import { useDownload } from "@heart-re-up/react-lib/hooks/useDownload";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  active: boolean;
}

export default function DemoData() {
  const [filename, setFilename] = useState("export-data");
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  const { download, isSupported } = useDownload();

  // 샘플 데이터
  const sampleUsers: User[] = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      age: 25,
      city: "서울",
      active: true,
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      age: 30,
      city: "부산",
      active: false,
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      age: 28,
      city: "대구",
      active: true,
    },
    {
      id: 4,
      name: "최지영",
      email: "choi@example.com",
      age: 32,
      city: "인천",
      active: true,
    },
    {
      id: 5,
      name: "정하나",
      email: "jung@example.com",
      age: 27,
      city: "광주",
      active: false,
    },
  ];

  const downloadJSON = async () => {
    const exportData = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        totalRecords: sampleUsers.length,
      },
      users: sampleUsers,
      summary: {
        activeUsers: sampleUsers.filter((u) => u.active).length,
        averageAge: Math.round(
          sampleUsers.reduce((sum, u) => sum + u.age, 0) / sampleUsers.length
        ),
        cities: [...new Set(sampleUsers.map((u) => u.city))],
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json; charset=utf-8",
    });

    const success = await download(blob, { filename: `${filename}.json` });
    setDownloadStatus(success ? "JSON 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  const downloadCSV = async () => {
    const headers = ["ID", "이름", "이메일", "나이", "도시", "활성상태"];
    const csvContent = [
      headers.join(","),
      ...sampleUsers.map((user) =>
        [
          user.id,
          `"${user.name}"`,
          user.email,
          user.age,
          `"${user.city}"`,
          user.active ? "활성" : "비활성",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv; charset=utf-8",
    });

    const success = await download(blob, { filename: `${filename}.csv` });
    setDownloadStatus(success ? "CSV 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  const downloadXML = async () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<export>
  <info>
    <timestamp>${new Date().toISOString()}</timestamp>
    <version>1.0.0</version>
    <totalRecords>${sampleUsers.length}</totalRecords>
  </info>
  <users>
${sampleUsers
  .map(
    (user) => `    <user id="${user.id}">
      <name>${user.name}</name>
      <email>${user.email}</email>
      <age>${user.age}</age>
      <city>${user.city}</city>
      <active>${user.active}</active>
    </user>`
  )
  .join("\n")}
  </users>
  <summary>
    <activeUsers>${sampleUsers.filter((u) => u.active).length}</activeUsers>
    <averageAge>${Math.round(sampleUsers.reduce((sum, u) => sum + u.age, 0) / sampleUsers.length)}</averageAge>
    <cities>
${[...new Set(sampleUsers.map((u) => u.city))].map((city) => `      <city>${city}</city>`).join("\n")}
    </cities>
  </summary>
</export>`;

    const blob = new Blob([xmlContent], {
      type: "application/xml; charset=utf-8",
    });

    const success = await download(blob, { filename: `${filename}.xml` });
    setDownloadStatus(success ? "XML 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  const downloadExcel = async () => {
    // 간단한 Excel 호환 형식 (TSV)
    const headers = ["ID", "이름", "이메일", "나이", "도시", "활성상태"];
    const tsvContent = [
      headers.join("\t"),
      ...sampleUsers.map((user) =>
        [
          user.id,
          user.name,
          user.email,
          user.age,
          user.city,
          user.active ? "활성" : "비활성",
        ].join("\t")
      ),
    ].join("\n");

    const blob = new Blob([tsvContent], {
      type: "application/vnd.ms-excel; charset=utf-8",
    });

    const success = await download(blob, { filename: `${filename}.xls` });
    setDownloadStatus(success ? "Excel 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  const downloadReport = async () => {
    const reportContent = `사용자 데이터 리포트
===================

생성일시: ${new Date().toLocaleString("ko-KR")}
총 사용자 수: ${sampleUsers.length}명

📊 통계 정보
-----------
활성 사용자: ${sampleUsers.filter((u) => u.active).length}명
비활성 사용자: ${sampleUsers.filter((u) => !u.active).length}명
평균 나이: ${Math.round(sampleUsers.reduce((sum, u) => sum + u.age, 0) / sampleUsers.length)}세

🏙️ 도시별 분포
-----------
${[...new Set(sampleUsers.map((u) => u.city))]
  .map((city) => {
    const count = sampleUsers.filter((u) => u.city === city).length;
    return `${city}: ${count}명`;
  })
  .join("\n")}

👥 사용자 목록
-----------
${sampleUsers
  .map(
    (user, index) =>
      `${index + 1}. ${user.name} (${user.age}세, ${user.city})
   이메일: ${user.email}
   상태: ${user.active ? "활성" : "비활성"}
`
  )
  .join("\n")}

📈 연령대별 분포
--------------
20대: ${sampleUsers.filter((u) => u.age >= 20 && u.age < 30).length}명
30대: ${sampleUsers.filter((u) => u.age >= 30 && u.age < 40).length}명

이 리포트는 useDownload 훅을 사용하여 생성되었습니다.
`;

    const blob = new Blob([reportContent], {
      type: "text/plain; charset=utf-8",
    });

    const success = await download(blob, {
      filename: `${filename}-report.txt`,
    });
    setDownloadStatus(success ? "리포트 다운로드 성공!" : "다운로드 실패");
    setTimeout(() => setDownloadStatus(""), 3000);
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          데이터 파일 다운로드
        </Text>

        <Text size="2" color="gray">
          구조화된 데이터를 다양한 형식으로 내보낼 수 있습니다.
        </Text>

        <Flex direction="column" gap="3">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              파일명 (확장자 제외):
            </Text>
            <TextField.Root
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="export-data"
            />
          </Flex>

          {/* 샘플 데이터 미리보기 */}
          <Card variant="surface">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                📋 샘플 데이터 ({sampleUsers.length}개 레코드):
              </Text>
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  backgroundColor: "var(--gray-2)",
                  padding: "8px",
                  borderRadius: "4px",
                  overflow: "auto",
                }}
              >
                {sampleUsers.slice(0, 3).map((user) => (
                  <div key={user.id}>
                    {user.id}. {user.name} - {user.email} ({user.age}세,{" "}
                    {user.city}) [{user.active ? "활성" : "비활성"}]
                  </div>
                ))}
                {sampleUsers.length > 3 && (
                  <div>... 외 {sampleUsers.length - 3}개</div>
                )}
              </div>
            </Flex>
          </Card>

          <Flex direction="column" gap="3">
            <Text size="2" weight="medium">
              다운로드 형식 선택:
            </Text>

            <Flex gap="2" wrap="wrap">
              <Button onClick={downloadJSON} variant="solid">
                📄 JSON 형식
              </Button>
              <Button onClick={downloadCSV} variant="soft">
                📊 CSV 형식
              </Button>
              <Button onClick={downloadXML} variant="soft">
                🔖 XML 형식
              </Button>
              <Button onClick={downloadExcel} variant="soft">
                📈 Excel 형식
              </Button>
            </Flex>

            <Button onClick={downloadReport} variant="outline">
              📋 텍스트 리포트
            </Button>

            {downloadStatus && (
              <Badge color={downloadStatus.includes("성공") ? "green" : "red"}>
                {downloadStatus}
              </Badge>
            )}
          </Flex>

          <Card variant="surface">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                📁 파일 형식별 특징:
              </Text>
              <Text size="2" color="gray">
                • <strong>JSON:</strong> 웹 애플리케이션에서 주로 사용, 중첩
                데이터 구조 지원
              </Text>
              <Text size="2" color="gray">
                • <strong>CSV:</strong> Excel에서 바로 열 수 있음, 표 형태
                데이터에 적합
              </Text>
              <Text size="2" color="gray">
                • <strong>XML:</strong> 구조화된 문서 형식, 메타데이터 포함 가능
              </Text>
              <Text size="2" color="gray">
                • <strong>Excel:</strong> Microsoft Excel에서 직접 열 수 있는
                형식
              </Text>
              <Text size="2" color="gray">
                • <strong>텍스트 리포트:</strong> 사람이 읽기 쉬운 요약 형태
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
