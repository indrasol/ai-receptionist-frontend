import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bot, PhoneCall, FileText, Search, Calendar, Building2 } from "lucide-react";
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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedAssistant, setSelectedAssistant] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Generate stable IDs for placeholder data
  const generateStableId = (firstName: string, lastName: string, phone: string) => {
    const data = `${firstName}-${lastName}-${phone}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  };

  // Placeholder data for inbound calls
  const inboundCalls = [
    {
      id: generateStableId("John", "Doe", "(555) 123-4567"),
      firstName: "John",
      lastName: "Doe",
      leadPhoneNumber: "(555) 123-4567",
      callDate: "2025-08-11",
      callTime: "14:30",
      companyName: "Acme Corp",
      assistant: "Mary Smith"
    },
    {
      id: generateStableId("Jane", "Smith", "(555) 234-5678"),
      firstName: "Jane",
      lastName: "Smith",
      leadPhoneNumber: "(555) 234-5678",
      callDate: "2025-08-11",
      callTime: "15:45",
      companyName: "Tech Solutions",
      assistant: "John Wilson"
    },
    {
      id: generateStableId("Bob", "Johnson", "(555) 345-6789"),
      firstName: "Bob",
      lastName: "Johnson",
      leadPhoneNumber: "(555) 345-6789",
      callDate: "2025-08-11",
      callTime: "16:20",
      companyName: "Global Industries",
      assistant: "Sarah Davis"
    },
    {
      id: generateStableId("Alice", "Brown", "(555) 456-7890"),
      firstName: "Alice",
      lastName: "Brown",
      leadPhoneNumber: "(555) 456-7890",
      callDate: "2025-08-10",
      callTime: "09:15",
      companyName: "Digital Ventures",
      assistant: "Mary Smith"
    },
    {
      id: generateStableId("Charlie", "Wilson", "(555) 567-8901"),
      firstName: "Charlie",
      lastName: "Wilson",
      leadPhoneNumber: "(555) 567-8901",
      callDate: "2025-08-10",
      callTime: "11:30",
      companyName: "Innovation Labs",
      assistant: "John Wilson"
    },
    {
      id: generateStableId("Diana", "Martinez", "(555) 678-9012"),
      firstName: "Diana",
      lastName: "Martinez",
      leadPhoneNumber: "(555) 678-9012",
      callDate: "2025-08-10",
      callTime: "13:45",
      companyName: "Future Tech",
      assistant: "Sarah Davis"
    },
    {
      id: generateStableId("Edward", "Taylor", "(555) 789-0123"),
      firstName: "Edward",
      lastName: "Taylor",
      leadPhoneNumber: "(555) 789-0123",
      callDate: "2025-08-09",
      callTime: "10:20",
      companyName: "Smart Systems",
      assistant: "Mary Smith"
    },
    {
      id: generateStableId("Fiona", "Anderson", "(555) 890-1234"),
      firstName: "Fiona",
      lastName: "Anderson",
      leadPhoneNumber: "(555) 890-1234",
      callDate: "2025-08-09",
      callTime: "14:15",
      companyName: "Cloud Services",
      assistant: "John Wilson"
    },
    {
      id: generateStableId("George", "Thompson", "(555) 901-2345"),
      firstName: "George",
      lastName: "Thompson",
      leadPhoneNumber: "(555) 901-2345",
      callDate: "2025-08-09",
      callTime: "16:50",
      companyName: "Data Analytics Co",
      assistant: "Sarah Davis"
    },
    {
      id: generateStableId("Helen", "Garcia", "(555) 012-3456"),
      firstName: "Helen",
      lastName: "Garcia",
      leadPhoneNumber: "(555) 012-3456",
      callDate: "2025-08-08",
      callTime: "08:30",
      companyName: "AI Solutions",
      assistant: "Mary Smith"
    },
    {
      id: generateStableId("Ivan", "Rodriguez", "(555) 111-2222"),
      firstName: "Ivan",
      lastName: "Rodriguez",
      leadPhoneNumber: "(555) 111-2222",
      callDate: "2025-08-08",
      callTime: "12:45",
      companyName: "Automation Inc",
      assistant: "John Wilson"
    },
    {
      id: generateStableId("Julia", "Lee", "(555) 333-4444"),
      firstName: "Julia",
      lastName: "Lee",
      leadPhoneNumber: "(555) 333-4444",
      callDate: "2025-08-08",
      callTime: "15:25",
      companyName: "Robotics Ltd",
      assistant: "Sarah Davis"
    }
  ];

  // Get unique values for filters
  const uniqueAssistants = [...new Set(inboundCalls.map(call => call.assistant))];
  const uniqueCompanies = [...new Set(inboundCalls.map(call => call.companyName))];
  const uniqueDates = [...new Set(inboundCalls.map(call => call.callDate))];

  // Filter calls based on search and filters
  const filteredCalls = inboundCalls.filter((call) => {
    const matchesSearch = searchTerm === "" || 
      call.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.leadPhoneNumber.includes(searchTerm) ||
      call.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate === "all" || call.callDate === selectedDate;
    const matchesAssistant = selectedAssistant === "all" || call.assistant === selectedAssistant;
    const matchesCompany = selectedCompany === "all" || call.companyName === selectedCompany;
    
    return matchesSearch && matchesDate && matchesAssistant && matchesCompany;
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

  const handleSummaryClick = (id: string) => {
    // Create a placeholder resource for the call summary
    const call = inboundCalls.find(c => c.id === id);
    if (call) {
      const resource = {
        id: call.id,
        firstName: call.firstName,
        lastName: call.lastName,
        phone: call.leadPhoneNumber,
        successStatus: "pass" as const,
        summary: `Call summary for ${call.firstName} ${call.lastName} from ${call.companyName}. Call received on ${call.callDate} at ${call.callTime} and was handled by assistant ${call.assistant}.`,
        transcript: `[${call.callTime}] Assistant: Hello, thank you for calling. How can I help you today?\n[${call.callTime}] ${call.firstName}: Hi, I'm calling about your services...\n[${call.callTime}] Assistant: I'd be happy to help you with that. Let me get some information from you...`,
        recordingUrl: undefined
      };
      navigate(`call-summary/${id}`, { state: { resource } });
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
            Leads Inbound Calls Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
              <SelectTrigger className="w-[150px]">
                <Bot className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Assistant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assistants</SelectItem>
                {uniqueAssistants.map((assistant) => (
                  <SelectItem key={assistant} value={assistant}>{assistant}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[150px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredCalls.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Lead Phone Number</TableHead>
                    <TableHead>Call Date</TableHead>
                    <TableHead>Call Time</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Assistant</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">{call.firstName}</TableCell>
                      <TableCell>{call.lastName}</TableCell>
                      <TableCell>{call.leadPhoneNumber}</TableCell>
                      <TableCell>{call.callDate}</TableCell>
                      <TableCell>{call.callTime}</TableCell>
                      <TableCell>{call.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <Bot className="w-3 h-3" />
                          {call.assistant}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSummaryClick(call.id)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Summary
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