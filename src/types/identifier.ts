import { isAddress } from "ethers/lib/utils";

type EthHash = `0x${string & { length: 64 }}`;
type EthAddress = `0x${string & { length: 40 }}`;

function isEthHash(value: string): value is EthHash {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function isEthAddress(value: string): value is EthAddress {
  return isAddress(value);
}

export { isEthAddress, isEthHash as isHash };

export type { EthHash, EthAddress };
