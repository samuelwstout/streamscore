"use client";
import { UserButton } from "@clerk/nextjs";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <main className="h-screen flex">
      <div className="w-1/6 flex flex-col">
        <div className="border border-black h-20 flex items-center px-3">
          <h1>Streamscore</h1>
        </div>
        <div className="flex-1"></div>
        <div className="border border-black h-20 flex items-center px-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="border border-black flex-1">
        <div className="h-4/5">
          <div className="h-full overflow-scroll">
            {messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                {m.role === "user" ? "User: " : "AI: "}
                {m.content}
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="h-1/5 flex items-center justify-between px-4"
        >
          <input
            type="text"
            value={input}
            className="w-full h-10 px-2 border-2 border-gray-300 rounded-md"
            placeholder="Type your message here..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
}
