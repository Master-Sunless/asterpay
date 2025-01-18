import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  // TODO: Integrate with Web3 - Save settings to blockchain or local storage
  const handleSave = () => {
    console.log("Saving settings");
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
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          <div className="space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-notifications">
                    Payment Due Notifications
                  </Label>
                  <Switch id="payment-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="transaction-notifications">
                    Transaction Updates
                  </Label>
                  <Switch id="transaction-notifications" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gas-limit">Default Gas Limit</Label>
                  <Input id="gas-limit" type="number" defaultValue="21000" />
                </div>
                <div>
                  <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                  <Input id="slippage" type="number" defaultValue="0.5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" />
                </div>
                <div>
                  <Label htmlFor="email">Email for Notifications</Label>
                  <Input id="email" type="email" />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;