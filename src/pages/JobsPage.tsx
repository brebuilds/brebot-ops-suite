import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { apiClient, type Job, type JobStep } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    
    // Poll every 5 seconds
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      const isInitialLoad = loading;
      if (!isInitialLoad) setRefreshing(true);
      
      const jobsData = await apiClient.listJobs();
      setJobs(jobsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadJobDetails = async (jobId: string) => {
    try {
      const jobDetails = await apiClient.getJob(jobId);
      setSelectedJob(jobDetails);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
    }
  };

  const retryJob = async (jobId: string, stepNo?: number) => {
    try {
      await apiClient.retryJobStep(jobId, stepNo);
      toast({
        title: "Success",
        description: "Job retry initiated",
      });
      loadJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry job",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Monitor and manage job executions</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadJobs}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm">{job.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    {getStatusBadge(job.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {job.steps?.length || 0} steps
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadJobDetails(job.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px] sm:w-[800px]">
                        <SheetHeader>
                          <SheetTitle>Job Details: {job.id}</SheetTitle>
                        </SheetHeader>
                        {selectedJob && (
                          <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium">Status</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusIcon(selectedJob.status)}
                                  {getStatusBadge(selectedJob.status)}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium">Plan ID</h3>
                                <p className="text-sm font-mono mt-1">{selectedJob.planId}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Steps</h3>
                              <div className="space-y-2">
                                {selectedJob.steps?.map((step: JobStep) => (
                                  <Card key={step.id}>
                                    <CardHeader className="pb-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <CardTitle className="text-sm">
                                            Step {step.stepNo}: {step.name}
                                          </CardTitle>
                                          <div className="flex items-center gap-2 mt-1">
                                            {getStatusIcon(step.status)}
                                            {getStatusBadge(step.status)}
                                          </div>
                                        </div>
                                        {step.status === 'failed' && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => retryJob(selectedJob.id, step.stepNo)}
                                          >
                                            <RefreshCw className="h-3 w-3 mr-1" />
                                            Retry
                                          </Button>
                                        )}
                                      </div>
                                    </CardHeader>
                                    {step.logs && (
                                      <CardContent className="pt-0">
                                        <h4 className="text-xs font-medium mb-2">Logs</h4>
                                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                          {step.logs}
                                        </pre>
                                      </CardContent>
                                    )}
                                    {step.artifacts && step.artifacts.length > 0 && (
                                      <CardContent className="pt-0">
                                        <h4 className="text-xs font-medium mb-2">Artifacts</h4>
                                        <div className="flex gap-2 flex-wrap">
                                          {step.artifacts.map((artifact, i) => (
                                            <Badge key={i} variant="outline">{artifact}</Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                    {job.status === 'failed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryJob(job.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No jobs found</p>
            <Button variant="outline" className="mt-4" onClick={loadJobs}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}