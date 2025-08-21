import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bot, PhoneCall, FileText, Search, Calendar, Building2, Loader2, AlertCircle } from "lucide-react";
import { inboundService, InboundCall } from "@/services/inboundService";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const InboundLogs = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // API data states
  const [inboundCalls, setInboundCalls] = useState<InboundCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCallId, setLoadingCallId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch inbound calls from API
  useEffect(() => {
    const fetchInboundCalls = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await inboundService.getCalls();
        
        if (response.success && response.data) {
          setInboundCalls(response.data);
        } else {
          setError(response.error || 'Failed to fetch inbound calls');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInboundCalls();
  }, [isAuthenticated]);

  // Helper function to format call time from ISO date
  const formatCallTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return '';
    }
  };

  // Helper function to format call status
  const formatCallStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ended':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  // Get unique values for filters
  const uniqueStatuses = [...new Set(inboundCalls.map(call => formatCallStatus(call.call_status)))];
  const uniqueDates = [...new Set(inboundCalls.map(call => call.call_date))];

  // Filter calls based on search and filters
  const filteredCalls = inboundCalls.filter((call) => {
    const matchesSearch = searchTerm === "" || 
      call.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone_number.includes(searchTerm) ||
      call.customer_number.includes(searchTerm);
    
    const matchesDate = selectedDate === "all" || call.call_date === selectedDate;
    const matchesStatus = selectedStatus === "all" || formatCallStatus(call.call_status) === selectedStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCalls = filteredCalls.slice(startIndex, endIndex);

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

  const handleSummaryClick = async (callId: string) => {
    try {
      setLoadingCallId(callId);
      
      const response = await inboundService.getCallById(callId);
      
      if (response.success && response.data) {
        const call = response.data;
        const resource = {
          id: call.id,
          firstName: call.first_name,
          lastName: call.last_name,
          phone: call.phone_number,
          successStatus: call.success_evaluation === "true" ? "pass" as const : 
                         call.success_evaluation === "false" ? "fail" as const : "no-status" as const,
          summary: call.call_summary || "No summary available for this call.",
          transcript: call.call_transcript || "No transcript available for this call.",
          recordingUrl: call.call_recording_url || undefined
        };
        navigate(`call-summary/${call.id}`, { state: { resource } });
      } else {
        // Show error - could use a toast library here, but for now we'll use alert
        setError(`Failed to load call details: ${response.error}`);
      }
    } catch (err) {
      setError(`An error occurred while loading call details: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingCallId(null);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <PhoneCall className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No inbound calls yet.</h3>
      <p className="text-muted-foreground max-w-md">
        Inbound call logs will appear here once your AI receptionist starts receiving calls.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold gradient-primary-text">Inbound Call Logs</h1>
        <p className="text-muted-foreground">
          Track and manage incoming calls handled by your AI receptionist.
        </p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5" />
            Inbound Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-2 h-auto p-1"
                >
                  ✕
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-72"
                disabled={loading}
              />
            </div>
            
            <Select value={selectedDate} onValueChange={setSelectedDate} disabled={loading}>
              <SelectTrigger className="w-auto min-w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={loading}>
              <SelectTrigger className="w-auto min-w-[150px]">
                <Bot className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading inbound calls...</span>
            </div>
          ) : filteredCalls.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Call Date</TableHead>
                    <TableHead>Call Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">{call.first_name}</TableCell>
                      <TableCell>{call.last_name}</TableCell>
                      <TableCell>{call.phone_number}</TableCell>
                      <TableCell>{call.call_date}</TableCell>
                      <TableCell>{formatCallTime(call.created_at)}</TableCell>
                      <TableCell>{call.call_duration_formatted || '--'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          {formatCallStatus(call.call_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSummaryClick(call.id)}
                          disabled={loadingCallId === call.id}
                          className="flex items-center gap-1"
                        >
                          {loadingCallId === call.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          {loadingCallId === call.id ? "Loading..." : "Summary"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {filteredCalls.length > 0 && totalPages > 1 && (
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
    </div>
  );
};

export default InboundLogs;