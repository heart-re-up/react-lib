import { Heading } from "@radix-ui/themes";
import { ModalController } from "../components/ModalController";

export function PageB() {
  return (
    <div>
      <Heading size="9">페이지B</Heading>
      <ModalController
        pageName="페이지B"
        nextPageName="페이지C"
        nextPagePath="/history-manager/page-c"
      />
    </div>
  );
}
