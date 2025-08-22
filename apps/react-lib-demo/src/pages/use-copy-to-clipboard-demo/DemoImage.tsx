import { useCopyToClipboard } from "@heart-re-up/react-lib/hooks/useCopyToClipboard";
import { Badge, Button, Card, Flex, Text } from "@radix-ui/themes";
import { useState, useRef } from "react";

export default function DemoImage() {
  const [copyStatus, setCopyStatus] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { copyImage, isAdvancedSupported } = useCopyToClipboard();

  const drawOnCanvas = (type: "gradient" | "pattern" | "text") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = 300;
    canvas.height = 200;

    // 배경 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (type) {
      case "gradient":
        // 그라디언트 배경
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(0.5, "#4ecdc4");
        gradient.addColorStop(1, "#45b7d1");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 텍스트 추가
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("그라디언트 이미지", canvas.width / 2, canvas.height / 2);
        break;

      case "pattern":
        // 패턴 배경
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 체크 패턴
        ctx.fillStyle = "#e9ecef";
        for (let i = 0; i < canvas.width; i += 20) {
          for (let j = 0; j < canvas.height; j += 20) {
            if ((i / 20 + j / 20) % 2 === 0) {
              ctx.fillRect(i, j, 20, 20);
            }
          }
        }

        // 중앙에 원
        ctx.fillStyle = "#007acc";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
        ctx.fill();

        // 텍스트
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("패턴 이미지", canvas.width / 2, canvas.height / 2 + 5);
        break;

      case "text":
        // 단색 배경
        ctx.fillStyle = "#2d3748";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 제목
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("React Hooks", canvas.width / 2, 60);

        // 부제목
        ctx.fillStyle = "#a0aec0";
        ctx.font = "18px Arial";
        ctx.fillText("useCopyToClipboard", canvas.width / 2, 90);

        // 설명
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px Arial";
        ctx.fillText(
          "이미지를 클립보드에 복사할 수 있습니다",
          canvas.width / 2,
          130
        );

        // 이모지 (대체)
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 32px Arial";
        ctx.fillText("📋", canvas.width / 2, 170);
        break;
    }
  };

  const handleCopyCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !isAdvancedSupported) {
      setCopyStatus("이미지 복사를 지원하지 않습니다");
      setTimeout(() => setCopyStatus(""), 3000);
      return;
    }

    canvas.toBlob(async (blob) => {
      if (blob) {
        const success = await copyImage(blob);
        setCopyStatus(success ? "이미지 복사 성공!" : "이미지 복사 실패");
        setTimeout(() => setCopyStatus(""), 3000);
      } else {
        setCopyStatus("이미지 생성 실패");
        setTimeout(() => setCopyStatus(""), 3000);
      }
    }, "image/png");
  };

  const createAndCopyCustomImage = async () => {
    if (!isAdvancedSupported) {
      setCopyStatus("이미지 복사를 지원하지 않습니다");
      setTimeout(() => setCopyStatus(""), 3000);
      return;
    }

    // SVG 이미지 생성
    const svg = `
      <svg width="250" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="250" height="150" fill="url(#bg)" rx="10"/>
        <text x="125" y="80" font-family="Arial" font-size="20" font-weight="bold" 
              fill="white" text-anchor="middle">SVG 이미지</text>
        <circle cx="125" cy="110" r="15" fill="rgba(255,255,255,0.3)"/>
      </svg>
    `;

    // SVG를 Blob으로 변환
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });

    // SVG를 PNG로 변환하기 위해 Canvas 사용
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    img.onload = async () => {
      canvas.width = 250;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const success = await copyImage(blob);
          setCopyStatus(success ? "SVG 이미지 복사 성공!" : "이미지 복사 실패");
          setTimeout(() => setCopyStatus(""), 3000);
        }
      }, "image/png");
    };

    img.src = URL.createObjectURL(svgBlob);
  };

  // 컴포넌트 마운트 시 기본 그라디언트 그리기
  useState(() => {
    setTimeout(() => drawOnCanvas("gradient"), 100);
  });

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            이미지 복사 기능
          </Text>
          <Badge color={isAdvancedSupported ? "green" : "red"} variant="soft">
            이미지 지원: {isAdvancedSupported ? "✓" : "✗"}
          </Badge>
        </Flex>

        <Text size="2" color="gray">
          {`const { copyImage } = useCopyToClipboard();`}
        </Text>

        {!isAdvancedSupported ? (
          <Card
            variant="surface"
            style={{ backgroundColor: "var(--orange-2)" }}
          >
            <Text size="2" color="orange">
              ⚠️ 현재 브라우저에서는 이미지 클립보드 복사 기능을 지원하지
              않습니다. Chrome, Firefox, Safari 등 최신 브라우저를 사용해주세요.
            </Text>
          </Card>
        ) : (
          <>
            <Flex direction="column" gap="3" align="center">
              <canvas
                ref={canvasRef}
                style={{
                  border: "2px solid var(--gray-6)",
                  borderRadius: "8px",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />

              <Flex gap="2" wrap="wrap" justify="center">
                <Button
                  variant="soft"
                  size="1"
                  onClick={() => drawOnCanvas("gradient")}
                >
                  그라디언트
                </Button>
                <Button
                  variant="soft"
                  size="1"
                  onClick={() => drawOnCanvas("pattern")}
                >
                  패턴
                </Button>
                <Button
                  variant="soft"
                  size="1"
                  onClick={() => drawOnCanvas("text")}
                >
                  텍스트
                </Button>
              </Flex>

              <Flex gap="2" align="center" wrap="wrap">
                <Button onClick={handleCopyCanvas}>캔버스 이미지 복사</Button>
                <Button onClick={createAndCopyCustomImage} variant="soft">
                  SVG 이미지 복사
                </Button>

                {copyStatus && (
                  <Badge color={copyStatus.includes("성공") ? "green" : "red"}>
                    {copyStatus}
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Card variant="surface">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  💡 사용 방법:
                </Text>
                <Text size="2" color="gray">
                  1. 위의 버튼들로 다양한 이미지를 생성해보세요
                </Text>
                <Text size="2" color="gray">
                  2. "캔버스 이미지 복사" 버튼을 클릭하여 이미지를 클립보드에
                  복사
                </Text>
                <Text size="2" color="gray">
                  3. Word, PowerPoint, Photoshop 등에 붙여넣기(Ctrl+V)해보세요
                </Text>
                <Text size="2" color="gray">
                  4. 이미지는 PNG 형식으로 복사됩니다
                </Text>
              </Flex>
            </Card>
          </>
        )}
      </Flex>
    </Card>
  );
}
