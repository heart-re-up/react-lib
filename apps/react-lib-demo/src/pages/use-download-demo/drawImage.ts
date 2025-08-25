export const drawGradientImage = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 400;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
};

export const drawChartImage = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 400;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 제목
  ctx.fillStyle = "#333";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("월별 다운로드 수", 200, 40);

  // 차트 데이터
  const data = [120, 190, 300, 500, 200, 300, 450, 380, 280, 350, 400, 480];
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
    ctx.fillText(months[index], x + barWidth / 2, chartTop + chartHeight + 20);
  });
};

export const drawPatternImage = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 400;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
};

export const drawQRImage = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 400;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
};
