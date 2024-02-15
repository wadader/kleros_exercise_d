import { Button, Stack } from "@mantine/core";
import useCreatorSocket from "../socket/useCreatorSocket";

function SolveGameSection() {
  useCreatorSocket();
  return (
    <Stack>
      <Button>Solve</Button>

      <Button>Claim Timeout</Button>
    </Stack>
  );
}

export default SolveGameSection;
