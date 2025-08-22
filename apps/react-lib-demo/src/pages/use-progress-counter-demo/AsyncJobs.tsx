import DemoHeader from "@/components/components/DemoHeader";
import { useProgressCounter } from "@heart-re-up/react-lib/hooks/useProgressCounter";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@radix-ui/themes";
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

  const { count, progress, increment, decrement, reset } = useProgressCounter();

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
      <DemoHeader
        title="Progress Counter Async Jobs"
        description="This is a demo of the Progress Counter Async Jobs component."
      />
      <Box py="4" mt="2" width="100%" translate="yes">
        <Heading size={"3"} mt="2">
          Count: {count}
        </Heading>
        <Heading size={"3"}>Progress: {progress ? "true" : "false"}</Heading>
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
