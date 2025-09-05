import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Eye } from "lucide-react";

interface IdentityStepProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export function IdentityStep({ onComplete, isCompleted }: IdentityStepProps) {
  const [voice, setVoice] = useState({
    candid_formal: [50],
    playful_serious: [50],
    brief_detailed: [50],
  });
  
  const [preferences, setPreferences] = useState({
    always_use_steps: true,
    include_tldr: false,
  });
  
  const [boundaries, setBoundaries] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    // Mock API call
    const payload = {
      voice: {
        candid_formal: voice.candid_formal[0],
        playful_serious: voice.playful_serious[0],
        brief_detailed: voice.brief_detailed[0],
      },
      preferences,
      boundaries,
    };
    
    console.log("Saving values:", payload);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete();
  };

  const generatePreview = () => {
    const traits = [];
    if (voice.candid_formal[0] < 40) traits.push("candid");
    else if (voice.candid_formal[0] > 60) traits.push("formal");
    
    if (voice.playful_serious[0] < 40) traits.push("playful");
    else if (voice.playful_serious[0] > 60) traits.push("serious");
    
    if (voice.brief_detailed[0] < 40) traits.push("concise");
    else if (voice.brief_detailed[0] > 60) traits.push("detailed");

    return `I'm a ${traits.join(", ")} AI assistant. ${
      preferences.always_use_steps ? "I'll break down complex tasks into clear steps. " : ""
    }${
      preferences.include_tldr ? "I'll provide TL;DR summaries when appropriate. " : ""
    }${
      boundaries ? `My boundaries include: ${boundaries}` : ""
    }`;
  };

  return (
    <div className="space-y-8">
      {/* Voice Sliders */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Voice & Personality</h3>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Communication Style</Label>
              <Badge variant="outline">
                {voice.candid_formal[0] < 40 ? "Candid" : 
                 voice.candid_formal[0] > 60 ? "Formal" : "Balanced"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-16">Candid</span>
              <Slider
                value={voice.candid_formal}
                onValueChange={(value) => setVoice(prev => ({ ...prev, candid_formal: value }))}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-16 text-right">Formal</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Tone</Label>
              <Badge variant="outline">
                {voice.playful_serious[0] < 40 ? "Playful" : 
                 voice.playful_serious[0] > 60 ? "Serious" : "Balanced"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-16">Playful</span>
              <Slider
                value={voice.playful_serious}
                onValueChange={(value) => setVoice(prev => ({ ...prev, playful_serious: value }))}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-16 text-right">Serious</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Response Length</Label>
              <Badge variant="outline">
                {voice.brief_detailed[0] < 40 ? "Brief" : 
                 voice.brief_detailed[0] > 60 ? "Detailed" : "Balanced"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-16">Brief</span>
              <Slider
                value={voice.brief_detailed}
                onValueChange={(value) => setVoice(prev => ({ ...prev, brief_detailed: value }))}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-16 text-right">Detailed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Response Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="steps"
              checked={preferences.always_use_steps}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, always_use_steps: !!checked }))
              }
            />
            <Label htmlFor="steps" className="text-sm">
              Always break down complex tasks into numbered steps
            </Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="tldr"
              checked={preferences.include_tldr}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, include_tldr: !!checked }))
              }
            />
            <Label htmlFor="tldr" className="text-sm">
              Include TL;DR summaries for long responses
            </Label>
          </div>
        </div>
      </div>

      {/* Boundaries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Boundaries & Guidelines</h3>
        <Textarea
          placeholder="Define what BreBot should and shouldn't do. For example: 'Never delete files without explicit confirmation', 'Always ask before sending emails', etc."
          value={boundaries}
          onChange={(e) => setBoundaries(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <Card className="bg-muted/30 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Voice Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{generatePreview()}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? "Hide" : "Preview"}
        </Button>
        
        <Button onClick={handleSave} disabled={isCompleted}>
          <Save className="h-4 w-4 mr-2" />
          {isCompleted ? "Saved" : "Save Identity"}
        </Button>
      </div>
    </div>
  );
}