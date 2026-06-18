const FLW_BASE = "https://api.flutterwave.com/v3";

interface FlwConfig {
  secretKey: string;
  webhookHash: string;
}

function getConfig(): FlwConfig {
  return {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
    webhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH || "",
  };
}

export interface InitiatePaymentParams {
  txRef: string;
  amount: number;
  currency?: string;
  email: string;
  name: string;
  redirectUrl: string;
}

export interface FlwPaymentResponse {
  status: string;
  message: string;
  data?: {
    link: string;
    id: number;
  };
}

export async function initiatePayment(params: InitiatePaymentParams): Promise<FlwPaymentResponse> {
  const { secretKey } = getConfig();

  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency || "NGN",
      redirect_url: params.redirectUrl,
      customer: {
        email: params.email,
        name: params.name,
      },
      meta: {
        tx_ref: params.txRef,
      },
    }),
  });

  return res.json();
}

export interface FlwTransaction {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: { email: string };
  };
}

export async function verifyTransaction(transactionId: number): Promise<FlwTransaction> {
  const { secretKey } = getConfig();

  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  return res.json();
}

export function verifyWebhookHash(signature: string | null): boolean {
  const { webhookHash } = getConfig();
  return !!signature && signature === webhookHash;
}
