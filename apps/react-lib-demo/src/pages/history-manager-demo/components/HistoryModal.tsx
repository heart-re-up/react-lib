import { Button, Dialog, Flex } from "@radix-ui/themes";

export type HistoryDialogProps = {
  open: boolean;
  title: string;
  nextTitle?: string;
  onClickOpenNext?: () => void;
};
export default function HistoryModal(props: HistoryDialogProps) {
  const {
    open,
    title,
    nextTitle: nextTitle,
    onClickOpenNext: onClickOpenNext,
  } = props;
  return (
    <Dialog.Root open={open}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          히스토리로 관리되는 다일알로그(모달)입니다. 히스토리 이벤트가 발생하면
          모달이 열리고 닫힙니다.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={close}>
            모달 닫기
          </Button>
          {nextTitle && <Button onClick={onClickOpenNext}>{nextTitle}</Button>}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
