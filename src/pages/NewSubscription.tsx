import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/molecules/PlanCard";
import { CustomPlanForm } from "@/components/molecules/CustomPlanForm";

const plans = [
  {
    id: 1,
    name: "Netflix Basic",
    price: "0.005 ETH",
    priceUSD: "$15",
    duration: "Monthly",
    features: ["HD Streaming", "1 Device", "No Ads"],
  },
  {
    id: 2,
    name: "Netflix Standard",
    price: "0.008 ETH",
    priceUSD: "$24",
    duration: "Monthly",
    features: ["Full HD Streaming", "2 Devices", "No Ads"],
  },
  {
    id: 3,
    name: "Netflix Premium",
    price: "0.01 ETH",
    priceUSD: "$30",
    duration: "Monthly",
    features: ["4K Streaming", "4 Devices", "No Ads"],
  },
  {
    id: 4,
    name: "Spotify Premium",
    price: "0.003 ETH",
    priceUSD: "$10",
    duration: "Monthly",
    features: ["Ad-free Music", "Offline Mode", "High Quality Audio"],
  },
  {
    id: 5,
    name: "Xbox Game Pass",
    price: "0.012 ETH",
    priceUSD: "$35",
    duration: "Monthly",
    features: ["100+ Games", "EA Play Included", "Cloud Gaming"],
  },
  {
    id: 6,
    name: "HBO Max",
    price: "0.006 ETH",
    priceUSD: "$18",
    duration: "Monthly",
    features: ["4K Streaming", "3 Devices", "Offline Downloads"],
  },
];

const NewSubscription = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customPlan, setCustomPlan] = useState<any>(null);

  // TODO: Integrate with Web3 - Handle subscription creation
  const handleSubscribe = async () => {
    console.log(
      "Creating subscription for plan:",
      isCustom ? customPlan : selectedPlan
    );
    setStep(3);
  };

  const handleCustomPlanSubmit = (plan: any) => {
    setCustomPlan(plan);
    setStep(2);
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
            <h1 className="text-3xl font-bold text-foreground">New Subscription</h1>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {step === 1 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Choose a Plan</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsCustom(!isCustom)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isCustom ? "Select Existing Plan" : "Create Custom Plan"}
                  </Button>
                </div>

                {isCustom ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Custom Subscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CustomPlanForm onSubmit={handleCustomPlanSubmit} />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        {...plan}
                        isSelected={selectedPlan === plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Plan</span>
                      <span>
                        {isCustom
                          ? customPlan.name
                          : plans.find((p) => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>
                        {isCustom
                          ? `${customPlan.price} ETH`
                          : plans.find((p) => p.id === selectedPlan)?.price}
                      </span>
                    </div>
                    <Button onClick={handleSubscribe} className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Confirm Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Subscription Created!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your subscription has been successfully created.
                  </p>
                  <Button onClick={() => navigate("/subscriptions")}>
                    View Subscriptions
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && step < 3 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step === 1 && !isCustom && selectedPlan && (
                <Button onClick={() => setStep(2)} className="ml-auto">
                  Continue
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewSubscription;