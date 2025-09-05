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
 * const { postMessage } = useBroadcastChannel({
 *   initialChannelName: 'user-updates',
 * });
 *
 * const handleUserUpdate = (userData) => {
 *   postMessage(userData);
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
    initialChannelName,
    disabled,
    onMessage: onMessageProp,
    onError: onErrorProp,
  } = props;
  /** 지원 여부 */
  const isSupported = typeof BroadcastChannel !== "undefined";
  /** 채널 이름 */
  const channelNameRef = useRef<string>(initialChannelName);
  /** 채널 객체 */
  const channelRef = useRef<BroadcastChannel>(null);

  // 렌더 영향없는 콜백 관리
  const onMessageRef = useRefLatest(onMessageProp);
  const onErrorRef = useRefLatest(onErrorProp);

  /**
   * 메시지 수신 리스너
   *
   * 훅 생성시 초기화되고 값이 변경되지 않습니다.
   * closeBroadcastChannel 및 initBroadcastChannel 에서 이벤트 리스너 등록과 해제 시 동일한 함수를 참조하기 위해서 사용합니다.
   */
  const listenerRef = useRef((event: MessageEvent) => {
    try {
      onMessageRef.current?.(event);
    } catch (error) {
      onErrorRef.current?.(
        new BroadcastChannelReceiveError(
          "Failed to receive message",
          channelNameRef.current,
          error
        )
      );
    }
  });

  /**
   * 채널 닫기.
   */
  const closeBroadcastChannel = useCallback((): void => {
    if (channelRef.current) {
      channelRef.current?.removeEventListener("message", listenerRef.current);
      channelRef.current?.close();
      channelRef.current = null;
    }
  }, [channelRef]);

  /**
   * 채널 초기화.
   * 기존 채널을 닫고 새로운 채널을 생성합니다.
   * channelNameRef 값을 사용합니다.
   */
  const initBroadcastChannel = useCallback(
    (channelName: string | null): void => {
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

      // 채널 이름 확인
      if (!channelName) {
        onErrorRef.current?.(
          new BroadcastChannelPostError("No channel name", channelName)
        );
        return;
      }

      // 채널 사용 비활성화 여부 확인
      if (disabled) {
        return;
      }

      // 채널 생성
      const channel = new BroadcastChannel(channelName);
      channelRef.current = channel;
      channel.addEventListener("message", listenerRef.current);
    },
    [isSupported, disabled, onErrorRef, listenerRef]
  );

  /**
   * 채널 초기화.
   * 기존 채널을 닫고 새로운 채널을 생성합니다.
   * channelNameRef 값을 사용합니다.
   */
  const resetBroadcastChannel = useCallback(
    (channelName: string | null): void => {
      const currentIsValid = !!channelNameRef.current;
      const newIsValid = !!channelName;

      // 둘 다 무효: 닫거나 생성할 일 없음.
      if (!currentIsValid && !newIsValid) {
        return;
      }

      // 둘 다 유효하고 같음: 이미 원하는 상태.
      if (
        currentIsValid &&
        newIsValid &&
        channelNameRef.current === channelName
      ) {
        return;
      }

      // 나머지 모든 경우: 변경 작업 필요
      // - 하나만 유효: 유효한 대상에 따라 닫기 or 생성
      // - 둘 다 유효하지만 다름: 닫고 생성
      closeBroadcastChannel();
      initBroadcastChannel(channelName);
      channelNameRef.current = channelName; // 채널 이름 업데이트
    },
    [closeBroadcastChannel, initBroadcastChannel]
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
          channelNameRef.current,
          error
        );
        onErrorRef.current?.(broadcastError);
      }
    },
    [onErrorRef, channelRef, channelNameRef]
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
            channelNameRef.current
          )
        );
      }
      // 채널 초기화 여부 확인
      else if (!channelRef.current) {
        onErrorRef.current?.(
          new BroadcastChannelPostError(
            "No channel found.",
            channelNameRef.current
          )
        );
      }
      // 메시지 전송
      else {
        performPostMessage(data);
      }
    },
    [onErrorRef, isSupported, channelNameRef, performPostMessage]
  );

  // 조건 발동 사이드 이펙트
  useEffect(() => {
    resetBroadcastChannel(channelNameRef.current);
    // 컴포넌트 언마운트시 채널 닫기
    return closeBroadcastChannel;
  }, [closeBroadcastChannel, resetBroadcastChannel]);

  return {
    isSupported,
    closeBroadcastChannel,
    resetBroadcastChannel,
    postMessage,
  };
};
