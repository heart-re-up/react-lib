/**
 * 정확한 origin 타입
 *
 * 예시
 * - "https://example.com"
 * - "https://example.com:8080"
 */
export type ExactOrigin =
  | `${string}://${string}`
  | `${string}://${string}:${string}`;

/**
 * ExactOrigin 타입 가드
 * @param value 검증할 값
 * @returns value가 ExactOrigin 타입이면 true
 */
export const isExactOrigin = (value: unknown): value is ExactOrigin => {
  // string 타입이 아니면 false
  if (typeof value !== "string") {
    return false;
  }

  // URL 생성자로 검증 - 브라우저 표준에 맞는 정확한 검증
  try {
    const url = new URL(value);
    return url.origin === value;
  } catch {
    return false;
  }
};
