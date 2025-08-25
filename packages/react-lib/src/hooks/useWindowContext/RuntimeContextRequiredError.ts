import { RuntimeContext } from "./RuntimeContext";

/**
 * 런타임(윈도우) 컨텍스트 요구사항 위반 에러
 */
export class RuntimeContextRequiredError extends Error {
  constructor(
    message: string,
    /**
     * 현재 런타임 컨텍스트
     */
    public readonly currentContext: RuntimeContext,
    /**
     * 필요한 런타임 컨텍스트 목록
     */
    public readonly requiredContexts: RuntimeContext[]
  ) {
    super(message);
    this.name = "RuntimeContextRequiredError";
    Object.setPrototypeOf(this, RuntimeContextRequiredError.prototype);
  }
}
