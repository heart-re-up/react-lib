export const relations = [
  {
    type: "hook",
    name: "useProgressCounter",
    description: "@heart-re-up/react-lib/hooks/use-progress-counter",
  },
  {
    type: "hook",
    name: "useProgressCounterAsync",
    description: "@heart-re-up/react-lib/hooks/use-progress-counter-async",
  },
  {
    type: "context(provider/hook)",
    name: "ProgressCounterAsyncContextProvider",
    description: "@heart-re-up/react-lib/contexts/progress-counter-async",
  },
  {
    type: "context(provider/hook)",
    name: "useProgressCounterAsyncContext",
    description: "@heart-re-up/react-lib/contexts/progress-counter-async",
  },
] as const;
