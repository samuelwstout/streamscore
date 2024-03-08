"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useChat } from "ai/react";
import Image from "next/image";
import { autoResize } from "@/utils/autoResizeInput";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { user } = useUser();

  return (
    <main className="h-full">
      <div className="w-1/6 flex flex-col bg-gray-50 h-screen fixed">
        <div className="h-20 flex items-center px-3">
          <h1>Streamscore</h1>
        </div>
        <div className="flex-1 flex flex-col"></div>
        <div className="h-20 flex items-center px-3">
          <UserButton afterSignOutUrl="/" />
          {user && <p className="text-sm pl-2">{user.fullName}</p>}
        </div>
      </div>
      <div className="w-5/6 ml-auto">
        <div className="py-10"></div>
        <div className="px-10 flex flex-col justify-center items-center">
          {messages.map((m) => (
            <div className="pb-5 w-1/2 leading-7" key={m.id}>
              {m.role === "user" ? "You: " : "Streamscore: "}
              {m.content}
            </div>
          ))}
        </div>
        <div className="py-12"></div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center fixed bottom-0 w-5/6 py-4 bg-white"
        >
          <div className="relative w-1/2">
            <textarea
              value={input}
              className="w-full pl-2 pr-16 py-1 border-2 border-gray-300 rounded-md focus:outline-none overflow-y-hidden min-h-16 resize-none"
              placeholder="Type your message here..."
              onChange={handleInputChange}
              onInput={autoResize}
              rows={1}
            />
            <button
              type="submit"
              className={`absolute right-2.5 bottom-4 rounded-md ${
                input.length > 0 ? "bg-black" : "bg-slate-200"
              } p-1`}
            >
              <Image src="/arrow.png" alt="arrow" width={25} height={25} />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
