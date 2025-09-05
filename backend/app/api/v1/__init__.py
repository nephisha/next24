from . import flights, hotels

__all__ = ["flights", "hotels"]

# app/utils/date_helpers.py
from datetime import date, datetime, timedelta
from typing import Optional
import pytz


def get_timezone_aware_datetime(dt: datetime, timezone: str = "UTC") -> datetime:
    """Convert datetime to timezone-aware datetime"""
    tz = pytz.timezone(timezone)
    if dt.tzinfo is None:
        return tz.localize(dt)
    return dt.astimezone(tz)


def format_duration(minutes: int) -> str:
    """Format duration in minutes to human-readable format"""
    hours = minutes // 60
    mins = minutes % 60

    if hours == 0:
        return f"{mins}m"
    elif mins == 0:
        return f"{hours}h"
    else:
        return f"{hours}h {mins}m"
