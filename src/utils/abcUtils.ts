export function extractABC(content: string): string | null {
  const abcRegex = /```([^`]+)```/;
  const match = content.match(abcRegex);
  return match ? match[1].trim() : null;
}
