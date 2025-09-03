export type OnMessageHandler = (
  event: MessageEvent,
  isOwnMessage: boolean
) => void;

export type OnMessageFromUntrustedOriginHandler = (event: MessageEvent) => void;

export type UseWindowEventMessageReceiverProps = {
  /**
   * 메시지 수신에 사용되는 신뢰하는 출처 목록
   *
   * 현재 출처의 메시지는 항상 신뢰합니다.
   */
  trustedOrigins?: string[];

  /**
   * 본인이 전송한 메시지도 수신
   *
   * 기본적으로 본인이 전송한 메시지는 무시됩니다.
   * 이 옵션을 true로 설정하면 본인이 전송한 메시지도 수신됩니다.
   * 기본값은 false입니다.
   */
  includeOwnMessage?: boolean;

  /**
   * 메시지 전송 비활성화 여부
   *
   * 이 옵션을 true로 설정하면 메시지 전송을 비활성화합니다.
   */
  disabled?: boolean;

  /**
   * 메시지 수신 핸들러
   *
   * 제공하지 않은 경우 메시지 수신 핸들러를 등록하지 않습니다.
   */
  onMessage?: OnMessageHandler;

  /**
   * 신뢰하지 않는 출처에서 온 메시지 수신 핸들러
   */
  onMessageFromUntrustedOrigin?: OnMessageFromUntrustedOriginHandler;
};

export type UseWindowEventMessageReceiverReturns = {
  /**
   * 신뢰하는 출처를 설정합니다.
   *
   * iframe 등 동적으로 신뢰하는 출처를 변경하는 경우에 사용합니다.
   */
  setTrustedOrigins: (trustedOrigins: string[]) => void;
};
