import { isServer } from "./isServer";

export const isBrowser = (): boolean => !isServer();
