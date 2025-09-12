import { NavigationDirection } from "@heart-re-up/history-manager/core";
import {
  HistoryNode,
  HistoryOptions,
  HistoryState,
} from "@heart-re-up/history-manager/types";
import { HistoryNodeChangeEvent } from "@heart-re-up/history-manager/types/HistoryNodeChangeEvent";
import { use, useCallback, useLayoutEffect } from "react";
import { HistoryManagerContext } from "./HistoryManagerContext";

/**
 * 중복 푸시 정책
 * - 'never': 중복 푸시 금지 (이미 히스토리에 있으면 푸시 불가. replace 되어 관리중인 경우도 이미 있는 것으로 취급 )
 * - 'always': 중복 푸시 허용 (항상 푸시 가능)
 * - 'no-forward': forward 방향의 히스토리에 있으면 중복 푸시 금지
 * - 'not-current': 현재 노드가 아닐 때만 중복 푸시 허용 (기본값)
 */
export type DuplicatePushPolicy =
  | "never"
  | "always"
  | "no-forward"
  | "not-current";

/**
 * useHistoryManager 훅 옵션
 */
export type UseHistoryOptions = {
  /** 훅 식별용 키 */
  key: string;

  /** Affinity 그룹 ID */
  affinity?: string;

  /**
   * 중복 푸시 정책
   * - 'never': 중복 푸시 금지 (이미 히스토리에 있으면 푸시 불가)
   * - 'always': 중복 푸시 허용 (항상 푸시 가능)
   * - 'not-current': 현재 노드가 아닐 때만 중복 푸시 허용 (기본값)
   */
  duplicatePushPolicy?: DuplicatePushPolicy;
  /**
   * 진입 콜백
   * @param direction 네비게이션 방향
   */
  onEnter?: (direction: NavigationDirection) => void;

  /**
   * 탈출 콜백
   * @param direction 네비게이션 방향
   */
  onExit?: (direction: NavigationDirection) => void;

  /**
   * 히스토리 노드 변경 콜백
   * @param previous 이전 히스토리 노드
   * @param current 현재 히스토리 노드
   */
  onNodeChanged?: (previous: HistoryNode, current: HistoryNode) => void;
};

/**
 * useHistoryManager 반환 타입
 */
export type UseHistoryReturns<T> = {
  /** 히스토리 추가 */
  push: (
    data: T,
    url?: string,
    options?: HistoryOptions
  ) => Readonly<HistoryState<T>> | null;
  /** 히스토리 교체 */
  replace: (
    data: T,
    url?: string,
    options?: HistoryOptions
  ) => Readonly<HistoryState<T>> | null;
  /** 현재 히스토리 봉인 */
  seal: () => void;
  /** 현재 히스토리 봉인 해제 */
  unseal: () => void;
};

/**
 * 히스토리 관리 React Hook
 */
export function useHistory<T = unknown>(
  options: UseHistoryOptions
): UseHistoryReturns<T> {
  const {
    key,
    affinity,
    duplicatePushPolicy = "no-forward",
    onEnter,
    onExit,
    onNodeChanged,
  } = options;
  const manager = use(HistoryManagerContext);

  if (manager === null) {
    throw new Error(
      "useHistory must be used within a HistoryManagerContextProvider"
    );
  }

  // key로 현재 노드를 찾는 헬퍼 함수
  const findNodeByKey = useCallback(
    (key: string) => {
      return manager
        .getNodeManager()
        .find((node) => node.metadata?.key === key);
    },
    [manager]
  );

  const canPush = useCallback(() => {
    switch (duplicatePushPolicy) {
      // 항상 중복 푸시 허용
      case "always":
        return true;
      // 이미 backward 방향의 히스토리에 있으면 중복 푸시 금지
      case "no-forward": {
        const existInForwardHistory = manager
          .getNodeManager()
          // 현재 노드를 포함하려면 end(exclusive)이기에 +1 해야함
          .nodes.slice(0, manager.getNodeManager().position + 1)
          .some((node) => node.metadata?.key === key);
        // 전방 히스토리에 있으면 푸시 불가 출력
        if (existInForwardHistory) {
          console.warn(
            "useHistory:",
            `Could not push duplicated history when duplicatePushPolicy is '${duplicatePushPolicy}'.`,
            `Key '${key}' already exists in forward history.`
          );
        }
        // 전방 히스토리에 없으면 푸시 가능
        return !existInForwardHistory;
      }
      // 이미 backward 방향의 히스토리에 있으면 중복 푸시 금지
      case "never":
        return !manager
          .getNodeManager()
          .nodes.some((node) => node.metadata?.key === key);
      // 현재 노드가 아니면 중복 푸시 허용
      case "not-current":
        return manager.getNodeManager().currentNode?.metadata?.key !== key;
    }
  }, [key, duplicatePushPolicy, manager]);

  // push 메서드
  const push = useCallback(
    (data: T, url?: string, options?: HistoryOptions) => {
      if (!canPush()) {
        return null;
      }
      return manager.push(data, url, {
        ...options,
        affinity,
        metadata: {
          ...options?.metadata,
          key,
        },
      });
    },
    [manager, affinity, key, canPush]
  );

  // replace 메서드
  const replace = useCallback(
    (data: T, url?: string, options?: HistoryOptions) => {
      return manager.replace(data, url, {
        ...options,
        affinity,
        metadata: {
          ...options?.metadata,
          key,
        },
      });
    },
    [manager, affinity, key]
  );

  // seal 메서드
  const seal = useCallback(() => {
    const node = findNodeByKey(key);
    if (node) {
      manager.getNodeManager().seal(node.id);
    }
  }, [manager, key, findNodeByKey]);

  // unseal 메서드
  const unseal = useCallback(() => {
    const node = findNodeByKey(key);
    if (node) {
      manager.getNodeManager().unseal(node.id);
    }
  }, [manager, key, findNodeByKey]);

  // 네비게이션 이벤트 리스너
  useLayoutEffect(() => {
    const nodeChangeListener = (event: HistoryNodeChangeEvent): void => {
      const { delta, traversal } = event;
      const direction = delta > 0 ? "forward" : "backward";
      const prevNode = traversal[0];
      const currNode = traversal[traversal.length - 1];

      // metadata.key로 자신의 노드 식별
      const isEnter = currNode?.metadata?.key === key;
      const isExit = prevNode.metadata?.key === key;

      // traversal 중간 노드에서 자신을 찾기 (current와 previous 제외)
      const isTraversedThrough = traversal
        ?.slice(1, -1) // 첫 번째(previous)와 마지막(current) 제외
        .some((node) => node.metadata?.key === key);

      if (isEnter) {
        onEnter?.(direction);
      } else if (isExit || isTraversedThrough) {
        // 직접 탈출하거나, 중간 경로에서 건너뛰어진 경우 모두 exit 처리
        onExit?.(direction);
      }

      onNodeChanged?.(prevNode, currNode);
    };

    manager.addHistoryNodeChangeEventListener(nodeChangeListener);
    return () => {
      manager.removeHistoryNodeChangeEventListener(nodeChangeListener);
    };
  }, [manager, key, onEnter, onExit, onNodeChanged]);

  return {
    push,
    replace,
    seal,
    unseal,
  };
}
