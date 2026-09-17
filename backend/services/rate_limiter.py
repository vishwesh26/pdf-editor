import time
from typing import Dict, Tuple, Optional
from fastapi import Request, HTTPException, status

# File size limits (as specified by user)
LIMIT_GUEST_BYTES = 15 * 1024 * 1024       # 15 MB
LIMIT_FREE_BYTES = 25 * 1024 * 1024        # 25 MB
LIMIT_PRO_BYTES = 50 * 1024 * 1024         # 50 MB

# Rate limits: (max_requests, window_seconds)
RATE_LIMIT_GUEST = (15, 600)   # 15 requests per 10 mins
RATE_LIMIT_FREE = (45, 600)    # 45 requests per 10 mins
RATE_LIMIT_PRO = (120, 600)    # 120 requests per 10 mins

class RateLimiter:
    def __init__(self):
        # Key: client_identifier -> list of request timestamps
        self._requests: Dict[str, list] = {}

    def _clean_old_requests(self, key: str, window_seconds: int, now: float):
        if key in self._requests:
            self._requests[key] = [t for t in self._requests[key] if now - t < window_seconds]
            if not self._requests[key]:
                del self._requests[key]

    def check(self, identifier: str, tier: str = "guest") -> Tuple[bool, int, int, int]:
        """
        Check if request is allowed.
        Returns: (allowed, remaining, limit, reset_seconds)
        """
        now = time.time()
        if tier == "pro":
            limit, window = RATE_LIMIT_PRO
        elif tier == "free":
            limit, window = RATE_LIMIT_FREE
        else:
            limit, window = RATE_LIMIT_GUEST

        self._clean_old_requests(identifier, window, now)
        current_history = self._requests.get(identifier, [])

        if len(current_history) >= limit:
            oldest = current_history[0]
            reset_seconds = max(1, int(window - (now - oldest)))
            return False, 0, limit, reset_seconds

        if identifier not in self._requests:
            self._requests[identifier] = []
        self._requests[identifier].append(now)

        remaining = limit - len(self._requests[identifier])
        reset_seconds = window
        return True, remaining, limit, reset_seconds

    @staticmethod
    def get_max_file_size(tier: str = "guest") -> int:
        if tier == "pro":
            return LIMIT_PRO_BYTES
        elif tier == "free":
            return LIMIT_FREE_BYTES
        return LIMIT_GUEST_BYTES

rate_limiter = RateLimiter()

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def check_rate_limit(request: Request, tier: str = "guest"):
    client_id = get_client_ip(request)
    allowed, remaining, limit, reset = rate_limiter.check(client_id, tier)

    request.state.rate_limit = limit
    request.state.rate_remaining = remaining
    request.state.rate_reset = reset

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {reset} seconds.",
            headers={
                "Retry-After": str(reset),
                "X-RateLimit-Limit": str(limit),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset),
            }
        )
