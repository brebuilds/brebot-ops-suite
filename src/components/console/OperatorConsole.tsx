import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatCommand } from "./panels/ChatCommand";
import { ApprovalsQueue } from "./panels/ApprovalsQueue";
import { TaskBoard } from "./panels/TaskBoard";
import { ActivityLog } from "./panels/ActivityLog";
import { TeamPanel } from "./panels/TeamPanel";
import { WorkflowsPanel } from "./panels/WorkflowsPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { 
  MessageSquare, 
  CheckSquare, 
  Kanban, 
  Activity, 
  Users, 
  Workflow, 
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface OperatorConsoleProps {
  isPreviewMode?: boolean;
}

export function OperatorConsole({ isPreviewMode = false }: OperatorConsoleProps) {
  const [activePanel, setActivePanel] = useState("chat");

  // Mock status data
  const status = {
    actions: {
      pending: 2,
      running: 1,
      needs_approval: 3,
      completed: 12,
      failed: 0,
    },
    tasks: {
      now: 4,
      next: 8,
      blocked: 2,
      done: 15,
    },
  };

  const panels = [
    { id: "chat", label: "Chat & Command", icon: MessageSquare },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: status.actions.needs_approval },
    { id: "tasks", label: "Task Board", icon: Kanban, badge: status.tasks.now },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "team", label: "Team", icon: Users },
    { id: "workflows", label: "Workflows", icon: Workflow },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Status Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Actions</p>
                <p className="text-2xl font-bold">{status.actions.running + status.actions.pending}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs">
                {status.actions.running} running
              </Badge>
              <Badge variant="outline" className="text-xs">
                {status.actions.pending} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Approval</p>
                <p className="text-2xl font-bold text-warning">{status.actions.needs_approval}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-warning border-warning/50">
                Awaiting review
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Tasks</p>
                <p className="text-2xl font-bold">{status.tasks.now}</p>
              </div>
              <Kanban className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs">
                {status.tasks.next} next
              </Badge>
              <Badge variant="outline" className="text-xs">
                {status.tasks.blocked} blocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-success">{status.actions.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Badge className="text-xs bg-success text-success-foreground">
                100% success rate
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Console */}
      <Tabs value={activePanel} onValueChange={setActivePanel} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <TabsTrigger 
                key={panel.id} 
                value={panel.id}
                className="flex items-center gap-2 relative"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{panel.label}</span>
                {panel.badge && panel.badge > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-warning text-warning-foreground"
                  >
                    {panel.badge}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ChatCommand isPreviewMode={isPreviewMode} />
          </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalsQueue />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskBoard />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamPanel />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowsPanel />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}