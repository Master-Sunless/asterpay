import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  priceUSD: string;
  duration: string;
  features: string[];
  isSelected: boolean;
  onClick: () => void;
}

export const PlanCard = ({
  name,
  price,
  priceUSD,
  duration,
  features,
  isSelected,
  onClick,
}: PlanCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : "hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">{price}</p>
          <p className="text-sm text-gray-500">
            {priceUSD} / {duration}
          </p>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};