import { Anchor, Center, Stack } from "@mantine/core";
import RpsImage from "../../assets/images/rpsImg.svg?react";
function RpslzImage() {
  return (
    <Center>
      <Stack>
        <RpsImage />
        <Center>
          <Anchor
            href="https://openclipart.org/detail/325665/rock-paper-scissors-lizard-spock"
            target="_blank"
          >
            Creative Commons
          </Anchor>
        </Center>
      </Stack>
    </Center>
  );
}

export default RpslzImage;
