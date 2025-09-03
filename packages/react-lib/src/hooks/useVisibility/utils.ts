export const isVisible = (): boolean =>
  typeof window === "undefined" || typeof document === "undefined"
    ? false
    : document.visibilityState === "visible";
