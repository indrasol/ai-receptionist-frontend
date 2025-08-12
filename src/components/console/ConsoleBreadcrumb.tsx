import { useLocation, useParams, Link } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  Home, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Mic, 
  Calendar, 
  BookOpen, 
  Settings,
  FileText
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
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div key={item.path} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="flex items-center gap-2 hover:text-primary">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ConsoleBreadcrumb;