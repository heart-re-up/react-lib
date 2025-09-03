import { RuntimeContext } from "../useWindowContext";

export type UseWindowInvokerDetectorReturns = {
  invokerWindow: Window | null;
  invokerOrigin: string | null;
  invokerRuntimeContext: RuntimeContext;
  accessible: boolean;
};
