import { prompt } from "@/prompt";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("models/gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}
