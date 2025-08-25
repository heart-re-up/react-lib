import { UseWindowCloseDetectorReturns } from "../useWindowCloseDetector";
import { WindowFeatures } from "./WindowFeatures";

export type UseOpenWindowProps = {
  /**
   * 새 윈도우에 열 페이지의 URL.
   *
   * 열린 창의 URL 이 변경되면 보안 기능을 실행할 수 있습니다. 예) 창 닫기
   */
  url: string;

  /**
   * 새 윈도우을 열 대상 윈도우.
   * @default "_blank"
   */
  target?: "_blank" | "_self" | "_parent" | "_top" | string;

  /**
   * 새 윈도우을 열 때 사용할 윈도우 기능들.
   * @default {}
   */
  windowFeatures?: WindowFeatures;

  /**
   * 보안 경고: Reverse Tabnabbing 공격에 취약해집니다!
   * 악성 사이트가 부모 윈도우을 피싱 사이트로 리다이렉트할 수 있습니다.
   *
   * @see https://owasp.org/www-community/attacks/Reverse_Tabnabbing
   */
  NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN?: "I understand";

  /**
   * 윈도우 열기 중 오류가 발생했을 때 호출되는 콜백 함수.
   */
  onError?: (error: Error) => void;

  /**
   * 윈도우가 닫혔을 때 호출되는 콜백 함수.
   * 현재윈도우에서 타겟 윈도우를 직접 닫을때는 호출되지 않습니다.
   */
  onClose?: () => void;
};

export type UseOpenWindowReturns = {
  /**
   * 새 윈도우을 엽니다.
   */
  open: (windowFeatures?: WindowFeatures) => WindowProxy | null;

  /** 열린 윈도우을 닫습니다. */
  close: UseWindowCloseDetectorReturns["close"];
};
