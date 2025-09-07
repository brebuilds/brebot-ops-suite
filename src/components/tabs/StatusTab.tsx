import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, Cpu, HardDrive, Wifi, Clock } from "lucide-react";

export function StatusTab() {
  const systemStatus = {
    overall: "operational",
    uptime: "99.8%",
    lastUpdate: "2 minutes ago",
    services: [
      { name: "Vector Database", status: "operational", response: "45ms" },
      { name: "File Processor", status: "operational", response: "120ms" },
      { name: "API Gateway", status: "operational", response: "30ms" },
      { name: "Email Connector", status: "degraded", response: "450ms" },
    ],
    resources: {
      memory: 68,
      storage: 34,
      cpu: 23,
    },
    stats: {
      documentsProcessed: 1247,
      queriesHandled: 89,
      filesIngested: 456,
      connectionsActive: 7,
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "default";
      case "degraded": return "outline";
      case "offline": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Overall Status</p>
              <Badge variant={getStatusColor(systemStatus.overall)} className="capitalize">
                {systemStatus.overall}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold text-success">{systemStatus.uptime}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                {systemStatus.lastUpdate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'bg-success animate-pulse' :
                    service.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                  }`} />
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{service.response}</span>
                  <Badge variant={getStatusColor(service.status)} className="text-xs">
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory</span>
                <span className="text-sm text-muted-foreground">{systemStatus.resources.memory}%</span>
              </div>
              <Progress value={systemStatus.resources.memory} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-muted-foreground">{systemStatus.resources.storage}%</span>
              </div>
              <Progress value={systemStatus.resources.storage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU</span>
                <span className="text-sm text-muted-foreground">{systemStatus.resources.cpu}%</span>
              </div>
              <Progress value={systemStatus.resources.cpu} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Database className="h-6 w-6 mx-auto text-primary" />
              <p className="text-2xl font-bold">{systemStatus.stats.documentsProcessed.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Documents Processed</p>
            </div>
            <div className="text-center space-y-2">
              <Activity className="h-6 w-6 mx-auto text-primary" />
              <p className="text-2xl font-bold">{systemStatus.stats.queriesHandled}</p>
              <p className="text-sm text-muted-foreground">Queries Today</p>
            </div>
            <div className="text-center space-y-2">
              <HardDrive className="h-6 w-6 mx-auto text-primary" />
              <p className="text-2xl font-bold">{systemStatus.stats.filesIngested}</p>
              <p className="text-sm text-muted-foreground">Files Ingested</p>
            </div>
            <div className="text-center space-y-2">
              <Wifi className="h-6 w-6 mx-auto text-primary" />
              <p className="text-2xl font-bold">{systemStatus.stats.connectionsActive}</p>
              <p className="text-sm text-muted-foreground">Active Connections</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}