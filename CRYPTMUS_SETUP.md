# Cryptmus Integration Setup Guide

## Overview

Cryptmus has been integrated as your primary cryptocurrency payment method, replacing Binance Pay. It supports 500+ cryptocurrencies and provides secure, instant payments.

## Step 1: Get Cryptmus API Credentials

1. Go to [https://cryptmus.com](https://cryptmus.com)
2. Sign up and create an account
3. Go to **Settings → API Keys**
4. Create a new API key with these permissions:
   - Write: Payments (for creating payments)
   - Read: Payments (for checking status)
5. Copy your **API Key** and **Webhook Secret**

## Step 2: Configure Environment Variables

Add these to your `.env` file in the backend:

```bash
# Cryptmus Configuration
CRYPTMUS_API_KEY=your_api_key_here
CRYPTMUS_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 3: Set Up Webhook URL

1. In Cryptmus dashboard, go to **Settings → Webhooks**
2. Add webhook URL:
   ```
   https://your-api-domain.com/api/payments/cryptmus/webhook
   ```
3. Select events:
   - ✅ Payment confirmed
   - ✅ Payment paid
   - ✅ Payment expired

## Step 4: Test Integration

### Frontend Test:

1. Go to booking payments page
2. Select "Cryptocurrency (500+ coins)" payment method
3. Click "Proceed to Payment"
4. Modal should open with payment details

### Backend Test:

```bash
curl -X POST http://localhost:5000/api/payments/cryptmus/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"bookingId": "1"}'
```

Expected response:

```json
{
  "success": true,
  "paymentId": "uuid-here",
  "paymentUrl": "https://cryptmus.com/pay/...",
  "amount": 50.0,
  "currency": "USD"
}
```

## Payment Flow

```
1. User selects "Cryptocurrency" payment method
2. Click "Proceed to Payment"
3. System calls POST /api/payments/cryptmus/init
4. Cryptmus returns payment URL
5. Modal opens with:
   - Payment link
   - Payment ID (copyable)
   - Amount and timer (1 hour expiry)
   - "Open Payment Page" button
6. User completes payment on Cryptmus
7. Webhook notifies your server
8. Payment status updated to "paid"
9. Booking status updated to "confirmed"
10. User redirected to booking details
```

## Features

✅ **500+ Cryptocurrencies** - Bitcoin, Ethereum, Monero, Litecoin, etc.
✅ **Instant Payments** - Payments confirmed in seconds
✅ **Automatic Conversion** - Auto-converts to fiat if needed
✅ **Secure** - Industry-standard encryption
✅ **Low Fees** - 0.5% merchant fee
✅ **Fast Payouts** - Daily payouts to your bank account
✅ **Webhook Support** - Real-time payment notifications

## Supported Cryptocurrencies (Sample)

- Bitcoin (BTC)
- Ethereum (ETH)
- Litecoin (LTC)
- Monero (XMR)
- Bitcoin Cash (BCH)
- Stellar (XLM)
- Ripple (XRP)
- Dogecoin (DOGE)
- And 490+ more...

## Testing with Sandbox

Cryptmus provides a sandbox environment for testing:

```bash
CRYPTMUS_API_KEY=sandbox_key_here
CRYPTMUS_WEBHOOK_SECRET=sandbox_secret_here
```

Use these test transactions:

- Test crypto wallets provided in Cryptmus dashboard

## Troubleshooting

### Issue: "Invalid API Key"

- Check `CRYPTMUS_API_KEY` in `.env`
- Regenerate key from Cryptmus dashboard

### Issue: "Payment URL not opening"

- Check cors settings
- Verify `process.env.API_URL` is set correctly

### Issue: "Webhook not triggered"

- Verify webhook URL is publicly accessible
- Check webhook secret matches in `.env`
- Review webhook logs in Cryptmus dashboard

### Issue: "Payment not marked as paid"

- Check database connection
- Verify booking exists in database
- Check webhook signature verification

## API Reference

### Create Payment

```
POST /api/payments/cryptmus/init
Authorization: Bearer {token}

Body:
{
  "bookingId": "123"
}

Response:
{
  "success": true,
  "paymentId": "uuid",
  "paymentUrl": "https://...",
  "amount": 50.00,
  "currency": "USD"
}
```

### Check Payment Status

```
GET /api/payments/cryptmus/status/{paymentId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "status": "paid",
  "amount": 50.00,
  "currency": "USD"
}
```

### Webhook Signature Verification

```javascript
const crypto = require("crypto");
const signature = req.headers["x-cryptmus-signature"];
const payload = req.body;
const secret = process.env.CRYPTMUS_WEBHOOK_SECRET;

const hash = crypto
  .createHmac("sha256", secret)
  .update(JSON.stringify(payload))
  .digest("hex");

const isValid = hash === signature;
```

## Security

✅ All communications are HTTPS-encrypted
✅ API keys stored securely in environment variables
✅ Webhook signatures verified with HMAC-SHA256
✅ Sensitive data never logged
✅ PCI DSS compliant

## Support

- Cryptmus Documentation: https://cryptmus.com/docs
- Support Email: support@cryptmus.com
- Live Chat: Available in dashboard

## Migration from Binance Pay

All old Binance Pay code has been removed. If you need to support legacy integration:

- Binance Pay routes still available at `/api/payments/binance/*`
- Recommended: Migrate all users to Cryptmus for better features

---

**Last Updated:** March 2026
**Cryptmus Crypto Integration v1.0**
