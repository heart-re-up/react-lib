import { useHistory } from "@heart-re-up/history-manager-react";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

interface ModalState {
  id: string;
  title: string;
  depth: number;
  isOpen: boolean;
}

export function DemoNested() {
  const [modals, setModals] = useState<ModalState[]>([]);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const { push, seal } = useHistory({
    affinity: "nested-modals",
    onEnter: (direction) => {
      console.debug("onEnter", direction);
      setModals((prev) => {
        const newModals = [...prev];
        newModals.push({
          id: `modal-${Date.now()}`,
          title: `모달 ${newModals.length + 1}`,
          depth: newModals.length + 1,
          isOpen: true,
        });
        return newModals;
      });
    },
    onExit: (direction) => {
      console.debug("onExit", direction);
      setModals((prev) => {
        const newModals = [...prev];
        newModals.pop();
        return newModals;
      });
    },
  });

  const handleOpenModal = () => {
    const newDepth = currentDepth + 1;
    const modalId = `modal-${Date.now()}`;
    const title = inputValue || `모달 레벨 ${newDepth}`;

    push({
      id: modalId,
      title,
      depth: newDepth,
      createdAt: new Date().toISOString(),
    });

    setInputValue("");
  };

  const handleCloseModal = () => {
    history.back();
  };

  const handleCloseAll = () => {
    // 모든 모달을 봉인하고 처음으로
    seal();
    const openCount = modals.filter((m) => m.isOpen).length;
    if (openCount > 0) {
      history.go(-openCount);
    }
  };

  const openModals = modals.filter((m) => m.isOpen);

  return (
    <Flex direction="column" gap="4">
      <Text size="3" weight="medium">
        중첩 모달 관리
      </Text>

      {/* 현재 상태 */}
      <Card>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Text size="2" weight="medium">
              열린 모달
            </Text>
            <Badge>{openModals.length}개</Badge>
          </Flex>

          {openModals.length === 0 ? (
            <Text size="2" color="gray">
              열린 모달이 없습니다.
            </Text>
          ) : (
            <Flex direction="column" gap="2">
              {openModals.map((modal, index) => (
                <Card
                  key={modal.id}
                  variant="surface"
                  style={{
                    marginLeft: `${index * 20}px`,
                    borderLeft: `3px solid var(--accent-9)`,
                  }}
                >
                  <Flex justify="between" align="center">
                    <Flex gap="2" align="center">
                      <Badge variant="soft" size="1">
                        깊이 {modal.depth}
                      </Badge>
                      <Text size="2" weight="medium">
                        {modal.title}
                      </Text>
                    </Flex>
                    {index === openModals.length - 1 && (
                      <Badge color="green" size="1">
                        현재
                      </Badge>
                    )}
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Flex>
      </Card>

      {/* 컨트롤 */}
      <Card>
        <Flex direction="column" gap="3">
          <Text size="2" weight="medium">
            모달 컨트롤
          </Text>

          <Flex gap="2" align="end">
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Text size="1">모달 제목 (선택사항)</Text>
              <TextField.Root
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`모달 레벨 ${currentDepth + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleOpenModal();
                  }
                }}
              />
            </Flex>
            <Button onClick={handleOpenModal}>중첩 모달 열기</Button>
          </Flex>

          <Flex gap="2">
            <Button
              onClick={handleCloseModal}
              variant="soft"
              disabled={openModals.length === 0}
            >
              현재 모달 닫기
            </Button>
            <Button
              onClick={handleCloseAll}
              variant="soft"
              color="red"
              disabled={openModals.length === 0}
            >
              모든 모달 닫기
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* 시각화 */}
      <Card>
        <Flex direction="column" gap="3">
          <Text size="2" weight="medium">
            히스토리 스택 시각화
          </Text>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              padding: "16px",
              backgroundColor: "var(--gray-2)",
              borderRadius: "6px",
              minHeight: "100px",
            }}
          >
            {modals.length === 0 ? (
              <Text size="2" color="gray">
                아직 히스토리가 없습니다.
              </Text>
            ) : (
              modals.map((modal, index) => (
                <div
                  key={modal.id}
                  style={{
                    width: "60px",
                    height: `${40 + modal.depth * 20}px`,
                    backgroundColor: modal.isOpen
                      ? "var(--accent-9)"
                      : "var(--gray-6)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                  title={modal.title}
                >
                  {modal.depth}
                </div>
              ))
            )}
          </div>
        </Flex>
      </Card>

      {/* 사용 시나리오 */}
      <Card variant="surface">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            🎯 사용 시나리오
          </Text>
          <Text size="2" color="gray">
            • 설정 → 프로필 편집 → 이미지 업로드와 같은 중첩 모달
          </Text>
          <Text size="2" color="gray">
            • 상품 목록 → 상품 상세 → 리뷰 작성 플로우
          </Text>
          <Text size="2" color="gray">
            • 브라우저 뒤로가기로 자연스럽게 이전 단계로 이동
          </Text>
          <Text size="2" color="gray">
            • 모든 모달을 한 번에 닫을 수 있어 UX 향상
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
