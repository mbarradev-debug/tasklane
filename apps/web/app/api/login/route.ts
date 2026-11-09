import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // ① Leer el formulario que envió el navegador
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  // ② Reenviar las credenciales a auth-service por su dirección de servidor
  const authResponse = await fetch(
    `${process.env.AUTH_SERVICE_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );

  // ③ Si auth-service rechazó (401 o 400), volver al login con un aviso
  if (!authResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  }

  // ④ Cambiar el envoltorio: el token pasa del body a una cookie HttpOnly
  const { accessToken } = await authResponse.json();
  const response = NextResponse.redirect(new URL("/tasks", request.url), 303);
  response.cookies.set("token", accessToken, {
    httpOnly: true, // el JavaScript de la página no puede leerla
    sameSite: "lax", // no se envía en peticiones que otros sitios disparen por debajo
    path: "/", // se envía en todas las rutas de localhost:3000
    maxAge: 60 * 60, // una hora, igual que el exp del token
  });
  return response;
}
