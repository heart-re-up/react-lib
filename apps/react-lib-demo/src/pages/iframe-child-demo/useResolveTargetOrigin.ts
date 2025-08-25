import { useSearchParams } from "react-router";

export type ExternalService = "svc1" | "svc2" | "svc3";

const EXTERNAL_SERVICE_MAP = {
  svc1: "https://svc1.example.com" as const,
  svc2: "https://svc2.example.com" as const,
  svc3: "https://svc3.example.com" as const,
} as const;

const QUERY_STRING_NAME = "_svcn";

export type UseResolveTargetOriginProps = {
  allowedServices: ExternalService[] | "*";
};

export type UseResolveTargetOriginReturns = {
  targetOrigin: (typeof EXTERNAL_SERVICE_MAP)[ExternalService] | "";
};

export const useResolveTargetOrigin = (
  props: UseResolveTargetOriginProps
): UseResolveTargetOriginReturns => {
  const { allowedServices } = props;
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get(QUERY_STRING_NAME);

  // 유효한 서비스 이름인지 검사
  const isValid = serviceName !== null && serviceName in EXTERNAL_SERVICE_MAP;

  // 허가된 서비스 목록에 포함되어 있는지 검사
  const isAllowed =
    allowedServices.includes(serviceName as ExternalService) ||
    allowedServices === "*";

  // 유효하고 허가되었다면 타겟 오리진으로 설정
  // 아니면 빈 문자열 반환
  const targetOrigin =
    isValid && isAllowed
      ? EXTERNAL_SERVICE_MAP[serviceName as ExternalService]
      : "";

  return { targetOrigin };
};
