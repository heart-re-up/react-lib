import {
  UseWindowMessageEventProps,
  UseWindowMessageEventReturns,
} from "./useWindowMessageEvent.type";
import { useWindowMessageEventReceiver } from "./useWindowMessageEventReceiver";
import { useWindowMessageEventSender } from "./useWindowMessageEventSender";

/**
 * 윈도우 메시지 훅
 *
 * 윈도우와 통신하기 위한 훅입니다.
 *
 * @param props 훅 옵션
 * @returns 메시지 전송 함수
 */
export const useWindowMessageEvent = (
  props: UseWindowMessageEventProps
): UseWindowMessageEventReturns => {
  return {
    ...useWindowMessageEventSender(props),
    ...useWindowMessageEventReceiver(props),
  };
};
