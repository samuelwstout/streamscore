"use client";
import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  Menu,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { UserButton, useUser } from "@clerk/nextjs";
import type { SelectConversation } from "@/db/schema";
import { useChat } from "ai/react";
import Image from "next/image";
import type { Message as BaseMessage } from "ai";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { autoResize } from "@/utils/autoResizeInput";
import abcjs from "abcjs";

interface Message extends BaseMessage {
  splitContent?: { content: string; isReady: boolean }[];
}

interface ClickedConvProps {
  id: number;
  userId: string | null;
  title: string | null;
  messages: Message[] | null;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function renderABC(abcString: string, elementId: string, callback: () => void) {
  abcjs.renderAbc(elementId, abcString);
  callback(); // Call the callback after rendering
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<SelectConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [chatFinished, setChatFinished] = useState(false);
  const [conversationId, setConversationId] = useState<null | number>(null);
  const [clickedConv, setClickedConv] = useState<null | ClickedConvProps>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newConversationStarted, setNewConversationStarted] = useState(false);

  const { user } = useUser();

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      onFinish: () => setChatFinished(true),
    });

  useEffect(() => {
    let allMessagesReady = true;

    const newMessages = messages.map((m: Message, index) => {
      if (m.content.includes("X:")) {
        const splitContent = m.content.split(
          /(X:\d+[\s\S]*?K:[\s\S]*?\n[\s\S]*?```\n)/
        );
        const updatedSplitContent = splitContent.map((part, partIndex) => {
          if (part.includes("X:")) {
            // Initially mark as not ready
            allMessagesReady = false;
            return { content: part.trim(), isReady: false };
          }
          return { content: part.trim().replace(/```/g, ""), isReady: true };
        });

        return { ...m, splitContent: updatedSplitContent };
      }
      return m; // Return unchanged if no ABC notation
    });

    if (allMessagesReady) {
      setMessages(newMessages);
    } else {
      newMessages.forEach((m, index) => {
        m.splitContent?.forEach((part, partIndex) => {
          if (part.content.includes("X:") && !part.isReady) {
            renderABC(
              part.content,
              `abc-container-${index}-${partIndex}`,
              () => {
                part.isReady = true;
                // Check if all parts are now ready
                const allPartsReady = newMessages.every(
                  (msg) =>
                    msg.splitContent?.every((part) => part.isReady) ?? true
                );
                if (allPartsReady) {
                  setMessages(newMessages);
                }
              }
            );
          }
        });
      });
    }
  }, [messages]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (isNewConversation && messages.length > 0) {
      setIsNewConversation(false);
      setNewConversationStarted(true);
    }
  }, [isNewConversation, messages]);

  useEffect(() => {
    if (chatFinished && newConversationStarted) {
      addConversation();
      setNewConversationStarted(false);
    } else if (chatFinished && !isNewConversation) {
      updateConversation();
    }
    setChatFinished(false);
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
      setConversationId(data.id);
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

  async function deleteConversation(clickedConv: ClickedConvProps) {
    const updatedConversations = conversations.filter(
      (i) => i.id !== clickedConv.id
    );
    setConversations(updatedConversations);
    const response = await fetch(`api/deleteConversation/${clickedConv.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete conversation.");
    } else {
      setDeleteModal(false);
      startNewConversation();
    }
  }

  function getMessages(clickId: number) {
    setSidebarOpen(false);
    setIsNewConversation(false);
    scrollToTop();
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
      <Transition show={deleteModal}>
        <Dialog className="relative z-10" onClose={setDeleteModal}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete conversation?
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          This will delete{" "}
                          <span className="font-semibold">
                            {clickedConv?.title}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => deleteConversation(clickedConv!)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setDeleteModal(false)}
                      data-autofocus
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
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
              <div className="fixed inset-0 bg-black" />
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
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
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
                                      <Menu.Button
                                        className="-m-2.5 block p-2.5 text-gray-500 hover:text-white"
                                        onClick={(e) => e.stopPropagation()}
                                      >
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
                                              <div
                                                onClick={() => {
                                                  setDeleteModal(true);
                                                  setClickedConv(item);
                                                }}
                                                className={classNames(
                                                  active ? "bg-gray-50" : "",
                                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                                )}
                                              >
                                                Delete
                                              </div>
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
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black">
            <div className="flex h-16 shrink-0 items-center sticky top-0 bg-black z-10 px-6">
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
                          className="flex items-center justify-between gap-x-3 py-3 hover:bg-slate-800 rounded-md group cursor-pointer"
                        >
                          <div className="group-hover:text-white group flex text-sm leading-6 font-semibold truncate text-gray-400 px-2">
                            {item.title}
                          </div>
                          <div className="flex flex-none items-center gap-x-4">
                            <Menu as="div" className="relative flex-none">
                              <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-white">
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
                                      <div
                                        onClick={() => {
                                          setDeleteModal(true);
                                          setClickedConv(item);
                                        }}
                                        className={classNames(
                                          active ? "bg-gray-50" : "",
                                          "block px-3 py-1 text-sm leading-6 text-gray-900"
                                        )}
                                      >
                                        Delete
                                      </div>
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
                <li className="sticky bottom-0 -mx-6 mt-auto bg-black">
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

        <div className="sticky top-0 z-40 flex items-center justify-between gap-x-6 bg-black px-4 py-4 shadow-sm sm:px-6 lg:hidden">
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
        <div className="lg:ml-72 flex flex-col">
          <div className="flex-grow">
            {isNewConversation ? (
              <div className="flex justify-center items-center min-h-screen">
                <h1>Hello! How can I help you?</h1>
              </div>
            ) : (
              <div className="flex flex-col overflow-y-auto hide-scrollbar px-10 lg:px-20 py-5 min-h-screen">
                {messages.map((m: Message, index) => (
                  <div className="pb-5 leading-7" key={m.id}>
                    {m.role === "user" ? "You: " : "Streamscore: "}
                    <div>
                      {m.splitContent ? (
                        m.splitContent.map((part, partIndex) => (
                          <div key={partIndex}>
                            {part.isReady ? (
                              part.content.includes("X:") ? (
                                <div
                                  id={`abc-container-${index}-${partIndex}`}
                                />
                              ) : (
                                <div>
                                  {part.content
                                    .split("\n")
                                    .map((line, index) => (
                                      <React.Fragment key={index}>
                                        {line}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </div>
                              )
                            ) : (
                              <div>Loading...</div> // Placeholder or loading indicator
                            )}
                          </div>
                        ))
                      ) : (
                        <div>{m.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as any);
              setTimeout(() => {
                const event = new Event("input", { bubbles: true });
                document.querySelector("textarea")?.dispatchEvent(event);
              });
              if (messages.length < 4) {
                setTimeout(() => {
                  scrollToTop();
                }, 100);
              }
            }}
            className="flex justify-center w-full sticky bottom-0 py-4 bg-white"
          >
            <div className="relative w-full lg:w-1/2 mx-10 md:w-2/3 border-2 border-gray-300 rounded-md">
              <textarea
                value={input}
                className="w-full px-2 py-1 focus:outline-none overflow-y-hidden resize-none"
                placeholder="Type your message here..."
                onChange={handleInputChange}
                onInput={autoResize}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                    setTimeout(() => {
                      const event = new Event("input", {
                        bubbles: true,
                      });
                      document.querySelector("textarea")?.dispatchEvent(event);
                    });
                    if (messages.length < 4) {
                      setTimeout(() => {
                        scrollToTop();
                      }, 100);
                    }
                  }
                }}
              />
              <div className="flex justify-end items-center p-1">
                <button
                  type="submit"
                  className={`rounded-md ${
                    input.length > 0 ? "bg-black" : "bg-slate-200"
                  } p-1`}
                >
                  <Image src="/arrow.png" alt="arrow" width={25} height={25} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
