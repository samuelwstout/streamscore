"use client";

import { useState } from "react";
import { handleSubmit } from "../api/handleSubmit";
import TypewriterEffect from "@/components/typewriterEffect";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    const response = await handleSubmit(input);
    const {
      message: { content },
    } = response;
    if (content) setResponse(content);
    setInput("");
  };

  return (
    <main>
      <div className="min-h-screen w-full flex flex-col justify-start items-center pt-5 gap-2">
        <input
          type="text"
          className="rounded p-2 text-black"
          placeholder="Enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClick();
          }}
        />
        <button onClick={handleClick} className="border p-2 rounded">
          Submit
        </button>
        {response && <TypewriterEffect text={response} />}
      </div>
    </main>
  );
}
