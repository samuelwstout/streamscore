"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useChat } from "ai/react";
import Image from "next/image";
import { autoResize } from "@/utils/autoResizeInput";
import { useEffect, useState } from "react";
import type { SelectConversation } from "@/db/schema";

export default function Chat() {
  const [chatFinished, setChatFinished] = useState(false);
  const [conversations, setConversations] = useState<SelectConversation[]>([]);
  const [conversationId, setConversationId] = useState<null | number>(null);
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      onFinish: () => setChatFinished(true),
    });
  const { user } = useUser();

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (chatFinished && messages.length === 2) {
      addConversation();
      setChatFinished(false);
    } else if (chatFinished && messages.length > 2) {
      updateConversation();
    }
  }, [chatFinished, messages]);

  async function getConversations() {
    const response = await fetch("api/getConversations");
    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }
    const data = await response.json();
    setConversations(data);
  }

  async function addConversation() {
    const conversationData = {
      title: messages[0].content,
      userId: user?.id,
      messages: messages,
    };
    await fetch("api/addConversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationData),
    });
  }

  function getMessages(clickId: number) {
    const conversation = conversations.find((i) => i.id === clickId);
    if (conversation?.messages) {
      setMessages(conversation.messages);
    } else {
      console.error("Can't find conversation");
    }
    setConversationId(clickId);
  }

  async function updateConversation() {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return { ...conv, messages: messages };
      }
      return conv;
    });
    setConversations(updatedConversations);
    const response = await fetch(`api/updateConversation/${conversationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to update conversation");
    }

    // const updatedConversation = await response.json();
    // console.log({ updatedConversation });
  }

  return (
    <main className="h-full">
      <div className="w-1/6 flex flex-col bg-gray-50 h-screen fixed">
        <div className="h-20 flex items-center justify-between px-3">
          <h1>Streamscore</h1>
          <button
            onClick={() => {
              setMessages([]);
              setConversationId(null);
            }}
          >
            <Image
              src="/startConversation.png"
              alt="start conversation"
              width={25}
              height={25}
            />
          </button>
        </div>
        <div className="flex-1 flex flex-col px-3 py-3 gap-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className="flex flex-row items-start"
              onClick={() => getMessages(conversation.id)}
            >
              {conversation.title}
            </button>
          ))}
        </div>
        <div className="h-20 flex items-center px-3">
          <UserButton afterSignOutUrl="/" />
          {user && <p className="text-sm pl-2">{user.fullName}</p>}
        </div>
      </div>
      <div className="w-5/6 ml-auto">
        <div className="py-10"></div>
        {messages.length === 0 ? (
          <div className="px-10 h-screen flex justify-center items-center">
            <div>
              <h1>Hello! How can I help you?</h1>
            </div>
          </div>
        ) : (
          <div className="px-10 flex flex-col justify-center items-center">
            {messages.map((m) => (
              <div className="pb-5 w-1/2 leading-7" key={m.id}>
                {m.role === "user" ? "You: " : "Streamscore: "}
                {m.content}
              </div>
            ))}
          </div>
        )}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
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
