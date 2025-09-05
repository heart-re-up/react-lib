import { ExactOrigin, isExactOrigin } from "./ExactOrigin";

/**
 * 윈도우간 메시지 통신에서 허용되는 유효한 origin 타입
 *
 * 예시
 * - "*" : 모든 origin 허용 (보안상 권장하지 않음)
 * - ExactOrigin 타입
 *
 * 부분 와일드카드는 지원하지 않습니다.
 */
export type ValidOrigin = ExactOrigin | "*";

/**
 * 문자열이 유효한 ValidOrigin 타입인지 검증하는 타입가드
 * @param value 검증할 값
 * @returns value가 유효한 ValidOrigin 타입이면 true
 */
export const isValidOrigin = (value: unknown): value is ValidOrigin => {
  // "*"는 특별한 값으로 허용
  if (value === "*") {
    return true;
  }
  return isExactOrigin(value);
};
