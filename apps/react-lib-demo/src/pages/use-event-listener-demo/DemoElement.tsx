import { useEventListener } from "@heart-re-up/react-lib/hooks/useEventListener";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useRef, useState } from "react";

export default function DemoElement() {
  const [clickCount, setClickCount] = useState(0);
  const [hoverState, setHoverState] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [dragState, setDragState] = useState<"none" | "over" | "dropped">(
    "none"
  );
  const [droppedText, setDroppedText] = useState("");

  // 요소 참조
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 버튼 클릭 이벤트
  useEventListener(
    "click",
    () => {
      setClickCount((prev) => prev + 1);
    },
    buttonRef
  );

  // 호버 박스 이벤트
  useEventListener(
    "mouseenter",
    () => {
      setHoverState(true);
    },
    hoverBoxRef
  );

  useEventListener(
    "mouseleave",
    () => {
      setHoverState(false);
    },
    hoverBoxRef
  );

  // 입력 필드 이벤트
  useEventListener(
    "focus",
    () => {
      setInputFocused(true);
    },
    inputRef
  );

  useEventListener(
    "blur",
    () => {
      setInputFocused(false);
    },
    inputRef
  );

  useEventListener(
    "input",
    (event) => {
      const inputEvent = event as Event & { target: HTMLInputElement };
      setInputValue(inputEvent.target.value);
    },
    inputRef
  );

  // 드래그 앤 드롭 이벤트
  useEventListener(
    "dragover",
    (event) => {
      event.preventDefault();
      setDragState("over");
    },
    dropZoneRef
  );

  useEventListener(
    "dragleave",
    () => {
      setDragState("none");
    },
    dropZoneRef
  );

  useEventListener(
    "drop",
    (event) => {
      event.preventDefault();
      const dropEvent = event as DragEvent;
      const text =
        dropEvent.dataTransfer?.getData("text/plain") || "드롭된 내용";
      setDroppedText(text);
      setDragState("dropped");

      // 3초 후 상태 초기화
      setTimeout(() => setDragState("none"), 3000);
    },
    dropZoneRef
  );

  const resetCounts = () => {
    setClickCount(0);
    setInputValue("");
    setDroppedText("");
    setDragState("none");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            요소별 이벤트 리스너
          </Text>
          <Button onClick={resetCounts} variant="soft" size="1">
            초기화
          </Button>
        </Flex>

        <Text size="2" color="gray">
          {`useEventListener('click', handler, elementRef); // 특정 요소에 등록`}
        </Text>

        <Flex direction="column" gap="4">
          {/* 클릭 카운터 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🖱️ 클릭 이벤트
              </Text>
              <Flex justify="between" align="center">
                <Button ref={buttonRef} size="2">
                  클릭하세요!
                </Button>
                <Badge color="blue" variant="soft">
                  클릭 횟수: {clickCount}
                </Badge>
              </Flex>
            </Flex>
          </Card>

          {/* 호버 상태 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎯 마우스 호버 이벤트
              </Text>
              <div
                ref={hoverBoxRef}
                style={{
                  padding: "20px",
                  backgroundColor: hoverState
                    ? "var(--blue-3)"
                    : "var(--gray-3)",
                  borderRadius: "8px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <Text size="2">
                  {hoverState
                    ? "🎉 마우스가 올라와 있습니다!"
                    : "👋 마우스를 올려보세요"}
                </Text>
              </div>
              <Badge color={hoverState ? "green" : "gray"} variant="soft">
                호버 상태: {hoverState ? "활성" : "비활성"}
              </Badge>
            </Flex>
          </Card>

          {/* 입력 필드 이벤트 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                ⌨️ 입력 필드 이벤트
              </Text>
              <TextField.Root
                ref={inputRef}
                placeholder="여기에 텍스트를 입력해보세요..."
                style={{
                  borderColor: inputFocused ? "var(--blue-7)" : undefined,
                }}
              />
              <Flex gap="2" wrap="wrap">
                <Badge color={inputFocused ? "blue" : "gray"} variant="soft">
                  포커스: {inputFocused ? "활성" : "비활성"}
                </Badge>
                <Badge color={inputValue ? "green" : "gray"} variant="soft">
                  입력 길이: {inputValue.length}자
                </Badge>
              </Flex>
              {inputValue && (
                <Text size="2" color="gray">
                  입력된 내용: "{inputValue}"
                </Text>
              )}
            </Flex>
          </Card>

          {/* 드래그 앤 드롭 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                📁 드래그 앤 드롭 이벤트
              </Text>
              <div
                ref={dropZoneRef}
                style={{
                  padding: "30px",
                  border: `2px dashed ${
                    dragState === "over"
                      ? "var(--blue-7)"
                      : dragState === "dropped"
                        ? "var(--green-7)"
                        : "var(--gray-6)"
                  }`,
                  borderRadius: "8px",
                  textAlign: "center",
                  backgroundColor:
                    dragState === "over"
                      ? "var(--blue-2)"
                      : dragState === "dropped"
                        ? "var(--green-2)"
                        : "var(--gray-2)",
                  transition: "all 0.3s ease",
                }}
              >
                <Text size="2">
                  {dragState === "over"
                    ? "📂 여기에 드롭하세요!"
                    : dragState === "dropped"
                      ? "✅ 드롭 완료!"
                      : "📋 텍스트를 여기로 드래그하세요"}
                </Text>
                {droppedText && (
                  <Text
                    size="2"
                    color="green"
                    style={{ marginTop: "8px", display: "block" }}
                  >
                    드롭된 내용: "{droppedText}"
                  </Text>
                )}
              </div>
              <Badge
                color={
                  dragState === "over"
                    ? "blue"
                    : dragState === "dropped"
                      ? "green"
                      : "gray"
                }
                variant="soft"
              >
                드래그 상태:{" "}
                {dragState === "over"
                  ? "드래그 중"
                  : dragState === "dropped"
                    ? "드롭 완료"
                    : "대기 중"}
              </Badge>
            </Flex>
          </Card>
        </Flex>

        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 테스트 방법:
            </Text>
            <Text size="2" color="gray">
              • 파란색 버튼을 여러 번 클릭해보세요
            </Text>
            <Text size="2" color="gray">
              • 회색 박스에 마우스를 올리고 내려보세요
            </Text>
            <Text size="2" color="gray">
              • 입력 필드를 클릭하고 텍스트를 입력해보세요
            </Text>
            <Text size="2" color="gray">
              • 다른 곳의 텍스트를 선택해서 드래그 앤 드롭 영역으로 끌어보세요
            </Text>
            <Text size="2" color="gray">
              • 각 이벤트는 해당 요소에만 등록되어 다른 요소에는 영향을 주지
              않습니다
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}
