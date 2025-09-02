# 🌟 Social Media Integration Implementation Guide

## 📋 Overview

This guide outlines the comprehensive social media integration strategy for Next24 travel platform, including Instagram feeds, user-generated content, photo contests, and community features.

## 🚀 Implementation Phases

### Phase 1: Foundation (Current - Mock Data)
✅ **Completed Components:**
- Instagram Feed component with mock data
- User Stories component with submission forms
- Photo Contest component with voting system
- Community page with tabbed interface
- Header navigation updated

### Phase 2: API Integration (Next Steps)
🔄 **Instagram Basic Display API Integration:**
- Set up Instagram App in Facebook Developer Console
- Implement OAuth flow for user authentication
- Create hashtag content fetching service
- Add real-time content moderation

### Phase 3: User-Generated Content (UGC)
🔄 **Content Management System:**
- User authentication and profiles
- Story submission and approval workflow
- Photo upload and processing
- Content moderation tools

### Phase 4: Community Features
🔄 **Advanced Social Features:**
- User voting and rating systems
- Influencer partnership tools
- Community reviews and recommendations
- Social sharing integrations

## 🛠️ Technical Implementation

### Instagram Integration

#### 1. Instagram Basic Display API Setup
```javascript
// backend/app/integrations/instagram_api.py
import requests
from typing import List, Dict
import os

class InstagramAPI:
    def __init__(self):
        self.access_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')
        self.base_url = 'https://graph.instagram.com'
    
    async def get_hashtag_media(self, hashtag: str, limit: int = 20) -> List[Dict]:
        """Fetch media posts for a specific hashtag"""
        # Implementation for hashtag search
        pass
    
    async def get_user_media(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Fetch media posts from a specific user"""
        # Implementation for user media
        pass
```

#### 2. Frontend Service Integration
```typescript
// frontend/src/lib/instagram.ts
interface InstagramPost {
    id: string;
    caption: string;
    media_url: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    permalink: string;
    timestamp: string;
    username: string;
}

export async function fetchInstagramPosts(hashtags: string[]): Promise<InstagramPost[]> {
    const response = await fetch('/api/instagram/hashtag-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashtags })
    });
    return response.json();
}
```

### User Stories System

#### 1. Database Schema
```sql
-- User Stories Table
CREATE TABLE travel_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    author_id UUID REFERENCES users(id),
    images TEXT[], -- Array of image URLs
    tags TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    travel_date DATE,
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Story Likes Table
CREATE TABLE story_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES travel_stories(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(story_id, user_id)
);

-- Story Comments Table
CREATE TABLE story_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES travel_stories(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Backend API Endpoints
```python
# backend/app/routers/stories.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Optional
import uuid

router = APIRouter(prefix="/api/stories", tags=["stories"])

@router.get("/", response_model=List[TravelStoryResponse])
async def get_stories(
    destination: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0
):
    """Get travel stories with optional filtering"""
    pass

