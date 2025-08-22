import { Flex } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressCounterAsyncContextProvider } from "../../../../../packages/react-lib/src/contexts/progress-counter-async";
import AsyncJobs from "./AsyncJobs";
import ReactQueries from "./ReactQueries";

export default function UseProgressCounterDemo() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Flex direction="column" gap="4">
        <ProgressCounterAsyncContextProvider>
          <AsyncJobs />
        </ProgressCounterAsyncContextProvider>
        <ProgressCounterAsyncContextProvider>
          <ReactQueries />
        </ProgressCounterAsyncContextProvider>
      </Flex>
    </QueryClientProvider>
  );
}
