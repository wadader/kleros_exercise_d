import {
  AppShell,
  Burger,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import useWalletInteractionStore from "../../store/walletInteraction";

function PageContainer({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const isInteractingWithWallet = useWalletInteractionStore(
    (state) => state.isInteractingWithWallet
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container fluid pos="relative">
          <LoadingOverlay visible={isInteractingWithWallet} />
          <Center>
            <ConnectButton />
          </Center>
          <Container>
            <Outlet />
          </Container>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default PageContainer;
