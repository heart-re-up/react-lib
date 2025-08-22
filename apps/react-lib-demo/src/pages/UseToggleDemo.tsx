import { useToggle } from "../../../../packages/react-lib/src/hooks/useToggle";
import * as Accordion from "@radix-ui/react-accordion";
import * as Switch from "@radix-ui/react-switch";
import { Card } from "@radix-ui/themes";

export default function UseToggleDemo() {
  const [isVisible, toggleVisible, setVisible] = useToggle(false);
  const [isDarkMode, , setDarkMode] = useToggle(false);
  const [isEnabled, , setEnabled] = useToggle(true);
  const [showAdvanced, toggleAdvanced] = useToggle(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">useToggle</h2>
        <p className="text-muted-foreground">
          boolean 상태를 쉽게 토글하고 관리할 수 있는 훅입니다. 토글 함수와 직접
          설정 함수를 모두 제공합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">기본 토글</h3>
            <p className="text-sm text-muted-foreground">
              간단한 보이기/숨기기 기능을 구현합니다.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleVisible}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {isVisible ? "숨기기" : "보이기"}
              </button>
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                강제로 보이기
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              현재 상태:{" "}
              <code className="bg-muted px-2 py-1 rounded">
                {isVisible.toString()}
              </code>
            </div>

            {isVisible && (
              <div className="p-4 bg-accent rounded-lg border-l-4 border-primary">
                <div className="font-medium">토글된 콘텐츠</div>
                <div className="text-sm text-muted-foreground mt-1">
                  이 내용은 토글 상태가 true일 때만 보입니다.
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">스위치 컨트롤</h3>
            <p className="text-sm text-muted-foreground">
              Radix UI Switch와 함께 사용하는 예시입니다.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">다크 모드</div>
                <div className="text-sm text-muted-foreground">
                  테마를 어둡게 변경합니다
                </div>
              </div>
              <Switch.Root
                checked={isDarkMode}
                onCheckedChange={setDarkMode}
                className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">알림 활성화</div>
                <div className="text-sm text-muted-foreground">
                  푸시 알림을 받습니다
                </div>
              </div>
              <Switch.Root
                checked={isEnabled}
                onCheckedChange={setEnabled}
                className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm space-y-2">
                <div>
                  다크 모드:{" "}
                  <code className="bg-muted px-2 py-1 rounded">
                    {isDarkMode.toString()}
                  </code>
                </div>
                <div>
                  알림:{" "}
                  <code className="bg-muted px-2 py-1 rounded">
                    {isEnabled.toString()}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="pb-4">
          <h3 className="text-lg font-medium">아코디언 예시</h3>
          <p className="text-sm text-muted-foreground">
            Radix UI Accordion과 함께 사용하여 고급 설정을 토글합니다.
          </p>
        </div>
        <div>
          <Accordion.Root type="single" collapsible className="w-full">
            <Accordion.Item value="advanced" className="border-b">
              <Accordion.Trigger
                onClick={toggleAdvanced}
                className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
              >
                고급 설정 {showAdvanced ? "숨기기" : "보기"}
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-4 pt-0 space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="cache"
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor="cache" className="text-sm">
                        캐시 활성화
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="analytics"
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor="analytics" className="text-sm">
                        분석 데이터 수집
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="debug"
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor="debug" className="text-sm">
                        디버그 모드
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    아코디언 상태:{" "}
                    <code className="bg-muted px-2 py-1 rounded">
                      {showAdvanced.toString()}
                    </code>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </Card>

      <Card className="p-6">
        <div className="pb-4">
          <h3 className="text-lg font-medium">API 사용법</h3>
          <p className="text-sm text-muted-foreground">
            useToggle 훅의 반환값과 사용 방법을 설명합니다.
          </p>
        </div>
        <div>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
                {`const [value, toggle, setValue] = useToggle(initialValue);

// value: 현재 boolean 값
// toggle: () => void - 값을 반전시키는 함수
// setValue: (value: boolean) => void - 특정 값으로 설정하는 함수`}
              </pre>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">현재 값</div>
                <div className="text-xs text-muted-foreground">
                  현재 토글 상태를 나타내는 boolean 값
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">toggle 함수</div>
                <div className="text-xs text-muted-foreground">
                  현재 값을 반대로 바꾸는 함수
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">setValue 함수</div>
                <div className="text-xs text-muted-foreground">
                  특정 boolean 값으로 직접 설정하는 함수
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
