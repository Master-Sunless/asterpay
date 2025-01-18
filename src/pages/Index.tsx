import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertCircle, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// TODO: Integrate with Web3 - Fetch active subscriptions count and total value
const mockStats = {
  activeSubscriptions: 5,
  totalValue: "0.05 ETH",
  pendingPayments: 2,
};

// TODO: Integrate with Web3 - Fetch recent transactions
const mockTransactions = [
  {
    id: 1,
    service: "Netflix Premium",
    amount: "0.01 ETH",
    date: "2024-02-15",
    status: "Completed",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    service: "Spotify Family",
    amount: "0.005 ETH",
    date: "2024-02-14",
    status: "Completed",
    txHash: "0x8765...4321",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button onClick={() => navigate("/subscriptions/new")}>
                <Plus className="mr-2 h-4 w-4" /> New Subscription
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Subscriptions
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockStats.activeSubscriptions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Value Locked
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalValue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Payments
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockStats.pendingPayments}
                  </div>
                </CardContent>
              </Card>
            </div>

            {mockStats.pendingPayments > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pending Payments</AlertTitle>
                <AlertDescription>
                  You have {mockStats.pendingPayments} pending payments that
                  require your attention.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.service}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.txHash}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;