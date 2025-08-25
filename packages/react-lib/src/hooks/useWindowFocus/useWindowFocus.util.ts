export const hasDocumentFocus = (): boolean => {
  return typeof window === "undefined" || typeof document === "undefined"
    ? false
    : document.hasFocus();
};
