import {
  UseWindowMessageEventReceiverProps,
  UseWindowMessageEventReceiverReturns,
} from "./useWindowMessageEventReceiver.type";
import {
  UseWindowMessageEventSenderProps,
  UseWindowMessageEventSenderReturns,
} from "./useWindowMessageEventSender.type";

export type UseWindowMessageEventProps = UseWindowMessageEventSenderProps &
  UseWindowMessageEventReceiverProps;

export type UseWindowMessageEventReturns = UseWindowMessageEventSenderReturns &
  UseWindowMessageEventReceiverReturns;
