import type { Message } from "ai";

export interface ClickedConvProps {
  id: number;
  userId: string | null;
  title: string | null;
  messages: Message[] | null;
}
