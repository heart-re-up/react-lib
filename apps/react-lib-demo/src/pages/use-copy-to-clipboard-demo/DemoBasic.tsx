import { useCopyToClipboard } from "@heart-re-up/react-lib/hooks/useCopyToClipboard";
import { Badge, Button, Card, Flex, Text, TextArea } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoBasic() {
  const [inputText, setInputText] = useState(
    "안녕하세요! 이 텍스트를 복사해보세요."
  );
  const [copyStatus, setCopyStatus] = useState<string>("");

  const { copyText, copiedText, isSupported, isAdvancedSupported } =
    useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copyText(inputText);
    setCopyStatus(success ? "복사 성공!" : "복사 실패");
    setTimeout(() => setCopyStatus(""), 3000);
  };

  const predefinedTexts = [
    "Hello World!",
    "React Hooks는 정말 강력합니다! 🚀",
    "useCopyToClipboard 훅을 사용하면 쉽게 클립보드에 복사할 수 있습니다.",
    `다중 라인 텍스트도
복사할 수 있습니다.
각 줄이 그대로 유지됩니다.`,
    "특수문자도 복사됩니다: !@#$%^&*()_+-={}[]|\\:;\"'<>?,./",
  ];

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            기본 텍스트 복사
          </Text>
          <Flex gap="2">
            <Badge color={isSupported ? "green" : "red"} variant="soft">
              기본 지원: {isSupported ? "✓" : "✗"}
            </Badge>
            <Badge color={isAdvancedSupported ? "green" : "red"} variant="soft">
              고급 지원: {isAdvancedSupported ? "✓" : "✗"}
            </Badge>
          </Flex>
        </Flex>

        <Text size="2" color="gray">
          {`const { copyText, copiedText } = useCopyToClipboard();`}
        </Text>

        <Flex direction="column" gap="3">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              복사할 텍스트:
            </Text>
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="복사할 텍스트를 입력하세요..."
              rows={3}
            />
          </Flex>

          <Flex gap="2" align="center">
            <Button
              onClick={handleCopy}
              disabled={!inputText.trim() || !isSupported}
            >
              복사하기
            </Button>

            {copyStatus && (
              <Badge color={copyStatus.includes("성공") ? "green" : "red"}>
                {copyStatus}
              </Badge>
            )}
          </Flex>
        </Flex>

        {copiedText && (
          <Card variant="surface">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                마지막으로 복사된 텍스트:
              </Text>
              <Text
                size="2"
                style={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  backgroundColor: "var(--gray-3)",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {copiedText}
              </Text>
            </Flex>
          </Card>
        )}

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            미리 정의된 텍스트:
          </Text>
          <Flex gap="2" wrap="wrap">
            {predefinedTexts.map((text, index) => (
              <Button
                key={index}
                variant="soft"
                size="1"
                onClick={() => setInputText(text)}
              >
                예시 {index + 1}
              </Button>
            ))}
          </Flex>
        </Flex>

        {!isSupported && (
          <Card variant="surface" style={{ backgroundColor: "var(--red-2)" }}>
            <Text size="2" color="red">
              ⚠️ 현재 브라우저에서는 클립보드 복사 기능을 지원하지 않습니다.
              HTTPS 환경이거나 최신 브라우저를 사용해주세요.
            </Text>
          </Card>
        )}

        <Text size="1" color="gray">
          💡 팁: 복사 후 다른 곳에 붙여넣기(Ctrl+V 또는 Cmd+V)를 해보세요.
        </Text>
      </Flex>
    </Card>
  );
}
