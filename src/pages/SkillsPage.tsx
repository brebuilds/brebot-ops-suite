import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient, type Skill } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Settings, Shield, Play } from "lucide-react";

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const skillsData = await apiClient.listSkills();
      setSkills(skillsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePolicy = async (skillId: string, policy: 'assist' | 'approve' | 'auto_safe') => {
    try {
      await apiClient.updateSkillPolicy(skillId, policy);
      setSkills(skills.map(skill => 
        skill.id === skillId ? { ...skill, policy } : skill
      ));
      toast({
        title: "Success",
        description: "Skill policy updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skill policy",
        variant: "destructive",
      });
    }
  };

  const getPolicyBadge = (policy: string) => {
    switch (policy) {
      case 'auto_safe':
        return <Badge variant="default" className="bg-green-500"><Play className="h-3 w-3 mr-1" />Auto Safe</Badge>;
      case 'approve':
        return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />Approve</Badge>;
      case 'assist':
        return <Badge variant="outline"><Settings className="h-3 w-3 mr-1" />Assist</Badge>;
      default:
        return <Badge variant="outline">{policy}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills Management</h1>
        <p className="text-muted-foreground">Configure policies for AI skills and capabilities</p>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  <CardDescription>{skill.description}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {getPolicyBadge(skill.policy)}
                  <Select
                    value={skill.policy}
                    onValueChange={(value: 'assist' | 'approve' | 'auto_safe') => 
                      updatePolicy(skill.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assist">Assist</SelectItem>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="auto_safe">Auto Safe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {skills.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No skills configured yet</p>
            <Button variant="outline" className="mt-4" onClick={loadSkills}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}