import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Dict, Any, Optional, List
import requests
from PIL import Image
import io
import hashlib
from datetime import datetime
import os
from ..config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


class MediaStorageService:
    """Handles media upload, processing, and optimization"""

    def __init__(self):
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_formats = ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov"]

    async def upload_from_url(
        self, media_url: str, folder: str = "social_media", tags: List[str] = None
    ) -> Dict[str, Any]:
        """Upload media from external URL to Cloudinary"""
        try:
            # Generate unique public_id
            url_hash = hashlib.md5(media_url.encode()).hexdigest()[:12]
            timestamp = int(datetime.utcnow().timestamp())
            public_id = f"{folder}/{timestamp}_{url_hash}"

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                media_url,
                public_id=public_id,
                folder=folder,
                tags=tags or [],
                resource_type="auto",  # Auto-detect image/video
                quality="auto:good",
                fetch_format="auto",
                # Image transformations
                transformation=[{"quality": "auto:good"}, {"fetch_format": "auto"}],
            )

            return {
                "success": True,
                "url": upload_result["secure_url"],
                "public_id": upload_result["public_id"],
                "width": upload_result.get("width"),
                "height": upload_result.get("height"),
                "format": upload_result.get("format"),
                "bytes": upload_result.get("bytes"),
                "resource_type": upload_result.get("resource_type"),
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def upload_file(
        self,
        file_content: bytes,
        filename: str,
        folder: str = "user_uploads",
        tags: List[str] = None,
    ) -> Dict[str, Any]:
        """Upload file content to Cloudinary"""
        try:
            # Validate file size
            if len(file_content) > self.max_file_size:
                return {"success": False, "error": "File size exceeds 10MB limit"}

            # Generate unique public_id
            file_hash = hashlib.md5(file_content).hexdigest()[:12]
            timestamp = int(datetime.utcnow().timestamp())
            name_without_ext = os.path.splitext(filename)[0]
            public_id = f"{folder}/{timestamp}_{name_without_ext}_{file_hash}"

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file_content,
                public_id=public_id,
                folder=folder,
                tags=tags or [],
                resource_type="auto",
                quality="auto:good",
                fetch_format="auto",
            )

            return {
                "success": True,
                "url": upload_result["secure_url"],
                "public_id": upload_result["public_id"],
                "width": upload_result.get("width"),
                "height": upload_result.get("height"),
                "format": upload_result.get("format"),
                "bytes": upload_result.get("bytes"),
                "resource_type": upload_result.get("resource_type"),
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_optimized_url(
        self,
        public_id: str,
        width: int = None,
        height: int = None,
        quality: str = "auto:good",
    ) -> str:
        """Get optimized URL for different display sizes"""
        transformations = [{"quality": quality}, {"fetch_format": "auto"}]

        if width and height:
            transformations.append(
                {"width": width, "height": height, "crop": "fill", "gravity": "auto"}
            )
        elif width:
            transformations.append({"width": width, "crop": "scale"})

        return cloudinary.CloudinaryImage(public_id).build_url(
            transformation=transformations, secure=True
        )

    def get_thumbnail_url(self, public_id: str, size: int = 300) -> str:
        """Get thumbnail URL for preview"""
        return self.get_optimized_url(public_id, width=size, height=size)

    async def delete_media(self, public_id: str) -> bool:
        """Delete media from Cloudinary"""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"Error deleting media {public_id}: {e}")
            return False

    async def get_media_info(self, public_id: str) -> Optional[Dict[str, Any]]:
        """Get media information from Cloudinary"""
        try:
            result = cloudinary.api.resource(public_id)
            return {
                "url": result["secure_url"],
                "width": result.get("width"),
                "height": result.get("height"),
                "format": result.get("format"),
                "bytes": result.get("bytes"),
                "created_at": result.get("created_at"),
            }
        except Exception as e:
            print(f"Error getting media info for {public_id}: {e}")
            return None


class ContentModerationService:
    """AI-powered content moderation"""

    def __init__(self):
        self.moderation_threshold = 0.7

    async def moderate_image(self, image_url: str) -> Dict[str, Any]:
        """Moderate image content using Cloudinary's AI moderation"""
        try:
            # Use Cloudinary's moderation add-on
            moderation_result = cloudinary.uploader.upload(
                image_url,
                moderation="aws_rek",  # AWS Rekognition
                resource_type="image",
            )

            moderation_data = moderation_result.get("moderation", [])

            # Process moderation results
            flags = []
            max_score = 0.0

            for moderation in moderation_data:
                if moderation.get("status") == "approved":
                    continue

                for category, score in moderation.get("response", {}).items():
                    if score > self.moderation_threshold:
                        flags.append({"category": category, "confidence": score})
                        max_score = max(max_score, score)

            return {
                "approved": len(flags) == 0,
                "score": max_score,
                "flags": flags,
                "raw_data": moderation_data,
            }

        except Exception as e:
            # Fallback: approve if moderation fails
            return {"approved": True, "score": 0.0, "flags": [], "error": str(e)}

    async def moderate_text(self, text: str) -> Dict[str, Any]:
        """Moderate text content for inappropriate language"""
        try:
            # Simple keyword-based moderation (can be enhanced with AI services)
            inappropriate_keywords = ["spam", "scam", "fake", "hate", "violence"]

            text_lower = text.lower()
            flags = []

            for keyword in inappropriate_keywords:
                if keyword in text_lower:
                    flags.append({"type": "inappropriate_language", "keyword": keyword})

            return {"approved": len(flags) == 0, "flags": flags}

        except Exception as e:
            return {"approved": True, "flags": [], "error": str(e)}


# Global instances
media_service = MediaStorageService()
moderation_service = ContentModerationService()
