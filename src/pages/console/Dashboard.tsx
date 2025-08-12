
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Phone, Calendar, TrendingUp, Star, MessageCircle, Clock } from 'lucide-react';
import { mockCalls, kpiData } from '@/data/mockData';

const Dashboard = () => {
  const [animatedKPIs, setAnimatedKPIs] = useState({
    callsHandled: 0,
    bookingsCompleted: 0,
    upsellRate: 0,
    customerSatisfaction: 0
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
        callsHandled: Math.min(prev.callsHandled + kpiData.callsHandled / steps, kpiData.callsHandled),
        bookingsCompleted: Math.min(prev.bookingsCompleted + kpiData.bookingsCompleted / steps, kpiData.bookingsCompleted),
        upsellRate: Math.min(prev.upsellRate + kpiData.upsellRate / steps, kpiData.upsellRate),
        customerSatisfaction: Math.min(prev.customerSatisfaction + kpiData.customerSatisfaction / steps, kpiData.customerSatisfaction)
      }));
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      setAnimatedKPIs(kpiData);
    }, duration);

    return () => clearInterval(timer);
  }, []);

  // Sample chart data
  const chartData = [
    { time: '9 AM', calls: 8 },
    { time: '10 AM', calls: 12 },
    { time: '11 AM', calls: 15 },
    { time: '12 PM', calls: 20 },
    { time: '1 PM', calls: 18 },
    { time: '2 PM', calls: 25 },
    { time: '3 PM', calls: 22 },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calls Handled</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(animatedKPIs.callsHandled)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <ResponsiveContainer width={60} height={20}>
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="calls"
                      stroke="#7B61FF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from yesterday
                </p>
              </div>
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
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(animatedKPIs.bookingsCompleted)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from yesterday
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
              <CardTitle className="text-sm font-medium">Upsell Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {animatedKPIs.upsellRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.5%</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {animatedKPIs.customerSatisfaction.toFixed(1)}/5
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.2</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Call Activity Today</CardTitle>
              <CardDescription>Hourly call volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#7B61FF"
                    strokeWidth={3}
                    dot={{ fill: '#7B61FF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Call Feed
              </CardTitle>
              <CardDescription>Most recent conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCalls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {call.caller}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              call.status === 'completed' ? 'default' :
                              call.status === 'transferred' ? 'secondary' :
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {call.status}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {call.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{call.summary}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(call.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Calls
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
