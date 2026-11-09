// Página de Next.js: componente de servidor (no lleva 'use client')
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams; // '1' si viene de un login fallido; undefined si no

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>

      {error && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-red-700">
          Invalid email or password
        </p>
      )}

      <form method="POST" action="/api/login" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded border px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Log in
        </button>
      </form>
    </main>
  );
}
