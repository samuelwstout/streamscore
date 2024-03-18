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
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      onFinish: () => setChatFinished(true),
    });
  const { user } = useUser();

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (chatFinished && isNewConversation) {
      addConversation();
      setChatFinished(false);
    } else if (chatFinished && !isNewConversation) {
      updateConversation();
    }
  }, [chatFinished, messages]);

  function startNewConversation() {
    setMessages([]);
    setConversationId(null);
    setIsNewConversation(true);
  }

  async function getConversations() {
    setIsLoadingConversations(true);
    try {
      const response = await fetch("api/getConversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function addConversation() {
    let conversationData = {
      title: messages[0].content,
      userId: user?.id,
      messages: messages,
    };
    try {
      const response = await fetch("api/addConversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversationData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const responseData = await response.json();
      const { data } = responseData;
      setConversations([...conversations, data]);
    } catch (error) {
      console.error(error);
    }
  }

  function getMessages(clickId: number) {
    setIsNewConversation(false);
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
  }

  return (
    <main className="h-full">
      <div className="w-1/6 flex flex-col bg-gray-50 h-screen fixed">
        <div className="h-20 flex items-center justify-between px-3">
          <h1>Streamscore</h1>
          <button onClick={startNewConversation}>
            <Image
              src="/startConversation.png"
              alt="start conversation"
              width={25}
              height={25}
            />
          </button>
        </div>
        <div className="flex-1 flex flex-col px-3 py-3 gap-2 max-h-100vh overflow-y-auto">
          {isLoadingConversations && <p>Loading conversations...</p>}
          {conversations
            .sort((a, b) => b.id - a.id)
            .map((conversation) => (
              <div
                key={conversation.id}
                className="flex flex-row items-center justify-between hover:bg-gray-200 overflow-hidden whitespace-nowrap leading-normal min-h-8 px-2 rounded cursor-pointer group"
                onClick={() => getMessages(conversation.id)}
              >
                <span>
                  {conversation.title!.length > 25
                    ? `${conversation.title?.slice(0, 25)}...`
                    : conversation.title}
                </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    // call a function to render a modal
                  }}
                  className="delete-btn hidden group-hover:flex z-10 bg-gray-200 p-1"
                >
                  <Image
                    src="/ellipsis.png"
                    alt="ellipsis"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="h-20 flex items-center px-3">
          <UserButton afterSignOutUrl="/" />
          {user && <p className="text-sm pl-2">{user.fullName}</p>}
        </div>
      </div>
      <div className="w-5/6 ml-auto">
        <div className="py-10" />
        {isNewConversation ? (
          <div className="px-10 flex justify-center items-center">
            <div>
              <h1>Hello! How can I help you?</h1>
            </div>
          </div>
        ) : (
          <div className="px-10 flex flex-col overflow-y-auto hide-scrollbar">
            {messages.map((m) => (
              <div className="pb-5 px-20 leading-7" key={m.id}>
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
