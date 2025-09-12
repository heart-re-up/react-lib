/**
 * 히스토리 관리자 핵심 타입 정의
 */

import { NodeManager } from "../node";
import { HistoryState } from "../types";
import { HistoryNodeChangeEventHandler } from "../types/HistoryNodeChangeEvent";
import { HistoryOptions } from "../types/HistoryOptions";
import { OnBeforePushEventHandler } from "../types/OnBeforePushEventListener";

/**
 * 네비게이션 방향
 */
export type NavigationDirection = "forward" | "backward";

/**
 * 네비게이션 이벤트 타입
 */
export type NavigationType = "enter" | "exit";

/**
 * 노드 관리 키 - 충돌을 피하기 위한 안전한 키
 */
export const NODE_KEY = "__n__" as const;

/**
 * 히스토리 관리자 인터페이스
 */
export interface HistoryManager
  extends OnBeforePushEventHandler,
    HistoryNodeChangeEventHandler {
  /** 히스토리 추가 */
  push<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /** 히스토리 교체 */
  replace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /** 뒤로 가기 */
  back(): void;

  /** 앞으로 가기 */
  forward(): void;

  /** 특정 위치로 이동 */
  go(delta: number): void;

  getNodeManager(): NodeManager;
}
