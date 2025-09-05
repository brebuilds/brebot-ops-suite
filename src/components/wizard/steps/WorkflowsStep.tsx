import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Play, Save, Zap } from "lucide-react";

interface WorkflowsStepProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface WorkflowStep {
  id: string;
  tool: string;
  inputs: Record<string, string>;
  outputs: string[];
  critical: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

const mockWebhooks = [
  { key: 'send_email', name: 'Send Email', description: 'Send emails via SMTP' },
  { key: 'create_task', name: 'Create Task', description: 'Add tasks to project management' },
  { key: 'generate_report', name: 'Generate Report', description: 'Create PDF reports' },
  { key: 'update_calendar', name: 'Update Calendar', description: 'Manage calendar events' },
  { key: 'post_slack', name: 'Post to Slack', description: 'Send Slack messages' },
  { key: 'create_document', name: 'Create Document', description: 'Generate documents' },
  { key: 'run_analysis', name: 'Run Analysis', description: 'Perform data analysis' },
  { key: 'backup_data', name: 'Backup Data', description: 'Create data backups' },
];

export function WorkflowsStep({ onComplete, isCompleted }: WorkflowsStepProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Daily Report Generation',
      description: 'Generate and send daily status reports',
      steps: [
        {
          id: '1',
          tool: 'run_analysis',
          inputs: { data_source: 'daily_metrics', format: 'summary' },
          outputs: ['report_data', 'insights'],
          critical: false,
        },
        {
          id: '2',
          tool: 'generate_report',
          inputs: { template: 'daily_report', data: '{{report_data}}' },
          outputs: ['report_pdf', 'report_url'],
          critical: false,
        },
        {
          id: '3',
          tool: 'send_email',
          inputs: { 
            to: 'team@company.com', 
            subject: 'Daily Report {{date}}',
            attachment: '{{report_pdf}}'
          },
          outputs: ['email_sent'],
          critical: true,
        },
      ],
    },
  ]);

  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(workflows[0]);
  const [simulationResult, setSimulationResult] = useState<string>('');

  const addStep = () => {
    if (!currentWorkflow) return;
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      tool: '',
      inputs: {},
      outputs: [],
      critical: false,
    };
    
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep],
    });
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!currentWorkflow) return;
    
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    });
  };

  const removeStep = (stepId: string) => {
    if (!currentWorkflow) return;
    
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(step => step.id !== stepId),
    });
  };

  const addInput = (stepId: string) => {
    if (!currentWorkflow) return;
    
    const step = currentWorkflow.steps.find(s => s.id === stepId);
    if (!step) return;
    
    const key = `input_${Object.keys(step.inputs).length + 1}`;
    updateStep(stepId, {
      inputs: { ...step.inputs, [key]: '' }
    });
  };

  const updateInput = (stepId: string, key: string, value: string) => {
    if (!currentWorkflow) return;
    
    const step = currentWorkflow.steps.find(s => s.id === stepId);
    if (!step) return;
    
    updateStep(stepId, {
      inputs: { ...step.inputs, [key]: value }
    });
  };

  const removeInput = (stepId: string, key: string) => {
    if (!currentWorkflow) return;
    
    const step = currentWorkflow.steps.find(s => s.id === stepId);
    if (!step) return;
    
    const { [key]: removed, ...restInputs } = step.inputs;
    updateStep(stepId, { inputs: restInputs });
  };

  const updateOutputs = (stepId: string, outputsString: string) => {
    const outputs = outputsString.split(',').map(s => s.trim()).filter(Boolean);
    updateStep(stepId, { outputs });
  };

  const simulateWorkflow = async () => {
    if (!currentWorkflow) return;
    
    setSimulationResult('Running simulation...');
    
    // Mock simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = `Simulation completed for "${currentWorkflow.name}":
    
✓ Step 1: ${currentWorkflow.steps[0]?.tool || 'No tool'} - Success
✓ Step 2: ${currentWorkflow.steps[1]?.tool || 'No tool'} - Success  
${currentWorkflow.steps[2] ? `⚠ Step 3: ${currentWorkflow.steps[2].tool} - Requires approval` : ''}

Estimated runtime: 2.3 seconds
Critical steps: ${currentWorkflow.steps.filter(s => s.critical).length}`;
    
    setSimulationResult(result);
  };

  const saveWorkflow = async () => {
    if (!currentWorkflow) return;
    
    console.log('Saving workflow:', currentWorkflow);
    
    // Update workflows list
    setWorkflows(prev => 
      prev.map(wf => wf.id === currentWorkflow.id ? currentWorkflow : wf)
    );
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete();
  };

  if (!currentWorkflow) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Workflow Name</Label>
            <Input
              value={currentWorkflow.name}
              onChange={(e) => setCurrentWorkflow({
                ...currentWorkflow,
                name: e.target.value
              })}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={currentWorkflow.description}
              onChange={(e) => setCurrentWorkflow({
                ...currentWorkflow,
                description: e.target.value
              })}
              placeholder="Brief description"
            />
          </div>
        </div>
      </div>

      {/* Steps Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Workflow Steps</h4>
          <Button onClick={addStep} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {currentWorkflow.steps.map((step, index) => (
            <Card key={step.id} className="border-card-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Step {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={step.critical}
                      onCheckedChange={(checked) => updateStep(step.id, { critical: checked })}
                    />
                    <Label className="text-sm">Critical</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div className="space-y-2">
                  <Label>Tool</Label>
                  <Select value={step.tool} onValueChange={(value) => updateStep(step.id, { tool: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWebhooks.map((webhook) => (
                        <SelectItem key={webhook.key} value={webhook.key}>
                          <div>
                            <div className="font-medium">{webhook.name}</div>
                            <div className="text-xs text-muted-foreground">{webhook.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Inputs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Inputs</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addInput(step.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(step.inputs).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            const { [key]: oldValue, ...rest } = step.inputs;
                            updateStep(step.id, { inputs: { ...rest, [newKey]: oldValue } });
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={value}
                          onChange={(e) => updateInput(step.id, key, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInput(step.id, key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outputs */}
                <div className="space-y-2">
                  <Label>Outputs (comma-separated)</Label>
                  <Input
                    placeholder="output_key1, output_key2"
                    value={step.outputs.join(', ')}
                    onChange={(e) => updateOutputs(step.id, e.target.value)}
                  />
                </div>

                {step.critical && (
                  <Badge variant="outline" className="text-warning border-warning/50">
                    <Zap className="h-3 w-3 mr-1" />
                    Requires Approval
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Simulation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{simulationResult}</pre>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={simulateWorkflow}
          disabled={currentWorkflow.steps.length === 0}
        >
          <Play className="h-4 w-4 mr-2" />
          Simulate
        </Button>
        
        <Button 
          onClick={saveWorkflow}
          disabled={isCompleted || !currentWorkflow.name || currentWorkflow.steps.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          {isCompleted ? 'Saved' : 'Save Workflow'}
        </Button>
      </div>
    </div>
  );
}