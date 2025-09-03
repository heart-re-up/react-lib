import { useCallback, useEffect, useRef } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import {
  BroadcastChannelNotSupportedError,
  BroadcastChannelPostError,
  BroadcastChannelReceiveError,
} from "./BroadcastChannelError";
import {
  UseBroadcastChannelProps,
  UseBroadcastChannelReturns,
} from "./useBroadcastChannel.type";

/**
 * BroadcastChannel을 React에서 쉽게 사용할 수 있는 훅
 * 같은 origin의 다른 탭/창과 통신할 수 있습니다.
 *
 * @param channelName 채널 이름
 * @param options 옵션
 * @returns BroadcastChannel 관련 함수들과 상태
 *
 * @example
 * ```typescript
 * // 메시지 송신자
 * const { sendMessage } = useBroadcastChannel('user-updates');
 *
 * const handleUserUpdate = (userData) => {
 *   sendMessage('USER_UPDATED', userData);
 * };
 *
 * // 메시지 수신자 (본인이 보낸 메시지는 자동으로 제외됨)
 * const { lastMessage } = useBroadcastChannel('user-updates', {
 *   messageType: 'USER_UPDATED',
 *   onMessage: (userData) => {
 *     console.log('다른 탭에서 사용자 정보 업데이트:', userData);
 *   }
 * });
 * ```
 */
export const useBroadcastChannel = (
  props: UseBroadcastChannelProps
): UseBroadcastChannelReturns => {
  const {
    channelName,
    disabled,
    onMessage: onMessageProp,
    onError: onErrorProp,
  } = props;
  const isSupported = typeof BroadcastChannel !== "undefined";
  const channelRef = useRef<BroadcastChannel>(null);

  // 렌더 영향없는 콜백 관리
  const onMessageRef = useRefLatest(onMessageProp);
  const onErrorRef = useRefLatest(onErrorProp);

  /**
   * 채널 이름 설정O
   */
  const setChannelName = useCallback(
    (channelName: string): void => {
      channelRef.current = new BroadcastChannel(channelName);
    },
    [channelRef]
  );

  /**
   * 메시지 전송 수행 (내부용)
   */
  const performPostMessage = useCallback(
    <T = unknown>(data: T): void => {
      try {
        channelRef.current?.postMessage(data);
      } catch (error) {
        const broadcastError = new BroadcastChannelPostError(
          "Failed to send message",
          channelName,
          error
        );
        onErrorRef.current?.(broadcastError);
      }
    },
    [onErrorRef, channelRef, channelName]
  );

  /**
   * 메시지 전송
   */
  const postMessage = useCallback(
    <T = unknown>(data: T): void => {
      // 채널 사용 가능 여부 확인
      if (!isSupported) {
        onErrorRef.current?.(
          new BroadcastChannelNotSupportedError(
            "BroadcastChannel is not supported in this browser",
            channelName
          )
        );
      }
      // 채널 초기화 여부 확인
      else if (!channelRef.current) {
        onErrorRef.current?.(
          new BroadcastChannelPostError("No channel found", channelName)
        );
      }
      // 메시지 전송
      else {
        performPostMessage(data);
      }
    },
    [onErrorRef, isSupported, channelName, performPostMessage]
  );

  // 채널 초기화
  useEffect(() => {
    // 채널 사용 가능 여부 확인
    if (!isSupported) {
      onErrorRef.current?.(
        new BroadcastChannelNotSupportedError(
          "BroadcastChannel is not supported in this browser",
          channelName
        )
      );
      return;
    }

    if (!channelName) {
      onErrorRef.current?.(
        new BroadcastChannelPostError("No channel name", channelName)
      );
      return;
    }

    if (disabled) {
      return;
    }

    // 채널 초기화
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;
    // 메시지 리스너
    const handleMessage = (event: MessageEvent): void => {
      try {
        onMessageRef.current?.(event);
      } catch (error) {
        onErrorRef.current?.(
          new BroadcastChannelReceiveError(
            "Failed to receive message",
            channelName,
            error
          )
        );
      }
    };

    channel.addEventListener("message", handleMessage);

    // 정리 함수
    return (): void => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [onMessageRef, onErrorRef, isSupported, channelName, disabled]);

  return {
    isSupported,
    setChannelName,
    postMessage,
  };
};
