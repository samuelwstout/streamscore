"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { UserButton, useUser } from "@clerk/nextjs";
import type { SelectConversation } from "@/db/schema";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Chat() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<SelectConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  useEffect(() => {
    getConversations();
  }, []);

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
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {isLoadingConversations && (
                              <div className="text-sm text-white leading-6 font-semibold">
                                Loading conversations...
                              </div>
                            )}
                            {conversations
                              .sort((a, b) => b.id - a.id)
                              .map((item) => (
                                <li key={item.id}>
                                  <div
                                    className={classNames(
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                      "text-gray-400 hover:text-white hover:bg-gray-800"
                                    )}
                                  >
                                    {item.title}
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
            <div className="flex h-16 shrink-0 items-center sticky top-0 bg-gray-900 z-10 px-6">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="StreamScore"
              />
            </div>
            <nav className="flex flex-1 flex-col px-6">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {isLoadingConversations && (
                      <div className="text-sm text-white leading-6 font-semibold">
                        Loading conversations...
                      </div>
                    )}
                    {conversations
                      .sort((a, b) => b.id - a.id)
                      .map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-x-6 py-5 bg-white"
                        >
                          <div className="min-w-0">
                            <div className="flex items-start gap-x-3">
                              <p className="text-sm font-semibold leading-6 text-gray-900 truncate">
                                {item.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-none items-center gap-x-4">
                            <Menu as="div" className="relative flex-none">
                              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">Open options</span>
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

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
    </>
  );
}
