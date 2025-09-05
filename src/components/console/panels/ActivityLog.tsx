import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, Clock, User, CheckCircle, XCircle, AlertTriangle, Zap } from "lucide-react";

interface LogEntry {
  id: number;
  actorRole?: string;
  action: string;
  result?: string;
  artifactLink?: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function ActivityLog() {
  const [logs] = useState<LogEntry[]>([
    {
      id: 1,
      actorRole: 'ceo',
      action: 'Approved marketing campaign budget increase',
      result: 'Budget updated from $20K to $25K for Q1 advertising',
      timestamp: '2024-01-10T14:45:00Z',
      type: 'success',
    },
    {
      id: 2,
      actorRole: 'content',
      action: 'Generated Q1 marketing strategy document',
      result: 'Created 15-page strategy document with competitive analysis',
      artifactLink: '/documents/q1-marketing-strategy.pdf',
      timestamp: '2024-01-10T14:30:00Z',
      type: 'success',
    },
    {
      id: 3,
      actorRole: 'designer',
      action: 'Workflow execution failed',
      result: 'Unable to connect to design asset repository',
      timestamp: '2024-01-10T14:15:00Z',
      type: 'error',
    },
    {
      id: 4,
      actorRole: 'manager',
      action: 'Scheduled team standup meetings',
      result: 'Created recurring weekly meetings for all teams',
      timestamp: '2024-01-10T14:00:00Z',
      type: 'success',
    },
    {
      id: 5,
      action: 'System backup completed',
      result: 'Successfully backed up 1.2GB of project data',
      timestamp: '2024-01-10T13:45:00Z',
      type: 'info',
    },
    {
      id: 6,
      actorRole: 'content',
      action: 'Blog post draft completed',
      result: 'Industry trends article ready for review (2,400 words)',
      artifactLink: '/drafts/industry-trends-q1.md',
      timestamp: '2024-01-10T13:30:00Z',
      type: 'success',
    },
    {
      id: 7,
      actorRole: 'ceo',
      action: 'Requested customer data export',
      result: 'Export queued for approval (contains PII)',
      timestamp: '2024-01-10T13:15:00Z',
      type: 'warning',
    },
    {
      id: 8,
      actorRole: 'designer',
      action: 'Created product launch graphics',
      result: 'Generated 12 visual assets for announcement campaign',
      artifactLink: '/assets/product-launch-graphics/',
      timestamp: '2024-01-10T13:00:00Z',
      type: 'success',
    },
    {
      id: 9,
      action: 'Database optimization completed',
      result: 'Query performance improved by 35%',
      timestamp: '2024-01-10T12:45:00Z',
      type: 'info',
    },
    {
      id: 10,
      actorRole: 'manager',
      action: 'Updated project timeline',
      result: 'Adjusted Q1 milestones based on resource availability',
      timestamp: '2024-01-10T12:30:00Z',
      type: 'success',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActor, setFilterActor] = useState<string>('all');

  const actors = [
    { value: 'ceo', label: 'CEO', color: 'bg-red-500' },
    { value: 'designer', label: 'Designer', color: 'bg-blue-500' },
    { value: 'content', label: 'Content', color: 'bg-green-500' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-500' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.result && log.result.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesActor = filterActor === 'all' || log.actorRole === filterActor;
    
    return matchesSearch && matchesType && matchesActor;
  });

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Zap className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <Badge className="bg-success text-success-foreground">Success</Badge>;
      case 'error':
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const getActorColor = (actorValue?: string) => {
    return actors.find(a => a.value === actorValue)?.color || 'bg-gray-500';
  };

  const getActorLabel = (actorValue?: string) => {
    return actors.find(a => a.value === actorValue)?.label || 'System';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
            <Badge variant="outline">{filteredLogs.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterActor} onValueChange={setFilterActor}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                {actors.map((actor) => (
                  <SelectItem key={actor.value} value={actor.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${actor.color}`} />
                      {actor.label}
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {logs.filter(l => l.type === 'success').length}
              </p>
              <p className="text-sm text-muted-foreground">Success</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {logs.filter(l => l.type === 'error').length}
              </p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {logs.filter(l => l.type === 'warning').length}
              </p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {logs.filter(l => l.type === 'info').length}
              </p>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="bg-card border-card-border">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-4">
              {filteredLogs.map((log, index) => (
                <div key={log.id} className="flex gap-4 p-4 rounded-lg border border-card-border hover:bg-muted/30 transition-colors">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(log.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {log.actorRole && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <Badge className={`text-xs ${getActorColor(log.actorRole)} text-white`}>
                              {getActorLabel(log.actorRole)}
                            </Badge>
                          </div>
                        )}
                        {getTypeBadge(log.type)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(log.timestamp)}</span>
                        <span>• {getTimeAgo(log.timestamp)}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <h4 className="font-medium">{log.action}</h4>

                    {/* Result */}
                    {log.result && (
                      <p className="text-sm text-muted-foreground">{log.result}</p>
                    )}

                    {/* Artifact Link */}
                    {log.artifactLink && (
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Activity className="h-3 w-3" />
                        <a href={log.artifactLink} className="hover:underline">
                          View artifact
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities match your current filters</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}