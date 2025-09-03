import { WindowLike } from "@/libs/window";
import { PostMessageOptions } from "@/libs/window/message";

export type UseWindowEventMessageSenderProps = {
  /**
   * 메시지를 수신할 대상 윈도우
   *
   * 제공하지 않은 경우 현재 윈도우로 발송합니다.
   */
  targetWindow?: WindowLike | null;

  /**
   * 메시지를 수신하는 대상 윈도우의 origin
   *
   * 대상 윈도우의 URI 를 지정해야 합니다.
   *
   * 이벤트를 전송하려 할 때에 targetWindow의 스키마, 호스트 이름, 포트가 targetOrigin의 정보와 맞지 않다면, 이벤트는 전송되지 않습니다.
   *
   * 예) "https://example.com"
   */
  targetOrigin?: string | null;

  /**
   * 메시지 전송 비활성화 여부
   *
   * 이 옵션을 true로 설정하면 메시지 전송을 비활성화합니다.
   */
  disabled?: boolean;

  /**
   * 메시지 전송 에러 발생 시 호출되는 콜백
   */
  onError?: (error: Error) => void;
};

export type UseWindowEventMessageSenderReturns = {
  /**
   * 대상 윈도우를 설정합니다.
   *
   * iframe 등 DOM Loaded 이후에 윈도우를 획득하는 경우에 사용합니다.
   */
  setTargetWindow: (targetWindow: WindowLike) => void;

  /**
   * 대상 오리진을 설정합니다.
   *
   * iframe 등 동적으로 대상 오리진을 변경하는 경우에 사용합니다.
   */
  setTargetOrigin: (targetOrigin: string) => void;

  /**
   * 데이터 메시지 전송 함수
   *
   * @param payload 전송 메시지에 포함할 데이터
   * @param options 메시지 전송 옵션
   * @returns 전송 성공 여부
   */
  postMessage: <T = unknown>(data: T, options?: PostMessageOptions) => void;
};
