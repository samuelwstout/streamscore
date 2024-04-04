import { db } from "@/db/db";
import { SelectConversation, conversations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
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
  try {
    await db.delete(conversations).where(eq(conversations.id, id));
    return new Response(
      JSON.stringify({ message: "Conversation deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error deleting conversation",
        error: error instanceof Error ? error.toString() : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
