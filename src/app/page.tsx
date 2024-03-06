import Link from "next/link";
import TodoList from "./_components/TodoList";

export default function Main() {
  return (
    <main className="h-screen">
      <h1>Landing page</h1>
      <Link className="border-2 border-black p-1" href="/chat">
        Chat
      </Link>
      <TodoList />
    </main>
  );
}
