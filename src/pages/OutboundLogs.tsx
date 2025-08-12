import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, Link2, Phone, Circle, Loader2, AlertCircle, Plus, Minus, Bot, PhoneCall, CalendarIcon, Clock, Search, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProjectResource {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  successStatus: "pass" | "fail" | "no-status";
  summary: string;
  transcript?: string;
  recordingUrl?: string;
}

const CallLogs = () => {
  const [urlName, setUrlName] = useState("");
  const [url, setUrl] = useState("");
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ProjectResource | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssistant, setFilterAssistant] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Header mapping for flexible parsing
  const headerMappings = {
    firstName: ['first name', 'firstname', 'first_name'],
    lastName: ['last name', 'lastname', 'last_name'],
    phone: ['customer phone numbers', 'lead phone number', 'phone', 'phone number'],
    successStatus: ['success evaluation', 'status', 'result'],
    calls: ['calls', 'call count'],
    summary: ['summary', 'notes', 'description'],
    transcript: ['transcript', 'call transcript'],
    recordingUrl: ['recording url', 'recording', 'call recording']
  };

  const normalizeHeader = (header: string): string | null => {
    const normalized = header.toLowerCase().trim();
    for (const [key, aliases] of Object.entries(headerMappings)) {
      if (aliases.includes(normalized)) {
        return key;
      }
    }
    return null;
  };

  const normalizeSuccessStatus = (value: string): "pass" | "fail" | "no-status" => {
    const normalized = value.toLowerCase().trim();
    if (['pass', 'green', 'success', 'ok', 'yes'].includes(normalized)) {
      return 'pass';
    }
    if (['fail', 'red', 'failed', 'no'].includes(normalized)) {
      return 'fail';
    }
    return 'no-status';
  };

  const normalizePhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return digits;
  };

  const parseDataToResources = (data: any[]): ProjectResource[] => {
    if (data.length === 0) return [];
    
    const headers = Object.keys(data[0]);
    const mapping: Record<string, string> = {};
    
    headers.forEach(header => {
      const normalized = normalizeHeader(header);
      if (normalized) {
        mapping[normalized] = header;
      }
    });

    return data.filter(row => {
      // Skip empty rows
      return Object.values(row).some(value => value && value.toString().trim());
    }).map((row, index) => ({
      id: (index + 1).toString(),
      firstName: row[mapping.firstName] || '',
      lastName: row[mapping.lastName] || '',
      phone: row[mapping.phone] ? normalizePhoneNumber(row[mapping.phone].toString()) : '',
      successStatus: row[mapping.successStatus] ? normalizeSuccessStatus(row[mapping.successStatus].toString()) : 'no-status',
      summary: row[mapping.summary] || '',
      transcript: row[mapping.transcript] || '',
      recordingUrl: row[mapping.recordingUrl] || ''
    }));
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        throw new Error('Please upload a valid .xlsx, .xls, or .csv file');
      }

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const parsedResources = parseDataToResources(jsonData);
      
      if (parsedResources.length === 0) {
        throw new Error('No valid data found in the file');
      }
      
      setResources(parsedResources);
      toast({
        title: "File imported successfully",
        description: `Imported ${parsedResources.length} records from ${file.name}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse file';
      setError(errorMessage);
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = async () => {
    if (!urlName.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both URL name and URL fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Convert Google Sheets edit URL to CSV export URL
      let csvUrl = url;
      const sheetsMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (sheetsMatch) {
        const sheetId = sheetsMatch[1];
        const gidMatch = url.match(/gid=([0-9]+)/);
        const gid = gidMatch ? gidMatch[1] : '0';
        csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      }
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Sheets data. Make sure the sheet is public (Anyone with the link can view).');
      }
      
      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: 'string' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const parsedResources = parseDataToResources(jsonData);
      
      if (parsedResources.length === 0) {
        throw new Error('No valid data found in the Google Sheet');
      }
      
      setResources(parsedResources);
      toast({
        title: "Google Sheets imported successfully",
        description: `Imported ${parsedResources.length} records from ${urlName}`
      });
      setUrlName("");
      setUrl("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import Google Sheets data';
      setError(errorMessage);
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: "pass" | "fail" | "no-status") => {
    const iconClass = "h-5 w-5 fill-current";
    switch (status) {
      case "pass":
        return (
          <div className="flex items-center gap-2">
            <Circle className={`${iconClass} text-green-500`} />
            <span className="text-green-700 font-medium">Pass</span>
          </div>
        );
      case "fail":
        return (
          <div className="flex items-center gap-2">
            <Circle className={`${iconClass} text-red-500`} />
            <span className="text-red-700 font-medium">Fail</span>
          </div>
        );
      case "no-status":
        return (
          <div className="flex items-center gap-2">
            <Circle className={`${iconClass} text-yellow-500`} />
            <span className="text-yellow-700 font-medium">No Status</span>
          </div>
        );
    }
  };

  const handleCheckboxChange = (resourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, resourceId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== resourceId));
    }
  };

  const handleCallAction = (resource: ProjectResource) => {
    setSelectedResource(resource);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleCall = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for the call.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Call Scheduled",
      description: `Call scheduled for ${selectedResource?.firstName} ${selectedResource?.lastName} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    });

    // Reset form and close modal
    setSelectedDate(undefined);
    setSelectedTime("");
    setIsScheduleModalOpen(false);
    setSelectedResource(null);
  };

  const handleCancelSchedule = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setIsScheduleModalOpen(false);
    setSelectedResource(null);
  };

  const handleSummaryView = (resource: ProjectResource) => {
    navigate(`call-summary/${resource.id}`, { 
      state: { resource } 
    });
  };

  const handleAddOrganization = () => {
    if (!organizationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Organization Added",
      description: `Added organization: ${organizationName}`,
    });
  };

  const handleRemoveOrganization = () => {
    setOrganizationName("");
    toast({
      title: "Organization Removed",
      description: "Organization has been cleared.",
    });
  };

  const handleAutoCall = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select leads to start auto calling.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Auto Call Started",
      description: `Starting auto call for ${selectedFiles.length} selected leads with ${selectedAssistant || 'default'} assistant.`,
    });
  };

  // Get unique values for filters
  const uniqueStatuses = [...new Set(resources.map(resource => resource.successStatus))];
  const assistantOptions = ["assistant-1", "assistant-2", "assistant-3"];

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = searchTerm === "" || 
      resource.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || resource.successStatus === filterStatus;
    const matchesAssistant = filterAssistant === "all" || filterAssistant === selectedAssistant;
    
    return matchesSearch && matchesStatus && matchesAssistant;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  };

  // Call resetPagination when filters change
  useState(() => {
    resetPagination();
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Outbound Call Logs</h1>
        </div>


        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

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
                {isLoading ? (
                  <>
                    <Loader2 className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
                    <p className="text-muted-foreground mb-4">Processing file...</p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your .xlsx, .xls, or .csv files here, or click to browse
                    </p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept=".xlsx,.xls,.csv"
                    />
                    <Label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </Label>
                  </>
                )}
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
              <Button onClick={handleAddUrl} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import from Google Sheets'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Leads Calls Info Table */}
        {resources.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                Import a file or Google Sheet to see Leads Calls Info.
              </p>
            </CardContent>
          </Card>
        )}
        
        {resources.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leads Outbound Calls Info</CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
                    <SelectTrigger className="w-auto min-w-[180px]">
                      <Bot className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select Assistant" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px]">
                      <SelectItem value="assistant-1">Assistant 1</SelectItem>
                      <SelectItem value="assistant-2">Assistant 2</SelectItem>
                      <SelectItem value="assistant-3">Assistant 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAutoCall} className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4" />
                    Auto Call
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex gap-4 items-center justify-between mb-6 flex-wrap">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-auto min-w-[150px]">
                    <Circle className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[200px]">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="fail">Fail</SelectItem>
                    <SelectItem value="no-status">No Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30">
                      <TableHead className="w-12 font-bold text-foreground">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="font-bold text-foreground">First Name</TableHead>
                      <TableHead className="font-bold text-foreground">Last Name</TableHead>
                      <TableHead className="font-bold text-foreground">Lead Phone Number</TableHead>
                      <TableHead className="font-bold text-foreground">Status</TableHead>
                      <TableHead className="font-bold text-foreground">Action</TableHead>
                      <TableHead className="font-bold text-foreground">Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResources.map((resource, index) => (
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
                          {getStatusIcon(resource.successStatus)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handleCallAction(resource)}
                          >
                            <Phone className="h-4 w-4" />
                            Call
                          </Button>
                        </TableCell>
                        <TableCell className="py-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handleSummaryView(resource)}
                          >
                            Summary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredResources.length > 0 && totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Schedule Call Modal */}
        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Call</DialogTitle>
              {selectedResource && (
                <p className="text-sm text-muted-foreground">
                  Scheduling call for {selectedResource.firstName} {selectedResource.lastName} ({selectedResource.phone})
                </p>
              )}
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Select Date - Calendar View */}
              <div className="space-y-2">
                <Label>Select Date</Label>
                <div className="border rounded-lg p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </div>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label>Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="09:30">9:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="12:30">12:30 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="13:30">1:30 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="14:30">2:30 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="15:30">3:30 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="16:30">4:30 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelSchedule}>
                Cancel
              </Button>
              <Button onClick={handleScheduleCall}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CallLogs;