export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
