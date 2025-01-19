import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const serviceProviders = [
  { name: "Netflix", plans: ["Basic", "Standard", "Premium"] },
  { name: "Spotify", plans: ["Individual", "Duo", "Family"] },
  { name: "Amazon Prime", plans: ["Monthly", "Annual"] },
  { name: "Disney+", plans: ["Basic", "Premium"] },
  { name: "HBO Max", plans: ["With Ads", "Ad-Free"] },
  { name: "YouTube Premium", plans: ["Individual", "Family"] },
  { name: "Apple TV+", plans: ["Monthly", "Annual"] },
  { name: "Hulu", plans: ["Basic", "Premium", "Live TV"] },
  { name: "PlayStation Plus", plans: ["Essential", "Extra", "Premium"] },
  { name: "Xbox Game Pass", plans: ["Console", "PC", "Ultimate"] },
];

const planPrices: Record<string, Record<string, { eth: string; usd: string }>> = {
  Netflix: {
    Basic: { eth: "0.005", usd: "15" },
    Standard: { eth: "0.008", usd: "24" },
    Premium: { eth: "0.01", usd: "30" },
  },
  Spotify: {
    Individual: { eth: "0.003", usd: "9" },
    Duo: { eth: "0.005", usd: "15" },
    Family: { eth: "0.008", usd: "24" },
  },
  "HBO Max": {
    "With Ads": { eth: "0.004", usd: "12" },
    "Ad-Free": { eth: "0.007", usd: "21" },
  },
  "Xbox Game Pass": {
    Console: { eth: "0.005", usd: "15" },
    PC: { eth: "0.005", usd: "15" },
    Ultimate: { eth: "0.01", usd: "30" },
  },
};

interface CustomPlanFormProps {
  onSubmit: (plan: {
    name: string;
    price: string;
    provider: string;
    selectedPlan: string;
  }) => void;
}

export const CustomPlanForm = ({ onSubmit }: CustomPlanFormProps) => {
  const [provider, setProvider] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [customProvider, setCustomProvider] = useState("");
  const [price, setPrice] = useState("");
  const [isCustomProvider, setIsCustomProvider] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (isCustomProvider) {
      toast({
        title: "Custom Provider Request Submitted",
        description: "The Provider would be added within 12-24 business hours",
        duration: 5000,
      });
    }
    onSubmit({
      name: `${isCustomProvider ? customProvider : provider} ${selectedPlan}`,
      price,
      provider: isCustomProvider ? customProvider : provider,
      selectedPlan,
    });
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    if (!isCustomProvider && provider in planPrices) {
      const prices = planPrices[provider][plan];
      if (prices) {
        setPrice(prices.eth);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Service Provider</Label>
        <Select
          value={provider}
          onValueChange={(value) => {
            setProvider(value);
            setIsCustomProvider(value === "custom");
            setSelectedPlan("");
            setPrice("");
          }}
        >
          <SelectTrigger className="w-full bg-popover">
            <SelectValue placeholder="Select a service provider" />
          </SelectTrigger>
          <SelectContent className="bg-popover shadow-lg border-2">
            {serviceProviders.map((provider) => (
              <SelectItem key={provider.name} value={provider.name}>
                {provider.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Provider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCustomProvider && (
        <div>
          <Label>Custom Provider Name</Label>
          <Input
            value={customProvider}
            onChange={(e) => setCustomProvider(e.target.value)}
            placeholder="Enter provider name"
            className="bg-background"
          />
        </div>
      )}

      {(provider || isCustomProvider) && (
        <>
          <div>
            <Label>Plan</Label>
            {isCustomProvider ? (
              <Input
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                placeholder="Enter plan name"
                className="bg-background"
              />
            ) : (
              <Select value={selectedPlan} onValueChange={handlePlanSelect}>
                <SelectTrigger className="w-full bg-popover">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-popover shadow-lg border-2">
                  {serviceProviders
                    .find((p) => p.name === provider)
                    ?.plans.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {(isCustomProvider ||
            !planPrices[provider]?.[selectedPlan]) && (
            <div>
              <Label>Price (ETH)</Label>
              <Input
                type="number"
                step="0.001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.01"
                className="bg-background"
              />
              {price && (
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ ${(parseFloat(price) * 3000).toFixed(2)} USD
                </p>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedPlan || !price || (!provider && !customProvider)}
          >
            Create Custom Plan
          </Button>
        </>
      )}
    </div>
  );
};
