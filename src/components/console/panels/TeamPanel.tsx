import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Settings } from "lucide-react";

export function TeamPanel() {
  const actors = [
    { 
      role: 'ceo', 
      name: 'Chief Executive Officer', 
      description: 'Strategic leadership and high-level decision making',
      allowedTools: ['budget_approval', 'strategic_planning', 'investor_relations'],
      color: 'bg-red-500'
    },
    { 
      role: 'designer', 
      name: 'Design Lead', 
      description: 'Visual design, UX/UI, and brand consistency',
      allowedTools: ['design_tools', 'asset_creation', 'brand_guidelines'],
      color: 'bg-blue-500'
    },
    { 
      role: 'content', 
      name: 'Content Manager', 
      description: 'Content creation, copywriting, and content strategy',
      allowedTools: ['content_creation', 'social_media', 'blog_management'],
      color: 'bg-green-500'
    },
    { 
      role: 'manager', 
      name: 'Project Manager', 
      description: 'Team coordination, project planning, and resource allocation',
      allowedTools: ['project_management', 'team_coordination', 'reporting'],
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Team Management</h2>
        <p className="text-muted-foreground">Overview of team roles and permissions</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {actors.map((actor) => (
          <Card key={actor.role} className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${actor.color}`}>
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg">{actor.name}</h3>
                  <Badge className={`${actor.color} text-white`}>
                    {actor.role.toUpperCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{actor.description}</p>
              
              <div>
                <h4 className="font-medium mb-2">Allowed Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {actor.allowedTools.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}