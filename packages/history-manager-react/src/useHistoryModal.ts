import { HistoryOptions } from "@heart-re-up/history-manager/types";
import { use, useCallback, useLayoutEffect, useState } from "react";
import { HistoryManagerContext } from "./HistoryManagerContext";
import { useHistory, UseHistoryOptions, UseHistoryReturns } from "./useHistory";

/**
 * useHistoryModal 훅 옵션
 * useHistory의 모든 옵션을 포함하고 추가 모달 관련 옵션을 제공
 */
export type UseHistoryModalOptions = UseHistoryOptions & {
  /**
   * forward exit 시 모달을 열린 상태로 유지할지 여부
   * - true: forward로 나가도 모달이 열린 상태 유지 (스택형 모달)
   * - false: forward로 나가면 모달 닫힘 (기본값)
   */
  keepOpenOnForwardExit?: boolean;
};

/**
 * useHistoryModal 반환 타입
 * useHistory의 모든 반환값에 opened 상태 추가
 */
export type UseHistoryModalReturns<T> = UseHistoryReturns<T> & {
  /** 모달 열림/닫힘 상태 */
  opened: boolean;
  setOpened: (opened: boolean) => void;
  open: UseHistoryReturns<T>["push"];
  close: () => void;
};

/**
 * 히스토리 기반 모달 관리 React Hook
 *
 * 기본 동작:
 * - Enter (forward/backward): 항상 모달 열기
 * - Exit backward: 항상 모달 닫기 (뒤로가기)
 * - Exit forward: keepOpenOnForwardExit 옵션에 따라 결정
 */
export function useHistoryModal<T = unknown>(
  options: UseHistoryModalOptions
): UseHistoryModalReturns<T> {
  const { keepOpenOnForwardExit = false, ...historyOptions } = options;
  const { key } = historyOptions;
  const [opened, setOpened] = useState(false);
  const manager = use(HistoryManagerContext);

  if (manager === null) {
    throw new Error(
      "useHistoryModal must be used within a HistoryManagerContextProvider"
    );
  }

  // useHistory 훅 사용 (onEnter/onExit 콜백 오버라이드)
  const historyHook = useHistory<T>({
    ...historyOptions,
    onEnter: (direction) => {
      console.debug("useHistoryModal onEnter:", key, direction);
      setOpened(true);
      // 원래 onEnter 콜백이 있다면 호출
      historyOptions.onEnter?.(direction);
    },
    onExit: (direction) => {
      console.debug("useHistoryModal onExit:", key, direction);
      if (direction === "backward") {
        // backward exit은 항상 모달 닫기
        setOpened(false);
      } else if (!keepOpenOnForwardExit) {
        // forward exit은 옵션에 따라 결정
        setOpened(false);
      }

      // 원래 onExit 콜백이 있다면 호출
      historyOptions.onExit?.(direction);
    },
  });

  const open = useCallback(
    (data: T, url?: string, options?: HistoryOptions) => {
      return historyHook.push(data, url, options);
    },
    [historyHook]
  );

  const close = useCallback(() => {
    manager.back();
  }, [manager]);

  // 초기 상태 계산 함수
  // 봉인(sealed)된 히스토리가 대상일 수 있지만, 새로고침 전에 이미 봉인처리만 하고 네비게이션 하지 않았던 것이다.
  // 따라서 해당 봉인에 대한 반응 처리는 사용자의 다음 네비게이션에 따라서 NodeManager 가 자동으로 처리하게 한다.
  const shouldBeOpened = useCallback((): boolean => {
    const nm = manager.getNodeManager();
    const nodes = nm.nodes;
    const position = nm.position;
    const currentNode = nm.currentNode;
    console.debug(
      "useHistoryModal shouldBeOpened",
      key,
      nodes,
      position,
      currentNode
    );
    const isMeCurrentNode = currentNode.metadata?.key === key;
    const isMeInForwardHistory = nodes
      // 현재 노드를 제외한 전방 히스토리에 있으면 중복 푸시 금지
      .slice(0, position)
      .some((node) => node.metadata?.key === key);

    if (keepOpenOnForwardExit) {
      return isMeCurrentNode || isMeInForwardHistory;
    } else {
      return isMeCurrentNode;
    }
  }, [manager, key, keepOpenOnForwardExit]);

  // 초기 상태 설정
  useLayoutEffect(() => {
    setOpened(shouldBeOpened());
  }, [shouldBeOpened, key]);

  return {
    ...historyHook,
    opened,
    setOpened,
    open,
    close,
  };
}
