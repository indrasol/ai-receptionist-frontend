import { useLocation, useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Mic, 
  Calendar, 
  BookOpen, 
  Settings,
  FileText,
  ChevronRight
} from "lucide-react";

const pathMapping: Record<string, { label: string; icon: React.ElementType }> = {
  "dashboard": { label: "Dashboard", icon: Home },
  "out-bound": { label: "Outbound Calls", icon: PhoneOutgoing },
  "in-bound": { label: "Inbound Calls", icon: PhoneIncoming },
  "voice-routing": { label: "Voice Routing", icon: Mic },
  "appointments": { label: "Appointments", icon: Calendar },
  "knowledge-base": { label: "Knowledge Base", icon: BookOpen },
  "settings": { label: "Settings", icon: Settings },
  "call-summary": { label: "Call Summary", icon: FileText },
};

const ConsoleBreadcrumb = () => {
  const location = useLocation();
  const { slug } = useParams();

  // Parse the current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const consoleIndex = pathSegments.indexOf('app');
  
  if (consoleIndex === -1) return null;

  // Extract relevant path segments after /app/:slug
  const relevantSegments = pathSegments.slice(consoleIndex + 2); // Skip 'app' and slug

  // If we're on the root console path, show dashboard
  if (relevantSegments.length === 0) {
    relevantSegments.push('dashboard');
  }

  // Build breadcrumb items
  const breadcrumbItems: Array<{ path: string; label: string; icon: React.ElementType; isLast: boolean }> = [];
  
  let currentPath = `/app/${slug}`;
  
  relevantSegments.forEach((segment, index) => {
    // Skip ID segments (like call summary IDs)
    if (segment.length > 20 || /^[a-zA-Z0-9+/=]{8,}$/.test(segment)) {
      return;
    }
    
    const isLast = index === relevantSegments.length - 1 || 
                   (index === relevantSegments.length - 2 && relevantSegments[index + 1]?.length > 20);
    
    if (index > 0) {
      currentPath += `/${segment}`;
    } else {
      currentPath += segment === 'dashboard' ? '' : `/${segment}`;
    }
    
    const pathInfo = pathMapping[segment];
    if (pathInfo) {
      breadcrumbItems.push({
        path: currentPath,
        label: pathInfo.label,
        icon: pathInfo.icon,
        isLast
      });
    }
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              
              {item.isLast ? (
                <Badge 
                  variant="default" 
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-default"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Badge>
              ) : (
                <Link to={item.path}>
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Badge>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsoleBreadcrumb;