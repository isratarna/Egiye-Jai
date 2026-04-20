# SSL Commerz Sandbox Configuration & Testing Guide

## Quick Start (3 Options)

### Option A: Mock Payment (Fastest - No SSL Commerz Account Needed) ⭐

Use this for UI/UX testing without setting up SSL Commerz.

1. **Enable mock mode in `.env`:**
   ```
   USE_MOCK_PAYMENT=true
   ```

2. **Test via Backend API:**
   ```bash
   # First, create a donation (get the tran_id from response)
   curl -X POST http://localhost:5000/api/donations/initiate \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "01700000000",
       "amount": 1000,
       "message": "Test donation"
     }'
   
   # You'll get response like:
   # {"success":true,"gatewayUrl":"https://...","tran_id":"DON-ABC123..."}
   ```

3. **Simulate success callback:**
   ```bash
   curl -X POST http://localhost:5000/api/donations/test \
     -H "Content-Type: application/json" \
     -d '{
       "tran_id": "DON-ABC123...",
       "amount": 1000
     }'
   
   # Response: 
   # {"success":true,"message":"Mock payment processed successfully","redirectUrl":"http://localhost:5174/donation-result?status=success&..."}
   ```

4. **Or use the success URL directly:**
   ```
   http://localhost:5000/api/donations/success?test=true&tran_id=DON-ABC123&amount=1000
   ```

---

### Option B: Test with SSL Commerz Demo Credentials

The demo credentials in `.env` work on SSL Commerz sandbox without creating an account.

1. **Keep default values in `.env`:**
   ```
   SSLC_STORE_ID=dokkh69d8a9e2cd86e
   SSLC_STORE_PASSWD=dokkh69d8a9e2cd86e@ssl
   SSLC_IS_LIVE=false
   ```

2. **Use ngrok to expose local backend** (REQUIRED):
   
   a. Install ngrok: https://ngrok.com/download
   
   b. Start ngrok in a separate terminal:
   ```bash
   ngrok http 5000
   ```
   
   You'll see output:
   ```
   Session Status                online
   Forwarding                    https://abc123d.ngrok-free.app -> http://localhost:5000
   ```
   
   c. Copy the HTTPS URL and update `.env`:
   ```
   BACKEND_URL=https://abc123d.ngrok-free.app
   ```
   
   d. Restart backend:
   ```bash
   npm start
   ```

3. **Test the flow:**
   - Go to http://localhost:5174
   - Click "Donate"
   - Fill form and submit
   - You'll be redirected to SSL Commerz test page
   - SSL Commerz will redirect back to your callback endpoint

---

### Option C: Create Your Own SSL Commerz Sandbox Account (Most Realistic)

1. **Create account:**
   - Visit: https://www.sslcommerz.com/
   - Click "Sign Up"
   - Go to: https://dashboard.sslcommerz.com/

2. **Get credentials:**
   - Login to dashboard
   - Settings → Store Info
   - Copy Store ID and Store Password

3. **Update `.env`:**
   ```
   SSLC_STORE_ID=your_store_id_from_dashboard
   SSLC_STORE_PASSWD=your_store_password_from_dashboard
   SSLC_IS_LIVE=false
   ```

4. **Set up ngrok** (same as Option B steps 2a-2d)

5. **Configure callback URLs in SSL Commerz Dashboard:**
   - Go to: https://dashboard.sslcommerz.com/
   - Settings → Integration
   - Configure URLs:
     ```
     Success URL:  https://abc123d.ngrok-free.app/api/donations/success
     Fail URL:     https://abc123d.ngrok-free.app/api/donations/fail
     Cancel URL:   https://abc123d.ngrok-free.app/api/donations/cancel
     IPN URL:      https://abc123d.ngrok-free.app/api/donations/ipn
     ```

6. **Test the flow** (same as Option B step 3)

---

## Troubleshooting

### "Not allowed by CORS" Error

**Causes:**
1. ngrok URL doesn't match `BACKEND_URL` in `.env`
2. SSL Commerz callback URLs not updated in dashboard
3. Backend server not restarted after `.env` changes

**Fixes:**
```bash
# 1. Check ngrok URL matches .env
echo $BACKEND_URL

# 2. Restart backend if you changed .env
npm start

# 3. Check backend logs for rejected origins
# Look for: "❌ CORS rejected origin: ..."

# 4. Update SSL Commerz dashboard callback URLs if using custom account
```

### ngrok Session Expired

ngrok free tier sessions expire after 2 hours. Just restart:
```bash
# Kill current ngrok session (Ctrl+C)
# Start a new one
ngrok http 5000

# Update .env with new URL
# Restart backend
npm start
```

### Can't see Backend Logs

Make sure backend is running in foreground:
```bash
cd backend
npm start

# You should see:
# 🔄 Connecting to MongoDB Atlas...
# ✅ MongoDB connected
# 🚀 Server running on http://localhost:5000
```

---

## Testing Checklist

- [ ] Backend running (`npm start` in `/backend`)
- [ ] Frontend running (`npm run dev` in `/frontend`)
- [ ] ngrok running (if not using mock mode)
- [ ] `.env` has correct BACKEND_URL
- [ ] `.env` has correct SSLC credentials
- [ ] SSL Commerz callback URLs updated (if custom account)
- [ ] Mock mode status set correctly

---

## API Endpoints Reference

### Donations
- `POST /api/donations/initiate` - Initiate payment (returns gateway URL)
- `POST /api/donations/success` - Success callback (redirects to frontend)
- `POST /api/donations/fail` - Failure callback
- `POST /api/donations/cancel` - Cancellation callback
- `POST /api/donations/ipn` - Instant Payment Notification
- `POST /api/donations/test` - Mock payment test endpoint
- `GET /api/donations/stats` - Public donation stats
- `GET /api/donations` - Admin: All donations (requires auth)

### Mock Endpoints (when USE_MOCK_PAYMENT=true)
- `POST /api/donations/test` with `{tran_id, amount}`
- `GET /api/donations/success?test=true&tran_id=...&amount=...`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success / Valid request |
| 400  | Missing required fields |
| 401  | Not authenticated |
| 403  | CORS blocked / Admin only |
| 500  | Server error (check logs) |

---

## Notes

- **Demo credentials** work on SSL Commerz sandbox but won't receive real confirmation emails
- **ngrok URLs change** every 2 hours on free tier - update `.env` when needed
- **Mock mode** perfect for testing validation, UI, and error handling
- **Backend logs** show which origins are rejected - helpful for debugging CORS
