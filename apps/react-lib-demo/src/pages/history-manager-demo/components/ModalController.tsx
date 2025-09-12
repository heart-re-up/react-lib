import { useHistoryModal } from "@heart-re-up/history-manager-react";
import { Button, Card, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import HistoryModal from "./HistoryModal";

interface ModalControllerProps {
  pageName: string;
  nextPageName: string;
  nextPagePath: string;
}

export function ModalController({
  pageName,
  nextPageName,
  nextPagePath,
}: ModalControllerProps) {
  const navigate = useNavigate();

  // 모달 3개 훅
  const {
    opened: modal1Opened,
    close: closeModal1,
    open: openModal1,
    seal: sealModal1,
  } = useHistoryModal({
    key: pageName + ":modal-1",
    keepOpenOnForwardExit: true,
  });

  const {
    opened: modal2Opened,
    close: closeModal2,
    open: openModal2,
    seal: sealModal2,
  } = useHistoryModal({
    key: pageName + ":modal-2",
    keepOpenOnForwardExit: true,
  });

  const {
    opened: modal3Opened,
    close: closeModal3,
    open: openModal3,
    seal: sealModal3,
  } = useHistoryModal({
    key: pageName + ":modal-3",
    keepOpenOnForwardExit: true,
  });

  // 모달 열기 핸들러들
  const handleOpenModal1 = () => {
    openModal1({});
  };

  const handleOpenModal2 = () => {
    openModal2({});
  };

  const handleOpenModal3 = () => {
    openModal3({});
  };

  // 페이지가 언마운트(파기/탈출)되면 모달들을 모두 봉인
  useEffect(() => {
    return () => {
      console.log("ModalController useEffect finalize");
      sealModal1();
      sealModal2();
      sealModal3();
    };
  }, []);

  return (
    <>
      {/* 현재 상태 */}
      <Card>
        <Flex direction="column" gap="3">
          <Button onClick={handleOpenModal1}>모달 1 열기</Button>

          <HistoryModal
            open={modal1Opened}
            title="모달 1"
            nextTitle="모달 2"
            onClose={closeModal1}
            onOpenNext={handleOpenModal2}
          />

          <HistoryModal
            open={modal2Opened}
            title="모달 2"
            nextTitle="모달 3"
            onClose={closeModal2}
            onOpenNext={handleOpenModal3}
          />

          <HistoryModal
            open={modal3Opened}
            title="모달 3"
            nextTitle={nextPageName}
            onClose={closeModal3}
            onOpenNext={() => navigate(nextPagePath)}
          />
        </Flex>
      </Card>
    </>
  );
}
