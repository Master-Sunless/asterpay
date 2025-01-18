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
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <Button onClick={() => navigate("/subscriptions/new")}>
              <Plus className="mr-2 h-4 w-4" /> New Subscription
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
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