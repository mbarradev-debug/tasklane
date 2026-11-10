import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${process.env.TASKS_SERVICE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  const tasks: Task[] = await response.json();

  return (
    <main className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My tasks</h1>
        <form method="POST" action="/api/logout">
          <button
            type="submit"
            className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
          >
            Log out
          </button>
        </form>
      </div>

      {error === "invalid" && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-red-700">
          Could not create the task. Please check the title.
        </p>
      )}

      <form method="POST" action="/api/tasks" className="mb-6 flex gap-2">
        <input
          type="text"
          name="title"
          required
          placeholder="New task"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>You have no tasks yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task.id} className="rounded border px-3 py-2">
              {task.completed ? "✓ " : ""}
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