@router.post("/", response_model=TravelStoryResponse)
async def create_story(
    story: TravelStoryCreate,
    images: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    """Create a new travel story"""
    pass

@router.post("/{story_id}/like")
async def like_story(
    story_id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    """Like or unlike a story"""
    pass
```

### Photo Contest System

#### 1. Contest Management
```python
# backend/app/models/contests.py
from sqlalchemy import Column, String, DateTime, Integer, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

class PhotoContest(Base):
    __tablename__ = "photo_contests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    theme = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    voting_end_date = Column(DateTime, nullable=False)
    prize = Column(String(500))
    status = Column(String(20), default='upcoming')  # upcoming, active, voting, ended
    max_entries_per_user = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContestEntry(Base):
    __tablename__ = "contest_entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contest_id = Column(UUID(as_uuid=True), ForeignKey('photo_contests.id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500), nullable=False)
    location = Column(String(255))
    votes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### 2. Voting System
```typescript
// frontend/src/lib/contests.ts
export async function voteForEntry(entryId: string): Promise<void> {
    const response = await fetch(`/api/contests/entries/${entryId}/vote`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to vote');
    }
}

export async function submitContestEntry(
    contestId: string, 
    entry: ContestEntryData, 
    image: File
): Promise<void> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', entry.title);
    formData.append('description', entry.description);
    formData.append('location', entry.location);
    
    const response = await fetch(`/api/contests/${contestId}/entries`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit entry');
    }
}
```

## 🔧 Configuration & Setup

### Environment Variables
```bash
# Instagram API
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_access_token

# Image Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Content Moderation
CONTENT_MODERATION_API_KEY=your_moderation_key
```

### Instagram App Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app and add Instagram Basic Display product
3. Configure OAuth redirect URIs
4. Get App ID and App Secret
5. Generate access tokens for hashtag access

### Image Upload Configuration
```typescript
// frontend/src/lib/upload.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'travel_stories');
    
    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );
    
    const data = await response.json();
    return data.secure_url;
}
```

## 📊 Analytics & Monitoring

### Key Metrics to Track
- Instagram post engagement rates
- User story submission rates
- Photo contest participation
- Community interaction metrics
- Content moderation efficiency

### Analytics Implementation
```typescript
// frontend/src/lib/analytics.ts
export function trackSocialEngagement(action: string, content_type: string, content_id: string) {
    // Google Analytics 4 event tracking
    gtag('event', action, {
        event_category: 'Social',
        event_label: content_type,
        custom_parameter_1: content_id
    });
}

// Usage examples:
trackSocialEngagement('instagram_post_view', 'hashtag_feed', post.id);
trackSocialEngagement('story_like', 'travel_story', story.id);
trackSocialEngagement('contest_vote', 'photo_contest', entry.id);
```

## 🛡️ Content Moderation

### Automated Moderation
```python
# backend/app/services/moderation.py
import requests
from typing import Dict, List

class ContentModerationService:
    def __init__(self):
        self.api_key = os.getenv('CONTENT_MODERATION_API_KEY')
    
    async def moderate_text(self, text: str) -> Dict:
        """Check text content for inappropriate material"""
        # Implementation using services like AWS Comprehend or Google Cloud AI
        pass
    
    async def moderate_image(self, image_url: str) -> Dict:
        """Check image content for inappropriate material"""
        # Implementation using services like AWS Rekognition or Google Vision AI
        pass
    
    async def auto_approve_content(self, content_score: float) -> bool:
        """Auto-approve content based on moderation score"""
        return content_score > 0.8  # Threshold for auto-approval
```

### Manual Review Queue
```python
# backend/app/routers/admin.py
@router.get("/moderation/queue")
async def get_moderation_queue(
    content_type: str = "all",  # stories, contest_entries, comments
    status: str = "pending",
    admin_user: User = Depends(get_admin_user)
):
    """Get content pending moderation review"""
    pass

@router.post("/moderation/{content_id}/approve")
async def approve_content(
    content_id: uuid.UUID,
    admin_user: User = Depends(get_admin_user)
):
    """Approve content for public display"""
    pass
```

## 🎯 Influencer Partnership Tools

### Influencer Dashboard
```typescript
// frontend/src/components/influencer/Dashboard.tsx
interface InfluencerMetrics {
    total_posts: number;
    total_engagement: number;
    reach: number;
    conversion_rate: number;
}

export function InfluencerDashboard() {
    // Dashboard for travel influencers to track their content performance
    // Integration with Instagram Insights API
    // Campaign management tools
    // Payment tracking
}
```

### Partnership Management
```python
# backend/app/models/partnerships.py
class InfluencerPartnership(Base):
    __tablename__ = "influencer_partnerships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    influencer_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    campaign_name = Column(String(255))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    compensation_type = Column(String(50))  # monetary, travel_voucher, product
    compensation_amount = Column(Numeric(10, 2))
    required_posts = Column(Integer)
    hashtags_required = Column(ARRAY(String))
    status = Column(String(20), default='active')
```

## 🚀 Deployment Considerations

### Scalability
- Use CDN for image delivery (Cloudinary, AWS CloudFront)
- Implement caching for Instagram API responses
- Use background jobs for content processing
- Database indexing for social queries

### Security
- Rate limiting for API endpoints
- Content validation and sanitization
- Secure file upload handling
- User authentication and authorization

### Performance
- Lazy loading for social media content
- Image optimization and compression
- Efficient database queries with pagination
- Caching strategies for frequently accessed content

## 📈 Success Metrics

### Engagement Metrics
- Monthly active community members
- User-generated content submissions per month
- Average engagement rate on social content
- Photo contest participation rates

### Business Metrics
- Increased time on site from social features
- Conversion rate from community to bookings
- Influencer partnership ROI
- User retention improvement

### Content Quality Metrics
- Content approval rates
- User satisfaction scores
- Community feedback ratings
- Moderation efficiency

## 🎉 Launch Strategy

### Soft Launch (Beta)
1. Enable features for limited user group
2. Gather feedback and iterate
3. Test content moderation workflows
4. Optimize performance

### Public Launch
1. Marketing campaign highlighting social features
2. Influencer partnerships for launch content
3. First photo contest with attractive prizes
4. Community challenges and engagement campaigns

### Post-Launch
1. Regular photo contests (monthly themes)
2. Featured story campaigns
3. Seasonal content initiatives
4. Community ambassador program

---

This comprehensive social media integration will transform Next24 into a vibrant travel community platform, encouraging user engagement and creating a valuable content ecosystem that benefits both travelers and the business.