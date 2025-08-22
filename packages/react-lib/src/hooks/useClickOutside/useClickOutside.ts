import { useEffect, useRef } from "react";

/**
 * 지정된 요소 외부를 클릭했을 때 콜백을 실행하는 훅
 *
 * @param callback 외부 클릭 시 실행할 콜백 함수
 * @param enabled 훅이 활성화되어 있는지 여부 (기본값: true)
 * @returns 감지할 요소에 연결할 ref
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * const ref = useClickOutside(() => setIsOpen(false));
 *
 * return (
 *   <div>
 *     <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *     {isOpen && (
 *       <div ref={ref} className="modal">
 *         <p>Modal Content</p>
 *       </div>
 *     )}
 *   </div>
 * );
 *
 * @example
 * // 조건부로 활성화/비활성화
 * const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 * const dropdownRef = useClickOutside(
 *   () => setIsDropdownOpen(false),
 *   isDropdownOpen
 * );
 *
 * return (
 *   <div>
 *     <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
 *       Toggle Dropdown
 *     </button>
 *     {isDropdownOpen && (
 *       <ul ref={dropdownRef} className="dropdown">
 *         <li>Option 1</li>
 *         <li>Option 2</li>
 *       </ul>
 *     )}
 *   </div>
 * );
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): React.RefObject<T> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      // ref가 없거나 클릭된 요소가 ref 내부에 있으면 무시
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      callback(event);
    };

    // mousedown과 touchstart 이벤트를 사용하여 더 빠른 반응성 제공
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [callback, enabled]);

  return ref as React.RefObject<T>;
};

export type UseClickOutsideCallback = (event: MouseEvent | TouchEvent) => void;