# PostgreSQL Database Usage Guide

## 🎯 **What the Database Stores**

Your Railway PostgreSQL database stores **persistent application data** that powers your travel platform's core features.

## 📊 **Database Tables & Their Purpose**

### **🌍 Travel Content Tables**

#### **1. `destinations`**
- **Purpose**: Store travel destination information
- **Data**: City details, descriptions, images, ratings, pricing
- **Example**: Paris, Tokyo, New York with photos, best times to visit, average costs

#### **2. `destination_pricing`** 
- **Purpose**: Dynamic pricing data for destinations
- **Data**: Hotel prices, meal costs, seasonal pricing multipliers
- **Example**: Paris costs 20% more in summer, budget vs luxury pricing

#### **3. `travel_guides`**
- **Purpose**: Travel articles and guides
- **Data**: Packing guides, budget tips, "best of" articles
- **Example**: "Ultimate Paris Packing List", "Budget Travel in Europe"

### **📱 Social Media Tables**

#### **4. `social_media_posts`**
- **Purpose**: Curated social media content from Instagram, TikTok, etc.
- **Data**: Travel photos/videos, captions, engagement metrics
- **Example**: Instagram posts tagged #ParisTravel with location data

#### **5. `user_generated_content`**
- **Purpose**: Content submitted by your users
- **Data**: User travel photos, stories, reviews
- **Example**: Users sharing their Paris trip photos for contests

#### **6. `photo_contests`**
- **Purpose**: Travel photo competitions
- **Data**: Contest themes, prizes, rules, deadlines
- **Example**: "Best Sunset Photo 2024" contest with $500 prize

#### **7. `social_media_feeds`**
- **Purpose**: Curated content feeds for different pages
- **Data**: Feed configurations, algorithms, display settings
- **Example**: Homepage feed showing trending travel content

#### **8. `content_moderation_logs`**
- **Purpose**: Track content approval/rejection
- **Data**: Moderation decisions, AI scores, admin actions
- **Example**: Log of which posts were approved for display

## 🔄 **How Data Flows**

### **Content Creation:**
```
Admin adds destinations → Database → API → Frontend displays
Users submit photos → Database → Moderation → Featured content
```

### **Dynamic Features:**
```
User searches flights → API calls external services → Results displayed
User views destination → Database provides details → Personalized content
```

## 🚀 **Current Status & Next Steps**

### **✅ What's Working Now:**
- Database connected to Railway backend
- Tables will be created automatically on first API call
- Health check shows database status

### **📋 To See Tables Created:**
1. **Make an API call** that uses the database (triggers table creation)
2. **Check Railway PostgreSQL dashboard** → Data tab
3. **Or connect directly** using the database credentials

### **🛠️ To Populate with Data:**
```bash
# Run the migration script to add sample data
cd backend
python scripts/migrate_static_data.py
```

## 💡 **Why You Need the Database**

### **Without Database (Current):**
- ✅ Flight/hotel search works (uses external APIs)
- ❌ No destination details stored
- ❌ No user-generated content
- ❌ No travel guides
- ❌ No social media integration

### **With Database (Full Features):**
- ✅ Rich destination pages with details
- ✅ User photo contests and submissions
- ✅ Curated social media feeds
- ✅ Travel guides and articles
- ✅ Personalized recommendations
- ✅ Content moderation system

## 🔍 **To Verify Tables Are Created:**

After redeploying, check your Railway logs for:
```
✅ Database connection successful
✅ Database tables created successfully
📊 Tables created:
   - destinations
   - destination_pricing
   - travel_guides
   - social_media_posts
   - user_generated_content
   - photo_contests
   - social_media_feeds
   - content_moderation_logs
```

**The database transforms your app from a simple search tool into a full-featured travel platform!** 🌟