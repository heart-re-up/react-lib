import { useCallback, useEffect, useRef } from "react";
import { isTrustedOrigin } from "../../libs/window";
import {
  UseWindowEventMessageReceiverProps,
  UseWindowEventMessageReceiverReturns,
} from "./useWindowEventMessageReceiver.type";
import { normalizeOrigin } from "./utils";

/**
 * 윈도우 메시지 수신자
 *
 * 윈도우로부터 메시지를 수신하기 위한 훅입니다.
 *
 *
 * @param props 수신자 옵션
 * @returns 수신자 반환 값
 * @example
 * ```tsx
 * const receiver = useWindowEventMessageReceiver({
 *   trustedOrigins: ['https://www.example.com'],
 *   onMessage: (message) => {
 *     console.log(message);
 *   }
 * });
 *
 * // iframe 등 동적으로 신뢰하는 출처를 변경하고 싶은 경우
 * receiver.setTrustedOrigins(['https://other.example.com']);
 * ```
 */
export const useWindowEventMessageReceiver = (
  props: UseWindowEventMessageReceiverProps
): UseWindowEventMessageReceiverReturns => {
  const {
    trustedOrigins: trustedOriginsProp = [],
    includeOwnMessage = false,
    disabled = false,
    onMessage,
    onMessageFromUntrustedOrigin,
  } = props;
  const isServer = typeof window === "undefined";
  const trustedOriginsRef = useRef<string[]>(
    trustedOriginsProp.map(normalizeOrigin)
  );

  /**
   * 신뢰하는 출처를 설정합니다.
   *
   * iframe 등 동적으로 신뢰하는 출처를 변경하는 경우에 사용합니다.
   */
  const setTrustedOrigins = useCallback(
    (trustedOrigins: string[]) => {
      trustedOriginsRef.current = trustedOrigins.map(normalizeOrigin);
    },
    [trustedOriginsRef]
  );

  useEffect((): (() => void) => {
    // disabled 또는 서버 환경이거나 onMessage가 없으면 이벤트 리스너를 등록하지 않습니다.
    if (disabled || isServer || !onMessage) {
      return () => {};
    }

    const handler = (event: MessageEvent): void => {
      // 본인이 발송한 메시지인지 여부
      const isOwnMessage = event.source === window;
      // 본인이 발송한 메시지를 무시해야하는 경우
      // includeOwnMessage: 본인이 발송한 메시지도 수신
      if (isOwnMessage && !includeOwnMessage) {
        // ignore own message
        return;
      }

      // Origin 검사
      if (isTrustedOrigin(event.origin, trustedOriginsRef.current)) {
        onMessage?.(event, isOwnMessage);
      } else {
        onMessageFromUntrustedOrigin?.(event);
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [
    isServer,
    disabled,
    trustedOriginsRef,
    includeOwnMessage,
    onMessage,
    onMessageFromUntrustedOrigin,
  ]);

  return {
    setTrustedOrigins,
  };
};
