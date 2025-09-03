export const normalizeOrigin = (origin: string): string => {
  return new URL(origin).origin;
};
