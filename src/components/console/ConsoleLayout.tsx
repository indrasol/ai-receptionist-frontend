
import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, Home, Mic, Calendar, BookOpen, Settings, Menu, LogOut, Phone, PhoneOutgoing, PhoneIncoming, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConsoleBreadcrumb from './ConsoleBreadcrumb';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: 'dashboard' },
  { icon: PhoneIncoming, label: 'Inbound', path: 'in-bound' },
  { icon: PhoneOutgoing, label: 'Outbound', path: 'out-bound' },
  // { icon: Mic, label: 'Voice Routing', path: 'voice-routing' },
  // { icon: Calendar, label: 'Appointments', path: 'appointments' },
  // { icon: BookOpen, label: 'Knowledge Base', path: 'knowledge-base' },
  // { icon: Settings, label: 'Settings', path: 'settings' },
];

const ConsoleLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { slug, id: receptionistId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  
  // Determine if we're in a receptionist-specific route
  const isReceptionistRoute = location.pathname.startsWith('/receptionist/');
  const currentReceptionistId = isReceptionistRoute ? receptionistId : null;

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const navigateToPath = (path: string) => {
    if (isReceptionistRoute) {
      navigate(`/receptionist/${receptionistId}/${path}`);
    } else {
      navigate(`/app/${slug}/${path}`);
    }
  };

  // Get onboarding data
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
  const businessName = onboardingData?.businessName || 'Your Business';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 relative z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Phone className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <span className="font-heading font-semibold text-gray-900">AI Receptionist</span>
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.aside
            initial={false}
            animate={{
              width: sidebarExpanded ? 250 : 72,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="bg-white border-r border-gray-200 flex flex-col"
          >
            <div className="p-4">
              <motion.h2
                initial={false}
                animate={{
                  opacity: sidebarExpanded ? 1 : 0,
                  x: sidebarExpanded ? 0 : -10
                }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-gray-900 truncate"
              >
                {sidebarExpanded && businessName}
              </motion.h2>
            </div>

            <nav className="flex-1 px-2">
              <ul className="space-y-1">
                {/* Back to Knowledge Link */}
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start h-10 text-primary hover:bg-primary/10",
                      !sidebarExpanded && "px-3"
                    )}
                    onClick={() => {
                      if (currentReceptionistId) {
                        navigate(`/knowledge/${currentReceptionistId}`);
                      } else {
                        navigate('/launch');
                      }
                    }}
                  >
                    <ArrowLeft className={cn("w-4 h-4", sidebarExpanded && "mr-3")} />
                    <motion.span
                      initial={false}
                      animate={{
                        opacity: sidebarExpanded ? 1 : 0,
                        width: sidebarExpanded ? "auto" : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="truncate"
                    >
                      {sidebarExpanded && "Back to Knowledge"}
                    </motion.span>
                  </Button>
                </li>
                
                {/* Separator */}
                <li className="py-2">
                  <div className="border-t border-gray-200"></div>
                </li>
                
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start h-10",
                          isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                          !sidebarExpanded && "px-3"
                        )}
                        onClick={() => navigateToPath(item.path)}
                      >
                        <Icon className={cn("w-4 h-4", sidebarExpanded && "mr-3")} />
                        <motion.span
                          initial={false}
                          animate={{
                            opacity: sidebarExpanded ? 1 : 0,
                            width: sidebarExpanded ? "auto" : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="truncate"
                        >
                          {sidebarExpanded && item.label}
                        </motion.span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <div className="p-6">
              <ConsoleBreadcrumb />
              <div className="-mt-6">
                <Outlet />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ConsoleLayout;
