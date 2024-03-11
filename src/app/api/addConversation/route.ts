import { db } from "@/db/db";
import { InsertConversation, conversations } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const requestData: InsertConversation = await req.json();
    await db.insert(conversations).values(requestData);
    return new Response(
      JSON.stringify({ message: "Conversation added successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log("Error parsing request data:", error);
    return new Response(
      JSON.stringify({
        message: "Error adding conversation",
        error: error instanceof Error ? error.toString() : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
