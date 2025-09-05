export type OnMessageHandler = (event: MessageEvent) => void;

export type OnMessageFromUntrustedOriginHandler = (event: MessageEvent) => void;

export type UseWindowMessageEventReceiverProps = {
  /**
   * 메시지 전송 비활성화 여부
   *
   * 이 옵션을 true로 설정하면 메시지 전송을 비활성화합니다.
   */
  disabled?: boolean;

  /**
   * 초기화시 메시지 수신에 사용되는 신뢰하는 출처 목록
   * 초기화에만 사용됩니다. 중간에 변경하려면 setTrustedOrigins 함수를 사용하세요.
   * (현재 출처의 메시지는 항상 신뢰합니다.)
   */
  intialTrustedOrigins?: string[];

  /**
   * 메시지 수신 핸들러
   *
   * 제공하지 않은 경우 메시지 수신 핸들러를 등록하지 않습니다.
   */
  onMessage?: OnMessageHandler;

  /**
   * 신뢰하지 않는 출처에서 온 메시지 수신 핸들러
   *
   * 명확하게 핸들러 자체를 분리해서 신뢰하지 않는 출처에서 온 메시지를 처리하는 핸들러를 제공합니다.
   */
  onMessageFromUntrustedOrigin?: OnMessageFromUntrustedOriginHandler;
};

export type UseWindowMessageEventReceiverReturns = {
  /**
   * 신뢰하는 출처를 설정합니다.
   *
   * iframe 등 동적으로 신뢰하는 출처를 변경하는 경우에 사용합니다.
   */
  setTrustedOrigins: (trustedOrigins: string[]) => void;
};
