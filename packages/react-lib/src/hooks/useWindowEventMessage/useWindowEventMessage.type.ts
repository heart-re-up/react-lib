import {
  UseWindowEventMessageReceiverProps,
  UseWindowEventMessageReceiverReturns,
} from "./useWindowEventMessageReceiver.type";
import {
  UseWindowEventMessageSenderProps,
  UseWindowEventMessageSenderReturns,
} from "./useWindowEventMessageSender.type";

export type UseWindowEventMessageProps = UseWindowEventMessageSenderProps &
  UseWindowEventMessageReceiverProps;

export type UseWindowEventMessageReturns = UseWindowEventMessageSenderReturns &
  UseWindowEventMessageReceiverReturns;
