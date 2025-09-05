import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Database, Folder, Mail, FileText, Play, RefreshCw } from "lucide-react";

interface SourcesStepProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface Source {
  id: string;
  type: 'email' | 'folder' | 'notion' | 'obsidian';
  name: string;
  path: string;
  active: boolean;
  icon: any;
}

export function SourcesStep({ onComplete, isCompleted }: SourcesStepProps) {
  const [sources, setSources] = useState<Source[]>([
    { id: '1', type: 'email', name: 'IMAP Email', path: '', active: false, icon: Mail },
    { id: '2', type: 'folder', name: 'Local Inbox', path: '/inbox', active: true, icon: Folder },
    { id: '3', type: 'notion', name: 'Notion Import', path: '', active: false, icon: FileText },
    { id: '4', type: 'obsidian', name: 'Obsidian Vault', path: '', active: false, icon: Database },
  ]);

  const [ingestProgress, setIngestProgress] = useState({
    processedNotes: 0,
    processedChunks: 0,
    embedded: 0,
    isRunning: false,
    jobId: null as string | null,
  });

  const updateSource = (id: string, updates: Partial<Source>) => {
    setSources(prev => prev.map(source => 
      source.id === id ? { ...source, ...updates } : source
    ));
  };

  const startIngest = async () => {
    const activeSource = sources.find(s => s.active);
    if (!activeSource) return;

    setIngestProgress(prev => ({ ...prev, isRunning: true }));
    
    // Mock API call to start ingest
    const response = await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: 1, path: activeSource.path }),
    }).catch(() => ({ 
      ok: true, 
      json: () => Promise.resolve({ jobId: 'mock-job-123' }) 
    }));
    
    if (response.ok) {
      const data = await response.json();
      setIngestProgress(prev => ({ ...prev, jobId: data.jobId }));
      
      // Mock progress updates
      const mockProgress = () => {
        setIngestProgress(prev => {
          if (!prev.isRunning) return prev;
          
          const notes = Math.min(prev.processedNotes + Math.floor(Math.random() * 5) + 1, 45);
          const chunks = Math.min(prev.processedChunks + Math.floor(Math.random() * 8) + 2, 156);
          const embedded = Math.min(prev.embedded + Math.floor(Math.random() * 6) + 1, 142);
          
          if (notes >= 45 && chunks >= 156 && embedded >= 142) {
            setTimeout(() => {
              setIngestProgress(p => ({ ...p, isRunning: false }));
              if (!isCompleted) onComplete();
            }, 1000);
          }
          
          return {
            ...prev,
            processedNotes: notes,
            processedChunks: chunks,
            embedded: embedded,
          };
        });
      };
      
      const interval = setInterval(mockProgress, 800);
      setTimeout(() => clearInterval(interval), 15000);
    }
  };

  const isIngestReady = sources.some(s => s.active && s.path);

  return (
    <div className="space-y-8">
      {/* Sources Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Data Sources</h3>
        
        <div className="grid gap-4">
          {sources.map((source) => {
            const Icon = source.icon;
            return (
              <Card key={source.id} className={`transition-all ${
                source.active ? 'border-primary/50 bg-primary/5' : 'border-card-border'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      source.active ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        source.active ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{source.name}</Label>
                        <Switch
                          checked={source.active}
                          onCheckedChange={(checked) => 
                            updateSource(source.id, { active: checked })
                          }
                        />
                      </div>
                      
                      <Input
                        placeholder={
                          source.type === 'email' ? 'imap.gmail.com:993' :
                          source.type === 'folder' ? '/path/to/inbox' :
                          source.type === 'notion' ? 'Notion API token' :
                          '/path/to/vault'
                        }
                        value={source.path}
                        onChange={(e) => updateSource(source.id, { path: e.target.value })}
                        disabled={!source.active}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ingest Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Data Processing</h3>
          <Button 
            onClick={startIngest}
            disabled={!isIngestReady || ingestProgress.isRunning}
            className="flex items-center gap-2"
          >
            {ingestProgress.isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {ingestProgress.isRunning ? 'Processing...' : 'Start Ingest'}
          </Button>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Notes</span>
                  <Badge variant="outline">{ingestProgress.processedNotes}/45</Badge>
                </div>
                <Progress value={(ingestProgress.processedNotes / 45) * 100} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chunks</span>
                  <Badge variant="outline">{ingestProgress.processedChunks}/156</Badge>
                </div>
                <Progress value={(ingestProgress.processedChunks / 156) * 100} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Embeddings</span>
                  <Badge variant="outline">{ingestProgress.embedded}/142</Badge>
                </div>
                <Progress value={(ingestProgress.embedded / 142) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        {ingestProgress.jobId && (
          <div className="text-sm text-muted-foreground">
            Job ID: {ingestProgress.jobId}
          </div>
        )}
      </div>

      {/* Status */}
      {!ingestProgress.isRunning && ingestProgress.processedNotes > 0 && (
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm font-medium">
                Processing complete! Indexed {ingestProgress.processedNotes} notes with {ingestProgress.embedded} embeddings.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}