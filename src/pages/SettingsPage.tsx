import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Wifi, WifiOff, Database, Zap } from "lucide-react";

interface HealthStatus {
  dbProvider: string;
  lanceConnected: boolean;
  postgresConnected: boolean;
  n8nConnected: boolean;
}

export function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    try {
      setLoading(true);
      const healthData = await apiClient.getHealth();
      setHealth(healthData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load health status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pingN8n = async () => {
    const n8nBaseUrl = import.meta.env.VITE_N8N_BASE_URL;
    const n8nPingPath = import.meta.env.VITE_N8N_PING_PATH;
    
    if (!n8nBaseUrl || !n8nPingPath) {
      toast({
        title: "Error",
        description: "N8N configuration not set up",
        variant: "destructive",
      });
      return;
    }

    try {
      setPinging(true);
      const response = await fetch(`${n8nBaseUrl}${n8nPingPath}`);
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "N8N is responding",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ping N8N",
        variant: "destructive",
      });
    } finally {
      setPinging(false);
    }
  };

  const getConnectionBadge = (connected: boolean) => {
    return connected ? (
      <Badge variant="default" className="bg-green-500">
        <Wifi className="h-3 w-3 mr-1" />
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive">
        <WifiOff className="h-3 w-3 mr-1" />
        Disconnected
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">System configuration and health monitoring</p>
      </div>

      {/* Data Provider Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Provider Health
          </CardTitle>
          <CardDescription>
            Status of backend data connections and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {health ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Database Provider</span>
                  </div>
                  <Badge variant="outline">{health.dbProvider}</Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Lance DB</span>
                  </div>
                  {getConnectionBadge(health.lanceConnected)}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">PostgreSQL</span>
                  </div>
                  {getConnectionBadge(health.postgresConnected)}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">N8N Workflow</span>
                  </div>
                  {getConnectionBadge(health.n8nConnected)}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={loadHealth}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button 
                  variant="outline" 
                  onClick={pingN8n}
                  disabled={pinging}
                >
                  {pinging ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Ping N8N
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load health status</p>
              <Button variant="outline" className="mt-4" onClick={loadHealth}>
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Current environment configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">API Base URL</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {import.meta.env.VITE_API_BASE || '/api'}
              </code>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">N8N Base URL</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {import.meta.env.VITE_N8N_BASE_URL || 'Not configured'}
              </code>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">N8N Ping Path</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {import.meta.env.VITE_N8N_PING_PATH || 'Not configured'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}