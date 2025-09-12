/**
 * 배열에서 from 인덱스부터 to 인덱스까지 방향성을 유지하며 슬라이스합니다.
 * 시작점과 끝점을 모두 포함합니다.
 *
 * 예를 들어 배열이 [A, B, C, D, E] 인 경우:
 *
 * from=1, to=3 인 경우:
 * 결과 = [B, C, D] (순방향)
 *
 * from=3, to=1 인 경우:
 * 결과 = [D, C, B] (역방향)
 *
 * from=2, to=2 인 경우:
 * 결과 = [C] (같은 위치)
 *
 * @param array 대상 배열
 * @param from 시작 인덱스
 * @param to 끝 인덱스
 * @returns from에서 to까지의 요소들을 방향에 따라 정렬한 배열
 */
export const sliceWithDirection = <T>(
  array: T[],
  from: number,
  to: number
): T[] => {
  const start = Math.min(from, to);
  const end = Math.max(from, to) + 1; // slice는 end를 포함하지 않으므로 +1
  const sliced = array.slice(start, end);
  // from > to 면 역순으로 정렬
  return from > to ? sliced.reverse() : sliced;
};
