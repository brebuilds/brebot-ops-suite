import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiClient, type Plan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Play, Lightbulb, CheckCircle } from "lucide-react";

export function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const { toast } = useToast();

  const handlePlan = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const plan = await apiClient.planFromPrompt(prompt);
      setCurrentPlan(plan);
      toast({
        title: "Plan Generated",
        description: "Your plan is ready to execute",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!currentPlan) return;

    try {
      setExecuting(true);
      const result = await apiClient.dispatchJob({ planId: currentPlan.id });
      toast({
        title: "Job Started",
        description: `Job ${result.jobId} has been dispatched`,
      });
      setCurrentPlan(null);
      setPrompt("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute plan",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Chat & Plan</h1>
        <p className="text-muted-foreground">Describe what you want to accomplish, generate a plan, and execute it</p>
      </div>

      {/* Chat Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            What would you like to accomplish?
          </CardTitle>
          <CardDescription>
            Describe your goal and we'll create a plan to achieve it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: 'Create a website for my restaurant with online ordering capabilities'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handlePlan} 
              disabled={!prompt.trim() || loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Generate Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Plan */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Generated Plan
            </CardTitle>
            <CardDescription>
              Review the plan and execute when ready
              {currentPlan.estimatedTime && ` • Estimated time: ${currentPlan.estimatedTime}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentPlan.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    <Badge variant="outline" className="mt-2">
                      Skill: {step.skillId}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleExecute}
                disabled={executing}
                className="flex-1"
              >
                {executing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Execute Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPlan(null)}
                disabled={executing}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      {!currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Examples</CardTitle>
            <CardDescription>Try one of these example prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {[
                "Create a landing page for my SaaS product",
                "Build an e-commerce store with payment processing",
                "Set up a blog with CMS integration",
                "Create a dashboard for data visualization",
              ].map((example) => (
                <Button
                  key={example}
                  variant="ghost"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => setPrompt(example)}
                >
                  <Send className="h-4 w-4 mr-2 flex-shrink-0" />
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}