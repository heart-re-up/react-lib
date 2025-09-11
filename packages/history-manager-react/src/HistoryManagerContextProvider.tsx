import { HistoryManagerImpl } from "@heart-re-up/history-manager/core";
import { HistoryManagerContext } from "./HistoryManagerContext";

export type HistoryManagerContextProviderProps = {
  children: React.ReactNode;
};

export function HistoryManagerContextProvider({
  children,
}: HistoryManagerContextProviderProps) {
  const isServer = typeof window === "undefined";
  const historyManager = new HistoryManagerImpl(
    isServer ? undefined : window.history
  );
  return (
    <HistoryManagerContext value={historyManager}>
      {children}
    </HistoryManagerContext>
  );
}
