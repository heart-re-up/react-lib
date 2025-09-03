/**
 * 신뢰할 수 있는 origin인지 확인
 */
export const isTrustedOrigin = (
  origin: string,
  trustedOrigins: string[]
): boolean => {
  return trustedOrigins.includes(origin) || trustedOrigins.includes("*");
};
