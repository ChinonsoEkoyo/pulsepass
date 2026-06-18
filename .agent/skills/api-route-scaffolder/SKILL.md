---
name: "api-route-scaffolder"
description: "Guidelines for creating Next.js API Routes or Server Actions with Drizzle + Neon"
---
# API Route Scaffolder

## Route Location
- API routes: `app/api/<resource>/route.ts` (Next.js App Router)
- Server Actions: `app/_actions/<action>.ts`

## Structure
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { table } from '@/db/schema';
import { z } from 'zod';

const schema = z.object({ /* ... */ });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const user = await getAuthUser(); // from JWT context
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const result = await db.insert(table).values(parsed).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## Checklist
- [ ] Validate payload with Zod
- [ ] Authenticate user (JWT from cookies/Authorization header)
- [ ] Authorize role-based access where needed
- [ ] Query Neon via Drizzle (never raw SQL)
- [ ] Wrap in try/catch with proper HTTP status codes
- [ ] Return consistent JSON shape: `{ data?, error? }`
