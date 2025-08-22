import { useDownload } from "@heart-re-up/react-lib/hooks/useDownload";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState, useRef } from "react";

export default function DemoImage() {
  const [filename, setFilename] = useState("generated-image.png");
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { download, isSupported } = useDownload();

  const generateAndDrawImage = (
    type: "gradient" | "chart" | "pattern" | "qr"
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (type) {
      case "gradient":
        // 그라디언트 배경
        const gradient = ctx.createRadialGradient(200, 150, 0, 200, 150, 200);
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(0.3, "#4ecdc4");
        gradient.addColorStop(0.6, "#45b7d1");
        gradient.addColorStop(1, "#96ceb4");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 장식 요소
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 20 + 5,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }

        // 텍스트
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("React Hooks", 200, 130);
        ctx.font = "20px Arial";
        ctx.fillText("useDownload Demo", 200, 160);
        break;

      case "chart":
        // 배경
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 제목
        ctx.fillStyle = "#333";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("월별 다운로드 수", 200, 40);

        // 차트 데이터
        const data = [
          120, 190, 300, 500, 200, 300, 450, 380, 280, 350, 400, 480,
        ];
        const months = [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ];
        const maxValue = Math.max(...data);
        const chartHeight = 180;
        const chartTop = 60;
        const barWidth = 25;
        const barSpacing = 5;
        const startX = 50;

        // 바 차트 그리기
        data.forEach((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = startX + index * (barWidth + barSpacing);
          const y = chartTop + chartHeight - barHeight;

          // 바
          ctx.fillStyle = `hsl(${200 + index * 10}, 70%, 60%)`;
          ctx.fillRect(x, y, barWidth, barHeight);

          // 값 표시
          ctx.fillStyle = "#333";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(value.toString(), x + barWidth / 2, y - 5);

          // 월 표시
          ctx.fillText(
            months[index],
            x + barWidth / 2,
            chartTop + chartHeight + 20
          );
        });
        break;

      case "pattern":
        // 체크무늬 패턴
        const checkSize = 20;
        for (let x = 0; x < canvas.width; x += checkSize) {
          for (let y = 0; y < canvas.height; y += checkSize) {
            ctx.fillStyle =
              (x / checkSize + y / checkSize) % 2 === 0 ? "#e3f2fd" : "#bbdefb";
            ctx.fillRect(x, y, checkSize, checkSize);
          }
        }

        // 중앙 원
        ctx.fillStyle = "#1976d2";
        ctx.beginPath();
        ctx.arc(200, 150, 80, 0, 2 * Math.PI);
        ctx.fill();

        // 원 안의 텍스트
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Pattern", 200, 145);
        ctx.font = "16px Arial";
        ctx.fillText("Design", 200, 165);
        break;

      case "qr":
        // QR 코드 스타일 패턴 (실제 QR 코드는 아님)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const moduleSize = 8;
        const qrSize = 25; // 25x25 모듈
        const startXPos = (canvas.width - qrSize * moduleSize) / 2;
        const startYPos = (canvas.height - qrSize * moduleSize) / 2;

        // QR 패턴 생성 (랜덤)
        for (let x = 0; x < qrSize; x++) {
          for (let y = 0; y < qrSize; y++) {
            // 코너 찾기 패턴
            if (
              (x < 7 && y < 7) ||
              (x >= qrSize - 7 && y < 7) ||
              (x < 7 && y >= qrSize - 7)
            ) {
              if (
                x === 0 ||
                x === 6 ||
                y === 0 ||
                y === 6 ||
                (x >= 2 && x <= 4 && y >= 2 && y <= 4)
              ) {
                ctx.fillStyle = "black";
                ctx.fillRect(
                  startXPos + x * moduleSize,
                  startYPos + y * moduleSize,
                  moduleSize,
                  moduleSize
                );
              }
            } else if (Math.random() > 0.5) {
              ctx.fillStyle = "black";
              ctx.fillRect(
                startXPos + x * moduleSize,
                startYPos + y * moduleSize,
                moduleSize,
                moduleSize
              );
            }
          }
        }

        // 하단 텍스트
        ctx.fillStyle = "#666";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Generated QR-like Pattern",
          200,
          startYPos + qrSize * moduleSize + 30
        );
        break;
    }
  };

  const handleDownloadCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob) {
        const success = await download(blob, { filename });
        setDownloadStatus(success ? "이미지 다운로드 성공!" : "다운로드 실패");
        setTimeout(() => setDownloadStatus(""), 3000);
      }
    }, "image/png");
  };

  const downloadSVGImage = async () => {
    const svg = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="200" fill="url(#bg)" rx="15"/>
        <text x="150" y="80" font-family="Arial" font-size="24" font-weight="bold" 
              fill="white" text-anchor="middle">SVG Image</text>
        <text x="150" y="110" font-family="Arial" font-size="16" 
              fill="rgba(255,255,255,0.8)" text-anchor="middle">Generated by useDownload</text>
        <circle cx="150" cy="140" r="20" fill="rgba(255,255,255,0.3)"/>
        <rect x="130" y="160" width="40" height="20" fill="rgba(255,255,255,0.2)" rx="10"/>
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const success = await download(blob, {
      filename: filename.replace(".png", ".svg"),
    });

    setDownloadStatus(success ? "SVG 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  // 컴포넌트 마운트 시 기본 이미지 생성
  useState(() => {
    setTimeout(() => generateAndDrawImage("gradient"), 100);
  });

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          이미지 파일 다운로드
        </Text>

        <Text size="2" color="gray">
          Canvas나 SVG로 생성된 이미지를 파일로 다운로드할 수 있습니다.
        </Text>

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

          <Flex direction="column" gap="2" align="center">
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
                onClick={() => generateAndDrawImage("gradient")}
              >
                그라디언트
              </Button>
              <Button
                variant="soft"
                size="1"
                onClick={() => generateAndDrawImage("chart")}
              >
                차트
              </Button>
              <Button
                variant="soft"
                size="1"
                onClick={() => generateAndDrawImage("pattern")}
              >
                패턴
              </Button>
              <Button
                variant="soft"
                size="1"
                onClick={() => generateAndDrawImage("qr")}
              >
                QR 스타일
              </Button>
            </Flex>

            <Flex gap="2" align="center" wrap="wrap">
              <Button onClick={handleDownloadCanvas}>PNG 다운로드</Button>
              <Button onClick={downloadSVGImage} variant="soft">
                SVG 다운로드
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

          <Card variant="surface">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                💡 사용 방법:
              </Text>
              <Text size="2" color="gray">
                1. 위의 버튼들로 다양한 이미지를 생성해보세요
              </Text>
              <Text size="2" color="gray">
                2. 원하는 파일명을 입력하세요 (.png 또는 .svg)
              </Text>
              <Text size="2" color="gray">
                3. "PNG 다운로드" 또는 "SVG 다운로드" 버튼을 클릭하세요
              </Text>
              <Text size="2" color="gray">
                4. 브라우저의 다운로드 폴더에서 파일을 확인하세요
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
