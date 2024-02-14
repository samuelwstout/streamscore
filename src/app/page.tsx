import { UserButton } from "@clerk/nextjs";

export default function Main() {
  return (
    <main className="h-screen">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
