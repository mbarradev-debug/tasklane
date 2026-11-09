import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const { error, registered } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-sm p-8">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>

      {registered && (
        <p className="mb-4 rounded bg-green-50 px-3 py-2 text-green-700">
          Account created. Please log in.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-red-700">
          Invalid email or password
        </p>
      )}

      <form method="POST" action="/api/login" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            name="password"
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
