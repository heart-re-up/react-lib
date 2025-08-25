import { WindowFeatures } from "@heart-re-up/react-lib/hooks/useOpenWindow";
import {
  Box,
  Callout,
  Flex,
  Grid,
  Heading,
  Separator,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export type WindowFeatureSettingsProps = {
  defaultValue?: WindowFeatures;
  onChange?: (value: WindowFeatures) => void;
};

export default function WindowFeatureSettings({
  defaultValue,
  onChange,
}: WindowFeatureSettingsProps) {
  const { control, watch } = useForm<WindowFeatures>({
    defaultValues: defaultValue ?? { noopener: true },
    mode: "onChange",
  });

  const watchedValues = watch();

  // 폼 값이 변경될 때마다 상위 컴포넌트에 알림
  useEffect(() => {
    onChange?.(watchedValues);
  }, [onChange, watchedValues]);

  return (
    <Box p="4">
      <Flex direction="column" gap="6">
        <Heading size="4">Window Features 설정</Heading>

        {/* 기본 창 설정 */}
        <Box>
          <Heading size="3">기본 창 설정</Heading>
          <Grid columns="4" gap="2" mt="2">
            <Flex align="center" justify="start" gap="2">
              <Controller
                name="popup"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">팝업 창으로 열기</Text>
            </Flex>

            <Flex align="center" justify="start" gap="2">
              <Controller
                name="attributionsrc"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">Attribution Reporting (실험적)</Text>
            </Flex>
          </Grid>
        </Box>

        <Separator size="4" />

        {/* 보안 설정 */}

        <Box>
          <Heading size="3">보안 설정</Heading>
          <Grid columns="4" gap="2" mt="2">
            <Flex align="center" justify="start" gap="2">
              <Controller
                name="noopener"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">noopener (자식창의 부모 창 접근 차단)</Text>
            </Flex>

            <Flex align="center" justify="start" gap="2">
              <Controller
                name="noreferrer"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">noreferrer (리퍼러 헤더 생략)</Text>
            </Flex>
          </Grid>
        </Box>

        <Separator size="4" />

        {/* 창 크기 및 위치 */}
        <Box>
          <Heading size="3">창 크기 및 위치</Heading>
          <Grid columns="4" gap="2" mt="2">
            <Box style={{ flex: 1 }}>
              <Text size="2" className="mb-1 block">
                너비 (width/innerWidth)
              </Text>
              <Controller
                name="width"
                control={control}
                rules={{
                  min: { value: 100, message: "최소값은 100입니다" },
                  pattern: {
                    value: /^\d+$/,
                    message: "숫자만 입력 가능합니다",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField.Root
                    placeholder="예: 800"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                    color={fieldState.error ? "red" : undefined}
                  />
                )}
              />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text size="2" className="mb-1 block">
                높이 (height/innerHeight)
              </Text>
              <Controller
                name="height"
                control={control}
                rules={{
                  min: { value: 100, message: "최소값은 100입니다" },
                  pattern: {
                    value: /^\d+$/,
                    message: "숫자만 입력 가능합니다",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField.Root
                    placeholder="예: 600"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                    color={fieldState.error ? "red" : undefined}
                  />
                )}
              />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text size="2" className="mb-1 block">
                X 위치 (left/screenX)
              </Text>
              <Controller
                name="left"
                control={control}
                rules={{
                  pattern: {
                    value: /^-?\d+$/,
                    message: "숫자만 입력 가능합니다",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField.Root
                    placeholder="예: 100"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                    color={fieldState.error ? "red" : undefined}
                  />
                )}
              />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text size="2" className="mb-1 block">
                Y 위치 (top/screenY)
              </Text>
              <Controller
                name="top"
                control={control}
                rules={{
                  pattern: {
                    value: /^-?\d+$/,
                    message: "숫자만 입력 가능합니다",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField.Root
                    placeholder="예: 100"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                    color={fieldState.error ? "red" : undefined}
                  />
                )}
              />
            </Box>
          </Grid>
        </Box>

        <Separator />

        {/* 레거시 UI 기능 (팝업에서만 효과) */}
        <Box>
          <Heading size="3">레거시 UI 기능</Heading>

          <Callout.Root color="amber" mt="2" mb="3">
            <Callout.Icon>⚠️</Callout.Icon>
            <Callout.Text>
              최신 브라우저에서는 효과가 없을 수 있습니다.
            </Callout.Text>
          </Callout.Root>

          <Grid columns="4" gap="2" mt="2">
            <Flex align="center" justify="start">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">주소 표시줄 (location)</Text>
            </Flex>

            <Flex align="center" justify="start">
              <Controller
                name="toolbar"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">툴바 (toolbar)</Text>
            </Flex>

            <Flex align="center" justify="start">
              <Controller
                name="menubar"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">메뉴바 (menubar)</Text>
            </Flex>

            <Flex align="center" justify="start">
              <Controller
                name="resizable"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">크기 조절 가능 (resizable)</Text>
            </Flex>

            <Flex align="center" justify="start">
              <Controller
                name="scrollbars"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">스크롤바 (scrollbars)</Text>
            </Flex>

            <Flex align="center" justify="start">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Text size="2">상태 표시줄 (status)</Text>
            </Flex>
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}
