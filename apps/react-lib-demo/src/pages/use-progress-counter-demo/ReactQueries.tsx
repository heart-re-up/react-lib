import DemoHeader from "@/components/components/DemoHeader";
import { timeout } from "@/lib/utils";
import { useProgress } from "@heart-re-up/react-lib/contexts/progress-counter-async";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { random } from "lodash-es";

const queryFn = async () => {
  await timeout(random(1000, 5000));
  return "query";
};

const useQueryDemo = (index: number) => {
  const { progressCounterWith } = useProgress();
  return useQuery({
    queryKey: ["query", index],
    queryFn: () => progressCounterWith(queryFn),
  });
};

export default function ReactQueries() {
  const { count, progress } = useProgress();
  const query1 = useQueryDemo(1);
  const query2 = useQueryDemo(2);
  const query3 = useQueryDemo(3);
  return (
    <Card>
      <DemoHeader
        title="Progress Counter Async Jobs"
        description="This is a demo of the Progress Counter Async Jobs component."
      />
      <Heading size={"3"} mt="2">
        Count: {count}
      </Heading>
      <Heading size={"3"}>Progress: {progress ? "true" : "false"}</Heading>
      <Flex direction="row" gap="2" mt="2">
        <Button onClick={() => query1.refetch()} loading={query1.isFetching}>
          QUERY1
        </Button>
        <Button onClick={() => query2.refetch()} loading={query2.isFetching}>
          QUERY2
        </Button>
        <Button onClick={() => query3.refetch()} loading={query3.isFetching}>
          QUERY3
        </Button>
      </Flex>
    </Card>
  );
}
