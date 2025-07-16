from typing import List, Optional
import re


def validate_iata_code(code: str) -> bool:
    """Validate IATA airport code format"""
    if not code or len(code) != 3:
        return False
    return code.isalpha() and code.isupper()


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def sanitize_destination(destination: str) -> str:
    """Sanitize destination string for search"""
    # Remove special characters, normalize spaces
    sanitized = re.sub(r"[^\w\s-]", "", destination)
    return " ".join(sanitized.split())
