import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, Clock, User } from "lucide-react";

interface Approval {
  id: number;
  actionId: number;
  workflowName: string;
  actorRole: string;
  input: any;
  reason?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export function ApprovalsQueue() {
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: 1,
      actionId: 123,
      workflowName: 'Send Marketing Email Campaign',
      actorRole: 'content',
      input: {
        subject: 'Q1 Product Launch Announcement',
        recipients: 'all_customers',
        template: 'product_launch_v2',
        scheduled_time: '2024-01-15T09:00:00Z'
      },
      reason: 'Email campaign to 50,000+ customers requires approval',
      createdAt: '2024-01-10T14:30:00Z',
      status: 'pending',
    },
    {
      id: 2,
      actionId: 124,
      workflowName: 'Budget Allocation Change',
      actorRole: 'manager',
      input: {
        department: 'marketing',
        amount: 25000,
        category: 'advertising',
        justification: 'Increased Q1 campaign budget for competitive response'
      },
      reason: 'Budget changes over $20K require CEO approval',
      createdAt: '2024-01-10T13:45:00Z',
      status: 'pending',
    },
    {
      id: 3,
      actionId: 125,
      workflowName: 'Customer Data Export',
      actorRole: 'designer',
      input: {
        data_type: 'customer_analytics',
        export_format: 'csv',
        date_range: '2023-01-01_to_2023-12-31',
        include_pii: true
      },
      reason: 'Export includes PII and requires privacy review',
      createdAt: '2024-01-10T12:15:00Z',
      status: 'pending',
    },
  ]);

  const handleApproval = async (approvalId: number, decision: 'approve' | 'deny') => {
    // Mock API call
    console.log(`${decision} approval ${approvalId}`);
    
    setApprovals(prev => prev.map(approval => 
      approval.id === approvalId 
        ? { ...approval, status: decision === 'approve' ? 'approved' : 'denied' }
        : approval
    ));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const formatInput = (input: any) => {
    return JSON.stringify(input, null, 2);
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

  const getActorColor = (role: string) => {
    const colors = {
      ceo: 'bg-red-500',
      designer: 'bg-blue-500',
      content: 'bg-green-500',
      manager: 'bg-purple-500',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const completedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingApprovals.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-success">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">12m</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <Badge className="bg-warning text-warning-foreground">
                {pendingApprovals.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
              <p>All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <Card key={approval.id} className="border-warning/20 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{approval.workflowName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getActorColor(approval.actorRole)} text-white`}>
                              {approval.actorRole.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Action #{approval.actionId}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {getTimeAgo(approval.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-warning border-warning/50">
                          Needs Approval
                        </Badge>
                      </div>

                      {/* Reason */}
                      {approval.reason && (
                        <div className="p-3 rounded-lg bg-muted/50 border-l-4 border-warning">
                          <p className="text-sm">{approval.reason}</p>
                        </div>
                      )}

                      {/* Input Preview */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Workflow Input:</h5>
                        <ScrollArea className="h-32">
                          <pre className="text-xs bg-muted/30 p-3 rounded border font-mono overflow-x-auto">
                            {formatInput(approval.input)}
                          </pre>
                        </ScrollArea>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleApproval(approval.id, 'approve')}
                          className="flex items-center gap-2 bg-success text-success-foreground hover:bg-success/80"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleApproval(approval.id, 'deny')}
                          className="flex items-center gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      {completedApprovals.length > 0 && (
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Recent Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedApprovals.slice(0, 5).map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg border border-card-border">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      approval.status === 'approved' ? 'bg-success' : 'bg-destructive'
                    }`} />
                    <div>
                      <span className="font-medium">{approval.workflowName}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {approval.actorRole}
                        <span>• {getTimeAgo(approval.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={approval.status === 'approved' 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                    }
                  >
                    {approval.status === 'approved' ? 'Approved' : 'Denied'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}