import { Button, Center, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import useGameStore from "../../../store/game";
import { isEthAddress } from "../../../types/identifier";

function GameItem({ contractAddress }: GameItemProps) {
  const navigate = useNavigate();
  return (
    <Center>
      <Button
        onClick={() => {
          selectContract(contractAddress, navigate);
        }}
      >
        <Text>{contractAddress}</Text>
      </Button>
    </Center>
  );
}
interface GameItemProps {
  contractAddress: string;
}

function selectContract(selectedContract: string, navigate: NavigateFunction) {
  if (!isEthAddress(selectedContract)) return;
  useGameStore.getState().setters.selectedContract(selectedContract);
  navigate("/join");
}

export default GameItem;
