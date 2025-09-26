import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, PhoneIncoming, PhoneOutgoing, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardResponse, inboundService } from '@/services/inboundService';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  // API data states
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation states
  const [animatedKPIs, setAnimatedKPIs] = useState({
    inboundCalls: 0,
    outboundCalls: 0,
    outboundSuccessRate: 0
  });

  // Get user's display name
  const displayName = authLoading ? 'there' : (user?.name || user?.username || user?.email?.split('@')[0] || 'there');

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const { id: receptionistId } = useParams<{ id: string }>();

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await inboundService.getDashboardStats(receptionistId ? [receptionistId] : []);
        
        if (data) {
          setDashboardData(data);
        } else {
          setError(error || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, receptionistId]);

  // Animate KPI numbers when dashboard data is loaded
  useEffect(() => {
    if (!dashboardData) return;

    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    const targetValues = {
      inboundCalls: dashboardData.dashboard.inbound_calls_today,
      outboundCalls: dashboardData.dashboard.outbound_calls_today,
      outboundSuccessRate: dashboardData.dashboard.outbound_success_rate
    };

    const timer = setInterval(() => {
      setAnimatedKPIs(prev => ({
        inboundCalls: Math.min(prev.inboundCalls + targetValues.inboundCalls / steps, targetValues.inboundCalls),
        outboundCalls: Math.min(prev.outboundCalls + targetValues.outboundCalls / steps, targetValues.outboundCalls),
        outboundSuccessRate: Math.min(prev.outboundSuccessRate + targetValues.outboundSuccessRate / steps, targetValues.outboundSuccessRate)
      }));
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      setAnimatedKPIs(targetValues);
    }, duration);

    return () => clearInterval(timer);
  }, [dashboardData]);

  // Process trend data from API
  const trendData = dashboardData?.trends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    inbound: trend.inbound_calls,
    outbound: trend.outbound_calls,
    total: trend.total_calls
  })) || [];

  // Helper function to format percentage change
  const formatPercentageChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {sign}{value.toFixed(1)}%
      </span>
    );
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((timestamp.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  // Refresh dashboard data
  const refreshDashboard = async () => {
    if (!isAuthenticated) return;

    try {
      setError(null);
      
      const response = await inboundService.getDashboardStats();
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Failed to refresh dashboard statistics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  // Show loading spinner if still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {displayName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your AI receptionist today.
          </p>
          {dashboardData?.organization && (
            <p className="text-sm text-gray-500 mt-1">
              Organization: {dashboardData.organization.name}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshDashboard}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbound Calls</CardTitle>
              <PhoneIncoming className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(animatedKPIs.inboundCalls)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData ? formatPercentageChange(dashboardData.dashboard.inbound_calls_change_percent) : '--'} from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outbound Calls</CardTitle>
              <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(animatedKPIs.outboundCalls)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData ? formatPercentageChange(dashboardData.dashboard.outbound_calls_change_percent) : '--'} from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outbound Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {animatedKPIs.outboundSuccessRate.toFixed(1)}%
              </div>
              <div className="flex justify-between items-end">
                <p className="text-xs text-muted-foreground">
                  {dashboardData ? formatPercentageChange(dashboardData.dashboard.success_rate_change_percent) : '--'} from yesterday
                </p>
                <p className="text-xs text-gray-500">
                  ({dashboardData?.dashboard.outbound_calls_successful || 0}/{dashboardData?.dashboard.outbound_calls_completed || 0})
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Inbound Calls Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Call Volume Trends</CardTitle>
            <CardDescription>Daily call volume over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Calls', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value, name) => {
                      const labels = {
                        inbound: 'Inbound Calls',
                        outbound: 'Outbound Calls',
                        total: 'Total Calls'
                      };
                      return [`${value} calls`, labels[name as keyof typeof labels] || name];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inbound"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outbound"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#F59E0B' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#7B61FF"
                    strokeWidth={3}
                    dot={{ fill: '#7B61FF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#7B61FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
