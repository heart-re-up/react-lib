import {
  UseWindowEventMessageProps,
  UseWindowEventMessageReturns,
} from "./useWindowEventMessage.type";
import { useWindowEventMessageReceiver } from "./useWindowEventMessageReceiver";
import { useWindowEventMessageSender } from "./useWindowEventMessageSender";

/**
 * 윈도우 메시지 훅
 *
 * 윈도우와 통신하기 위한 훅입니다.
 *
 * @param props 훅 옵션
 * @returns 메시지 전송 함수
 */
export const useWindowEventMessage = (
  props: UseWindowEventMessageProps
): UseWindowEventMessageReturns => {
  const sender = useWindowEventMessageSender(props);
  const receiver = useWindowEventMessageReceiver(props);
  return {
    ...sender,
    ...receiver,
  };
};
