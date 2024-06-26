export function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = "inherit";
  if (target.value === "") {
    target.style.height = "32px";
  } else {
    const minHeight = parseInt(window.getComputedStyle(target).minHeight, 10);
    const newHeight = Math.max(target.scrollHeight, minHeight);
    target.style.height = `${newHeight}px`;
  }
}
