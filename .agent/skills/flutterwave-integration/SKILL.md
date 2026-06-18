---
name: "flutterwave-integration"
description: "Complete instructions for integrating Flutterwave payments into PulsePass"
---
# Flutterwave Integration Skill

## Overview
PulsePass uses Flutterwave as its exclusive payment processor — NOT Paystack.

## Environment Variables
- `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` — public key for frontend
- `FLUTTERWAVE_SECRET_KEY` — secret key for server-side API calls
- `FLUTTERWAVE_WEBHOOK_HASH` — secret hash to verify incoming webhooks
- `FLUTTERWAVE_ENCRYPTION_KEY` — encryption key for payload

## Payment Flow
1. Frontend calls `/api/payments/initialize` with `amount`, `currency`, `email`, `tx_ref`.
2. Server creates a Flutterwave payment link via `POST https://api.flutterwave.com/v3/payments`.
3. User completes payment on Flutterwave's hosted page.
4. Flutterwave sends a webhook to `/api/payments/webhook`.
5. Verify the webhook using `FLUTTERWAVE_WEBHOOK_HASH` and `verify-transaction` endpoint.
6. On successful verification, create `TicketInstance` and update `Order` status.
7. Return confirmation to the frontend via redirect.

## Webhook Verification
Use the `resources/webhook-handler.ts` file for a reference implementation. Always:
- Verify the webhook signature hash
- Confirm `event.type === "charge.completed"` and `data.status === "successful"`
- Call `GET https://api.flutterwave.com/v3/transactions/{id}/verify` to double-check
- Idempotency: check if order is already processed before creating tickets

## Error Handling
- Return `400` for malformed webhooks
- Return `409` if order already processed (idempotency)
- Log all webhook failures to monitoring
- Never expose raw Flutterwave responses to the client
