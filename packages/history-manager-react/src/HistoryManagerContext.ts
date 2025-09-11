import { HistoryManager } from "@heart-re-up/history-manager/core";
import { createContext } from "react";

export type HistoryManagerContextType = HistoryManager;

export const HistoryManagerContext =
  createContext<HistoryManagerContextType | null>(null);
