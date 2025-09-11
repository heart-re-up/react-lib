import { Heading } from "@radix-ui/themes";
import { ModalController } from "../components/ModalController";

export function PageA() {
  return (
    <div>
      <Heading size="9">페이지A</Heading>
      <ModalController
        pageName="페이지A"
        nextPageName="페이지B"
        nextPagePath="/history-manager/page-b"
      />
    </div>
  );
}
