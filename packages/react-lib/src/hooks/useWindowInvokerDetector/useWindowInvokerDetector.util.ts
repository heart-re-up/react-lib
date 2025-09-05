import { RuntimeContext } from "../useWindowContext";

export const isUnavailableRuntimeContext = (
  runtimeContext: RuntimeContext
): boolean => {
  return ["worker", "server", "unknown"].includes(runtimeContext);
};

export const getWindow = (runtimeContext: RuntimeContext): Window | null => {
  switch (runtimeContext) {
    case "window":
      return window;
    case "opened":
      return window.opener;
    case "iframe":
      return window.parent;
    default:
      return null;
  }
};

export const getOrigin = (runtimeContext: RuntimeContext): string | null => {
  try {
    switch (runtimeContext) {
      case "window":
        return window.location.origin;
      case "opened":
        return window.opener?.location.origin || null;
      case "iframe":
        return window.parent?.location.origin || null;
      default:
        return null;
    }
  } catch (_error: unknown) {
    // 크로스 오리진으로 인해 접근할 수 없는 경우
    return null;
  }
};
