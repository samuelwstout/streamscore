import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { conversations, SelectConversation } from "@/db/schema";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      id: SelectConversation["id"];
    };
  }
) {
  const { id } = params;
  const requestData = await req.json();
  const { messages } = requestData;
  try {
    await db
      .update(conversations)
      .set({ messages: messages })
      .where(eq(conversations.id, id))
      .returning();
    return new Response(
      JSON.stringify({ message: "Conversation updated successfully" }),
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
