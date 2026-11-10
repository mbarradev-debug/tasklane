import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  const form = await request.formData();
  const title = form.get("title");

  const tasksResponse = await fetch(`${process.env.TASKS_SERVICE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (tasksResponse.status === 401) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  if (!tasksResponse.ok) {
    return NextResponse.redirect(
      new URL("/tasks?error=invalid", request.url),
      303,
    );
  }

  return NextResponse.redirect(new URL("/tasks", request.url), 303);
}
