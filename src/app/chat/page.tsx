"use client";
import { UserButton } from "@clerk/nextjs";
import { useChat } from "ai/react";

export default function Chat() {
  // const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="h-full">
      <div className="w-1/6 flex flex-col bg-gray-50 h-screen fixed">
        <div className="h-20 flex items-center px-3">
          <h1>Streamscore</h1>
        </div>
        <div className="flex-1 flex flex-col"></div>
        <div className="h-20 flex items-center px-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="w-5/6 ml-auto flex flex-col justify-between">
        <div className="py-10"></div>
        <div className="px-10"></div>
        <div className="py-12"></div>
        <form
          // onSubmit={handleSubmit}
          className="flex justify-center fixed bottom-0 w-5/6 py-4"
        >
          <input
            type="text"
            // value={input}
            className="w-1/2 h-10 px-2 border-2 border-gray-300 rounded-md"
            placeholder="Type your message here..."
            // onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
}

{
  /* {messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                {m.role === "user" ? "User: " : "AI: "}
                {m.content}
              </div>
            ))} */
}
