import { NextResponse } from "next/server";

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.delete({ name: "token", path: "/" });
  return response;
}
