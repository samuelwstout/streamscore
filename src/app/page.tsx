"use client";
import React, { useEffect, useState } from "react";
import { Trail } from "./_components/Trail/Trail";
import ABCNotation from "./_components/ABCNotation/ABCNotation";

export default function Landing() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const abcContent = `
    X: 1
    L: 1/4
    K: Ab
    E A B b a c e E A B b a c e
  `;

  return (
    <div className="bg-white">
      <div className="relative isolate pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">
                streamscore
              </h1>
              <h1 className="text-base lg:text-xl font-normal tracking-tight text-gray-900">
                generative AI for sheet music
              </h1>

              <ABCNotation content={abcContent} />

              <div className="flex items-center justify-center mt-8">
                <a
                  href="/chat"
                  className="rounded-md bg-black px-3.5 py-2.5 text-sm font-normal tracking-tight text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  get started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
