import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { IdentityStep } from "./steps/IdentityStep";
import { SourcesStep } from "./steps/SourcesStep";
import { QAStep } from "./steps/QAStep";
import { WorkflowsStep } from "./steps/WorkflowsStep";

interface SetupWizardProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: "Identity & Values", component: IdentityStep },
  { id: 2, title: "Sources & Ingest", component: SourcesStep },
  { id: 3, title: "Deep Q&A", component: QAStep },
  { id: 4, title: "Workflows", component: WorkflowsStep },
];

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    } else {
      // All steps completed
      onComplete();
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <div className="col-span-3">
        <Card className="bg-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Setup Progress</CardTitle>
            <Progress value={progress} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedSteps.length} of {steps.length} steps completed
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/80 ${
                    isCurrent ? 'bg-primary/10 border border-primary/20' : 
                    isCompleted ? 'bg-success/10' : 'bg-muted/50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className={`h-5 w-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  <span className={`font-medium ${
                    isCurrent ? 'text-primary' : 
                    isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="col-span-9">
        <Card className="bg-card border-card-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Configure your BreBot's core settings and personality
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentStep} / {steps.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {CurrentStepComponent && (
              <CurrentStepComponent 
                onComplete={() => handleStepComplete(currentStep)}
                isCompleted={completedSteps.includes(currentStep)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            {currentStep < steps.length && (
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!completedSteps.includes(currentStep)}
              >
                Skip Step
              </Button>
            )}
            
            {currentStep === steps.length && completedSteps.length === steps.length && (
              <Button 
                onClick={onComplete}
                className="bg-gradient-primary text-primary-foreground shadow-glow"
              >
                Bring BreBot Online
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}