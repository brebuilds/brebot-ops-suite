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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Bot, Zap, CheckCircle, AlertCircle, Settings, Plus, Edit, Trash2, Key, User, Shield, Users, Plug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Connection {
  id: string;
  name: string;
  type: "ollama" | "openai" | "anthropic" | "custom";
  url: string;
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  model?: string;
  authType: "none" | "api_key" | "bearer_token" | "oauth" | "basic_auth";
  apiKey?: string;
  bearerToken?: string;
  username?: string;
  password?: string;
  oauthConfig?: {
    clientId: string;
    clientSecret: string;
    scope?: string;
    authUrl?: string;
    tokenUrl?: string;
  };
  headers?: Record<string, string>;
  description?: string;
}

interface Account {
  id: string;
  name: string;
  service: string;
  username: string;
  password: string;
  email?: string;
  notes?: string;
  lastUsed?: Date;
}

const CONNECTION_TYPES = [
  { value: "ollama", label: "Ollama", defaultAuth: "none" as const },
  { value: "openai", label: "OpenAI", defaultAuth: "api_key" as const },
  { value: "anthropic", label: "Anthropic", defaultAuth: "api_key" as const },
  { value: "custom", label: "Custom API", defaultAuth: "api_key" as const }
];

const AUTH_TYPES = [
  { value: "none", label: "No Authentication" },
  { value: "api_key", label: "API Key" },
  { value: "bearer_token", label: "Bearer Token / Personal Access Token" },
  { value: "oauth", label: "OAuth 2.0" },
  { value: "basic_auth", label: "Username & Password" }
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
      authType: "none",
      description: "Local Ollama instance"
    }
  ]);

  const [accounts, setAccounts] = useState<Account[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newConnection, setNewConnection] = useState<Partial<Connection>>({
    name: "",
    type: "ollama",
    url: "",
    model: "",
    authType: "none",
    apiKey: "",
    bearerToken: "",
    username: "",
    password: "",
    oauthConfig: {
      clientId: "",
      clientSecret: "",
      scope: "",
      authUrl: "",
      tokenUrl: ""
    },
    headers: {},
    description: ""
  });

  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    service: "",
    username: "",
    password: "",
    email: "",
    notes: ""
  });

  const testConnection = async (connection: Connection) => {
    try {
      let testUrl = connection.url;
      let testOptions: RequestInit = {};

      // Set up authentication headers
      const authHeaders: Record<string, string> = {};
      
      switch (connection.authType) {
        case "api_key":
          if (connection.type === "openai") {
            authHeaders["Authorization"] = `Bearer ${connection.apiKey}`;
          } else if (connection.type === "anthropic") {
            authHeaders["x-api-key"] = connection.apiKey || "";
            authHeaders["anthropic-version"] = "2023-06-01";
          } else {
            authHeaders["X-API-Key"] = connection.apiKey || "";
          }
          break;
        case "bearer_token":
          authHeaders["Authorization"] = `Bearer ${connection.bearerToken}`;
          break;
        case "basic_auth":
          const credentials = btoa(`${connection.username}:${connection.password}`);
          authHeaders["Authorization"] = `Basic ${credentials}`;
          break;
      }

      switch (connection.type) {
        case "ollama":
          testUrl = `${connection.url}/api/version`;
          break;
        case "openai":
          testUrl = `${connection.url}/models`;
          break;
        case "anthropic":
          testUrl = "https://api.anthropic.com/v1/messages";
          testOptions = {
            method: "POST",
            body: JSON.stringify({
              model: connection.model || "claude-3-haiku-20240307",
              max_tokens: 1,
              messages: [{ role: "user", content: "test" }]
            })
          };
          break;
        case "custom":
          // For custom APIs, just try a GET request
          break;
      }

      testOptions.headers = {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(connection.headers || {})
      };

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

    const selectedType = CONNECTION_TYPES.find(t => t.value === newConnection.type);
    const connection: Connection = {
      id: `${newConnection.type}-${Date.now()}`,
      name: newConnection.name,
      type: newConnection.type as Connection["type"],
      url: newConnection.url,
      status: "disconnected",
      enabled: false,
      model: newConnection.model,
      authType: (newConnection.authType || selectedType?.defaultAuth || "none") as Connection["authType"],
      apiKey: newConnection.apiKey,
      bearerToken: newConnection.bearerToken,
      username: newConnection.username,
      password: newConnection.password,
      oauthConfig: newConnection.oauthConfig,
      headers: newConnection.headers,
      description: newConnection.description
    };

    setConnections(prev => [...prev, connection]);
    setNewConnection({
      name: "",
      type: "ollama",
      url: "",
      model: "",
      authType: "none",
      apiKey: "",
      bearerToken: "",
      username: "",
      password: "",
      oauthConfig: {
        clientId: "",
        clientSecret: "",
        scope: "",
        authUrl: "",
        tokenUrl: ""
      },
      headers: {},
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Connection added",
      description: `${connection.name} has been added successfully`
    });
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.service || !newAccount.username) {
      toast({
        title: "Validation Error",
        description: "Name, service, and username are required",
        variant: "destructive"
      });
      return;
    }

    const account: Account = {
      id: `account-${Date.now()}`,
      name: newAccount.name,
      service: newAccount.service,
      username: newAccount.username,
      password: newAccount.password || "",
      email: newAccount.email,
      notes: newAccount.notes,
      lastUsed: new Date()
    };

    setAccounts(prev => [...prev, account]);
    setNewAccount({
      name: "",
      service: "",
      username: "",
      password: "",
      email: "",
      notes: ""
    });
    setIsAccountDialogOpen(false);
    
    toast({
      title: "Account added",
      description: `${account.name} has been added successfully`
    });
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
    toast({
      title: "Connection deleted",
      description: "Connection has been removed"
    });
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    toast({
      title: "Account deleted", 
      description: "Account has been removed"
    });
  };

  const startEditing = (connection: Connection) => {
    setEditingConnection(connection);
    setNewConnection(connection);
    setIsAddDialogOpen(true);
  };

  const startEditingAccount = (account: Account) => {
    setEditingAccount(account);
    setNewAccount(account);
    setIsAccountDialogOpen(true);
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
      authType: "none",
      apiKey: "",
      bearerToken: "",
      username: "",
      password: "",
      oauthConfig: {
        clientId: "",
        clientSecret: "",
        scope: "",
        authUrl: "",
        tokenUrl: ""
      },
      headers: {},
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Connection updated",
      description: "Connection has been updated successfully"
    });
  };

  const saveAccountEdit = () => {
    if (!editingAccount) return;
    
    setAccounts(prev => prev.map(acc => 
      acc.id === editingAccount.id 
        ? { ...acc, ...newAccount, lastUsed: new Date() }
        : acc
    ));
    
    setEditingAccount(null);
    setNewAccount({
      name: "",
      service: "",
      username: "",
      password: "",
      email: "",
      notes: ""
    });
    setIsAccountDialogOpen(false);
    
    toast({
      title: "Account updated",
      description: "Account has been updated successfully"
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

  const resetConnectionForm = () => {
    setNewConnection({
      name: "",
      type: "ollama",
      url: "",
      model: "",
      authType: "none",
      apiKey: "",
      bearerToken: "",
      username: "",
      password: "",
      oauthConfig: {
        clientId: "",
        clientSecret: "",
        scope: "",
        authUrl: "",
        tokenUrl: ""
      },
      headers: {},
      description: ""
    });
  };

  const resetAccountForm = () => {
    setNewAccount({
      name: "",
      service: "",
      username: "",
      password: "",
      email: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Connections</h2>
          <p className="text-muted-foreground">Manage external service connections and accounts for BreBot</p>
        </div>
      </div>

      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            API Connections
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                        onValueChange={(value) => {
                          const selectedType = CONNECTION_TYPES.find(t => t.value === value);
                          setNewConnection(prev => ({ 
                            ...prev, 
                            type: value as Connection["type"],
                            authType: selectedType?.defaultAuth || "none"
                          }));
                        }}
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
                  
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="connection-auth">Authentication</Label>
                      <Select 
                        value={newConnection.authType} 
                        onValueChange={(value) => setNewConnection(prev => ({ ...prev, authType: value as Connection["authType"] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select auth type" />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTH_TYPES.map((auth) => (
                            <SelectItem key={auth.value} value={auth.value}>
                              {auth.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Authentication Fields */}
                  {newConnection.authType === "api_key" && (
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

                  {newConnection.authType === "bearer_token" && (
                    <div className="space-y-2">
                      <Label htmlFor="connection-token">Bearer Token / Personal Access Token</Label>
                      <Input
                        id="connection-token"
                        type="password"
                        value={newConnection.bearerToken}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, bearerToken: e.target.value }))}
                        placeholder="ghp_xxxxxxxxxxxx or token_xxxxxxxxxxxx"
                      />
                    </div>
                  )}

                  {newConnection.authType === "basic_auth" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="connection-username">Username</Label>
                        <Input
                          id="connection-username"
                          value={newConnection.username}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="connection-password">Password</Label>
                        <Input
                          id="connection-password"
                          type="password"
                          value={newConnection.password}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="password"
                        />
                      </div>
                    </div>
                  )}

                  {newConnection.authType === "oauth" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oauth-client-id">Client ID</Label>
                          <Input
                            id="oauth-client-id"
                            value={newConnection.oauthConfig?.clientId}
                            onChange={(e) => setNewConnection(prev => ({ 
                              ...prev, 
                              oauthConfig: { ...prev.oauthConfig, clientId: e.target.value } as any
                            }))}
                            placeholder="client-id"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="oauth-client-secret">Client Secret</Label>
                          <Input
                            id="oauth-client-secret"
                            type="password"
                            value={newConnection.oauthConfig?.clientSecret}
                            onChange={(e) => setNewConnection(prev => ({ 
                              ...prev, 
                              oauthConfig: { ...prev.oauthConfig, clientSecret: e.target.value } as any
                            }))}
                            placeholder="client-secret"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oauth-scope">Scope (Optional)</Label>
                        <Input
                          id="oauth-scope"
                          value={newConnection.oauthConfig?.scope}
                          onChange={(e) => setNewConnection(prev => ({ 
                            ...prev, 
                            oauthConfig: { ...prev.oauthConfig, scope: e.target.value } as any
                          }))}
                          placeholder="read write"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oauth-auth-url">Auth URL</Label>
                          <Input
                            id="oauth-auth-url"
                            value={newConnection.oauthConfig?.authUrl}
                            onChange={(e) => setNewConnection(prev => ({ 
                              ...prev, 
                              oauthConfig: { ...prev.oauthConfig, authUrl: e.target.value } as any
                            }))}
                            placeholder="https://api.example.com/oauth/authorize"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="oauth-token-url">Token URL</Label>
                          <Input
                            id="oauth-token-url"
                            value={newConnection.oauthConfig?.tokenUrl}
                            onChange={(e) => setNewConnection(prev => ({ 
                              ...prev, 
                              oauthConfig: { ...prev.oauthConfig, tokenUrl: e.target.value } as any
                            }))}
                            placeholder="https://api.example.com/oauth/token"
                          />
                        </div>
                      </div>
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
                          : newConnection.type === "anthropic"
                          ? "claude-3-sonnet-20240229"
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
                      resetConnectionForm();
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
                  <CardTitle>API Connections</CardTitle>
                  <CardDescription>Overview of all configured API connections</CardDescription>
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
                            {CONNECTION_TYPES.find(ct => ct.value === connection.type)?.label} • {AUTH_TYPES.find(at => at.value === connection.authType)?.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{connection.url}</div>
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
                  <CardDescription>Add connections for these popular AI services and authentication methods</CardDescription>
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
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <strong>Anthropic</strong> - Claude models
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <strong>Custom API</strong> - Any REST API
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <strong>Multiple Auth</strong> - API Keys, OAuth, Tokens
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <strong>Secure</strong> - Encrypted credential storage
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAccount ? "Edit Account" : "Add New Account"}
                  </DialogTitle>
                  <DialogDescription>
                    Store account credentials for various services
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input
                        id="account-name"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Work Account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-service">Service</Label>
                      <Input
                        id="account-service"
                        value={newAccount.service}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, service: e.target.value }))}
                        placeholder="GitHub, Slack, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-username">Username</Label>
                      <Input
                        id="account-username"
                        value={newAccount.username}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-email">Email (Optional)</Label>
                      <Input
                        id="account-email"
                        type="email"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-password">Password</Label>
                    <Input
                      id="account-password"
                      type="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-notes">Notes (Optional)</Label>
                    <Textarea
                      id="account-notes"
                      value={newAccount.notes}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about this account"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAccountDialogOpen(false);
                      setEditingAccount(null);
                      resetAccountForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingAccount ? saveAccountEdit : addAccount}>
                    {editingAccount ? "Update" : "Add"} Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Accounts Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Stored Accounts</CardTitle>
                  <CardDescription>Manage usernames and passwords for various services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No accounts stored yet</p>
                    <p className="text-sm">Add your first account to get started</p>
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{account.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.service} • {account.username}
                          </div>
                          {account.email && (
                            <div className="text-xs text-muted-foreground">{account.email}</div>
                          )}
                          {account.notes && (
                            <div className="text-xs text-muted-foreground">{account.notes}</div>
                          )}
                          {account.lastUsed && (
                            <div className="text-xs text-muted-foreground">
                              Last used: {account.lastUsed.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingAccount(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAccount(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}