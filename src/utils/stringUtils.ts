export function removeTripleBackticks(input: string): string {
  return input.trim().replace(/```/g, "");
}
