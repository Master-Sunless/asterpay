import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold">Subscriptions</h1>
            </div>
            <Button onClick={() => navigate("/subscriptions/new")}>
              <Plus className="mr-2 h-4 w-4" /> New Subscription
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {mockSubscriptions.map((sub) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/subscriptions/${sub.id}/upgrade`)}
                          >
                            Upgrade
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(sub.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Subscriptions;