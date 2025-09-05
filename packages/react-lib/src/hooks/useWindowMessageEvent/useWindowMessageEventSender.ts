import { PostMessageOptions } from "@/libs/window/message";
import { useCallback, useRef } from "react";
import { resolveTargetWindow, WindowLike } from "../../libs/window";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import {
  UseWindowMessageEventSenderProps,
  UseWindowMessageEventSenderReturns,
} from "./useWindowMessageEventSender.type";
import { normalizeOrigin } from "./utils";

/**
 * 윈도우 메시지 발송자
 *
 * 다른 윈도우로 메시지를 전송하기 위한 훅입니다.
 *
 * @param props 발송자 옵션
 * @returns 발송자 반환 값
 * @example
 * ```tsx
 * const {postMessage} = useWindowMessageEventSender({
 *   targetWindow: window.parent,
 *   targetOrigin: 'https://www.example.com',
 * });
 *
 * postMessage({
 *   // 전송할 데이터
 * });
 * ```
 */
export const useWindowMessageEventSender = (
  props: UseWindowMessageEventSenderProps
): UseWindowMessageEventSenderReturns => {
  const isServer = typeof window === "undefined";
  const {
    targetWindow: targetWindowProp,
    targetOrigin: targetOriginProp,
    disabled = false,
    onError: onErrorProp,
  } = props;

  // 대상 윈도우
  // 서버에서는 기본 윈도우를 획득할 수 없다.
  // targetWindow 을 시도하고, 없는 경우 서버가 아닐 때 현재 창을 사용한다.
  const targetWindowRef = useRef<Window | null>(
    isServer ? null : resolveTargetWindow(targetWindowProp ?? window)
  );

  // 대상 오리진
  // 서버에서는 기본 origin 을 획득할 수 없다.
  // targetOrigin 을 시도하고, 없는 경우 서버가 아닐 때 현재 창의 origin 을 사용한다.
  const targetOriginRef = useRef<string>(
    normalizeOrigin(
      targetOriginProp ?? (isServer ? "" : window.location.origin)
    )
  );

  // 렌더 영향없는 콜백 관리
  const onErrorRef = useRefLatest(onErrorProp);

  /**
   * 대상 윈도우를 설정합니다.
   *
   * iframe 등 DOM Loaded 이후에 윈도우를 획득하는 경우에 사용합니다.
   */
  const setTargetWindow = useCallback(
    (target: WindowLike) => {
      targetWindowRef.current = resolveTargetWindow(target);
    },
    [targetWindowRef]
  );

  /**
   * 대상 오리진을 설정합니다.
   *
   * iframe 등 동적으로 대상 오리진을 변경하는 경우에 사용합니다.
   */
  const setTargetOrigin = useCallback(
    (target: string) => {
      targetOriginRef.current = normalizeOrigin(target);
    },
    [targetOriginRef]
  );

  /**
   * 메시지 전송 수행 (내부용)
   */
  const performPostMessage = useCallback(
    <T = unknown>(data: T, options?: PostMessageOptions) => {
      const { targetOrigin, transfer } = options ?? {};
      try {
        // 옵션이 제공되면 옵션을 사용하도록 함. 제공되지 않으면 기본값을 사용.
        targetWindowRef.current?.postMessage(
          data,
          targetOrigin ?? targetOriginRef.current,
          transfer
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          onErrorRef.current?.(error);
        } else {
          onErrorRef.current?.(
            new Error(`Failed to send message: ${String(error)}`)
          );
        }
      }
    },
    [onErrorRef]
  );

  /**
   * 데이터 메시지 전송 함수
   * @param payload 전송 메시지에 포함할 데이터
   * @param options 메시지 전송 옵션
   */
  const postMessage = useCallback(
    <T = unknown>(data: T, options?: PostMessageOptions) => {
      // 서버 환경이면 에러 발생
      if (isServer) {
        onErrorRef.current?.(new Error("Cannot send message in server"));
      }
      // 메시지 전송 비활성화 여부 확인
      else if (disabled) {
        onErrorRef.current?.(new Error("Message sending is disabled"));
      }
      // 메시지 전송
      else {
        performPostMessage(data, options);
      }
    },
    [onErrorRef, isServer, disabled, performPostMessage]
  );

  return {
    setTargetWindow,
    setTargetOrigin,
    postMessage,
  };
};
