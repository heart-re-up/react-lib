import { use } from "react";
import { useProgressCounterAsync } from "../../hooks/useProgressCounterAsync";
import { ProgressCounterAsyncContext } from "./ProgressCounterAsyncContext";

export const useProgressCounterAsyncContext = () => {
  // 컨텍스트가 있으면 컨텍스트를 사용하고, 없으면 로컬 상태를 사용
  const context = use(ProgressCounterAsyncContext);
  const local = useProgressCounterAsync();
  return context || local;
};
