import Link from "next/link";

export default function Main() {
  return (
    <main className="h-screen">
      <h1>Landing page</h1>
      <Link className="border-2 border-black p-1" href="/chat">
        Sign in
      </Link>
    </main>
  );
}
