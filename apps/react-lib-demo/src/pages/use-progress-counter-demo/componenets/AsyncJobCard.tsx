import { useCountdown } from "../../../../../../packages/react-lib/src/hooks/useCountdown";
import { Card, Progress, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { AsyncJob } from "./AsyncJob";

export type AsyncJobCardProps = {
  job: AsyncJob;
  onComplete: () => void;
};

export const AsyncJobCard = ({ job, onComplete }: AsyncJobCardProps) => {
  const { remainingTime, start, stop } = useCountdown({
    duration: job.estimatedTime,
    options: {
      reportInterval: 100,
      computeFrame: 60,
    },
    onComplete,
  });

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  return (
    <Card>
      <Text size="2">{job.id}</Text>
      <Progress value={remainingTime} max={job.estimatedTime} size="3" />
    </Card>
  );
};
