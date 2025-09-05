import { useCallback } from "react";
import { useWindowCloseDetector } from "../useWindowCloseDetector";
import { UseOpenWindowProps, UseOpenWindowReturns } from "./useOpenWindow.type";
import { formatWindowFeatures, preconditions } from "./useOpenWindow.util";
import { WindowFeatures } from "./WindowFeatures";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";

export const useOpenWindow = (
  props: UseOpenWindowProps
): UseOpenWindowReturns => {
  const {
    url,
    target,
    windowFeatures: windowFeaturesProp = {},
    onClose,
    onError,
  } = props;

  // 유효하지 않은 옵션에 따른 경고 메시지 출력
  preconditions(props);

  // 윈도우 닫기를 추적합니다.
  const { setWindow, close } = useWindowCloseDetector(onClose);

  const onErrorRef = useRefLatest(onError);

  const open = useCallback(
    (windowFeatures: WindowFeatures = {}) => {
      const resolvedFeatures = { ...windowFeaturesProp, ...windowFeatures };
      const featuresString = formatWindowFeatures(resolvedFeatures);
      const w = window.open(url, target, featuresString);
      if (w) {
        setWindow(w);
      }
      // noopener 옵션이 활성이 아닐 때, 윈도우 객체가 없다면 팝업이 차단당한 경우입니다.
      else if (!resolvedFeatures.noopener) {
        onErrorRef.current?.(new Error("새 윈도우를 열 수 없습니다."));
      }
      return w;
    },
    [url, target, windowFeaturesProp, onErrorRef, setWindow]
  );

  return { open, close };
};
