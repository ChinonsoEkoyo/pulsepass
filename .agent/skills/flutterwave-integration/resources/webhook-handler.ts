import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const signature = req.headers['verif-hash'];
  if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_HASH) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const payload = req.body;
  if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
    // 1. Verify transaction via FLW API using transaction ID
    // 2. Update Order status in Supabase database
    // 3. Generate TicketInstance and associate with the appropriate Order
  }

  res.status(200).end();
}
