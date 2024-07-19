"use client";
import React, { useEffect, useState } from "react";
import { Trail } from "./_components/Trail/Trail";

export default function Landing() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div className="bg-white">
      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        ></div>
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Trail open={open}>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Streamscore
                </h1>
                <h1 className="text-base lg:text-xl font-bold tracking-tight text-gray-900">
                  an LLM chat interface that renders sheet music.
                </h1>
                <div className="flex items-center justify-center">
                  <a
                    href="/chat"
                    className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Get started
                  </a>
                </div>
              </Trail>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
