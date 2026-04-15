import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json({ status: "ok", data }, { status });
}

export function fail(message, status = 400, details = undefined) {
  const body = { status: "error", message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}
