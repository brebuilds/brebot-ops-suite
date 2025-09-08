import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiClient, type Artifact } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Search, File, Image, Video, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobIdFilter, setJobIdFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async (jobId?: string) => {
    try {
      setLoading(true);
      const artifactsData = await apiClient.listArtifacts(jobId);
      setArtifacts(artifactsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load artifacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadArtifacts(jobIdFilter || undefined);
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.includes('video')) return <Video className="h-4 w-4 text-purple-500" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className="h-4 w-4 text-orange-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const downloadArtifact = (artifact: Artifact) => {
    window.open(artifact.url, '_blank');
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
        <h1 className="text-2xl font-bold">Artifacts</h1>
        <p className="text-muted-foreground">Browse and download job artifacts and outputs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Artifacts</CardTitle>
          <CardDescription>Filter artifacts by job ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Job ID"
              value={jobIdFilter}
              onChange={(e) => setJobIdFilter(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={() => {
              setJobIdFilter("");
              loadArtifacts();
            }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Step ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artifacts.map((artifact) => (
              <TableRow key={artifact.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(artifact.type)}
                    <span className="font-medium">{artifact.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{artifact.type}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{artifact.jobId}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{artifact.stepId}</span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(artifact.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadArtifact(artifact)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {artifacts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {jobIdFilter ? "No artifacts found for this job" : "No artifacts found"}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => loadArtifacts()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}