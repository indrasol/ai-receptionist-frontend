import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Bot, PhoneCall, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InboundLogs = () => {
  const navigate = useNavigate();

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
    }
  ];

  const handleSummaryClick = (id: string) => {
    navigate(`/call-summary/${id}`);
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
    <div className="container mx-auto p-6 space-y-6">
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5" />
              Leads Inbound Calls Info
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Assistants Dropdown */}
              <Select>
                <SelectTrigger className="w-48">
                  <Bot className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Assistant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assistants</SelectItem>
                  <SelectItem value="mary">Mary Smith</SelectItem>
                  <SelectItem value="john">John Wilson</SelectItem>
                  <SelectItem value="sarah">Sarah Davis</SelectItem>
                </SelectContent>
              </Select>

              {/* Auto Call Button */}
              <Button variant="outline" className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                Auto Call
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {inboundCalls.length === 0 ? (
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
                  {inboundCalls.map((call) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InboundLogs;