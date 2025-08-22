const FOCUSABLE_SELECTORS = [
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  'object:not([tabindex="-1"])',
  'embed:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([tabindex="-1"])',
].join(", ");

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const elements = container.querySelectorAll(FOCUSABLE_SELECTORS) as NodeListOf<HTMLElement>;
  const focusableElements = Array.from(elements).filter((element) => {
    return (
      element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0
    );
  });

  // 웹 표준에 따른 tabindex 정렬:
  // 1. 양수 tabindex (1, 2, 3...) - 작은 값부터
  // 2. tabindex=0 또는 없음 - DOM 순서
  const positiveTabIndex: HTMLElement[] = [];
  const zeroOrNoTabIndex: HTMLElement[] = [];

  focusableElements.forEach((element) => {
    const tabIndex = parseInt(element.getAttribute("tabindex") || "0", 10);
    if (tabIndex > 0) {
      positiveTabIndex.push(element);
    } else {
      zeroOrNoTabIndex.push(element);
    }
  });

  // 양수 tabindex를 값 순으로 정렬
  positiveTabIndex.sort((a, b) => {
    const aIndex = parseInt(a.getAttribute("tabindex") || "0", 10);
    const bIndex = parseInt(b.getAttribute("tabindex") || "0", 10);
    return aIndex - bIndex;
  });

  // 최종 순서: 양수 tabindex -> tabindex=0/없음 (DOM 순서)
  return [...positiveTabIndex, ...zeroOrNoTabIndex];
};
