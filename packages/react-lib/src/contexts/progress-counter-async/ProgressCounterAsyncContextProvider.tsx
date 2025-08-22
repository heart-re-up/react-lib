import {
  useProgressCounterAsync,
  UseProgressCounterAsyncProps,
} from "../../hooks/useProgressCounterAsync";
import { ProgressCounterAsyncContext } from "./ProgressCounterAsyncContext";

export type ProgressCounterAsyncContextProviderProps = {
  children: React.ReactNode;
} & UseProgressCounterAsyncProps;

export const ProgressCounterAsyncContextProvider = ({
  children,
  ...props
}: ProgressCounterAsyncContextProviderProps) => {
  const contextValue = useProgressCounterAsync(props);
  return (
    <ProgressCounterAsyncContext value={contextValue}>
      {children}
    </ProgressCounterAsyncContext>
  );
};
