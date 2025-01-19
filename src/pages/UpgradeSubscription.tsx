import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { PlanCard } from "@/components/molecules/PlanCard";
import { useState } from "react";

const upgradePlans = {
  netflix: [
    {
      id: 1,
      name: "Netflix Standard",
      price: "0.008 ETH",
      priceUSD: "$24",
      duration: "Monthly",
      features: ["Full HD Streaming", "2 Devices", "No Ads"],
    },
    {
      id: 2,
      name: "Netflix Premium",
      price: "0.01 ETH",
      priceUSD: "$30",
      duration: "Monthly",
      features: ["4K Streaming", "4 Devices", "No Ads", "HDR Content"],
    },
  ],
  spotify: [
    {
      id: 3,
      name: "Spotify Duo",
      price: "0.005 ETH",
      priceUSD: "$15",
      duration: "Monthly",
      features: ["2 Premium Accounts", "Duo Mix", "Offline Mode"],
    },
    {
      id: 4,
      name: "Spotify Family",
      price: "0.008 ETH",
      priceUSD: "$24",
      duration: "Monthly",
      features: ["6 Premium Accounts", "Family Mix", "Explicit Content Filter"],
    },
  ],
};

const UpgradeSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // TODO: Integrate with Web3 - Get current subscription details
  const currentProvider = "netflix"; // This would come from the subscription details

  const availablePlans = upgradePlans[currentProvider as keyof typeof upgradePlans] || [];

  const handleUpgrade = async () => {
    // TODO: Integrate with Web3 - Handle subscription upgrade
    console.log("Upgrading subscription:", id, "to plan:", selectedPlan);
    navigate("/subscriptions");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Upgrade Subscription</h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availablePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  {...plan}
                  isSelected={selectedPlan === plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleUpgrade}
              disabled={!selectedPlan}
            >
              Confirm Upgrade
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpgradeSubscription;