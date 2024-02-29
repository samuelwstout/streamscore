"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { user } = useUser();

  function autoResize(e: any) {
    e.target.style.height = "inherit";
    const minHeight = parseInt(window.getComputedStyle(e.target).minHeight, 10);
    const newHeight = Math.max(e.target.scrollHeight, minHeight);
    e.target.style.height = `${newHeight}px`;
  }

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
        <div className="px-10 flex justify-center items-center">
          {/* {messages.map((m) => (
            <div key={m.id}>
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))} */}
          <div className="pb-5 w-1/2 leading-7">
            This layout assumes you want the sidebar to remain fixed. If the
            sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals. This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals. This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals. This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.This layout assumes you want the sidebar to remain fixed. If
            the sidebar's fixed positioning is not behaving as expected (e.g.,
            causing overlap due to being taken out of the document flow), you
            might need to adjust the layout further based on your overall design
            goals.
          </div>
        </div>
        <div className="py-12"></div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center fixed bottom-0 w-5/6 py-4 bg-white"
        >
          <textarea
            value={input}
            className="w-1/2 px-2 pt-1.5 border-2 border-gray-300 rounded-md focus:outline-none overflow-y-hidden min-h-10 resize-none"
            placeholder="Type your message here..."
            onChange={handleInputChange}
            onInput={autoResize}
            rows={1}
          />
        </form>
      </div>
    </main>
  );
}
