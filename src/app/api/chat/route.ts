import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { prompt } from "@/utils/prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      ...messages,
      {
        role: "system",
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
