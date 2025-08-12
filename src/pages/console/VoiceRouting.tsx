
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Settings, ArrowRight, Phone, Clock } from 'lucide-react';

const VoiceRouting = () => {
  const routes = [
    {
      id: '1',
      name: 'General Inquiries',
      condition: 'Default route',
      action: 'AI handles FAQ',
      active: true,
      callsToday: 127
    },
    {
      id: '2',
      name: 'Sales Team',
      condition: 'Keywords: "price", "buy", "purchase"',
      action: 'Transfer to ext. 101',
      active: true,
      callsToday: 43
    },
    {
      id: '3',
      name: 'Technical Support',
      condition: 'Keywords: "bug", "error", "technical"',
      action: 'Transfer to ext. 102',
      active: true,
      callsToday: 18
    },
    {
      id: '4',
      name: 'Billing Questions',
      condition: 'Keywords: "billing", "payment", "invoice"',
      action: 'AI handles + escalate if needed',
      active: false,
      callsToday: 0
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Voice Routing</h1>
          <p className="text-gray-600 mt-2">
            Configure how calls are routed based on customer intent and keywords.
          </p>
        </div>
        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </motion.div>

      {/* Visual Flow (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Call Flow Designer
            </CardTitle>
            <CardDescription>
              Visual flowchart coming soon. For now, manage routes in the table below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">🚧</div>
                <p className="text-gray-500 font-medium">Drag & Drop Flow Builder</p>
                <p className="text-sm text-gray-400">Coming in the next update</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Routes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Current Routes</CardTitle>
            <CardDescription>
              Manage your call routing rules and view performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Calls Today</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route, index) => (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{route.condition}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {route.action.includes('Transfer') && (
                          <Phone className="w-3 h-3 mr-1 text-blue-500" />
                        )}
                        {route.action}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={route.active ? "default" : "secondary"}>
                        {route.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-gray-400" />
                        {route.callsToday}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">78%</div>
              <p className="text-xs text-gray-500 mt-1">Calls resolved without transfer</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Average Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <p className="text-xs text-gray-500 mt-1">From call start to first response</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Transfer Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-xs text-gray-500 mt-1">Successful transfers to humans</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceRouting;
