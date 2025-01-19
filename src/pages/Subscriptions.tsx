import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { SubscriptionList } from "@/components/molecules/SubscriptionList";

// TODO: Integrate with Web3 - Fetch active subscriptions from blockchain
const mockSubscriptions = [
  {
    id: 1,
    name: "Netflix Premium",
    amount: "0.01 ETH",
    status: "Active",
    nextPayment: "2024-03-15",
    lastPayment: "2024-02-15",
  },
  {
    id: 2,
    name: "Spotify Family",
    amount: "0.005 ETH",
    status: "Active",
    nextPayment: "2024-03-20",
    lastPayment: "2024-02-20",
  },
  {
    id: 3,
    name: "Xbox Game Pass",
    amount: "0.012 ETH",
    status: "Active",
    nextPayment: "2024-03-25",
    lastPayment: "2024-02-25",
  },
  {
    id: 4,
    name: "HBO Max",
    amount: "0.006 ETH",
    status: "Active",
    nextPayment: "2024-03-18",
    lastPayment: "2024-02-18",
  },
  {
    id: 5,
    name: "Disney+",
    amount: "0.008 ETH",
    hasPendingPayment: true,
    status: "Pending",
    nextPayment: "2024-03-10",
    lastPayment: "2024-02-10",
    pendingReason: "Insufficient funds",
  },
  {
    id: 6,
    name: "Apple TV+",
    amount: "0.007 ETH",
    hasPendingPayment: true,
    status: "Pending",
    nextPayment: "2024-03-12",
    lastPayment: "2024-02-12",
    pendingReason: "Transaction failed: Error code 1234",
  },
  {
    id: 7,
    name: "Amazon Prime",
    amount: "0.009 ETH",
    hasPendingPayment: true,
    status: "Pending",
    nextPayment: "2024-03-08",
    lastPayment: "2024-02-08",
    pendingReason: "Network congestion: Error code 5678",
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();

  // TODO: Integrate with Web3 - Handle subscription cancellation
  const handleCancel = (id: number) => {
    console.log("Cancel subscription:", id);
  };

  // TODO: Integrate with Web3 - Handle subscription upgrade
  const handleUpgrade = (id: number) => {
    navigate(`/subscriptions/${id}/upgrade`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
            <Button onClick={() => navigate("/subscriptions/new")}>
              <Plus className="mr-2 h-4 w-4" /> New Subscription
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionList
                subscriptions={mockSubscriptions}
                onCancel={handleCancel}
                onUpgrade={handleUpgrade}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Subscriptions;