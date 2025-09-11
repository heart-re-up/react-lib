import { useHistoryModal } from "@heart-re-up/history-manager-react";
import { Button, Card, Flex } from "@radix-ui/themes";
import { useCallback, useEffect } from "react";
import HistoryModal from "./HistoryModal";
import { useNavigate } from "react-router";

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
  // 모달 3개 훅
  const modal1History = useHistoryModal({
    key: pageName + ":modal-1",
    // keepOpenOnForwardExit: true,
  });

  const modal2History = useHistoryModal({
    key: pageName + ":modal-2",
    // keepOpenOnForwardExit: true,
  });

  const modal3History = useHistoryModal({
    key: pageName + ":modal-3",
    // keepOpenOnForwardExit: true,
  });

  // 모달 열기 핸들러들
  const handleOpenModal1 = () => {
    modal1History.open({});
  };

  const handleOpenModal2 = () => {
    modal2History.open({});
  };

  const handleOpenModal3 = () => {
    modal3History.open({});
  };

  const handleSealAll = useCallback(() => {
    modal1History.seal();
    modal2History.seal();
    modal3History.seal();
  }, [modal1History, modal2History, modal3History]);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      handleSealAll();
    };
  }, [handleSealAll]);

  return (
    <>
      {/* 현재 상태 */}
      <Card>
        <Flex direction="column" gap="3">
          <Button onClick={handleOpenModal1}>모달 1 열기</Button>

          <HistoryModal
            open={modal1History.opened}
            title="모달 1"
            nextTitle="모달 2"
            onClickOpenNext={handleOpenModal2}
          />

          <HistoryModal
            open={modal2History.opened}
            title="모달 2"
            nextTitle="모달 3"
            onClickOpenNext={handleOpenModal3}
          />

          <HistoryModal
            open={modal3History.opened}
            title="모달 3"
            nextTitle={nextPageName}
            onClickOpenNext={() => navigate(nextPagePath)}
          />
        </Flex>
      </Card>
    </>
  );
}
