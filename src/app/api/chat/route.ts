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
        This is a chat interface for technical music questions. 
        Return ABC notation in every response.
        This UI converts ABC notation to sheet music. 
        Use simple, easy-to-read ABC notation with quarter notes by default, not eighth notes by default.
        Avoid fancy embellishments unless explicitly requested. 
        Keep it simple. 
        Don't explicitly say that you're using ABC notation. Say it's music notation.
        `,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
