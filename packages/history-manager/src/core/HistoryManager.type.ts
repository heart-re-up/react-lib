/**
 * 히스토리 관리자 핵심 타입 정의
 */

import { NodeManager } from "../node";
import { HistoryProxy } from "../proxy";
import { HistoryState } from "../types";
import { HistoryNode } from "../types/HistoryNode";
import { HistoryOptions } from "../types/HistoryOptions";

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
export interface HistoryManager {
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

  /** 네비게이션 리스너 추가 */
  addNavigationListener(listener: NavigationListener): void;

  /** 네비게이션 리스너 제거 */
  removeNavigationListener(listener: NavigationListener): void;

  getNodeManager(): NodeManager;

  getHistoryProxy(): HistoryProxy;
}

/**
 * 네비게이션 리스너
 */
export type NavigationListener = (event: NavigationChangeEvent) => void;

/**
 * 네비게이션 변경 이벤트
 */
export interface NavigationChangeEvent {
  type: "push" | "replace" | "pop";
  delta: number;
  previous: HistoryNode;
  current?: HistoryNode;
  traversal?: HistoryNode[]; // 경로상의 모든 노드
}
