"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    console.log(input);
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
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button onClick={handleSubmit} className="border p-2 rounded">
          Submit
        </button>
      </div>
    </main>
  );
}
