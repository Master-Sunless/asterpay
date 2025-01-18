import { WalletConnector } from "@/components/molecules/WalletConnector";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold">DePay</span>
        </div>
        <WalletConnector />
      </div>
    </header>
  );
};