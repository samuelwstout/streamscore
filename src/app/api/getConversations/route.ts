import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { SelectConversation, conversations } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const userConversations: SelectConversation[] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, user.id));

    return new Response(JSON.stringify(userConversations), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error getting conversations",
        error: error instanceof Error ? error.toString() : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
