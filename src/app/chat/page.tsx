"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { UserButton, useUser } from "@clerk/nextjs";
import type { SelectConversation } from "@/db/schema";
import { autoResize } from "@/utils/autoResizeInput";
import { useChat } from "ai/react";
import Image from "next/image";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<SelectConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [chatFinished, setChatFinished] = useState(false);
  const [conversationId, setConversationId] = useState<null | number>(null);

  const { user } = useUser();

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      onFinish: () => setChatFinished(true),
    });

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
      title: messages.length > 0 ? messages[0].content : "",
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

  function getMessages(clickId: number) {
    setSidebarOpen(false);
    setIsNewConversation(false);
    const conversation = conversations.find((i) => i.id === clickId);
    if (conversation?.messages) {
      setMessages(conversation.messages);
    } else {
      console.error("Can't find conversation");
    }
    setConversationId(clickId);
  }

  function startNewConversation() {
    setMessages([]);
    setConversationId(null);
    setIsNewConversation(true);
    setSidebarOpen(false);
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Streamscore"
                      />
                      <button onClick={startNewConversation}>
                        <Image
                          src="/startConversation.png"
                          alt="start conversation"
                          width={25}
                          height={25}
                        />
                      </button>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {isLoadingConversations && (
                              <div className="text-sm text-gray-400 leading-6 font-semibold">
                                Loading conversations...
                              </div>
                            )}
                            {conversations
                              .sort((a, b) => b.id - a.id)
                              .map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => getMessages(item.id)}
                                  className="flex items-center justify-between gap-x-3 py-3 hover:bg-gray-800 rounded-md group cursor-pointer"
                                >
                                  <div className="group-hover:text-white group flex text-sm leading-6 font-semibold truncate text-gray-400 px-2">
                                    {item.title}
                                  </div>
                                  <div className="flex flex-none items-center gap-x-4">
                                    <Menu
                                      as="div"
                                      className="relative flex-none"
                                    >
                                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-white">
                                        <EllipsisVerticalIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </Menu.Button>
                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={classNames(
                                                  active ? "bg-gray-50" : "",
                                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                                )}
                                              >
                                                Delete
                                              </a>
                                            )}
                                          </Menu.Item>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900">
            <div className="flex h-16 shrink-0 items-center justify-between sticky top-0 bg-gray-900 z-10 px-6">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="StreamScore"
              />
              <button onClick={startNewConversation}>
                <Image
                  src="/startConversation.png"
                  alt="start conversation"
                  width={25}
                  height={25}
                />
              </button>
            </div>
            <nav className="flex flex-1 flex-col px-6">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {isLoadingConversations && (
                      <div className="text-sm text-gray-400 leading-6 font-semibold">
                        Loading conversations...
                      </div>
                    )}
                    {conversations
                      .sort((a, b) => b.id - a.id)
                      .map((item) => (
                        <li
                          key={item.id}
                          onClick={() => getMessages(item.id)}
                          className="flex items-center justify-between gap-x-3 py-3 hover:bg-gray-800 rounded-md group cursor-pointer"
                        >
                          <div className="group-hover:text-white group flex text-sm leading-6 font-semibold truncate text-gray-400 px-2">
                            {item.title}
                          </div>
                          <div className="flex flex-none items-center gap-x-4">
                            <Menu as="div" className="relative flex-none">
                              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-white">
                                <EllipsisVerticalIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={classNames(
                                          active ? "bg-gray-50" : "",
                                          "block px-3 py-1 text-sm leading-6 text-gray-900"
                                        )}
                                      >
                                        Delete
                                      </a>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="sticky bottom-0 -mx-6 mt-auto bg-gray-900">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white">
                    <UserButton afterSignOutUrl="/" />
                    <span className="sr-only">Your profile</span>
                    {user && <span aria-hidden="true">{user.fullName}</span>}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center justify-between gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <UserButton afterSignOutUrl="/" />
          <span className="sr-only">Your profile</span>
        </div>

        <div className="lg:ml-72 min-h-screen flex flex-col border border-blue-500">
          <div className="flex-grow">
            {isNewConversation ? (
              <div className="flex justify-center items-center">
                <div>
                  <h1>Hello! How can I help you?</h1>
                </div>
              </div>
            ) : (
              <div className="flex flex-col overflow-y-auto hide-scrollbar">
                {messages.map((m) => (
                  <div className="pb-5 px-2 leading-7" key={m.id}>
                    {m.role === "user" ? "You: " : "Streamscore: "}
                    {m.content}
                  </div>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex justify-center w-full sticky bottom-0 py-4 bg-white"
          >
            <div className="relative w-1/2">
              <textarea
                value={input}
                className="w-full pl-2 py-1 border-2 border-gray-300 rounded-md focus:outline-none overflow-y-hidden min-h-16 resize-none"
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
      </div>
    </>
  );
}
