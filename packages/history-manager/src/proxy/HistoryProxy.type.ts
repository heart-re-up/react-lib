export type OnChangeState = (
  state: unknown,
  url: string | URL | null | undefined
) => void;

export interface HistoryProxy extends History {
  setPushListener: (listener: OnChangeState | null) => void;
  setReplaceListener: (listener: OnChangeState | null) => void;
}
