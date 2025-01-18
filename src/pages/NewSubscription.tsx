import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: 1,
    name: "Netflix Basic",
    price: "0.005 ETH",
    features: ["HD Streaming", "1 Device", "No Ads"],
  },
  {
    id: 2,
    name: "Netflix Standard",
    price: "0.008 ETH",
    features: ["Full HD Streaming", "2 Devices", "No Ads"],
  },
  {
    id: 3,
    name: "Netflix Premium",
    price: "0.01 ETH",
    features: ["4K Streaming", "4 Devices", "No Ads"],
  },
];

const NewSubscription = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // TODO: Integrate with Web3 - Handle subscription creation
  const handleSubscribe = async () => {
    console.log("Creating subscription for plan:", selectedPlan);
    setStep(3);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Subscription</h1>

      <div className="space-y-4">
        {step === 1 && (
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
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
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

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span>{plans.find((p) => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span>{plans.find((p) => p.id === selectedPlan)?.price}</span>
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
              <h2 className="text-2xl font-bold mb-2">Subscription Created!</h2>
              <p className="text-gray-600">
                Your subscription has been successfully created.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && step < 3 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step === 1 && selectedPlan && (
            <Button onClick={() => setStep(2)} className="ml-auto">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewSubscription;