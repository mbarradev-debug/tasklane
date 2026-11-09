import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-sm p-8">
      <h1 className="mb-6 text-2xl font-semibold">Sign up</h1>

      {error === "exists" && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-red-700">
          This email is already registered
        </p>
      )}
      {error === "invalid" && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-red-700">
          Please check your details and try again
        </p>
      )}

      <form
        method="POST"
        action="/api/register"
        className="flex flex-col gap-4"
      >
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
          Name
          <input
            type="text"
            name="name"
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
          Sign up
        </button>
      </form>

      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
