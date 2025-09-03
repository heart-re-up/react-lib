import { BroadcastChannelError } from "./BroadcastChannelError";

export type UseBroadcastChannelProps = {
  /**
   * 채널 이름
   *
   * 같은 출처에서 같은 채널 이름을 가진 창들과 통신할 수 있습니다.
   */
  channelName: string;

  /**
   * 채널 사용 비활성화 여부
   *
   * 이 옵션을 true로 설정하면 채널 사용을 비활성화합니다.
   */
  disabled?: boolean;

  /**
   * 메시지 수신 시 호출되는 콜백
   */
  onMessage?: (event: MessageEvent) => void;

  /**
   * 에러 발생 시 호출되는 콜백
   */
  onError?: <E extends BroadcastChannelError>(error: E) => void;
};

export type UseBroadcastChannelReturns = {
  /**
   * BroadcastChannel 지원 여부
   */
  isSupported: boolean;

  /**
   * 채널 이름을 설정합니다.
   *
   * 채널 이름을 설정하면 채널 이름을 변경할 수 있습니다.
   * @param channelName 채널 이름
   */
  setChannelName: (channelName: string) => void;

  /**
   * 데이터 메시지 전송 함수
   *
   * @param payload 전송 메시지에 포함할 데이터
   * @returns 전송 성공 여부
   */
  postMessage: <T = unknown>(data: T) => void;
};
