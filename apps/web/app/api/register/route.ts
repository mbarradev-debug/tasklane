import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = form.get("email");
  const name = form.get("name");
  const password = form.get("password");

  const authResponse = await fetch(
    `${process.env.AUTH_SERVICE_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    },
  );

  if (authResponse.status === 409) {
    return NextResponse.redirect(
      new URL("/register?error=exists", request.url),
      303,
    );
  }

  if (!authResponse.ok) {
    return NextResponse.redirect(
      new URL("/register?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(
    new URL("/login?registered=1", request.url),
    303,
  );
}
