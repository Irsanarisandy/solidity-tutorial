export function isEthValid(ethereum: Record<string, any>) {
  return (
    ethereum != null &&
    Object.keys(ethereum).length > 0 &&
    typeof ethereum.request === "function"
  );
}
