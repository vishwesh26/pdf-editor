import os
import urllib.request
import urllib.parse
import json
from typing import Optional
from fastapi import Request, Form, HTTPException, status

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

def get_client_ip(request: Request) -> Optional[str]:
    # Check CF-Connecting-IP or X-Forwarded-For if behind proxy
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()
    x_forwarded = request.headers.get("X-Forwarded-For")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None

async def verify_turnstile_token(
    token: Optional[str],
    client_ip: Optional[str] = None,
    expected_action: Optional[str] = None
) -> bool:
    secret = os.getenv("TURNSTILE_SECRET", "").strip()

    # If secret is unset or default placeholder, allow in dev mode
    if not secret or secret == "your_turnstile_secret_key_here":
        return True

    if not token or len(token) == 0 or len(token) > 2048:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cloudflare Turnstile token is missing or invalid."
        )

    try:
        data = {
            "secret": secret,
            "response": token,
        }
        if client_ip:
            data["remoteip"] = client_ip

        encoded_data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(
            TURNSTILE_VERIFY_URL,
            data=encoded_data,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "PustakEdits-Turnstile/1.0"
            }
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))

        if not result.get("success"):
            error_codes = result.get("error-codes", [])
            print(f"Turnstile verification rejected: {error_codes}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bot security verification failed."
            )

        if expected_action and result.get("action") and result.get("action") != expected_action:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Security challenge action mismatch."
            )

        return True
    except HTTPException:
        raise
    except Exception as e:
        print("Turnstile verification error:", e)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Error verifying Cloudflare Turnstile token."
        )

async def check_turnstile(
    request: Request,
    cf_turnstile_response: Optional[str] = Form(None, alias="cf-turnstile-response")
):
    """
    FastAPI dependency for endpoints accepting multipart form data.
    Checks cf-turnstile-response Form field or X-Turnstile-Token header.
    """
    token = cf_turnstile_response or request.headers.get("X-Turnstile-Token")
    client_ip = get_client_ip(request)
    await verify_turnstile_token(token, client_ip=client_ip)
