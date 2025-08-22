import { useCopyToClipboard } from "@heart-re-up/react-lib/hooks/useCopyToClipboard";
import { Badge, Button, Card, Flex, Text, TextArea } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoAdvanced() {
  const [plainText, setPlainText] = useState("이것은 일반 텍스트입니다.");
  const [htmlText, setHtmlText] = useState(
    "<strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>"
  );
  const [copyStatus, setCopyStatus] = useState<string>("");

  const { copyMultiple, isAdvancedSupported } = useCopyToClipboard();

  const handleCopyMultiple = async () => {
    if (!isAdvancedSupported) {
      setCopyStatus("고급 클립보드 기능을 지원하지 않습니다");
      setTimeout(() => setCopyStatus(""), 3000);
      return;
    }

    const success = await copyMultiple({
      "text/plain": new Blob([plainText], { type: "text/plain" }),
      "text/html": new Blob([htmlText], { type: "text/html" }),
    });

    setCopyStatus(success ? "다중 형식 복사 성공!" : "복사 실패");
    setTimeout(() => setCopyStatus(""), 3000);
  };

  const handleCopyRichText = async () => {
    if (!isAdvancedSupported) {
      setCopyStatus("고급 클립보드 기능을 지원하지 않습니다");
      setTimeout(() => setCopyStatus(""), 3000);
      return;
    }

    const richContent = `
      <div style="font-family: Arial, sans-serif; padding: 16px; border: 2px solid #007acc; border-radius: 8px; background: #f0f8ff;">
        <h2 style="color: #007acc; margin-top: 0;">🎉 서식이 있는 텍스트</h2>
        <p>이 텍스트는 <strong>HTML 서식</strong>을 포함하고 있습니다.</p>
        <ul>
          <li><em>기울임</em> 텍스트</li>
          <li><strong>굵은</strong> 텍스트</li>
          <li><u>밑줄</u> 텍스트</li>
        </ul>
        <p style="color: #666;">Word나 다른 리치 텍스트 에디터에 붙여넣으면 서식이 유지됩니다!</p>
      </div>
    `;

    const plainFallback = `
🎉 서식이 있는 텍스트

이 텍스트는 HTML 서식을 포함하고 있습니다.

• 기울임 텍스트
• 굵은 텍스트  
• 밑줄 텍스트

Word나 다른 리치 텍스트 에디터에 붙여넣으면 서식이 유지됩니다!
    `.trim();

    const success = await copyMultiple({
      "text/plain": new Blob([plainFallback], { type: "text/plain" }),
      "text/html": new Blob([richContent], { type: "text/html" }),
    });

    setCopyStatus(success ? "리치 텍스트 복사 성공!" : "복사 실패");
    setTimeout(() => setCopyStatus(""), 3000);
  };

  const predefinedHtmlExamples = [
    {
      label: "링크",
      html: '<a href="https://react.dev">React 공식 사이트</a>',
      plain: "React 공식 사이트 (https://react.dev)",
    },
    {
      label: "테이블",
      html: `
        <table border="1" style="border-collapse: collapse;">
          <tr><th>이름</th><th>나이</th></tr>
          <tr><td>김철수</td><td>25</td></tr>
          <tr><td>이영희</td><td>30</td></tr>
        </table>
      `,
      plain: "이름\t나이\n김철수\t25\n이영희\t30",
    },
    {
      label: "코드",
      html: '<pre><code>const greeting = "Hello World!";\nconsole.log(greeting);</code></pre>',
      plain: 'const greeting = "Hello World!";\nconsole.log(greeting);',
    },
  ];

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            고급 복사 기능 (다중 형식)
          </Text>
          <Badge color={isAdvancedSupported ? "green" : "red"} variant="soft">
            고급 지원: {isAdvancedSupported ? "✓" : "✗"}
          </Badge>
        </Flex>

        <Text size="2" color="gray">
          {`const { copyMultiple } = useCopyToClipboard();`}
        </Text>

        {!isAdvancedSupported ? (
          <Card
            variant="surface"
            style={{ backgroundColor: "var(--orange-2)" }}
          >
            <Text size="2" color="orange">
              ⚠️ 현재 브라우저에서는 고급 클립보드 기능(다중 형식)을 지원하지
              않습니다. Chrome, Firefox, Safari 등 최신 브라우저를 사용해주세요.
            </Text>
          </Card>
        ) : (
          <>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  일반 텍스트:
                </Text>
                <TextArea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="일반 텍스트를 입력하세요..."
                  rows={2}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  HTML 텍스트:
                </Text>
                <TextArea
                  value={htmlText}
                  onChange={(e) => setHtmlText(e.target.value)}
                  placeholder="HTML 마크업을 입력하세요..."
                  rows={2}
                />
              </Flex>

              <Flex gap="2" align="center" wrap="wrap">
                <Button onClick={handleCopyMultiple}>다중 형식 복사</Button>
                <Button onClick={handleCopyRichText} variant="soft">
                  리치 텍스트 복사
                </Button>

                {copyStatus && (
                  <Badge color={copyStatus.includes("성공") ? "green" : "red"}>
                    {copyStatus}
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                미리 정의된 HTML 예시:
              </Text>
              <Flex gap="2" wrap="wrap">
                {predefinedHtmlExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant="soft"
                    size="1"
                    onClick={async () => {
                      const success = await copyMultiple({
                        "text/plain": new Blob([example.plain], {
                          type: "text/plain",
                        }),
                        "text/html": new Blob([example.html], {
                          type: "text/html",
                        }),
                      });
                      setCopyStatus(
                        success ? `${example.label} 복사 성공!` : "복사 실패"
                      );
                      setTimeout(() => setCopyStatus(""), 3000);
                    }}
                  >
                    {example.label}
                  </Button>
                ))}
              </Flex>
            </Flex>

            <Card variant="surface">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  💡 사용 팁:
                </Text>
                <Text size="2" color="gray">
                  • 다중 형식으로 복사하면 붙여넣는 곳에 따라 적절한 형식이 자동
                  선택됩니다
                </Text>
                <Text size="2" color="gray">
                  • 메모장에 붙여넣으면 일반 텍스트, Word에 붙여넣으면 HTML
                  서식이 적용됩니다
                </Text>
                <Text size="2" color="gray">
                  • 브라우저의 개발자 도구 콘솔에서 복사 과정을 확인할 수
                  있습니다
                </Text>
              </Flex>
            </Card>
          </>
        )}
      </Flex>
    </Card>
  );
}
