import { createContext, use } from "react";
import { UseProgressCounterAsyncReturns } from "../../hooks/useProgressCounterAsync";

/**
 * 비동기 작업 진행 상태를 관리하는 컨텍스트 타입
 */
export type ProgressCounterAsyncContextType = UseProgressCounterAsyncReturns;

/**
 * 비동기 작업 진행 상태를 관리하는 컨텍스트
 */
export const ProgressCounterAsyncContext =
  createContext<ProgressCounterAsyncContextType | null>(null);

/**
 * 비동기 작업 진행 상태를 관리하는 컨텍스트를 사용하는 훅
 */
export const useProgressCounterAsyncContext = () =>
  use(ProgressCounterAsyncContext);
