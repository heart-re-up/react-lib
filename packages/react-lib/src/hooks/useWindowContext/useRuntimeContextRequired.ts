import { useEffect } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import { RuntimeContextRequiredError } from "./RuntimeContextRequiredError";
import { useRuntimeContext } from "./useRuntimeContext";
import type {
  UseRuntimeContextRequiredProps,
  UseRuntimeContextRequiredReturns,
} from "./useRuntimeContextRequired.type";

/**
 * 특정 런타임 컨텍스트에서만 동작하도록 제한하는 훅
 *
 * 필요한 환경에서 실행되지 않을 경우 에러를 발생시키거나 콜백을 실행합니다.
 *
 * @example
 * ```tsx
 * // iframe에서만 동작하도록 제한
 * useRuntimeContextRequired({
 *   required: ['iframe'],
 *   message: '이 컴포넌트는 iframe에서만 사용할 수 있습니다.'
 * });
 *
 * // 브라우저 환경(window, child, iframe)에서만 동작
 * useRuntimeContextRequired({
 *   required: ['window', 'child', 'iframe'],
 *   onViolation: (error) => console.warn('브라우저에서만 사용 가능합니다.', error)
 * });
 * ```
 *
 * @param props 훅 옵션
 * @returns 현재 컨텍스트와 요구사항 상태 정보
 */
export const useRuntimeContextRequired = (
  props: UseRuntimeContextRequiredProps
): UseRuntimeContextRequiredReturns => {
  const {
    requiredContexts,
    message,
    throwOnViolation = false,
    onViolation,
    disabled = false,
  } = props;

  const onViolationRef = useRefLatest(onViolation);

  // 현재 런타임 컨텍스트 감지
  const runtimeContext = useRuntimeContext();
  // 요구사항 확인
  const isViolated = !requiredContexts.includes(runtimeContext);

  useEffect(() => {
    if (disabled || !isViolated) {
      return;
    }

    // 요구사항 위반 시 처리
    const errorMessage =
      message ||
      `이 기능은 ${requiredContexts.join(", ")} 환경에서만 사용할 수 있습니다. (현재: ${runtimeContext})`;

    const runtimeContextRequiredError = new RuntimeContextRequiredError(
      errorMessage,
      runtimeContext,
      requiredContexts
    );

    // 콜백 실행
    onViolationRef.current?.(runtimeContextRequiredError);

    // 에러 발생
    if (throwOnViolation) {
      throw runtimeContextRequiredError;
    }
  }, [
    runtimeContext,
    isViolated,
    disabled,
    requiredContexts,
    message,
    throwOnViolation,
    onViolationRef,
  ]);

  return {
    runtimeContext,
    isViolated,
  };
};
