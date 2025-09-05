import { Dispatch, SetStateAction } from "react";

export type UseControlledStateProps<T> = {
  /**
   * 제어 컴포넌트에서 사용할 값 (optional)
   *
   * ⚠️ 중요: 이 값이 제공되면 제어 컴포넌트로 동작합니다.
   * 컴포넌트 생명주기 동안 일관되게 제어되거나 비제어되어야 합니다.
   *
   * @example
   * // ✅ 올바른 사용 - 항상 제어
   * const [value, setValue] = useControlledState({
   *   value: externalValue,
   *   onChange: setExternalValue
   * });
   *
   * @example
   * // ❌ 잘못된 사용 - 조건부 제어 (양방향 전환 모두 위험)
   * const [value, setValue] = useControlledState({
   *   value: condition ? externalValue : undefined,  // 위험! 제어↔비제어 전환
   *   onChange: setExternalValue
   * });
   */
  value?: T;
  /**
   * 비제어 컴포넌트에서 사용할 기본값
   *
   * 제어 컴포넌트(value가 제공된 경우)에서는 무시됩니다.
   */
  defaultValue?: T;
  /**
   * 값이 변경될 때 호출되는 콜백 함수 (optional)
   *
   * 제어 컴포넌트에서는 필수적으로 제공해야 상태 동기화가 가능합니다.
   */
  onChange?: (value: T) => void;
};

export type UseControlledStateReturns<T> = [
  /**
   * 현재 상태 값
   */
  T,
  /**
   * 상태를 업데이트하는 함수 (React.useState와 동일한 시그니처)
   */
  Dispatch<SetStateAction<T>>,
];
