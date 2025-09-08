import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Bot, Zap, CheckCircle, AlertCircle, Settings, Plus, Edit, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Connection {
  id: string;
  name: string;
  type: "ollama" | "openai" | "anthropic" | "custom";
  url: string;
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  model?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  description?: string;
}

const CONNECTION_TYPES = [
  { value: "ollama", label: "Ollama", requiresApiKey: false },
  { value: "openai", label: "OpenAI", requiresApiKey: true },
  { value: "anthropic", label: "Anthropic", requiresApiKey: true },
  { value: "custom", label: "Custom API", requiresApiKey: false }
];

export function ConnectionsTab() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "ollama-default",
      name: "Ollama Local",
      type: "ollama",
      url: "http://localhost:11434",
      status: "disconnected",
      enabled: false,
      model: "llama3.2",
      description: "Local Ollama instance"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [newConnection, setNewConnection] = useState<Partial<Connection>>({
    name: "",
    type: "ollama",
    url: "",
    model: "",
    apiKey: "",
    headers: {},
    description: ""
  });

  const testConnection = async (connection: Connection) => {
    try {
      let testUrl = connection.url;
      let testOptions: RequestInit = {};

      switch (connection.type) {
        case "ollama":
          testUrl = `${connection.url}/api/version`;
          break;
        case "openai":
          testUrl = "https://api.openai.com/v1/models";
          testOptions = {
            headers: {
              "Authorization": `Bearer ${connection.apiKey}`,
              "Content-Type": "application/json"
            }
          };
          break;
        case "anthropic":
          testUrl = "https://api.anthropic.com/v1/messages";
          testOptions = {
            method: "POST",
            headers: {
              "x-api-key": connection.apiKey || "",
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
              model: connection.model || "claude-3-sonnet-20240229",
              max_tokens: 1,
              messages: [{ role: "user", content: "test" }]
            })
          };
          break;
        case "custom":
          testOptions = {
            headers: connection.headers || {}
          };
          break;
      }

      const response = await fetch(testUrl, testOptions);
      
      if (response.ok || response.status === 400) { // 400 might be expected for some test calls
        setConnections(prev => prev.map(conn => 
          conn.id === connection.id 
            ? { ...conn, status: "connected" as const }
            : conn
        ));
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${connection.name}`
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setConnections(prev => prev.map(conn => 
        conn.id === connection.id 
          ? { ...conn, status: "error" as const }
          : conn
      ));
      toast({
        title: "Connection failed",
        description: `Could not connect to ${connection.name}. ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const toggleConnection = (id: string, enabled: boolean) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, enabled } : conn
    ));
  };

  const addConnection = () => {
    if (!newConnection.name || !newConnection.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required",
        variant: "destructive"
      });
      return;
    }

    const connection: Connection = {
      id: `${newConnection.type}-${Date.now()}`,
      name: newConnection.name,
      type: newConnection.type as Connection["type"],
      url: newConnection.url,
      status: "disconnected",
      enabled: false,
      model: newConnection.model,
      apiKey: newConnection.apiKey,
      headers: newConnection.headers,
      description: newConnection.description
    };

    setConnections(prev => [...prev, connection]);
    setNewConnection({
      name: "",
      type: "ollama",
      url: "",
      model: "",
      apiKey: "",
      headers: {},
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Connection added",
      description: `${connection.name} has been added successfully`
    });
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
    toast({
      title: "Connection deleted",
      description: "Connection has been removed"
    });
  };

  const startEditing = (connection: Connection) => {
    setEditingConnection(connection);
    setNewConnection(connection);
    setIsAddDialogOpen(true);
  };

  const saveEdit = () => {
    if (!editingConnection) return;
    
    setConnections(prev => prev.map(conn => 
      conn.id === editingConnection.id 
        ? { ...conn, ...newConnection }
        : conn
    ));
    
    setEditingConnection(null);
    setNewConnection({
      name: "",
      type: "ollama",
      url: "",
      model: "",
      apiKey: "",
      headers: {},
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Connection updated",
      description: "Connection has been updated successfully"
    });
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ollama":
        return <Bot className="h-4 w-4" />;
      case "openai":
      case "anthropic":
        return <Zap className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const selectedConnectionType = CONNECTION_TYPES.find(ct => ct.value === newConnection.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Connections</h2>
          <p className="text-muted-foreground">Manage external service connections for BreBot</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingConnection ? "Edit Connection" : "Add New Connection"}
              </DialogTitle>
              <DialogDescription>
                Configure a new API connection for BreBot to use
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connection-name">Connection Name</Label>
                  <Input
                    id="connection-name"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My API Connection"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connection-type">Type</Label>
                  <Select 
                    value={newConnection.type} 
                    onValueChange={(value) => setNewConnection(prev => ({ ...prev, type: value as Connection["type"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONNECTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connection-url">URL</Label>
                <Input
                  id="connection-url"
                  value={newConnection.url}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={
                    newConnection.type === "ollama" 
                      ? "http://localhost:11434"
                      : newConnection.type === "openai"
                      ? "https://api.openai.com/v1"
                      : "https://api.example.com"
                  }
                />
              </div>

              {selectedConnectionType?.requiresApiKey && (
                <div className="space-y-2">
                  <Label htmlFor="connection-apikey">API Key</Label>
                  <Input
                    id="connection-apikey"
                    type="password"
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="connection-model">Model (Optional)</Label>
                <Input
                  id="connection-model"
                  value={newConnection.model}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, model: e.target.value }))}
                  placeholder={
                    newConnection.type === "ollama" 
                      ? "llama3.2"
                      : newConnection.type === "openai"
                      ? "gpt-4"
                      : "model-name"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="connection-description">Description (Optional)</Label>
                <Textarea
                  id="connection-description"
                  value={newConnection.description}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this connection"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingConnection(null);
                  setNewConnection({
                    name: "",
                    type: "ollama",
                    url: "",
                    model: "",
                    apiKey: "",
                    headers: {},
                    description: ""
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingConnection ? saveEdit : addConnection}>
                {editingConnection ? "Update" : "Add"} Connection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Connections */}
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
            {connections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No connections configured yet</p>
                <p className="text-sm">Add your first connection to get started</p>
              </div>
            ) : (
              connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(connection.status)}
                    <div className="flex items-center gap-2">
                      {getTypeIcon(connection.type)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{connection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {CONNECTION_TYPES.find(ct => ct.value === connection.type)?.label} • {connection.url}
                      </div>
                      {connection.model && (
                        <div className="text-xs text-muted-foreground">Model: {connection.model}</div>
                      )}
                      {connection.description && (
                        <div className="text-xs text-muted-foreground">{connection.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(connection.status)}>
                      {connection.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(connection)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(connection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConnection(connection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={connection.enabled}
                      onCheckedChange={(enabled) => toggleConnection(connection.id, enabled)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Templates */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Key className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-muted-foreground">Supported Connection Types</CardTitle>
              <CardDescription>Add connections for these popular AI services</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <strong>Ollama</strong> - Local AI models
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <strong>OpenAI</strong> - GPT models via API
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <strong>Anthropic</strong> - Claude models
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <strong>Custom API</strong> - Any REST API
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}