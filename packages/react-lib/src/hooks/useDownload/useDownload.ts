import { useCallback } from "react";

/** 브라우저에서 다운로드 될 데이터 타입 */
export type DownloadData = Blob | string;

/** 다운로드 옵션 타입 */
export type DownloadOptions = {
  /** 다운로드할 파일명 */
  filename?: string;
};

/** 다운로드 함수 타입 */
export type DownloadFunction = (data: DownloadData, options?: DownloadOptions) => Promise<boolean>;

/**
 * useDownload 훅의 반환 타입
 */
export type UseDownloadReturnType = {
  /** 파일을 다운로드하는 비동기 함수 */
  download: DownloadFunction;
  /** 브라우저가 다운로드를 지원하는지 여부 */
  isSupported: boolean;
};

// ----------------------------------------------------------------------

/**
 * 파일 다운로드를 위한 Hook
 *
 * Blob이나 Data URL을 파일로 다운로드할 수 있습니다.
 * 간단하고 직관적인 다운로드 기능을 제공합니다.
 *
 * @returns {Object} 반환 값 객체
 * @returns {DownloadFunction} download - 파일을 다운로드하는 비동기 함수
 * @returns {boolean} isSupported - 브라우저가 다운로드를 지원하는지 여부
 *
 * @example
 * const { download, isSupported } = useDownload();
 *
 * // Blob 다운로드
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * await download(blob, { filename: 'hello.txt' });
 *
 * // Data URL 다운로드
 * const dataUrl = canvas.toDataURL('image/png');
 * await download(dataUrl, { filename: 'image.png' });
 */
export const useDownload = (): UseDownloadReturnType => {
  /**
   * 브라우저가 다운로드를 지원하는지 확인
   */
  const isSupported = typeof document !== "undefined" && "createElement" in document;

  /**
   * 메인 다운로드 함수
   */
  const download: DownloadFunction = useCallback(
    async (data: DownloadData, options: DownloadOptions = {}) => {
      if (!isSupported) {
        console.warn("Download not supported in this environment");
        return false;
      }

      try {
        let url: string;
        let shouldRevokeUrl = false;
        const { filename = `download-${Date.now()}` } = options;

        if (data instanceof Blob) {
          // Blob 처리
          url = URL.createObjectURL(data);
          shouldRevokeUrl = true;
        } else if (typeof data === "string") {
          // Data URL 또는 일반 URL 처리
          url = data;
          shouldRevokeUrl = false;
        } else {
          console.error("Unsupported data type for download");
          return false;
        }

        // 앵커 요소로 다운로드 실행
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // URL 정리 (Blob URL인 경우만)
        if (shouldRevokeUrl) {
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }

        return true;
      } catch (error) {
        console.error("Download failed:", error);
        return false;
      }
    },
    [isSupported]
  );

  return {
    download,
    isSupported,
  };
};
