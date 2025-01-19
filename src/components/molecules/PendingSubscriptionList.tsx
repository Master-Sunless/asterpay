import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/atoms/Button";

interface PendingSubscription {
  id: number;
  name: string;
  amount: string;
  status: string;
  pendingReason: string;
}

interface PendingSubscriptionListProps {
  subscriptions: PendingSubscription[];
  onResolve: (id: number) => void;
}

export const PendingSubscriptionList = ({
  subscriptions,
  onResolve,
}: PendingSubscriptionListProps) => {
  return (
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
          {subscriptions.map((sub) => (
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
                  onClick={() => onResolve(sub.id)}
                >
                  Resolve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};