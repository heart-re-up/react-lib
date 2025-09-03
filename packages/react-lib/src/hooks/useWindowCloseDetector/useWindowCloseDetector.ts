import { useCallback, useMemo, useRef } from "react";
import { findTargetWindow, WindowLike } from "../../libs/window";
import { useInterval } from "../useInterval";
import { useVisibilityChange } from "../useVisibility";

export type UseWindowCloseDetectorCallback = (closedWindow: Window) => void;

export type UseWindowCloseDetectorReturns = {
  /**
   * 윈도우 타겟을 설정합니다.
   *
   * @param window 윈도우 타겟.
   */
  setWindow: (target: WindowLike) => void;

  /**
   * 윈도우 타겟을 닫습니다.
   */
  close: () => boolean;
};

/**
 * 윈도우 관리자
 *
 * @param windowTarget 윈도우 타겟.
 * @param options 윈도우 관리자 옵션.
 * @returns 윈도우 관리자 반환 값.
 */
export const useWindowCloseDetector = (
  callback?: UseWindowCloseDetectorCallback
): UseWindowCloseDetectorReturns => {
  const windowRef = useRef<Window | null>(null);
  const visibleRef = useRef<boolean>(false);

  const close = useCallback(() => {
    if (windowRef.current === null) {
      return false;
    }
    if (windowRef.current.closed) {
      windowRef.current = null;
      return false;
    } else {
      windowRef.current.close();
      windowRef.current = null;
      return true;
    }
  }, [windowRef]);

  // 타겟 윈도우가 사용자 인터렉션을 받지 못한채로 닫히면 onbeforeunload 이벤트를 수신하지 못합니다.
  // 즉 타겟 윈도우가 스스로 닫힘을 감지하지 못해서 닫힘 이벤트를 부모 창으로 전송하지 못합니다.
  const { start: startTrack, cancel: stopTrack } = useInterval({
    action: () => checkWindowClosed(),
    delay: 200,
  });

  const checkWindowClosed = useCallback(() => {
    if (windowRef.current?.closed) {
      callback?.(windowRef.current);
      windowRef.current = null;
      stopTrack();
    }
  }, [windowRef, callback, stopTrack]);

  const tryToTrack = useCallback(() => {
    // 브라우저에서 현재 탭이 노출된 상태이며, 닫기를 추적할 윈도우가 있다면 추적 시작
    if (visibleRef.current && windowRef.current) {
      startTrack();
    }
  }, [startTrack, visibleRef, windowRef]);

  const setWindow = useCallback(
    (target: WindowLike) => {
      windowRef.current = findTargetWindow(target);
      tryToTrack();
    },
    [tryToTrack]
  );

  /**
   * 탭 전환시 타겟 윈도우 상태를 검사합니다.
   * 탭이 보이지 않을 때는 창 닫힘 추적을 중지합니다. (자원 절약)
   * 탭이 보이면 다시 추적을 시작합니다.
   */
  useVisibilityChange((visible) => {
    visibleRef.current = visible;
    checkWindowClosed();

    if (visible) {
      tryToTrack();
    } else {
      stopTrack();
    }
  });

  return useMemo(() => ({ setWindow, close }), [setWindow, close]);
};
