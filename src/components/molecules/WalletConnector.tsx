import { Button } from "@/components/atoms/Button";
import { Wallet } from "lucide-react";
import { useState } from "react";

export const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulated connection delay
    setTimeout(() => {
      setIsConnected(true);
      setAddress("0x1234...5678");
      setIsConnecting(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 rounded-md bg-green-100 text-green-800">
          {address}
        </div>
        <Button
          variant="ghost"
          onClick={handleDisconnect}
          className="text-gray-600"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      isLoading={isConnecting}
      leftIcon={<Wallet className="h-4 w-4" />}
    >
      Connect Wallet
    </Button>
  );
};