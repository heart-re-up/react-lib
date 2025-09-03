import { useRuntimeContext } from "../useWindowContext";
import { UseWindowInvokerDetectorReturns } from "./useWindowInvokerDetector.type";
import {
  getOrigin,
  getWindow,
  isUnavailableRuntimeContext,
} from "./useWindowInvokerDetector.util";

export const useWindowInvokerDetector = (): UseWindowInvokerDetectorReturns => {
  const invokerRuntimeContext = useRuntimeContext();

  // 웹 워커, 서버, 감지 불가능한 환경은 접근 불가능
  if (isUnavailableRuntimeContext(invokerRuntimeContext)) {
    return {
      invokerWindow: null,
      invokerOrigin: null,
      invokerRuntimeContext: invokerRuntimeContext,
      accessible: false,
    };
  }

  const invokerWindow: Window | null = getWindow(invokerRuntimeContext);
  const invokerOrigin: string | null = getOrigin(invokerRuntimeContext);

  // 크로스 오리진으로 인해 origin을 가져올 수 없는 경우 접근 불가능으로 처리
  // 같은 오리진이면 무조건 접근 가능이지만, 혹시 모르니 오리진 비교
  const accessible =
    invokerOrigin !== null && invokerOrigin === window.location.origin;

  return {
    invokerWindow,
    invokerOrigin,
    invokerRuntimeContext,
    accessible,
  };
};
