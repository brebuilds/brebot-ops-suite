import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Image, Code, Database, Mail, Calendar, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'documents' | 'images' | 'code' | 'database' | 'email' | 'calendar';
  status: 'processed' | 'processing' | 'failed';
  size: string;
  documents: number;
  lastUpdated: Date;
  description: string;
}

export function KnowledgeSettings() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      name: 'Company Documents',
      type: 'documents',
      status: 'processed',
      size: '45.2 MB',
      documents: 127,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'PDFs, Word docs, and text files'
    },
    {
      id: '2',
      name: 'Email Archive',
      type: 'email',
      status: 'processed',
      size: '128.7 MB',
      documents: 2456,
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: 'Email messages and attachments'
    },
    {
      id: '3',
      name: 'Project Images',
      type: 'images',
      status: 'processing',
      size: '67.3 MB',
      documents: 89,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Screenshots, diagrams, and photos'
    },
    {
      id: '4',
      name: 'Code Repository',
      type: 'code',
      status: 'failed',
      size: '12.8 MB',
      documents: 245,
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'Source code files and documentation'
    },
    {
      id: '5',
      name: 'Calendar Events',
      type: 'calendar',
      status: 'processed',
      size: '2.1 MB',
      documents: 156,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'Meeting notes and event details'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documents': return FileText;
      case 'images': return Image;
      case 'code': return Code;
      case 'database': return Database;
      case 'email': return Mail;
      case 'calendar': return Calendar;
      default: return FileText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return CheckCircle;
      case 'processing': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'default';
      case 'processing': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    setUploading(true);
    console.log('Uploading files:', files);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
    }, 3000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.py,.js,.ts,.jsx,.tsx,.json,.md"
            />
            
            {uploading ? (
              <div className="space-y-4">
                <RefreshCw className="h-8 w-8 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing files...</p>
                  <Progress value={45} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Drop files here or click to upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports PDFs, documents, images, code files, and more
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  Select Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Table */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledgeItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                const StatusIcon = getStatusIcon(item.status);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 text-${getStatusColor(item.status)}`} />
                        <Badge variant={getStatusColor(item.status)} className="capitalize">
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{item.documents.toLocaleString()}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimeAgo(item.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => console.log('Refresh', item.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => console.log('Delete', item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}