import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Subscription {
  id: number;
  name: string;
  amount: string;
  status: string;
  nextPayment: string;
  lastPayment: string;
  hasPendingPayment?: boolean;
  pendingReason?: string;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onCancel: (id: number) => void;
  onUpgrade: (id: number) => void;
}

export const SubscriptionList = ({
  subscriptions,
  onCancel,
  onUpgrade,
}: SubscriptionListProps) => {
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelClick = (id: number) => {
    setSelectedSubscription(id);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (selectedSubscription) {
      onCancel(selectedSubscription);
      setShowCancelDialog(false);
    }
  };

  const pendingSubscriptions = subscriptions.filter(sub => sub.hasPendingPayment);
  const activeSubscriptions = subscriptions.filter(sub => !sub.hasPendingPayment);

  return (
    <>
      {pendingSubscriptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-warning">Pending Payments</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSubscriptions.map((sub) => (
                <TableRow key={sub.id} className="bg-warning/10">
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning/20 text-warning">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell>{sub.pendingReason}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-warning hover:text-warning"
                      onClick={() => onUpgrade(sub.id)}
                    >
                      Resolve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
          {activeSubscriptions.map((sub) => (
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
                <div className="flex gap-2">
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
                        onClick={() => handleCancelClick(sub.id)}
                      >
                        Cancel Subscription
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this subscription? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};