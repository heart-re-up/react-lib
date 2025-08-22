import { useDownload } from "@heart-re-up/react-lib/hooks/useDownload";
import {
  Badge,
  Button,
  Card,
  Flex,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

export default function DemoText() {
  const [textContent, setTextContent] =
    useState(`안녕하세요! 이것은 텍스트 파일입니다.

이 파일은 useDownload 훅을 사용하여 다운로드되었습니다.

특징:
- 한글 텍스트 지원
- 여러 줄 텍스트
- 특수문자: !@#$%^&*()
- 유니코드: 🚀 🎉 ⭐

생성일: ${new Date().toLocaleString("ko-KR")}`);

  const [filename, setFilename] = useState("sample-text.txt");
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  const { download, isSupported } = useDownload();

  const handleDownloadText = async () => {
    const blob = new Blob([textContent], { type: "text/plain; charset=utf-8" });
    const success = await download(blob, { filename });

    setDownloadStatus(success ? "다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  const downloadPredefinedText = async (
    type: "markdown" | "csv" | "json" | "log"
  ) => {
    let content = "";
    let fileName = "";
    let mimeType = "text/plain";

    switch (type) {
      case "markdown":
        content = `# React Hooks Demo

## useDownload 훅

이 파일은 **useDownload** 훅을 사용하여 생성되었습니다.

### 기능
- [x] 텍스트 파일 다운로드
- [x] 이미지 파일 다운로드  
- [x] JSON 파일 다운로드
- [ ] PDF 파일 다운로드

### 코드 예시
\`\`\`javascript
const { download } = useDownload();
await download(blob, { filename: 'example.md' });
\`\`\`

> 생성일: ${new Date().toLocaleString("ko-KR")}
`;
        fileName = "readme.md";
        mimeType = "text/markdown";
        break;

      case "csv":
        content = `이름,나이,직업,도시
김철수,25,개발자,서울
이영희,30,디자이너,부산
박민수,28,기획자,대구
최지영,32,마케터,인천
정하나,27,개발자,광주`;
        fileName = "sample-data.csv";
        mimeType = "text/csv";
        break;

      case "json":
        const jsonData = {
          name: "useDownload Demo",
          version: "1.0.0",
          description: "React Hook for file downloads",
          features: [
            "Text file download",
            "Image file download",
            "JSON file download",
            "Custom filename support",
          ],
          author: {
            name: "React Hooks Library",
            email: "demo@example.com",
          },
          createdAt: new Date().toISOString(),
          data: {
            users: [
              { id: 1, name: "김철수", active: true },
              { id: 2, name: "이영희", active: false },
              { id: 3, name: "박민수", active: true },
            ],
          },
        };
        content = JSON.stringify(jsonData, null, 2);
        fileName = "demo-data.json";
        mimeType = "application/json";
        break;

      case "log":
        content = `[${new Date().toISOString()}] INFO: Application started
[${new Date().toISOString()}] DEBUG: useDownload hook initialized
[${new Date().toISOString()}] INFO: User requested file download
[${new Date().toISOString()}] DEBUG: Creating blob with content length: ${textContent.length}
[${new Date().toISOString()}] INFO: Download initiated successfully
[${new Date().toISOString()}] DEBUG: Browser download support: ${isSupported}
[${new Date().toISOString()}] INFO: File download completed
[${new Date().toISOString()}] DEBUG: Memory cleanup completed`;
        fileName = "application.log";
        mimeType = "text/plain";
        break;
    }

    const blob = new Blob([content], { type: `${mimeType}; charset=utf-8` });
    const success = await download(blob, { filename: fileName });

    setDownloadStatus(success ? `${fileName} 다운로드 성공!` : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            텍스트 파일 다운로드
          </Text>
          <Badge color={isSupported ? "green" : "red"} variant="soft">
            지원: {isSupported ? "✓" : "✗"}
          </Badge>
        </Flex>

        <Text size="2" color="gray">
          {`const { download } = useDownload();`}
        </Text>

        {!isSupported ? (
          <Card variant="surface" style={{ backgroundColor: "var(--red-2)" }}>
            <Text size="2" color="red">
              ⚠️ 현재 환경에서는 파일 다운로드를 지원하지 않습니다.
            </Text>
          </Card>
        ) : (
          <>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  파일명:
                </Text>
                <TextField.Root
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="다운로드할 파일명을 입력하세요..."
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  파일 내용:
                </Text>
                <TextArea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="다운로드할 텍스트를 입력하세요..."
                  rows={8}
                />
              </Flex>

              <Flex gap="2" align="center" wrap="wrap">
                <Button onClick={handleDownloadText}>
                  텍스트 파일 다운로드
                </Button>

                {downloadStatus && (
                  <Badge
                    color={downloadStatus.includes("성공") ? "green" : "red"}
                  >
                    {downloadStatus}
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                미리 정의된 파일 형식:
              </Text>
              <Flex gap="2" wrap="wrap">
                <Button
                  variant="soft"
                  size="2"
                  onClick={() => downloadPredefinedText("markdown")}
                >
                  📝 Markdown (.md)
                </Button>
                <Button
                  variant="soft"
                  size="2"
                  onClick={() => downloadPredefinedText("csv")}
                >
                  📊 CSV 데이터
                </Button>
                <Button
                  variant="soft"
                  size="2"
                  onClick={() => downloadPredefinedText("json")}
                >
                  🔧 JSON 파일
                </Button>
                <Button
                  variant="soft"
                  size="2"
                  onClick={() => downloadPredefinedText("log")}
                >
                  📋 로그 파일
                </Button>
              </Flex>
            </Flex>

            <Card variant="surface">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  💡 사용 팁:
                </Text>
                <Text size="2" color="gray">
                  • 파일명에 확장자를 포함하면 적절한 프로그램으로 열립니다
                </Text>
                <Text size="2" color="gray">
                  • UTF-8 인코딩을 사용하여 한글이 깨지지 않습니다
                </Text>
                <Text size="2" color="gray">
                  • 브라우저의 다운로드 폴더에 파일이 저장됩니다
                </Text>
              </Flex>
            </Card>
          </>
        )}
      </Flex>
    </Card>
  );
}
