import { useCallback, useState } from "react";

/**
 * 불린 상태를 토글하는 훅
 *
 * @param initialValue 초기 상태
 * @returns [상태, 토글 함수, 상태 설정 함수]
 *
 * @example
 * const [open, toggle, setOpen] = useToggle(false);
 *
 * return (
 *   <div>
 *     <button onClick={toggle}>
 *       {open ? 'Close' : 'Open'}
 *     </button>
 *   </div>
 * );
 *
 * // 강제로 상태 설정
 * setOpen(true);
 *
 * // 모달 열기/닫기
 * const [isModalOpen, toggleModal, setModalOpen] = useToggle(false);
 *
 * return (
 *   <div>
 *     <button onClick={toggleModal}>
 *       {isModalOpen ? 'Close' : 'Open'} Modal
 *     </button>
 *     <button onClick={() => setModalOpen(false)}>
 *       Force Close
 *     </button>
 *     {isModalOpen && <Modal />}
 *   </div>
 * );
 */
export const useToggle = (initialValue: boolean = false): UseToggleReturns => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, [setValue]);

  return [value, toggle, setValue];
};

export type UseToggleReturns = [boolean, () => void, (value: boolean) => void];
