import { useParams, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

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

const CallSummary = () => {
  const { id } = useParams();
  const location = useLocation();
  const resource = location.state?.resource as ProjectResource;

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/call-logs">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Call Logs
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                Call summary not found. Please return to the call logs and try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb/Back Navigation */}
        <div className="mb-6">
          <Link to="/call-logs">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Call Logs
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Call Summary - {resource.firstName} {resource.lastName}
          </h1>
          <p className="text-muted-foreground mt-2">
            {resource.phone}
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          {/* Transcript Card */}
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resource.transcript || "No transcript available for this call."}
                readOnly
                className="min-h-[200px] resize-none"
                placeholder="Transcript content will appear here..."
              />
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-foreground">
                  {resource.summary || "No summary available for this call."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call Recording Card */}
          <Card>
            <CardHeader>
              <CardTitle>Call Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {resource.recordingUrl ? (
                <audio 
                  controls 
                  className="w-full"
                  src={resource.recordingUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg border text-center">
                  <p className="text-muted-foreground">
                    No recording available for this call.
                  </p>
                  <audio 
                    controls
                    className="w-full mt-4 opacity-50"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallSummary;