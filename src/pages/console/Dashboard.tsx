
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PhoneIncoming, PhoneOutgoing, TrendingUp } from 'lucide-react';
import { mockCalls, kpiData } from '@/data/mockData';

const Dashboard = () => {
  const [animatedKPIs, setAnimatedKPIs] = useState({
    inboundCalls: 0,
    outboundCalls: 0,
    outboundSuccessRate: 0
  });

  // Get business name from onboarding data
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
  const businessName = onboardingData?.businessName || 'there';

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Animate KPI numbers on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setAnimatedKPIs(prev => ({
        inboundCalls: Math.min(prev.inboundCalls + 247 / steps, 247),
        outboundCalls: Math.min(prev.outboundCalls + 89 / steps, 89),
        outboundSuccessRate: Math.min(prev.outboundSuccessRate + 62.5 / steps, 62.5)
      }));
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      setAnimatedKPIs({
        inboundCalls: 247,
        outboundCalls: 89,
        outboundSuccessRate: 62.5
      });
    }, duration);

    return () => clearInterval(timer);
  }, []);

  // Sample 14-day trend data for inbound calls
  const trendData = [
    { date: 'Dec 1', calls: 45 },
    { date: 'Dec 2', calls: 52 },
    { date: 'Dec 3', calls: 48 },
    { date: 'Dec 4', calls: 61 },
    { date: 'Dec 5', calls: 55 },
    { date: 'Dec 6', calls: 67 },
    { date: 'Dec 7', calls: 71 },
    { date: 'Dec 8', calls: 64 },
    { date: 'Dec 9', calls: 58 },
    { date: 'Dec 10', calls: 73 },
    { date: 'Dec 11', calls: 69 },
    { date: 'Dec 12', calls: 81 },
    { date: 'Dec 13', calls: 76 },
    { date: 'Dec 14', calls: 84 },
  ];

  const formatTime = (timestamp: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((timestamp.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {businessName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your AI receptionist today.
        </p>
      </motion.div>

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
                <span className="text-green-600">+4.2%</span> from yesterday
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
                <span className="text-red-600">-1.3%</span> from yesterday
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
                  <span className="text-green-600">+2.1%</span> from yesterday
                </p>
                <p className="text-xs text-gray-500">(Pass Calls/Total Calls)</p>
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
            <CardTitle>Inbound Calls Trend</CardTitle>
            <CardDescription>Daily call volume over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
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
                  formatter={(value, name) => [`${value} calls`, 'Volume']}
                />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#7B61FF"
                  strokeWidth={3}
                  dot={{ fill: '#7B61FF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7B61FF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
