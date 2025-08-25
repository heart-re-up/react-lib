/**
 * 메시지 전송 옵션
 */
export type PostMessageOptions = {
  /**
   * 대상 오리진
   */
  targetOrigin?: string;
  /**
   * 전송할 데이터의 전송 객체
   */
  transfer?: Transferable[];
};
