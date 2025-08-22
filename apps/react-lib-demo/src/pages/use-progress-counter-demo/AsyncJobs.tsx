import { useProgressCounterAsyncContext } from "@heart-re-up/react-lib/contexts/progress-counter-async";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { animated, useTransition } from "@react-spring/web";
import { random } from "lodash-es";
import { useState } from "react";
import { AsyncJob } from "./componenets/AsyncJob";
import { AsyncJobCard } from "./componenets/AsyncJobCard";

const createJob = () => {
  return {
    id: random(1, 1000000).toString(),
    estimatedTime: random(1000, 5000),
  };
};

export default function AsyncJobs() {
  const [jobs, setJobs] = useState<AsyncJob[]>([]);

  const transitions = useTransition(jobs, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    config: { tension: 300, friction: 30 },
  });

  // useProgressCounter 훅을 직접 호출하여 진행 상태를 관리할 수 있습니다.
  const { count, progress, increment, decrement, reset } =
    useProgressCounterAsyncContext();

  const handleAddJob = () => {
    setJobs((prev) => [...prev, createJob()]);
    increment();
  };

  const handleCompleteJob = () => {
    decrement();
  };

  const handleClearJobs = () => {
    setJobs([]);
    reset();
  };

  return (
    <Card>
      <Box>
        <Text size={"3"} mt="2">
          <code>
            {`const { count = ${count}, progress = ${progress} } = useProgressCounterAsyncContext();`}
          </code>
        </Text>

        <Flex
          direction="row"
          align="center"
          justify="start"
          wrap={"wrap"}
          gap="4"
          mt="2"
        >
          <Button onClick={handleAddJob}>Add Job</Button>
          <Button onClick={handleClearJobs}>Reset</Button>
        </Flex>

        <Flex gap="4" direction="row" wrap={"wrap"} mt="2">
          {transitions((style, job) => (
            <animated.div style={style}>
              <AsyncJobCard
                key={job.id}
                job={job}
                onComplete={handleCompleteJob}
              />
            </animated.div>
          ))}
        </Flex>
      </Box>
    </Card>
  );
}
