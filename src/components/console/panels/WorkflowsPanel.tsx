import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, Play, Edit, Eye } from "lucide-react";

export function WorkflowsPanel() {
  const [workflows] = useState([
    {
      id: 1,
      name: 'Daily Report Generation',
      description: 'Generate and send daily status reports',
      steps: 3,
      active: true,
      lastRun: '2024-01-10T09:00:00Z'
    },
    {
      id: 2,
      name: 'Customer Onboarding',
      description: 'Automated new customer welcome sequence',
      steps: 5,
      active: true,
      lastRun: '2024-01-09T15:30:00Z'
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Workflows</h2>
        <p className="text-muted-foreground">Manage and execute automated workflows</p>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="bg-card border-card-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  {workflow.name}
                </CardTitle>
                <Badge className={workflow.active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                  {workflow.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{workflow.steps} steps</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}