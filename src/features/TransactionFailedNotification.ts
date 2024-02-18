import { showNotification } from "@mantine/notifications";

function showTxFailedNotification() {
  showNotification({
    title: "Transaction failed",
    message:
      "transaction failed. Please try raising gas limit manaually and try again",
    color: "red",
  });
}

export default showTxFailedNotification;
