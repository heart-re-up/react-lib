import { useLocalStorage } from "../../../../packages/react-lib/src/hooks/useLocalStorage";
import * as Separator from "@radix-ui/react-separator";
import { Card } from "@radix-ui/themes";

export default function UseLocalStorageDemo() {
  const [name, setName] = useLocalStorage("demo-name", "");
  const [age, setAge] = useLocalStorage("demo-age", 0);
  const [settings, setSettings] = useLocalStorage("demo-settings", {
    theme: "light",
    notifications: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">useLocalStorage</h2>
        <p className="text-muted-foreground">
          localStorage와 동기화되는 상태를 관리합니다. 페이지를 새로고침해도
          값이 유지됩니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">문자열 저장</h3>
            <p className="text-sm text-muted-foreground">
              이름을 입력하면 localStorage에 자동으로 저장됩니다.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              저장된 값:{" "}
              <code className="bg-muted px-2 py-1 rounded">
                {name || "(없음)"}
              </code>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">숫자 저장</h3>
            <p className="text-sm text-muted-foreground">
              나이를 입력하면 숫자 타입으로 localStorage에 저장됩니다.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2">
                나이
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="나이를 입력하세요"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              저장된 값:{" "}
              <code className="bg-muted px-2 py-1 rounded">{age}</code> (타입:{" "}
              {typeof age})
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="pb-4">
          <h3 className="text-lg font-medium">객체 저장</h3>
          <p className="text-sm text-muted-foreground">
            복잡한 객체도 JSON으로 직렬화되어 localStorage에 저장됩니다.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-2">
                테마
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) =>
                  setSettings((prev: typeof settings) => ({
                    ...prev,
                    theme: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="notifications"
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  setSettings((prev: typeof settings) => ({
                    ...prev,
                    notifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="notifications" className="text-sm font-medium">
                알림 허용
              </label>
            </div>
          </div>
          <Separator.Root className="bg-border h-[1px] my-4" />
          <div>
            <div className="text-sm font-medium mb-2">저장된 객체:</div>
            <pre className="bg-muted p-3 rounded-md text-sm overflow-auto">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
