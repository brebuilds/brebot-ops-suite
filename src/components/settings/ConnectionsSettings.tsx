import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plug, Plus, Settings, Trash2, CheckCircle, AlertCircle, Clock, Mail, Database, Cloud, Shield } from "lucide-react";

interface Connection {
  id: string;
  name: string;
  type: 'api' | 'mpc' | 'oauth' | 'database';
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function ConnectionsSettings() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const connections: Connection[] = [
    {
      id: '1',
      name: 'Gmail Integration',
      type: 'oauth',
      service: 'Gmail',
      status: 'connected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Access email content for search and analysis',
      icon: Mail
    },
    {
      id: '2',
      name: 'Company Database',
      type: 'database',
      service: 'PostgreSQL',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Query structured business data',
      icon: Database
    },
    {
      id: '3',
      name: 'Cloud Storage',
      type: 'api',
      service: 'AWS S3',
      status: 'error',
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'Access files stored in cloud storage',
      icon: Cloud
    },
    {
      id: '4',
      name: 'Secure MPC Node',
      type: 'mpc',
      service: 'Custom MPC',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'Multi-party computation for sensitive data',
      icon: Shield
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return Clock;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'disconnected': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'default';
      case 'mpc': return 'secondary';
      case 'oauth': return 'outline';
      case 'database': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Connection Dialog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              Connections
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Connection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connection Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select connection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Connection</SelectItem>
                        <SelectItem value="oauth">OAuth Integration</SelectItem>
                        <SelectItem value="database">Database Connection</SelectItem>
                        <SelectItem value="mpc">MPC Node</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Connection Name</Label>
                    <Input placeholder="Enter connection name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Service/Provider</Label>
                    <Input placeholder="e.g., Gmail, PostgreSQL, Custom API" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Configuration</Label>
                    <Textarea 
                      placeholder="Enter connection details (API keys, endpoints, etc.)"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync" />
                    <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Add Connection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => {
                const StatusIcon = getStatusIcon(connection.status);
                const ServiceIcon = connection.icon;
                
                return (
                  <TableRow key={connection.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ServiceIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{connection.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{connection.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{connection.service}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(connection.type)} className="uppercase text-xs">
                        {connection.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 text-${getStatusColor(connection.status)}`} />
                        <Badge variant={getStatusColor(connection.status)} className="capitalize">
                          {connection.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimeAgo(connection.lastSync)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => console.log('Configure', connection.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => console.log('Delete', connection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MPC Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            MPC Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Node Endpoint</Label>
              <Input placeholder="https://mpc.example.com" />
            </div>
            <div className="space-y-2">
              <Label>Node ID</Label>
              <Input placeholder="node-123" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Private Key</Label>
            <Textarea 
              placeholder="Enter your MPC private key"
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="mpc-enabled" />
            <Label htmlFor="mpc-enabled">Enable MPC for sensitive data processing</Label>
          </div>
          
          <Button className="w-full">
            Test MPC Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}