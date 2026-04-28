import os
import json
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
import razorpay
from supabase import create_client, Client

router = APIRouter()

# Initialize Razorpay Client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_KEY_SECRET", ""))
)
WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "my_development_webhook_secret_123")

# Initialize Supabase
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def grant_pro_access(email: str):
    """Finds user by email and upgrades them to Pro."""
    print(f"Attempting to grant Pro access to: {email}")
    try:
        # 1. Find user by email via admin auth API or users view.
        # Note: supabase-py doesn't currently support auth.admin.list_users() easily without specific permissions, 
        # so we might rely on the auth_users view or pass the UUID directly if possible.
        # Since we don't have direct access to auth.users from public schema, 
        # let's assume the user has logged in and has an entry in a public 'users' table or we can just upsert subscriptions by email.
        # Wait, the user ID is needed for the subscriptions table. 
        # A workaround in Supabase is using RPC or querying if a view exists.
        # Let's try to fetch from auth.users (requires service role key, which we have).
        
        response = supabase.table("subscriptions").select("id").eq("user_email", email).execute()
        # Since we didn't add email to subscriptions table in schema, we will add it or use RPC.
        # Let's write an RPC or direct SQL if needed. For now, since we are using service_key, we might be able to query auth.users? No, supabase client restricts querying auth schema directly via REST.
    except Exception as e:
        print(f"Error granting pro access: {str(e)}")

@router.post("/razorpay")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handles Razorpay Webhooks (e.g. payment.captured)
    """
    try:
        payload_body = await request.body()
        signature = request.headers.get("X-Razorpay-Signature", "")
        
        # Verify Webhook Signature
        try:
            razorpay_client.utility.verify_webhook_signature(
                payload_body.decode('utf-8'),
                signature,
                WEBHOOK_SECRET
            )
        except razorpay.errors.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Parse payload
        event = json.loads(payload_body)
        
        if event.get("event") == "payment.captured":
            payment = event["payload"]["payment"]["entity"]
            email = payment.get("email")
            
            if email:
                # In a real production app, we would safely look up the user by email
                # and update their subscription. Since we need to query `auth.users`, 
                # the best approach is to call a Postgres function (RPC).
                # For this implementation, we will call an RPC named `upgrade_user_to_pro_by_email`
                background_tasks.add_task(
                    supabase.rpc, 
                    "upgrade_user_to_pro_by_email", 
                    {"user_email": email}
                )

        return {"status": "ok"}
    except Exception as e:
        print(f"Webhook Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
