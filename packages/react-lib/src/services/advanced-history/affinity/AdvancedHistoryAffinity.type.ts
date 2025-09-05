import { AffinityState } from "../AdvancedHistory.type";

export interface AdvancedHistoryAffinity {
  /**
   *  같은 affinity 의 베이스까지 뒤로가기
   *
   * @param state 관련된 히스토리들의 affinity 상태를 어떻게 변경할지 결정하는 상태
   */
  backAffinity: (state?: Partial<AffinityState>) => void;

  /**
   * 같은 affinity 를 탈출하며 뒤로가기. 즉 affinity 의 베이스로 이동하는 backAffinity 보다 1만큼 더 뒤로가기한다.
   *
   * @param state 관련된 히스토리들의 affinity 상태를 어떻게 변경할지 결정하는 상태
   */
  exitAffinity: (state?: Partial<AffinityState>) => void;

  /**
   * 관련된 히스토리들의 affinity 상태를 변경한다.
   *
   * 단순히 affinity 상태만 변경하고 navigation 은 하지 않는다.
   *
   * @param affinityId 관련 히스토리 아이디
   * @param state 관련된 히스토리들의 affinity 상태를 어떻게 변경할지 결정하는 상태
   */
  updateAffinityState: (affinityId: string, state: Partial<AffinityState>) => void;
}
