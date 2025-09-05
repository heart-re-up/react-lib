/**
 * BroadcastChannel 에러
 */
export class BroadcastChannelError extends Error {
  constructor(
    message: string,
    public readonly channelName: string | null,
    public readonly cause?: unknown
  ) {
    super(`[Channel: ${channelName}] ${message}`);
    this.name = "BroadcastChannelError";
    // Error 클래스 상속 시 필요한 프로토타입 설정
    Object.setPrototypeOf(this, BroadcastChannelError.prototype);
  }
}

/**
 * BroadcastChannel 전송 에러
 */
export class BroadcastChannelPostError extends BroadcastChannelError {
  constructor(message: string, channelName: string | null, cause?: unknown) {
    super(message, channelName, cause);
    this.name = "BroadcastChannelPostError";
    Object.setPrototypeOf(this, BroadcastChannelPostError.prototype);
  }
}

/**
 * BroadcastChannel 수신 에러
 */
export class BroadcastChannelReceiveError extends BroadcastChannelError {
  constructor(message: string, channelName: string | null, cause?: unknown) {
    super(message, channelName, cause);
    this.name = "BroadcastChannelReceiveError";
    Object.setPrototypeOf(this, BroadcastChannelReceiveError.prototype);
  }
}

/**
 * BroadcastChannel 미지원 브라우저 에러
 */
export class BroadcastChannelNotSupportedError extends BroadcastChannelError {
  constructor(message: string, channelName: string | null) {
    super(message, channelName);
    this.name = "BroadcastChannelNotSupportedError";
    Object.setPrototypeOf(this, BroadcastChannelNotSupportedError.prototype);
  }
}
