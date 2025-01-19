import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface Subscription {
  id: number;
  name: string;
  amount: string;
  status: string;
  nextPayment: string;
}

interface ActiveSubscriptionListProps {
  subscriptions: Subscription[];
  onCancel: (id: number) => void;
  onUpgrade: (id: number) => void;
}

export const ActiveSubscriptionList = ({
  subscriptions,
  onCancel,
  onUpgrade,
}: ActiveSubscriptionListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Payment</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell>{sub.name}</TableCell>
            <TableCell>{sub.amount}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                {sub.status}
              </span>
            </TableCell>
            <TableCell>{sub.nextPayment}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">
                    Manage <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-white dark:bg-gray-800">
                  <DropdownMenuItem onClick={() => onUpgrade(sub.id)}>
                    Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onCancel(sub.id)}
                  >
                    Cancel Subscription
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};