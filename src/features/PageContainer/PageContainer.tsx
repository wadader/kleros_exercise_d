import {
  AppShell,
  Burger,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Outlet } from "react-router-dom";
import useWalletInteractionStore from "../../store/walletInteraction";
import InternalNavLink from "../InternalNavLink/InternalNavLink";
import { InternalLinksArr } from "./InternalLinks/InternalLinks";
import { SELECTED_CHAIN } from "../../config/config";

function PageContainer() {
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
        {InternalLinksArr.map((link) => (
          <InternalNavLink to={link.to} label={link.label} key={link.label} />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container fluid pos="relative">
          <LoadingOverlay visible={isInteractingWithWallet} />
          <Center my={20}>
            <Stack>
              <Center>
                <ConnectButton />
              </Center>
              <Group>
                <Text>Chain For Application: {SELECTED_CHAIN.name}</Text>
                <Text>Chain Id: {SELECTED_CHAIN.id}</Text>
              </Group>
            </Stack>
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
