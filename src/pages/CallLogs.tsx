import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, Link2, Phone, CircleDot } from "lucide-react";
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
    const iconClass = "h-4 w-4";
    switch (status) {
      case "pass":
        return <CircleDot className={`${iconClass} text-green-500`} />;
      case "fail":
        return <CircleDot className={`${iconClass} text-red-500`} />;
      case "no-status":
        return <CircleDot className={`${iconClass} text-yellow-500`} />;
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Customer Phone Numbers</TableHead>
                      <TableHead>Success Evaluation</TableHead>
                      <TableHead>Calls</TableHead>
                      <TableHead>Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFiles.includes(resource.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange(resource.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {resource.firstName}
                        </TableCell>
                        <TableCell>{resource.lastName}</TableCell>
                        <TableCell>{resource.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getStatusIcon(resource.successStatus)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary cursor-pointer hover:text-primary/80" />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={resource.summary}>
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