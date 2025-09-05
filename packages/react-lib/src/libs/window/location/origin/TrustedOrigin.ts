import { isExactOrigin } from "./ExactOrigin";
import { isValidOrigin, ValidOrigin } from "./ValidOrigin";

export class TrustedOrigins {
  static from(origins: string[]): TrustedOrigins {
    return new TrustedOrigins(origins);
  }

  private readonly validOrigins: ValidOrigin[] = [];

  constructor(origins: string[]) {
    this.validOrigins = origins.filter(isValidOrigin);
  }

  /**
   * 주어진 origin이 신뢰할 수 있는 대상인지 검사합니다.
   *
   * @param exactOrigin 검사할 대상 origin (정확한 origin만 허용, 와일드카드 불가)
   * @returns 신뢰할 수 있으면 true
   */
  match(exactOrigin: unknown): boolean {
    // "*"는 모든 origin과 매치
    if (this.validOrigins.includes("*")) {
      return true;
    }

    if (!isExactOrigin(exactOrigin)) {
      // eslint-disable-next-line no-console
      console.warn(`[TrustedOrigins] Invalid origin pattern: ${exactOrigin}`);
      return false;
    }

    // 정확한 origin 매칭으로 검사
    return this.validOrigins.some((validOrigin) => validOrigin === exactOrigin);
  }
}
