import { timeout } from "@/lib/utils";
import { useProgressCounterAsyncContext } from "@heart-re-up/react-lib/contexts/progress-counter-async";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { random } from "lodash-es";

const queryFn = async () => {
  await timeout(random(1000, 5000));
  return "query";
};

const useQueryDemo = (index: number) => {
  const { progressCounterWith } = useProgressCounterAsyncContext();
  return useQuery({
    queryKey: ["query", index],
    queryFn: () => progressCounterWith(queryFn),
  });
};

export default function ReactQueries() {
  const { count, progress } = useProgressCounterAsyncContext();
  const query1 = useQueryDemo(1);
  const query2 = useQueryDemo(2);
  const query3 = useQueryDemo(3);
  return (
    <Card>
      <Text size={"3"} mt="2">
        <code>
          {`const { count = ${count}, progress = ${progress} } = useProgressCounterAsyncContext();`}
        </code>
      </Text>
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
