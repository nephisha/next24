-- Create search_logs table for analytics
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_id UUID NOT NULL,
    search_type VARCHAR(20) NOT NULL CHECK (search_type IN ('flights', 'hotels')),
    
    -- Flight search fields
    origin VARCHAR(3),
    destination VARCHAR(3),
    departure_date DATE,
    return_date DATE,
    
    -- Hotel search fields  
    destination_city VARCHAR(255),
    check_in DATE,
    check_out DATE,
    
    -- Common fields
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER NOT NULL DEFAULT 0,
    rooms INTEGER DEFAULT 1,
    
    -- Results metadata
    results_count INTEGER NOT NULL DEFAULT 0,
    cache_hit BOOLEAN NOT NULL DEFAULT FALSE,
    search_time_ms INTEGER NOT NULL,
    providers TEXT[] NOT NULL DEFAULT '{}',
    
    -- User context (optional)
    user_ip INET,
    user_agent TEXT,
    session_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_search_logs_type_date ON search_logs(search_type, created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_route ON search_logs(origin, destination) WHERE search_type = 'flights';
CREATE INDEX IF NOT EXISTS idx_search_logs_destination ON search_logs(destination_city) WHERE search_type = 'hotels';
CREATE INDEX IF NOT EXISTS idx_search_logs_session ON search_logs(session_id);

-- Create popular_routes view for caching optimization
CREATE OR REPLACE VIEW popular_routes AS
SELECT 
    origin,
    destination,
    COUNT(*) as search_count,
    AVG(search_time_ms) as avg_search_time,
    MAX(created_at) as last_searched
FROM search_logs 
WHERE search_type = 'flights' 
    AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY origin, destination
ORDER BY search_count DESC;

-- Create popular_destinations view
CREATE OR REPLACE VIEW popular_destinations AS
SELECT 
    destination_city,
    COUNT(*) as search_count,
    AVG(search_time_ms) as avg_search_time,
    MAX(created_at) as last_searched
FROM search_logs 
WHERE search_type = 'hotels' 
    AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY destination_city
ORDER BY search_count DESC;

-- Create function to clean old search logs (keep last 30 days)
CREATE OR REPLACE FUNCTION clean_old_search_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM search_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job to run cleanup weekly (if using pg_cron)
-- SELECT cron.schedule('clean-search-logs', '0 2 * * 0', 'SELECT clean_old_search_logs();');

-- Optional: Create table for caching API responses
CREATE TABLE IF NOT EXISTS api_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);

-- Function to cleanup expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM api_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (for logging)
CREATE POLICY "Allow anonymous insert" ON search_logs
FOR INSERT TO anon
WITH CHECK (true);

-- Create policy for authenticated read access
CREATE POLICY "Allow authenticated read" ON search_logs
FOR SELECT TO authenticated
USING (true);