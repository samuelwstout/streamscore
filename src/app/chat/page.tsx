import { UserButton } from "@clerk/nextjs";

export default function Chat() {
  return (
    <main className="h-screen flex">
      <div className="w-1/6 flex flex-col">
        <div className="border border-black h-20 flex justify-center items-center">
          <h1>Streamscore</h1>
        </div>
        <div className="flex-1"></div>
        <div className="border border-black h-20 flex items-center px-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="border border-black flex-1">
        <div className="h-4/5"></div>
        <div className="h-1/5 flex items-center justify-between px-4">
          <input
            type="text"
            className="w-full h-10 px-2 border-2 border-gray-300 rounded-md"
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </main>
  );
}
