import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Forma de cada tarea que devuelve tasks-service (solo los campos que mostramos)
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// Página de Next.js: componente de servidor (corre en web, no en el navegador)
export default async function TasksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Escena A: sin cookie no hay sesión → al login, sin llamar a nadie
  if (!token) {
    redirect("/login");
  }

  // Cambio de envoltorio: el token de la cookie viaja a tasks-service como Bearer
  const response = await fetch(`${process.env.TASKS_SERVICE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Escena B: el token venció o fue alterado → JwtAuthGuard responde 401 → al login
  if (response.status === 401) {
    redirect("/login");
  }

  const tasks: Task[] = await response.json();

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold">My tasks</h1>

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
