import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowRight, Upload, Wrench, Workflow, FileText } from "lucide-react";

interface BotSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  botType: "brebot" | "employee" | "manager" | null;
}

const availableTools = [
  "GitHub API", "Slack API", "Email Integration", "Calendar Sync", 
  "Document Generator", "Data Analyzer", "Report Builder", "Social Media API",
  "Payment Processor", "CRM Integration", "Analytics Dashboard", "Code Reviewer"
];

const availableWorkflows = [
  "Content Creation Pipeline", "Customer Support Flow", "Code Review Process",
  "Data Analysis Workflow", "Report Generation", "Social Media Management",
  "Customer Onboarding", "Bug Triage Process"
];

export function BotSetupWizard({ isOpen, onClose, botType }: BotSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    description: "",
    selectedTools: [] as string[],
    selectedWorkflow: "",
    n8nWebhook: "",
    managedEmployees: [] as string[],
    infoResource: null as File | null
  });

  const isBreBot = botType === "brebot";
  const isManager = botType === "manager";
  const isEmployee = botType === "employee";
  const totalSteps = isBreBot ? 4 : 3;

  const handleToolToggle = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(tool)
        ? prev.selectedTools.filter(t => t !== tool)
        : [...prev.selectedTools, tool]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, infoResource: file }));
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete setup
      console.log("Bot setup completed:", formData);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-4 rounded-full bg-gradient-primary w-16 h-16 mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                {isBreBot ? "Setup BreBot (CEO)" : 
                 isManager ? "Create New Manager Bot" : 
                 "Create New Employee Bot"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {isBreBot 
                  ? "Configure your digital clone with deep understanding and capabilities"
                  : isManager
                  ? "Set up a bot that manages other bots and reports on their performance"
                  : "Set up a specialized bot linked to an n8n workflow"
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={isBreBot ? "BreBot Prime" : isManager ? "Manager Bot" : "Employee Bot"}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder={isBreBot ? "Chief Executive Bot" : isManager ? "e.g., Design Manager, Team Lead" : "e.g., Content Creator, Designer"}
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this bot's purpose and capabilities"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        if (isBreBot) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Deep Knowledge Setup</h3>
                <p className="text-muted-foreground">
                  BreBot requires comprehensive Q&A and understanding setup
                </p>
              </div>
              
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      BreBot's full setup includes the comprehensive onboarding wizard with:
                    </p>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">Identity & Values Configuration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">Comprehensive Q&A Sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">Knowledge Sources Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">Advanced Workflow Configuration</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // This would redirect to the full setup wizard
                        console.log("Redirecting to full BreBot setup wizard");
                      }}
                    >
                      Launch Full Setup Wizard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  {isManager ? "Management Setup" : "Tools & Access"}
                </h3>
                <p className="text-muted-foreground">
                  {isManager 
                    ? "Configure management and reporting capabilities"
                    : "Select which tools this bot can access"
                  }
                </p>
              </div>

              {isManager ? (
                <div className="space-y-4">
                  <div>
                    <Label>Managed Employees</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select which employee bots this manager will oversee
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {["DesignBot Alpha", "CodeBot Beta", "ContentBot Gamma", "SupportBot Delta"].map((employee) => (
                        <div key={employee} className="flex items-center space-x-2">
                          <Checkbox
                            id={employee}
                            checked={formData.managedEmployees.includes(employee)}
                            onCheckedChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                managedEmployees: prev.managedEmployees.includes(employee)
                                  ? prev.managedEmployees.filter(e => e !== employee)
                                  : [...prev.managedEmployees, employee]
                              }));
                            }}
                          />
                          <Label htmlFor={employee} className="text-sm font-normal">
                            {employee}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Available Tools</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {availableTools.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={tool}
                          checked={formData.selectedTools.includes(tool)}
                          onCheckedChange={() => handleToolToggle(tool)}
                        />
                        <Label htmlFor={tool} className="text-sm font-normal">
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Label>Selected Tools</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedTools.map((tool) => (
                        <Badge key={tool} variant="outline" className="bg-primary/10">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

      case 3:
        return (
            <div className="space-y-6">
              <div className="text-center">
                <Workflow className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  {isManager ? "Reporting Setup" : "Workflow Connection"}
                </h3>
                <p className="text-muted-foreground">
                  {isManager 
                    ? "Configure reporting and status tracking"
                    : "Connect this bot to an n8n workflow"
                  }
                </p>
              </div>

              <div className="space-y-4">
                {isEmployee && (
                  <div>
                    <Label>n8n Workflow Webhook</Label>
                    <Input
                      value={formData.n8nWebhook}
                      onChange={(e) => setFormData(prev => ({ ...prev, n8nWebhook: e.target.value }))}
                      placeholder="https://your-n8n-instance.com/webhook/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This bot will trigger this n8n workflow when activated
                    </p>
                  </div>
                )}

                {isManager && (
                  <div>
                    <Label>Primary Workflow</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, selectedWorkflow: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily-report">Daily Status Reports</SelectItem>
                        <SelectItem value="weekly-summary">Weekly Team Summary</SelectItem>
                        <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                        <SelectItem value="resource-allocation">Resource Allocation Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {!isManager && (
                  <div>
                    <Label>Primary Workflow</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, selectedWorkflow: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkflows.map((workflow) => (
                          <SelectItem key={workflow} value={workflow}>
                            {workflow}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Information Resource</Label>
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {isManager 
                          ? "Upload management guidelines or reporting templates"
                          : "Upload a knowledge document for this bot"
                        }
                      </p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt,.md"
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                    {formData.infoResource && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {formData.infoResource.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-4 rounded-full bg-success/10 w-16 h-16 mx-auto mb-4">
                <Bot className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Setup Complete!</h3>
              <p className="text-muted-foreground">
                Your bot is ready to be deployed
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {formData.role}
                </div>
                <div>
                  <span className="font-medium">Department:</span> {formData.department}
                </div>
                <div>
                  <span className="font-medium">Tools:</span> {formData.selectedTools.length} selected
                </div>
                <div>
                  <span className="font-medium">Workflow:</span> {formData.selectedWorkflow || "None"}
                </div>
                {isEmployee && (
                  <div>
                    <span className="font-medium">n8n Webhook:</span> {formData.n8nWebhook || "None"}
                  </div>
                )}
                {isManager && (
                  <div>
                    <span className="font-medium">Managed Employees:</span> {formData.managedEmployees.length} selected
                  </div>
                )}
                <div>
                  <span className="font-medium">Resource:</span> {formData.infoResource?.name || "None"}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isBreBot ? "BreBot Setup" : "Employee Bot Setup"}
          </DialogTitle>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 === step
                    ? "bg-primary text-primary-foreground"
                    : i + 1 < step
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="py-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-primary text-primary-foreground"
          >
            {step === totalSteps ? "Complete Setup" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}