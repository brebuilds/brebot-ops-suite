import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Bot, Zap, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Connection {
  id: string;
  name: string;
  type: string;
  url: string;
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  model?: string;
}

export function ConnectionsTab() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "ollama",
      name: "Ollama",
      type: "LLM Provider",
      url: "http://localhost:11434",
      status: "disconnected",
      enabled: false,
      model: "llama3.2"
    }
  ]);

  const [ollamaConfig, setOllamaConfig] = useState({
    url: "http://localhost:11434",
    model: "llama3.2",
    enabled: false
  });

  const testOllamaConnection = async () => {
    try {
      const response = await fetch(`${ollamaConfig.url}/api/version`);
      if (response.ok) {
        setConnections(prev => prev.map(conn => 
          conn.id === "ollama" 
            ? { ...conn, status: "connected" as const, url: ollamaConfig.url, model: ollamaConfig.model }
            : conn
        ));
        toast({
          title: "Connection successful",
          description: "Successfully connected to Ollama"
        });
      } else {
        throw new Error("Failed to connect");
      }
    } catch (error) {
      setConnections(prev => prev.map(conn => 
        conn.id === "ollama" 
          ? { ...conn, status: "error" as const }
          : conn
      ));
      toast({
        title: "Connection failed",
        description: "Could not connect to Ollama. Make sure it's running.",
        variant: "destructive"
      });
    }
  };

  const toggleConnection = (id: string, enabled: boolean) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, enabled } : conn
    ));
    
    if (id === "ollama") {
      setOllamaConfig(prev => ({ ...prev, enabled }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "default";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Connections</h2>
        <p className="text-muted-foreground">Manage external service connections for BreBot</p>
      </div>

      {/* Ollama Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Ollama Integration
                <Badge variant={getStatusColor(connections.find(c => c.id === "ollama")?.status || "disconnected")}>
                  {connections.find(c => c.id === "ollama")?.status || "disconnected"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Connect BreBot to your local Ollama instance for AI capabilities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ollama-url">Ollama URL</Label>
              <Input
                id="ollama-url"
                value={ollamaConfig.url}
                onChange={(e) => setOllamaConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="http://localhost:11434"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ollama-model">Model</Label>
              <Input
                id="ollama-model"
                value={ollamaConfig.model}
                onChange={(e) => setOllamaConfig(prev => ({ ...prev, model: e.target.value }))}
                placeholder="llama3.2"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="ollama-enabled"
                checked={ollamaConfig.enabled}
                onCheckedChange={(enabled) => toggleConnection("ollama", enabled)}
              />
              <Label htmlFor="ollama-enabled">Enable Ollama Integration</Label>
            </div>
            <Button onClick={testOllamaConnection} variant="outline">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Globe className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle>Active Connections</CardTitle>
              <CardDescription>Overview of all configured connections</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(connection.status)}
                  <div>
                    <div className="font-medium text-foreground">{connection.name}</div>
                    <div className="text-sm text-muted-foreground">{connection.type}</div>
                    {connection.model && (
                      <div className="text-xs text-muted-foreground">Model: {connection.model}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusColor(connection.status)}>
                    {connection.status}
                  </Badge>
                  <Switch
                    checked={connection.enabled}
                    onCheckedChange={(enabled) => toggleConnection(connection.id, enabled)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Future Connections */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription>Additional connection types will be added here</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <div>• OpenAI API Integration</div>
            <div>• Anthropic Claude Integration</div>
            <div>• Custom API Endpoints</div>
            <div>• Webhook Connections</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}