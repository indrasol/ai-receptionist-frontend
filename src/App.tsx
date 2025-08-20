import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Appointments from "./pages/console/Appointments";
import CallSummary from "./pages/CallSummary";
import ConsoleLayout from "./components/console/ConsoleLayout";
import Contact from "./pages/Contact";
import Dashboard from "./pages/console/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Features from "./pages/Features";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import InboundLogs from "./pages/InboundLogs";
import Integrations from "./pages/Integrations";
import KnowledgeBase from "./pages/console/KnowledgeBase";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Onboard from "./pages/Onboard";
import OutboundLogs from "./pages/OutboundLogs";
import Pricing from "./pages/Pricing";
import Register from "./pages/Register";
import Settings from "./pages/console/Settings";
import { Toaster as Sonner } from "@/components/ui/sonner";
import StartFree from "./pages/StartFree";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Tutorials from "./pages/Tutorials";
import VoiceRouting from "./pages/console/VoiceRouting";
import WhiteLabel from "./pages/WhiteLabel";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes - no layout */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Public routes with main layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/features" element={<Layout><Features /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/white-label" element={<Layout><WhiteLabel /></Layout>} />
            <Route path="/integrations" element={<Layout><Integrations /></Layout>} />
            <Route path="/tutorials" element={<Layout><Tutorials /></Layout>} />
            <Route path="/start-free" element={<Layout><StartFree /></Layout>} />
            <Route path="/out-bound" element={<Layout><OutboundLogs /></Layout>} />
            <Route path="/in-bound" element={<Layout><InboundLogs /></Layout>} />
            <Route path="/call-logs" element={<Navigate to="/out-bound" replace />} />
            <Route path="/call-summary/:id" element={<Layout><CallSummary /></Layout>} />
            
            {/* Onboarding - no main layout */}
            <Route path="/onboard" element={<Onboard />} />
            
            {/* Console routes with console layout */}
            <Route path="/app/:slug" element={<ConsoleLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="out-bound" element={<OutboundLogs />} />
              <Route path="out-bound/call-summary/:id" element={<CallSummary />} />
              <Route path="in-bound" element={<InboundLogs />} />
              <Route path="in-bound/call-summary/:id" element={<CallSummary />} />
              <Route path="voice-routing" element={<VoiceRouting />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
