import { uuid } from "@/libs";
import { AdvancedHistoryState, AffinityOptions } from "./AdvancedHistory.type";

export const isAdvancedHistoryState = <T = unknown>(
  state: unknown
): state is AdvancedHistoryState<T> => {
  return (
    state !== undefined &&
    state !== null &&
    typeof state === "object" &&
    "data" in state &&
    state.data !== undefined &&
    state.data !== null &&
    "node" in state &&
    state.node !== undefined &&
    state.node !== null
  );
};

export const satisfiesAdvancedHistoryState = <T = unknown>(
  data: T,
  affinity?: AffinityOptions
): AdvancedHistoryState<T> => {
  if (isAdvancedHistoryState<T>(data)) {
    return data;
  }
  return {
    data,
    node: {
      id: uuid(),
      timestamp: Date.now(),
      affinity,
    },
  };
};
