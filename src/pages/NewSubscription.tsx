import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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
];

const NewSubscription = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [customPlan, setCustomPlan] = useState({
    name: "",
    price: "",
    duration: "Monthly",
    features: [""],
  });
  const [isCustom, setIsCustom] = useState(false);

  // TODO: Integrate with Web3 - Handle subscription creation
  const handleSubscribe = async () => {
    console.log("Creating subscription for plan:", selectedPlan);
    setStep(3);
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
            <h1 className="text-3xl font-bold">New Subscription</h1>
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
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Subscription Name</Label>
                        <Input
                          id="name"
                          value={customPlan.name}
                          onChange={(e) =>
                            setCustomPlan({ ...customPlan, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (ETH)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.001"
                          value={customPlan.price}
                          onChange={(e) =>
                            setCustomPlan({ ...customPlan, price: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setStep(2)}
                        disabled={!customPlan.name || !customPlan.price}
                      >
                        Continue with Custom Plan
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? "ring-2 ring-primary"
                            : "hover:shadow-lg"
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <p className="text-2xl font-bold">{plan.price}</p>
                            <p className="text-sm text-gray-500">
                              {plan.priceUSD} / {plan.duration}
                            </p>
                          </div>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
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
              {step === 1 && (selectedPlan || isCustom) && (
                <Button
                  onClick={() => setStep(2)}
                  className="ml-auto"
                  disabled={isCustom && (!customPlan.name || !customPlan.price)}
                >
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