import { AlertCircle, Bot, CalendarIcon, Circle, Clock, Link2, Loader2, Minus, Phone, PhoneCall, Plus, Search, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lead, VoiceAssistant, outboundService } from "@/services/outboundService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProjectResource {
  id: string;  // Changed from number to string (UUID)
  firstName: string;
  lastName: string;
  phone: string;
  successStatus: "pass" | "fail" | "no-status";
  summary: string;
  transcript?: string;
  recordingUrl?: string;
  source?: string;
  imported_at?: string;
  created_at?: string;
  created_by_user_id?: string;
  created_by_user_email?: string;
  vapi_call_id?: string | null;
  call_status?: string;
  call_summary?: string | null;
  call_recording_url?: string | null;
  call_transcript?: string | null;
  success_evaluation?: string | null;
  sheet_url?: string;
}

const CallLogs = () => {
  const [urlName, setUrlName] = useState("");
  const [url, setUrl] = useState("");
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [voiceAssistants, setVoiceAssistants] = useState<VoiceAssistant[]>([]);
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
  const { isAuthenticated } = useAuth();
  const { id: receptionistId } = useParams<{ id: string }>();

  // Quick call modal state
  const [dialOpen,setDialOpen] = useState(false);
  const [dialNumber,setDialNumber] = useState("");
  const [qcFirst,setQcFirst] = useState("");
  const [qcLast,setQcLast] = useState("");
  const [qcPhone,setQcPhone] = useState("");

  // Google Sheets URL validation function
  const isValidGoogleSheetsUrl = (url: string): boolean => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return false;
    
    // Check if it's a Google Sheets URL
    const googleSheetsPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/;
    return googleSheetsPattern.test(cleanUrl);
  };

  // Load existing leads from API
  const loadExistingLeads = async () => {
    try {
      if (!isAuthenticated) {
        return;
      }

      setIsTableLoading(true);
      const result = await outboundService.getLeads(receptionistId);
      
      if (result.success && result.data) {
        const transformedResources: ProjectResource[] = result.data.map((item: Lead) => ({
          id: item.id,
          firstName: item.first_name || '',
          lastName: item.last_name || '',
          phone: item.phone_number || '',
          successStatus: item.success_evaluation === 'pass' ? 'pass' : 
                        item.success_evaluation === 'fail' ? 'fail' : 'no-status',
          summary: item.call_summary || '',
          transcript: item.call_transcript || '',
          recordingUrl: item.call_recording_url || '',
          source: item.source,
          imported_at: item.imported_at,
          created_at: item.created_at,
          created_by_user_id: item.created_by_user_id,
          created_by_user_email: item.created_by_user_email,
          vapi_call_id: item.vapi_call_id,
          call_status: item.call_status,
          call_summary: item.call_summary,
          call_recording_url: item.call_recording_url,
          call_transcript: item.call_transcript,
          success_evaluation: item.success_evaluation,
          sheet_url: item.sheet_url
        }));
        
        setResources(transformedResources);
        console.log('LoadExistingLeads - Successfully loaded', transformedResources.length, 'leads');
      } else {
        console.error('LoadExistingLeads - API error:', result.error);
        if (result.error?.includes('authentication token') || result.error?.includes('sign in')) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again to access your leads.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load leads",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('LoadExistingLeads - Exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leads';
      
      if (errorMessage.includes('authentication token') || errorMessage.includes('Unauthorized')) {
        toast({
          title: "Authentication Error", 
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsTableLoading(false);
    }
  };

  // Load voice assistants
  const loadVoiceAssistants = async () => {
    try {
      const result = await outboundService.getAssistants();
      
      if (result.success && result.data && result.data.voices && Array.isArray(result.data.voices)) {
        setVoiceAssistants(result.data.voices);
        if (result.data.voices.length > 0 && !selectedAssistant) {
          setSelectedAssistant(result.data.voices[0].display_name);
        }
      } else {
        // Ensure voiceAssistants is always an array
        setVoiceAssistants([]);
        if (result.error?.includes('authentication token') || result.error?.includes('Unauthorized')) {
          // Silent fail for authentication errors - user will see toast from loadExistingLeads
        }
      }
    } catch (err) {
      // Ensure voiceAssistants is always an array on error
      setVoiceAssistants([]);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load voice assistants';
      
      if (errorMessage.includes('authentication token') || errorMessage.includes('Unauthorized')) {
        // Silent fail for authentication errors - user will see toast from loadExistingLeads
      }
    }
  };

  // Load leads and voice assistants on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadExistingLeads();
      loadVoiceAssistants();
    }
  }, [isAuthenticated]);



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

      const result = await outboundService.uploadExcel(file);
      
      if (result.success && result.data) {
        // Transform API response data to match ProjectResource interface
        const transformedResources: ProjectResource[] = result.data.data.map((item) => ({
          id: item.id,
          firstName: item.FirstName || '',
          lastName: item.LastName || '',
          phone: item.PhoneNumber || '',
          successStatus: item.success_evaluation === 'pass' ? 'pass' : 
                        item.success_evaluation === 'fail' ? 'fail' : 'no-status',
          summary: item.call_summary || '',
          transcript: item.call_transcript || '',
          recordingUrl: item.call_recording_url || '',
          source: item.source,
          imported_at: item.imported_at,
          created_at: item.created_at,
          created_by_user_id: item.created_by_user_id,
          created_by_user_email: item.created_by_user_email,
          vapi_call_id: item.vapi_call_id,
          call_status: item.call_status,
          call_summary: item.call_summary,
          call_recording_url: item.call_recording_url,
          call_transcript: item.call_transcript,
          success_evaluation: item.success_evaluation,
          sheet_url: item.filename
        }));
        
        // Reload all leads to get the updated list
        await loadExistingLeads();
        
        toast({
          title: "File imported successfully",
          description: result.data.message || `Imported ${result.data.rows_count} records from ${file.name}`
        });
      } else {
        throw new Error(result.error || 'Failed to upload file');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      
      if (errorMessage.includes('authentication token') || errorMessage.includes('Unauthorized')) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Import failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheets URL.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidGoogleSheetsUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Sheets URL. The URL should start with https://docs.google.com/spreadsheets/",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "Please log in to upload Google Sheets data.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log('handleAddUrl - URL:', url);
    
    try {
      const result = await outboundService.uploadUrl(url);
      
      if (result.success && result.data) {
        // Reload all leads to get the updated list
        await loadExistingLeads();
        
        toast({
          title: "Google Sheets imported successfully",
          description: result.data.message || `Imported ${result.data.rows_count} records`
        });
        setUrlName("");
        setUrl("");
      } else {
        throw new Error(result.error || 'Failed to import Google Sheets data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import Google Sheets data';
      setError(errorMessage);
      
      if (errorMessage.includes('authentication token') || errorMessage.includes('Unauthorized')) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Import failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle calling selected leads
  const handleCallSelected = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to call.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAssistant) {
      toast({
        title: "No assistant selected",
        description: "Please select a voice assistant for the calls.",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "Please log in to initiate calls.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Use selected string IDs directly (now UUIDs)
      const leadIds = selectedFiles;
      
      const result = await outboundService.callLeads(leadIds, selectedAssistant);
      
      if (result.success && result.data) {
        // Reload leads to get updated call status
        await loadExistingLeads();
        
        toast({
          title: "Calls initiated successfully",
          description: result.data.message || `Initiated ${result.data.successful_calls} calls with ${result.data.voice_used} voice assistant`
        });
        
        // Clear selected files
        setSelectedFiles([]);
      } else {
        throw new Error(result.error || 'Failed to initiate calls');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate calls';
      
      if (errorMessage.includes('authentication token') || errorMessage.includes('Unauthorized')) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Call initiation failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
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
    navigate(`./call-summary/${resource.id.toString()}`, { 
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

  // Get unique values for filters
  const uniqueStatuses = [...new Set(resources.map(resource => resource.successStatus))];

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

  const addDigit = (digit: string) => {
    if (digit === '⌫') {
      setQcPhone(p => p.slice(0, -1));
    } else {
      setQcPhone(p => p + digit);
    }
  };

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

        {/* Top action grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload file card – existing markup remains */}
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

          {/* Add URL card – existing markup remains */}
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

          {/* Quick Call card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Call</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="First name" value={qcFirst} onChange={e=>setQcFirst(e.target.value)} />
              <Input placeholder="Last name"  value={qcLast} onChange={e=>setQcLast(e.target.value)} />
              <Input value={qcPhone} onChange={e=>setQcPhone(e.target.value)} placeholder="+ number" />
              <div className="grid grid-cols-3 gap-2">
                {['1','2','3','4','5','6','7','8','9','+','0','⌫'].map(d=>(
                  <Button key={d} variant="outline" onClick={()=>addDigit(d)}>{d}</Button>
                ))}
              </div>
              {/* Assistant selector hidden for now - using default voice */}
              <Button disabled={!qcPhone}
                onClick={async ()=>{
                  const res = await outboundService.callNumber({receptionist_id: receptionistId!, phone: qcPhone, first_name: qcFirst, last_name: qcLast});
                  if(res.success){
                    toast({title:'Call initiated'});
                    setQcFirst(''); setQcLast(''); setQcPhone('');
                    loadExistingLeads();
                  }else{
                    toast({variant:'destructive', title:'Error', description: res.error});
                  }
                }}>
                Call Now
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
                  {/* Assistant selector hidden for now */}
                  {/*<Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={loading}>*/}
                  {/*  ...*/}
                  {/*</Select>*/}
                  <input type="hidden" />
                  <Button 
                    onClick={handleCallSelected} 
                    className="flex items-center gap-2"
                    disabled={selectedFiles.length === 0 || !selectedAssistant || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PhoneCall className="h-4 w-4" />
                    )}
                    Call Selected ({selectedFiles.length})
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
                    {isTableLoading ? (
                      // Loading skeleton rows
                      Array.from({ length: itemsPerPage }).map((_, index) => (
                        <TableRow key={`loading-${index}`} className="border-b border-border/20">
                          <TableCell className="py-4">
                            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      paginatedResources.map((resource, index) => (
                      <TableRow 
                        key={resource.id.toString()} 
                        className={`
                          border-b border-border/20 
                          hover:bg-muted/20 
                          transition-colors duration-200
                          ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                        `}
                      >
                        <TableCell className="py-4">
                          <Checkbox
                            checked={selectedFiles.includes(resource.id.toString())}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange(resource.id.toString(), checked as boolean)
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
                      ))
                    )}
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

        {/* Quick Call Dialog */}
        <Dialog open={dialOpen} onOpenChange={setDialOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quick Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="First name" value={qcFirst} onChange={e=>setQcFirst(e.target.value)} />
              <Input placeholder="Last name" value={qcLast} onChange={e=>setQcLast(e.target.value)} />
              <div className="border rounded px-3 py-2 text-xl tracking-wider text-center">{dialNumber || '+ number'}</div>
              <div className="grid grid-cols-3 gap-2">
                {['1','2','3','4','5','6','7','8','9','+','0','⌫'].map(ch=>(
                  <Button key={ch} variant="secondary" onClick={()=>{
                    if(ch==='⌫') setDialNumber(p=>p.slice(0,-1));
                    else setDialNumber(p=>p+ch);
                  }}>{ch}</Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={()=>setDialOpen(false)}>Cancel</Button>
              <Button disabled={!dialNumber} onClick={async ()=>{
                const res = await outboundService.callNumber({phone:dialNumber,firstName:qcFirst,lastName:qcLast,voiceId:selectedAssistant});
                if(res.success) toast({title:'Call initiated'}); else toast({variant:'destructive',title:'Error',description:res.error});
                setDialOpen(false);
                loadExistingLeads();
              }}>Call Now</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CallLogs;