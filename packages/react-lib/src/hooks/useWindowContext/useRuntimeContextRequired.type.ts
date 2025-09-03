import { RuntimeContext } from "./RuntimeContext";
import { RuntimeContextRequiredError } from "./RuntimeContextRequiredError";

/**
 * useRuntimeContextRequired 훅의 props 타입
 */
export interface UseRuntimeContextRequiredProps {
  /**
   * 필요한 런타임 컨텍스트 목록
   *
   * @example
   * ['iframe'] // iframe에서만 허용
   * ['window', 'child'] // 일반 윈도우와 자식 윈도우에서만 허용
   * ['window', 'child', 'iframe'] // 브라우저 환경에서만 허용 (worker, server 제외)
   */
  requiredContexts: RuntimeContext[];

  /**
   * 요구사항 위반 시 표시할 에러 메시지
   * 지정하지 않으면 기본 메시지가 사용됩니다.
   */
  message?: string;

  /**
   * 요구사항 위반 시 에러를 던질지 여부
   * @default false
   */
  throwOnViolation?: boolean;

  /**
   * 요구사항 위반 시 실행할 콜백 함수
   *
   * @param error RuntimeContextRequiredError 객체 (currentContext, requiredContexts 정보 포함)
   */
  onViolation?: (error: RuntimeContextRequiredError) => void;

  /**
   * 요구사항 검사를 비활성화할지 여부
   * 개발 중이거나 특정 조건에서 요구사항을 우회하고 싶을 때 사용
   * @default false
   */
  disabled?: boolean;
}

/**
 * useRuntimeContextRequired 훅의 반환 타입
 */
export interface UseRuntimeContextRequiredReturns {
  /**
   * 현재 런타임 컨텍스트
   */
  currentContext: RuntimeContext;

  /**
   * 현재 컨텍스트가 요구사항을 만족하는지 여부
   */
  isAllowed: boolean;

  /**
   * 요구사항을 위반했는지 여부 (isAllowed의 반대)
   */
  isViolated: boolean;

  /**
   * 필요한 런타임 컨텍스트 목록
   */
  requiredContexts: RuntimeContext[];
}
