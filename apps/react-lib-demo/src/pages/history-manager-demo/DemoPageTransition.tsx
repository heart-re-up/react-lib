import { useHistory } from "@heart-re-up/history-manager-react";
import { NavigationEvent } from "@heart-re-up/history-manager/core";
import {
  Badge,
  Button,
  Card,
  Flex,
  Select,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";

interface PageState {
  name: string;
  modals: Array<{
    id: string;
    title: string;
    isOpen: boolean;
  }>;
}

export function DemoPageTransition() {
  const [currentPage, setCurrentPage] = useState("A");
  const [pages, setPages] = useState<Record<string, PageState>>({
    A: { name: "페이지 A", modals: [] },
    B: { name: "페이지 B", modals: [] },
  });
  const [strategy, setStrategy] = useState<"passthrough" | "snapback">(
    "passthrough"
  );
  const [eventLog, setEventLog] = useState<string[]>([]);

  // 각 페이지별로 별도의 affinity 사용
  const pageAHistory = useHistory({
    affinity: "page-a-modals",
    onNavigated: (event) => {
      handleNavigationEvent("A", event);
    },
  });

  const pageBHistory = useHistory({
    affinity: "page-b-modals",
    onNavigated: (event) => {
      handleNavigationEvent("B", event);
    },
  });

  const handleNavigationEvent = (
    page: string,
    event: NavigationEvent<unknown>
  ) => {
    const modalData = event.node.data;
    if (!modalData?.modalId) return;

    const log = `[${page}] ${event.type} - ${modalData.title}${
      event.sealed ? " (sealed)" : ""
    }`;
    setEventLog((prev) => [log, ...prev.slice(0, 9)]);

    setPages((prev) => {
      const newPages = { ...prev };
      const pageModals = [...newPages[page].modals];
      const modalIndex = pageModals.findIndex(
        (m) => m.id === modalData.modalId
      );

      if (event.type === "enter" && !event.sealed) {
        if (modalIndex === -1) {
          pageModals.push({
            id: modalData.modalId,
            title: modalData.title,
            isOpen: true,
          });
        } else {
          pageModals[modalIndex].isOpen = true;
        }
      } else if (event.type === "exit") {
        if (modalIndex !== -1) {
          pageModals[modalIndex].isOpen = false;
        }
      }

      newPages[page].modals = pageModals;
      return newPages;
    });
  };

  const handleOpenModal = (page: string) => {
    const history = page === "A" ? pageAHistory : pageBHistory;
    const modalCount = pages[page].modals.length + 1;
    const modalId = `${page.toLowerCase()}-modal-${modalCount}`;

    history.push({
      modalId,
      title: `${page} 모달 ${modalCount}`,
      page,
      createdAt: new Date().toISOString(),
    });
  };

  const handlePageTransition = (toPage: string) => {
    // 현재 페이지의 모달들을 seal
    const fromPage = currentPage;
    const history = fromPage === "A" ? pageAHistory : pageBHistory;

    // 열린 모달이 있으면 seal
    const openModals = pages[fromPage].modals.filter((m) => m.isOpen);
    if (openModals.length > 0) {
      history.seal(strategy);
      setEventLog((prev) => [
        `[${fromPage}] 페이지 전환 - ${openModals.length}개 모달 sealed (${strategy})`,
        ...prev.slice(0, 9),
      ]);
    }

    setCurrentPage(toPage);
    setEventLog((prev) => [
      `[시스템] ${fromPage} → ${toPage} 페이지 전환`,
      ...prev.slice(0, 9),
    ]);
  };

  const clearLog = () => {
    setEventLog([]);
  };

  const currentPageData = pages[currentPage];
  const openModals = currentPageData.modals.filter((m) => m.isOpen);

  return (
    <Flex direction="column" gap="4">
      <Text size="3" weight="medium">
        페이지 전환과 Seal 전략
      </Text>

      {/* 현재 페이지 */}
      <Card>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Text size="2" weight="medium">
              현재 페이지
            </Text>
            <Badge size="2" color="blue">
              {currentPageData.name}
            </Badge>
          </Flex>

          <Flex gap="2">
            <Button
              onClick={() => handlePageTransition("A")}
              variant={currentPage === "A" ? "solid" : "soft"}
              disabled={currentPage === "A"}
            >
              페이지 A로 이동
            </Button>
            <Button
              onClick={() => handlePageTransition("B")}
              variant={currentPage === "B" ? "solid" : "soft"}
              disabled={currentPage === "B"}
            >
              페이지 B로 이동
            </Button>
          </Flex>

          <Separator />

          {/* Seal 전략 설정 */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              Seal 전략
            </Text>
            <Select.Root
              value={strategy}
              onValueChange={(value: "passthrough" | "snapback") =>
                setStrategy(value)
              }
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="passthrough">
                  Passthrough (통과)
                </Select.Item>
                <Select.Item value="snapback">Snapback (되돌아감)</Select.Item>
              </Select.Content>
            </Select.Root>
            <Text size="1" color="gray">
              {strategy === "passthrough"
                ? "Sealed 모달을 자동으로 건너뜁니다"
                : "Sealed 모달에 진입하면 다시 되돌아갑니다"}
            </Text>
          </Flex>
        </Flex>
      </Card>

      {/* 현재 페이지의 모달 */}
      <Card>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Text size="2" weight="medium">
              {currentPageData.name}의 모달
            </Text>
            <Button size="2" onClick={() => handleOpenModal(currentPage)}>
              모달 열기
            </Button>
          </Flex>

          {openModals.length === 0 ? (
            <Text size="2" color="gray">
              열린 모달이 없습니다.
            </Text>
          ) : (
            <Flex direction="column" gap="2">
              {openModals.map((modal) => (
                <Card key={modal.id} variant="surface">
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">
                      {modal.title}
                    </Text>
                    <Badge color="green" size="1">
                      열림
                    </Badge>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Flex>
      </Card>

      {/* 전체 상태 */}
      <Flex gap="4">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              페이지 A 상태
            </Text>
            <Badge variant="soft">
              모달 {pages.A.modals.filter((m) => m.isOpen).length}/
              {pages.A.modals.length}개
            </Badge>
            {pages.A.modals.map((modal) => (
              <Text
                key={modal.id}
                size="1"
                color={modal.isOpen ? "green" : "gray"}
              >
                • {modal.title} {modal.isOpen ? "✓" : "✗"}
              </Text>
            ))}
          </Flex>
        </Card>

        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              페이지 B 상태
            </Text>
            <Badge variant="soft">
              모달 {pages.B.modals.filter((m) => m.isOpen).length}/
              {pages.B.modals.length}개
            </Badge>
            {pages.B.modals.map((modal) => (
              <Text
                key={modal.id}
                size="1"
                color={modal.isOpen ? "green" : "gray"}
              >
                • {modal.title} {modal.isOpen ? "✓" : "✗"}
              </Text>
            ))}
          </Flex>
        </Card>
      </Flex>

      {/* 이벤트 로그 */}
      <Card>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Text size="2" weight="medium">
              이벤트 로그
            </Text>
            <Button size="1" variant="ghost" onClick={clearLog}>
              지우기
            </Button>
          </Flex>

          <div
            style={{
              height: "150px",
              overflowY: "auto",
              backgroundColor: "var(--gray-2)",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {eventLog.length === 0 ? (
              <Text size="2" color="gray">
                이벤트가 여기에 표시됩니다.
              </Text>
            ) : (
              eventLog.map((log, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "4px",
                    color: log.includes("enter")
                      ? "var(--green-11)"
                      : log.includes("exit")
                        ? "var(--orange-11)"
                        : log.includes("sealed")
                          ? "var(--red-11)"
                          : log.includes("시스템")
                            ? "var(--blue-11)"
                            : "var(--gray-11)",
                  }}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </Flex>
      </Card>

      {/* 시나리오 설명 */}
      <Card variant="surface">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            🧪 테스트 시나리오
          </Text>
          <Text size="2" color="gray">
            1. 페이지 A에서 모달 2-3개를 엽니다
          </Text>
          <Text size="2" color="gray">
            2. 페이지 B로 전환합니다 (A의 모달들이 seal됨)
          </Text>
          <Text size="2" color="gray">
            3. 페이지 B에서도 모달을 열어봅니다
          </Text>
          <Text size="2" color="gray">
            4. 브라우저 뒤로가기를 해봅니다
          </Text>
          <Text size="2" color="gray">
            5. Sealed 전략에 따라 다른 동작을 확인합니다
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
