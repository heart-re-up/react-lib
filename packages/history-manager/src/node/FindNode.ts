import { HistoryNode } from "../types";

/**
 * 노드 찾기 조건
 */
export type PredicateHistoryNode = (
  value: HistoryNode,
  index: number,
  obj: readonly HistoryNode[]
) => boolean;

/**
 * 노드 찾기
 */
export const findNode = (
  nodes: HistoryNode[],
  finder: PredicateHistoryNode
): Readonly<HistoryNode> | undefined => {
  return nodes.find(finder);
};

/**
 * 노드 찾기
 */
export const findNodeById = (
  nodes: HistoryNode[],
  id: string
): HistoryNode | undefined => {
  return findNode(nodes, (node) => node.id === id);
};

/**
 * 노드 찾기
 */
export const findNodeByMetadata = (
  nodes: HistoryNode[],
  predicate: (metadata: Record<string, unknown> | undefined) => boolean
): HistoryNode | undefined => {
  return findNode(nodes, (node) => predicate(node.metadata));
};
