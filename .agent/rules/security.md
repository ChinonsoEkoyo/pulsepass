# PulsePass Security Rules

- **Authentication**: Use JWT & Refresh Tokens. Store access tokens in memory, refresh tokens in `httpOnly` secure cookies.
- **Authorization**: Implement role-based access control (organizer, attendee, admin) at the API route level.
- **Database**: Use Drizzle ORM (parameterized queries) to prevent SQL injection. Never concatenate user input into queries. Apply Row-Level Security where possible at the Neon/application layer.
- **Infrastructure**: Enforce HTTPS in all environments. Set `Secure`, `SameSite=Lax` on cookies. Use CSP headers.
- **Input Validation**: Validate all user inputs with Zod schemas on every API route. Sanitize rich text fields.
- **Rate Limiting**: Apply rate limiting on public POST endpoints (ticket purchase, registration, password reset). Use a token bucket or sliding window approach.
- **CSRF**: Use anti-CSRF tokens or rely on `SameSite` cookies + custom headers for state-changing requests.
- **Environment Variables**: Never expose `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_WEBHOOK_HASH`, `DATABASE_URL`, or `JWT_SECRET` to the client. Use `NEXT_PUBLIC_` prefix only for public-facing values.
- **Payments**: Verify all Flutterwave webhooks using the webhook hash AND the verify-transaction endpoint. Log all failed verifications.
- **Monitoring**: Log authentication failures, payment failures, and abuse signals. Use structured logging.
