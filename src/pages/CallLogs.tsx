import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, Link2, Phone, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectResource {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  successStatus: "pass" | "fail" | "no-status";
  summary: string;
}

const CallLogs = () => {
  const [urlName, setUrlName] = useState("");
  const [url, setUrl] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock data for the table
  const mockResources: ProjectResource[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      successStatus: "pass",
      summary: "Successful call completion with customer satisfaction"
    },
    {
      id: "2", 
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1 (555) 987-6543",
      successStatus: "no-status",
      summary: "Call in progress, awaiting evaluation"
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      phone: "+1 (555) 456-7890",
      successStatus: "fail",
      summary: "Call failed due to technical issues"
    }
  ];

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setHasContent(true);
      toast({
        title: "File uploaded successfully",
        description: `${files[0].name} has been uploaded.`
      });
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setHasContent(true);
      toast({
        title: "File uploaded successfully",
        description: `${files[0].name} has been uploaded.`
      });
    }
  };

  const handleAddUrl = () => {
    if (urlName.trim() && url.trim()) {
      setHasContent(true);
      toast({
        title: "URL added successfully",
        description: `${urlName} has been added to your resources.`
      });
      setUrlName("");
      setUrl("");
    } else {
      toast({
        title: "Error",
        description: "Please fill in both URL name and URL fields.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: "pass" | "fail" | "no-status") => {
    const iconClass = "h-5 w-5 fill-current";
    switch (status) {
      case "pass":
        return <Circle className={`${iconClass} text-green-500`} />;
      case "fail":
        return <Circle className={`${iconClass} text-red-500`} />;
      case "no-status":
        return <Circle className={`${iconClass} text-yellow-500`} />;
    }
  };

  const handleCheckboxChange = (resourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, resourceId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== resourceId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Call Logs</h1>
        </div>

        {/* Top Section - Two Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload File Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Add URL Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Add URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url-name">URL Name</Label>
                <Input
                  id="url-name"
                  placeholder="Enter URL name"
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAddUrl} className="w-full">
                Add URL
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Resources Table */}
        {hasContent && (
          <Card>
            <CardHeader>
              <CardTitle>Project Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30">
                      <TableHead className="w-12 font-bold text-foreground">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="font-bold text-foreground">First Name</TableHead>
                      <TableHead className="font-bold text-foreground">Last Name</TableHead>
                      <TableHead className="font-bold text-foreground">Customer Phone Numbers</TableHead>
                      <TableHead className="font-bold text-foreground">Success Evaluation</TableHead>
                      <TableHead className="font-bold text-foreground">Calls</TableHead>
                      <TableHead className="font-bold text-foreground">Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResources.map((resource, index) => (
                      <TableRow 
                        key={resource.id} 
                        className={`
                          border-b border-border/20 
                          hover:bg-muted/20 
                          transition-colors duration-200
                          ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                        `}
                      >
                        <TableCell className="py-4">
                          <Checkbox
                            checked={selectedFiles.includes(resource.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange(resource.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-foreground py-4">
                          {resource.firstName}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-4">{resource.lastName}</TableCell>
                        <TableCell className="font-mono text-sm py-4">{resource.phone}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center">
                            {getStatusIcon(resource.successStatus)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary cursor-pointer hover:text-primary/80 transition-colors" />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs py-4">
                          <div className="truncate text-muted-foreground" title={resource.summary}>
                            {resource.summary}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CallLogs;