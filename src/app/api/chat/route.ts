import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

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
        content: `
        This is a chat interface for answering technical music questions. 
        Generate ABC notation if the question is about musical concept, and if rendering sheet music would be useful. 
        Return simple, easy-to-read ABC notation.
        Use quarter notes by default, not eighth notes.
        Avoid embellishments unless explicitly requested.
        Keep it simple.
        `,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
