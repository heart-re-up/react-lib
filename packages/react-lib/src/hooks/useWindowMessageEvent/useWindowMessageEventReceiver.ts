import { useCallback, useEffect, useRef } from "react";
import { TrustedOrigins } from "../../libs/window";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import {
  UseWindowMessageEventReceiverProps,
  UseWindowMessageEventReceiverReturns,
} from "./useWindowMessageEventReceiver.type";
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
 * const receiver = useWindowMessageEventReceiver({
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
export const useWindowMessageEventReceiver = (
  props: UseWindowMessageEventReceiverProps
): UseWindowMessageEventReceiverReturns => {
  const {
    intialTrustedOrigins = [],
    disabled = false,
    onMessage: onMessageProp,
    onMessageFromUntrustedOrigin: onMessageFromUntrustedOriginProp,
  } = props;
  /** 서버 환경 여부 */
  const isServer = typeof window === "undefined";

  /** 신뢰하는 출처 */
  const trustedOriginsRef = useRef<string[]>(
    intialTrustedOrigins.map(normalizeOrigin)
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

  // 렌더 영향없는 콜백 관리
  const onMessageRef = useRefLatest(onMessageProp);
  const onMessageFromUntrustedOriginRef = useRefLatest(
    onMessageFromUntrustedOriginProp
  );

  useEffect((): (() => void) => {
    // 처리기 존재 여부
    const hasHandler =
      !!onMessageRef.current || !!onMessageFromUntrustedOriginRef.current;

    // disabled 또는 서버 환경이거나 처리기가 없으면 이벤트 리스너를 등록하지 않습니다.
    if (disabled || isServer || !hasHandler) {
      return () => {};
    }

    // 리스너
    const listener = (event: MessageEvent): void => {
      // 본인이 발송한 메시지를 무시
      if (event.source === window) {
        // ignore own message
        return;
      }

      // Origin 검사
      if (TrustedOrigins.from(trustedOriginsRef.current).match(event.origin)) {
        onMessageRef.current?.(event);
      } else {
        onMessageFromUntrustedOriginRef.current?.(event);
      }
    };

    // 등록과 정리
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [
    isServer,
    disabled,
    trustedOriginsRef,
    onMessageRef,
    onMessageFromUntrustedOriginRef,
  ]);

  return {
    setTrustedOrigins,
  };
};
