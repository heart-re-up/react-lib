import { Heading } from "@radix-ui/themes";
import { ModalController } from "../components/ModalController";

export function PageC() {
  return (
    <div>
      <Heading size="9">페이지C</Heading>
      <ModalController
        pageName="페이지C"
        nextPageName="페이지A"
        nextPagePath="/history-manager/page-a"
      />
    </div>
  );
}
