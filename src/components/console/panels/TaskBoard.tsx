import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Clock, Link as LinkIcon, MoreHorizontal } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'now' | 'next' | 'blocked' | 'done';
  assignedTo?: string;
  actionId?: number;
  createdAt: string;
  updatedAt: string;
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Review Q1 marketing strategy',
      description: 'Analyze proposed campaign themes and budget allocation',
      status: 'now',
      assignedTo: 'ceo',
      actionId: 123,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
    },
    {
      id: 2,
      title: 'Design product launch graphics',
      description: 'Create visual assets for new product announcement',
      status: 'now',
      assignedTo: 'designer',
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-10T10:30:00Z',
    },
    {
      id: 3,
      title: 'Write blog post content',
      description: 'Draft article about industry trends for Q1',
      status: 'now',
      assignedTo: 'content',
      createdAt: '2024-01-10T11:15:00Z',
      updatedAt: '2024-01-10T11:15:00Z',
    },
    {
      id: 4,
      title: 'Schedule team standup meetings',
      description: 'Coordinate weekly standup schedule for all teams',
      status: 'now',
      assignedTo: 'manager',
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-01-10T12:00:00Z',
    },
    {
      id: 5,
      title: 'Prepare investor presentation',
      description: 'Compile Q4 results and Q1 projections',
      status: 'next',
      assignedTo: 'ceo',
      createdAt: '2024-01-09T14:00:00Z',
      updatedAt: '2024-01-09T14:00:00Z',
    },
    {
      id: 6,
      title: 'Update brand guidelines',
      description: 'Refresh visual identity standards',
      status: 'next',
      assignedTo: 'designer',
      createdAt: '2024-01-09T15:30:00Z',
      updatedAt: '2024-01-09T15:30:00Z',
    },
    {
      id: 7,
      title: 'Social media campaign planning',
      description: 'Plan content calendar for next quarter',
      status: 'next',
      assignedTo: 'content',
      createdAt: '2024-01-09T16:00:00Z',
      updatedAt: '2024-01-09T16:00:00Z',
    },
    {
      id: 8,
      title: 'Budget review meeting',
      description: 'Waiting for finance team availability',
      status: 'blocked',
      assignedTo: 'manager',
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-08T10:00:00Z',
    },
    {
      id: 9,
      title: 'API documentation update',
      description: 'Blocked pending development team input',
      status: 'blocked',
      assignedTo: 'content',
      createdAt: '2024-01-08T11:00:00Z',
      updatedAt: '2024-01-08T11:00:00Z',
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'now' as Task['status'],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const actors = [
    { value: 'ceo', label: 'CEO', color: 'bg-red-500' },
    { value: 'designer', label: 'Designer', color: 'bg-blue-500' },
    { value: 'content', label: 'Content', color: 'bg-green-500' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-500' },
  ];

  const columns = [
    { status: 'now' as const, title: 'Now', color: 'border-red-500', bgColor: 'bg-red-500/10' },
    { status: 'next' as const, title: 'Next', color: 'border-blue-500', bgColor: 'bg-blue-500/10' },
    { status: 'blocked' as const, title: 'Blocked', color: 'border-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const moveTask = (taskId: number, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const createTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description || undefined,
      status: newTask.status,
      assignedTo: newTask.assignedTo || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', assignedTo: '', status: 'now' });
    setIsDialogOpen(false);
  };

  const getActorColor = (actorValue?: string) => {
    return actors.find(a => a.value === actorValue)?.color || 'bg-gray-500';
  };

  const getActorLabel = (actorValue?: string) => {
    return actors.find(a => a.value === actorValue)?.label || 'Unassigned';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Task Board</h2>
          <p className="text-muted-foreground">Organize and track your team's work</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {actors.map((actor) => (
                        <SelectItem key={actor.value} value={actor.value}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${actor.color}`} />
                            {actor.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newTask.status} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col.status} value={col.status}>
                          {col.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={createTask} disabled={!newTask.title.trim()}>
                  Create Task
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.status);
          
          return (
            <Card key={column.status} className={`border-2 ${column.color} ${column.bgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{column.title}</span>
                  <Badge variant="outline" className="text-sm">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="bg-card border-card-border hover:shadow-hover transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {task.assignedTo && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <Badge className={`text-xs ${getActorColor(task.assignedTo)} text-white`}>
                                  {getActorLabel(task.assignedTo)}
                                </Badge>
                              </div>
                            )}
                            {task.actionId && (
                              <div className="flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                <span className="text-muted-foreground">#{task.actionId}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(task.updatedAt)}</span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-1 pt-1">
                          {columns.map((col) => 
                            col.status !== task.status && (
                              <Button
                                key={col.status}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => moveTask(task.id, col.status)}
                              >
                                → {col.title}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Done Tasks Summary */}
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Done Tasks
            <Badge className="bg-success text-success-foreground">
              {tasks.filter(t => t.status === 'done').length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {tasks.filter(t => t.status === 'done').length} tasks completed today. 
            Great work! 🎉
          </p>
        </CardContent>
      </Card>
    </div>
  );
}