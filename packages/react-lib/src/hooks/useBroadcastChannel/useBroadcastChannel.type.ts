import { BroadcastChannelError } from "./BroadcastChannelError";

export type OnBroadcaseChannelMessageHandler = (event: MessageEvent) => void;
export type OnBroadcaseChannelErrorHandler = <E extends BroadcastChannelError>(
  error: E
) => void;
export type UseBroadcastChannelProps = {
  /**
   * 초기 채널 이름
   *
   * 초기화에만 관여하는 채널 이름입니다.
   * 추후 resetBroadcastChannel 을 통해서 채널을 연결할 수 있습니다.
   *
   * 초기 채널 이름을 null로 설정하면 초기에 연결을 시도하지 않습니다.
   */
  initialChannelName: string | null;

  /**
   * 채널 사용 비활성화 여부
   *
   * 이 옵션을 true로 설정하면 채널 사용을 비활성화합니다.
   */
  disabled?: boolean;

  /**
   * 메시지 수신 시 호출되는 콜백
   */
  onMessage?: OnBroadcaseChannelMessageHandler;

  /**
   * 에러 발생 시 호출되는 콜백
   */
  onError?: OnBroadcaseChannelErrorHandler;
};

export type UseBroadcastChannelReturns = {
  /**
   * BroadcastChannel 지원 여부
   */
  isSupported: boolean;

  /**
   * 채널을 닫습니다.
   */
  closeBroadcastChannel: () => void;

  /**
   * 채널 이름을 설정합니다.
   *
   * 채널 이름을 설정하면 채널이 연결됩니다.
   * 이미 연결된 채널이 있다면, 기존 채널을 닫고 새로운 채널을 연결합니다.
   */
  resetBroadcastChannel: (channelName: string) => void;

  /**
   * 데이터 메시지 전송 함수
   *
   * @param payload 전송 메시지에 포함할 데이터
   * @returns 전송 성공 여부
   */
  postMessage: <T = unknown>(data: T) => void;
};
