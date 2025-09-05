import { useCallback, useState } from "react";
import { useEffectDev } from "../useEffectDev.ts/useEffectDev";
import { usePrevious } from "../usePrevious";
import {
  UseControlledStateProps,
  UseControlledStateReturns,
} from "./useControlledState.type";

/**
 * 제어/비제어 컴포넌트에서 자동으로 값을 관리해주는 훅
 *
 * @param props - 훅 설정 옵션
 * @returns [현재값, 값변경함수] 튜플
 *
 * @example
 * // 비제어 컴포넌트 (내부 상태 관리)
 * const [value, setValue] = useControlledState({ defaultValue: '' });
 *
 * @example
 * // 제어 컴포넌트 (외부에서 상태 관리)
 * const [value, setValue] = useControlledState({
 *   value: externalValue,
 *   onChange: setExternalValue
 * });
 *
 * @example
 * // 하이브리드 (기본값 + 외부 제어)
 * const [value, setValue] = useControlledState({
 *   value: externalValue,
 *   defaultValue: 'default',
 *   onChange: setExternalValue
 * });
 */
export const useControlledState = <T>(
  props: UseControlledStateProps<T>
): UseControlledStateReturns<T> => {
  const { value, defaultValue, onChange } = props;

  // 제어 컴포넌트인지 확인 (value가 undefined가 아닌 경우)
  const isControlled = value !== undefined;

  // 내부 상태 (비제어 컴포넌트용)
  const [internalState, setInternalState] = useState<T>(defaultValue as T);

  // 제어/비제어 전환 감지를 위한 이전 상태 추적
  const wasControlled = usePrevious(isControlled);

  // 개발 환경에서 잘못된 사용 패턴 경고
  useEffectDev(() => {
    // 제어/비제어 전환 감지 (양방향)
    if (wasControlled !== undefined && wasControlled !== isControlled) {
      // eslint-disable-next-line no-console
      console.warn(
        `useControlledState: 컴포넌트가 ${wasControlled ? "제어" : "비제어"}에서 ${isControlled ? "제어" : "비제어"}로 전환되었습니다. ` +
          "이는 예측 불가능한 동작을 야기할 수 있습니다. " +
          "컴포넌트는 생명주기 동안 일관되게 제어되거나 비제어되어야 합니다."
      );
    }
  }, [isControlled, wasControlled]);

  // 현재 값 결정 (제어: 외부 value, 비제어: 내부 state)
  const currentValue = isControlled ? value : internalState;

  // 값 변경 함수
  const setValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      const resolvedValue =
        typeof newValue === "function"
          ? (newValue as React.ReducerWithoutAction<T>)(currentValue)
          : newValue;

      // 비제어 컴포넌트인 경우 내부 상태 업데이트
      if (!isControlled) {
        setInternalState(resolvedValue);
      }

      // onChange 콜백 호출 (제어/비제어 모두)
      if (onChange && resolvedValue !== currentValue) {
        onChange(resolvedValue);
      }
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue];
};
