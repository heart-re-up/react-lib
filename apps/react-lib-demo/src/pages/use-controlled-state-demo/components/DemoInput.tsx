import { useControlledState } from "@heart-re-up/react-lib/hooks/useControlledState";
import { useRenderCount } from "@heart-re-up/react-lib/hooks/useRenderCount";
import { Box, Text, TextField } from "@radix-ui/themes";
import { ComponentProps } from "react";

interface DemoInputProps
  extends Omit<ComponentProps<typeof TextField.Root>, "value" | "onChange"> {
  /** 제어 모드에서 사용할 값 */
  value?: string;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: string) => void;
  /** 비제어 모드에서 사용할 기본값 */
  defaultValue?: string;
}

/**
 * useControlledState를 활용한 재사용 가능한 Input 컴포넌트
 * - 제어/비제어 모드를 자동으로 감지
 * - 동일한 API로 두 가지 패턴 모두 지원
 */
export function DemoInput({
  value,
  onChange,
  defaultValue = "",
  ...props
}: DemoInputProps) {
  const [inputValue, setInputValue] = useControlledState({
    value,
    onChange,
    defaultValue,
  });

  const rendercount = useRenderCount();

  return (
    <Box>
      <Text size="1" color="gray" mb="2">
        컴포넌트 내부 렌더 카운트: {rendercount}
      </Text>

      <TextField.Root
        {...props}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Box>
  );
}
