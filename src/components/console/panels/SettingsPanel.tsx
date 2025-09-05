import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure BreBot system preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle>Paths Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Vault Path</Label>
              <Input placeholder="/path/to/vault" />
            </div>
            <div className="space-y-2">
              <Label>Inbox Path</Label>
              <Input placeholder="/path/to/inbox" />
            </div>
            <div className="space-y-2">
              <Label>Export Path</Label>
              <Input placeholder="/path/to/exports" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input placeholder="llama2:latest" />
            </div>
            <div className="space-y-2">
              <Label>Rate Limit (requests/minute)</Label>
              <Input type="number" placeholder="60" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Safety Mode</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Button className="w-fit">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}