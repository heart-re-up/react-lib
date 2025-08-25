/**
 * 레거시 기능들: 과거에는 열린 윈도우의 UI 기능을 제어했으나,
 * 현대 브라우저에서는 대부분의 기능이 무시되고 브라우저 기본 기능으로 처리됩니다.
 */
type LegacyWindowFeatures = {
  /**
   * 레거시 기능: 주소 표시줄과 툴바 표시 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  location?: boolean;

  /**
   * 레거시 기능: 툴바 표시 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  toolbar?: boolean;

  /**
   * 레거시 기능: 메뉴바 표시 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  menubar?: boolean;

  /**
   * 레거시 기능: 윈도우 크기 조절 가능 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  resizable?: boolean;

  /**
   * 레거시 기능: 스크롤바 표시 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  scrollbars?: boolean;

  /**
   * 레거시 기능: 상태 표시줄 표시 여부.
   * 현대 브라우저에서는 popup=true 로 새 윈도우을 팝업으로 요청할 때만 효과 있음.
   */
  status?: boolean;
};

type SecurityFeatures = {
  /**
   * 이 기능이 설정되면 새 윈도우은 Window.opener를 통해 원본 윈도우에 접근할 수 없으며 null을 반환.
   * noopener가 사용되면 _top, _self, _parent를 제외한 비어있지 않은 target 이름들은
   * 새로운 브라우징 컨텍스트를 열지 여부를 결정할 때 _blank처럼 처리됨.
   */
  noopener?: boolean;

  /**
   * 이 기능이 설정되면 브라우저는 Referer 헤더를 생략하고 noopener도 true로 설정.
   * rel="noreferrer"에 대한 자세한 정보는 MDN 문서 참조.
   */
  noreferrer?: boolean;
};

type PositionFeatures = {
  /**
   * 스크롤바를 포함한 콘텐츠 영역의 너비를 지정. 최소 필수값은 100.
   */
  width?: number;

  /**
   * 스크롤바를 포함한 콘텐츠 영역의 너비를 지정. 최소 필수값은 100.
   * width와 동일한 기능.
   */
  innerWidth?: number;

  /**
   * 스크롤바를 포함한 콘텐츠 영역의 높이를 지정. 최소 필수값은 100.
   */
  height?: number;

  /**
   * 스크롤바를 포함한 콘텐츠 영역의 높이를 지정. 최소 필수값은 100.
   * height와 동일한 기능.
   */
  innerHeight?: number;

  /**
   * 사용자 운영체제에서 정의한 작업 영역의 왼쪽에서 새 윈도우이 생성될 거리를 픽셀 단위로 지정.
   */
  left?: number;

  /**
   * 사용자 운영체제에서 정의한 작업 영역의 왼쪽에서 새 윈도우이 생성될 거리를 픽셀 단위로 지정.
   * left와 동일한 기능.
   */
  screenX?: number;

  /**
   * 사용자 운영체제에서 정의한 작업 영역의 위쪽에서 새 윈도우이 생성될 거리를 픽셀 단위로 지정.
   */
  top?: number;

  /**
   * 사용자 운영체제에서 정의한 작업 영역의 위쪽에서 새 윈도우이 생성될 거리를 픽셀 단위로 지정.
   * top과 동일한 기능.
   */
  screenY?: number;
};

/**
 * MDN 문서 기반 window.open windowFeatures 타입 정의
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures
 */
export type WindowFeatures = LegacyWindowFeatures &
  SecurityFeatures &
  PositionFeatures & {
    /**
     * 실험적 기능: Attribution Reporting API를 위한 헤더 전송을 나타냄.
     * 브라우저가 open() 호출과 함께 Attribution-Reporting-Eligible 헤더를 전송하도록 지시.
     * 사용자 상호작용 이벤트 핸들러(예: click) 내에서 사용자 상호작용 후 5초 이내에 호출되어야 함.
     */
    attributionsrc?: boolean;

    /**
     * 기본적으로 window.open은 새 탭에서 페이지를 열음.
     * popup이 true로 설정되면 최소한의 팝업 윈도우 사용을 요청.
     * 팝업 윈도우에 포함될 UI 기능은 브라우저가 자동으로 결정하며, 일반적으로 주소 표시줄만 포함.
     * popup이 false로 설정되어도 여전히 새 탭이 열림.
     */
    popup?: boolean;
  };

/**
 * 화면 중앙에 윈도우를 엽니다.
 *
 * @param features 윈도우 기능들.
 * @returns 위치가 조정된 윈도우 기능들.
 */
export const toCenter = <T extends PositionFeatures>(features: T): T => {
  const { availWidth, availHeight } = window.screen;
  const { width = 100, height = 100 } = features;
  const left = (availWidth - width) / 2;
  const top = (availHeight - height) / 2;
  return {
    ...features,
    width,
    height,
    left,
    top,
    screenX: left,
    screenY: top,
  };
};

/**
 * 마우스 포인트에 윈도우를 엽니다.
 *
 * @param windowFeatures 윈도우 기능들.
 * @param event 마우스 이벤트.
 * @returns 위치가 조정된 윈도우 기능들.
 */
export const toMouse = <T extends PositionFeatures>(
  features: T,
  event: MouseEvent
): WindowFeatures => {
  const { clientX, clientY } = event;
  return {
    ...features,
    left: clientX,
    top: clientY,
    screenX: clientX,
    screenY: clientY,
  };
};
