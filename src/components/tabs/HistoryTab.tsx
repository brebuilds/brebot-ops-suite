import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, MessageSquare, FileText, Database, RefreshCw, Filter } from "lucide-react";

interface HistoryItem {
  id: string;
  type: 'query' | 'file_upload' | 'system' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  tool?: string;
  status: 'success' | 'failed' | 'pending';
  attachments?: number;
}

export function HistoryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'query',
      title: 'Search for quarterly reports',
      description: 'Used file search tool to find Q3 financial documents',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      tool: 'file-search',
      status: 'success',
      attachments: 0
    },
    {
      id: '2',
      type: 'file_upload',
      title: 'Uploaded contract documents',
      description: '5 PDF files ingested and indexed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success',
      attachments: 5
    },
    {
      id: '3',
      type: 'query',
      title: 'Email search for client communications',
      description: 'Searched email archives for customer feedback',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tool: 'email',
      status: 'success',
      attachments: 0
    },
    {
      id: '4',
      type: 'system',
      title: 'Vector database reindexing',
      description: 'Automated maintenance task completed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'success',
      attachments: 0
    },
    {
      id: '5',
      type: 'error',
      title: 'Failed to process large PDF',
      description: 'Document exceeded size limit and was rejected',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'failed',
      attachments: 1
    },
    {
      id: '6',
      type: 'query',
      title: 'Database query for metrics',
      description: 'Retrieved performance analytics for dashboard',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tool: 'database',
      status: 'success',
      attachments: 0
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'query': return MessageSquare;
      case 'file_upload': return FileText;
      case 'system': return RefreshCw;
      case 'error': return RefreshCw;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'query': return 'primary';
      case 'file_upload': return 'accent';
      case 'system': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="query">Queries</SelectItem>
                <SelectItem value="file_upload">File Uploads</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Badge variant="secondary">{filteredItems.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-${getTypeColor(item.type)}/10 flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 text-${getTypeColor(item.type)}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(item.timestamp)}
                            </div>
                            {item.tool && (
                              <Badge variant="outline" className="text-xs">
                                {item.tool}
                              </Badge>
                            )}
                            {item.attachments && item.attachments > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {item.attachments} files
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusColor(item.status)} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Filter className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No items match your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}