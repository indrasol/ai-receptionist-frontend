
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import WhiteLabel from "./pages/WhiteLabel";
import Integrations from "./pages/Integrations";
import Tutorials from "./pages/Tutorials";
import StartFree from "./pages/StartFree";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Onboard from "./pages/Onboard";
import ConsoleLayout from "./components/console/ConsoleLayout";
import Dashboard from "./pages/console/Dashboard";
import VoiceRouting from "./pages/console/VoiceRouting";
import Appointments from "./pages/console/Appointments";
import KnowledgeBase from "./pages/console/KnowledgeBase";
import Settings from "./pages/console/Settings";
import CallLogs from "./pages/CallLogs";
import CallSummary from "./pages/CallSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with main layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/features" element={<Layout><Features /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/white-label" element={<Layout><WhiteLabel /></Layout>} />
          <Route path="/integrations" element={<Layout><Integrations /></Layout>} />
          <Route path="/tutorials" element={<Layout><Tutorials /></Layout>} />
          <Route path="/start-free" element={<Layout><StartFree /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/call-logs" element={<Layout><CallLogs /></Layout>} />
          <Route path="/call-summary/:id" element={<Layout><CallSummary /></Layout>} />
          
          {/* Onboarding - no main layout */}
          <Route path="/onboard" element={<Onboard />} />
          
          {/* Console routes with console layout */}
          <Route path="/app/:slug" element={<ConsoleLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="voice-routing" element={<VoiceRouting />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
