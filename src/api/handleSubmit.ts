"use server";

import OpenAI from "openai";

const openai = new OpenAI();

export const handleSubmit = async (input: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: input }],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0];
};
