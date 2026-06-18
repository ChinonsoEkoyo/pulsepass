import { NextResponse } from "next/server";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
