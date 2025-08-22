import DemoHeader from "@/components/components/DemoHeader";
import DemoRelationList from "@/components/components/DemoRelationList";
import { ProgressCounterAsyncContextProvider } from "@heart-re-up/react-lib/contexts/progress-counter-async";
import { Flex } from "@radix-ui/themes";
import AsyncJobs from "./AsyncJobs";
import ReactQueries from "./ReactQueries";

const relations = [
  {
    type: "hook",
    name: "useProgressCounter",
    description: "@heart-re-up/react-lib/hooks/use-progress-counter",
  },
  {
    type: "hook",
    name: "useProgressCounterAsync",
    description: "@heart-re-up/react-lib/hooks/use-progress-counter-async",
  },
  {
    type: "context(provider/hook)",
    name: "ProgressCounterAsyncContextProvider",
    description: "@heart-re-up/react-lib/contexts/progress-counter-async",
  },
  {
    type: "context(provider/hook)",
    name: "useProgressCounterAsyncContext",
    description: "@heart-re-up/react-lib/contexts/progress-counter-async",
  },
] as const;

export default function UseProgressCounterDemo() {
  return (
    <>
      <DemoHeader
        title="Progress Counter Demo"
        description="동시 실행되는 비동기 작업들의 개수를 카운트하고, 현재 진행 중인 비동기 작업이 있는지 여부를 제공합니다."
      />
      <DemoRelationList relations={relations} />
      <Flex mt="4" direction="column" gap="4">
        <ProgressCounterAsyncContextProvider>
          <AsyncJobs />
        </ProgressCounterAsyncContextProvider>
        <ProgressCounterAsyncContextProvider>
          <ReactQueries />
        </ProgressCounterAsyncContextProvider>
      </Flex>
    </>
  );
}
