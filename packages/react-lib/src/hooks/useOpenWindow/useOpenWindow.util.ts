import { UseOpenWindowProps } from "./useOpenWindow.type";
import { WindowFeatures } from "./WindowFeatures";

/**
 * WindowFeatures 객체를 window.open()의 windowFeatures 문자열로 변환합니다.
 *
 * @param features WindowFeatures 객체
 * @returns window.open()에서 사용할 수 있는 windowFeatures 문자열
 *
 * @example
 * ```typescript
 * const features = {
 *   popup: true,
 *   width: 800,
 *   height: 600,
 *   left: 100,
 *   top: 50,
 *   noopener: true
 * };
 *
 * const featuresString = formatWindowFeatures(features);
 * // "popup=true,width=800,height=600,left=100,top=50,noopener=true"
 *
 * window.open('https://example.com', '_blank', featuresString);
 * ```
 */
export const formatWindowFeatures = (features: WindowFeatures): string => {
  if (!features || Object.keys(features).length === 0) {
    return "";
  }

  const featureStrings: string[] = [];

  // 각 속성을 순회하며 문자열로 변환
  for (const [key, value] of Object.entries(features)) {
    if (value === undefined || value === null) {
      continue;
    }

    // boolean 값 처리
    if (typeof value === "boolean") {
      const booleanish = value ? "yes" : "no";
      featureStrings.push(`${key}=${booleanish}`);
    }
    // 숫자 값 처리
    else if (typeof value === "number") {
      featureStrings.push(`${key}=${value}`);
    }
    // 그외 타입은 문자열로 변환
    else {
      featureStrings.push(`${key}=${String(value)}`);
    }
  }

  return featureStrings.join(",");
};

/**
 * 암시적인 팝업 가능성 경고
 *
 * popup 속성이 명시되지 않았을 때, 특정 속성의 truthy 여부를 검사해서 popup 가능성을 경고
 *
 * @param windowFeatures
 * @returns
 */
export const warnImplicitPopupBehavior = (props: UseOpenWindowProps): void => {
  const { windowFeatures = {} } = props;
  // popup 이 명시적으로 설정되어 있으면 검사하지 않음
  if (windowFeatures.popup !== undefined) {
    return;
  }

  // 다음 기능을 제외한 속성이 truthy 일 때 경고 메시지 출력
  const allowTabFeatures = ["noopener", "noreferrer", "attributionsrc"];

  // windowFeatures에서 allowTabFeatures를 제외한 모든 속성 검사
  const truthyFeatures: string[] = [];

  Object.entries(windowFeatures).forEach(([key, value]) => {
    if (!allowTabFeatures.includes(key) && value) {
      truthyFeatures.push(key);
    }
  });

  if (truthyFeatures.length > 0) {
    console.warn(
      `popup 옵션이 명시되지 않은채로 다음 기능들이 설정되어 새 윈도우가 팝업으로 열립니다: ${truthyFeatures.join(", ")}`
    );
  }
};

export const warnDangerouslyDisableNoopenerForCrossOrigin = (
  props: UseOpenWindowProps
): void => {
  const {
    windowFeatures,
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN,
  } = props;
  if (
    !windowFeatures?.noopener &&
    !NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN
  ) {
    throw new Error(
      [
        "noopener 옵션이 falsy 값인 경우 타겟 윈도우에서 원본 윈도우에 접근할 수 있어 보안 위험이 있습니다.",
        "noopener 가 true 가 아닌 경우에는 NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN 옵션을 'I understand' 로 명시해야 윈도우를 열 수 있습니다.",
        "예) useOpenWindow({NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: 'I understand'})",
      ].join("\n")
    );
  }
};

export const preconditions = (props: UseOpenWindowProps): void => {
  warnImplicitPopupBehavior(props);
  warnDangerouslyDisableNoopenerForCrossOrigin(props);
};
