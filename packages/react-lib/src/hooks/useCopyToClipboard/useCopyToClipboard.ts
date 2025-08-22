import { useState, useMemo } from "react";

export type CopiedValue = string | null;

export type CopyData = string | ClipboardItem[];

export type CopyFn = (data: CopyData) => Promise<boolean>;

/**
 * useCopyToClipboard 훅의 반환 타입
 */
export type UseCopyToClipboardReturnType = {
  /** 범용 복사 함수 (문자열 또는 ClipboardItem 배열) */
  copy: CopyFn;
  /** 텍스트 전용 복사 함수 */
  copyText: (text: string) => Promise<boolean>;
  /** 이미지 전용 복사 함수 */
  copyImage: (blob: Blob) => Promise<boolean>;
  /** 여러 형식 동시 복사 함수 */
  copyMultiple: (items: Record<string, Blob>) => Promise<boolean>;
  /** 마지막으로 복사된 텍스트 */
  copiedText: CopiedValue;
  /** 기본 클립보드 지원 여부 (writeText) */
  isSupported: boolean;
  /** 고급 클립보드 지원 여부 (write) */
  isAdvancedSupported: boolean;
};

// ----------------------------------------------------------------------

/**
 * 클립보드 복사를 위한 Hook
 *
 * 텍스트, 이미지, HTML 등 다양한 형태의 데이터를 클립보드에 복사할 수 있습니다.
 * write() 함수 하나로 모든 복사 기능을 통합 처리합니다.
 *
 * @returns 반환 값 객체
 * @returns copy - 범용 복사 함수 (문자열 또는 ClipboardItem 배열)
 * @returns copyText - 텍스트 전용 복사 함수
 * @returns copyImage - 이미지 전용 복사 함수
 * @returns copyMultiple - 여러 형식 동시 복사 함수
 * @returns copiedText - 마지막으로 복사된 텍스트
 * @returns isSupported - 기본 클립보드 지원 여부 (writeText)
 * @returns isAdvancedSupported - 고급 클립보드 지원 여부 (write)
 *
 * @example
 * const { copyText, copyImage, copyMultiple, isSupported, isAdvancedSupported } = useCopyToClipboard();
 *
 * // 텍스트 복사 (write 사용)
 * await copyText("Hello World");
 *
 * // 이미지 복사
 * if (isAdvancedSupported) {
 *   canvas.toBlob(async (blob) => {
 *     if (blob) await copyImage(blob);
 *   });
 * }
 *
 * // 여러 형식 동시 복사
 * await copyMultiple({
 *   'text/plain': new Blob(['Hello'], { type: 'text/plain' }),
 *   'text/html': new Blob(['<b>Hello</b>'], { type: 'text/html' })
 * });
 */
export const useCopyToClipboard = (): UseCopyToClipboardReturnType => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  // 기본 클립보드 지원 여부 (writeText)
  const isSupported = useMemo(() => {
    return typeof navigator !== "undefined" && !!navigator?.clipboard?.writeText;
  }, []);

  // 고급 클립보드 지원 여부 (write - 텍스트도 포함)
  const isAdvancedSupported = useMemo(() => {
    return typeof navigator !== "undefined" && !!navigator?.clipboard?.write;
  }, []);

  // 범용 복사 함수
  const copy: CopyFn = async (data: CopyData) => {
    if (typeof data === "string") {
      return copyText(data);
    } else {
      return copyClipboardItems(data);
    }
  };

  // 텍스트 전용 복사 - write() 사용으로 통합
  const copyText = async (text: string): Promise<boolean> => {
    // 🚀 write()가 지원되면 write() 사용 (일관성)
    if (isAdvancedSupported) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
        setCopiedText(text);
        return true;
      } catch (error) {
        console.warn("Text copy via write() failed, falling back to writeText", error);
      }
    }

    // 💫 fallback: writeText() 사용
    if (isSupported) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        return true;
      } catch (error) {
        console.warn("Text copy via writeText() failed", error);
        setCopiedText(null);
        return false;
      }
    }

    console.warn("Clipboard text copy not supported");
    return false;
  };

  // 이미지 전용 복사
  const copyImage = async (blob: Blob): Promise<boolean> => {
    if (!isAdvancedSupported) {
      console.warn("Clipboard image copy not supported");
      return false;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      return true;
    } catch (error) {
      console.warn("Image copy failed", error);
      return false;
    }
  };

  // 여러 형식 동시 복사
  const copyMultiple = async (items: Record<string, Blob>): Promise<boolean> => {
    if (!isAdvancedSupported) {
      console.warn("Clipboard multiple format copy not supported");
      return false;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem(items)]);

      // 텍스트가 포함되어 있다면 상태 업데이트
      if (items["text/plain"]) {
        const text = await items["text/plain"].text();
        setCopiedText(text);
      }

      return true;
    } catch (error) {
      console.warn("Multiple format copy failed", error);
      return false;
    }
  };

  // ClipboardItem 배열 복사 (내부 헬퍼)
  const copyClipboardItems = async (items: ClipboardItem[]): Promise<boolean> => {
    if (!isAdvancedSupported) {
      console.warn("Clipboard advanced copy not supported");
      return false;
    }

    try {
      await navigator.clipboard.write(items);
      return true;
    } catch (error) {
      console.warn("Clipboard items copy failed", error);
      return false;
    }
  };

  return {
    copy,
    copyText,
    copyImage,
    copyMultiple,
    copiedText,
    isSupported,
    isAdvancedSupported,
  };
};
