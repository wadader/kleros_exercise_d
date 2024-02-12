import { isAddress } from "ethers/lib/utils";

type Hash = `0x${string & { length: 64 }}`;
type EthAddress = `0x${string & { length: 40 }}`;

function isHash(value: string): value is Hash {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function isEthAddress(value: string): value is EthAddress {
  return isAddress(value);
}

export { isEthAddress, isHash };

export type { Hash, EthAddress };
