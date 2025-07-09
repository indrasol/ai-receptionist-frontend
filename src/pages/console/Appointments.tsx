
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar, Search, Filter, Phone, Mail, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { mockAppointments } from '@/data/mockData';

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = mockAppointments.filter(apt => {
    const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage bookings made by your AI receptionist.
          </p>
        </div>
        <Button className="gradient-primary text-white">
          <Calendar className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">appointments scheduled</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-500">total bookings</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-gray-500">ready to go</p>
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
              <CardTitle className="text-base">No-Show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8%</div>
              <p className="text-xs text-gray-500">this month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
        </div>
      </motion.div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>
              Click on an appointment to view details and take actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment, index) => (
                  <Sheet key={appointment.id}>
                    <SheetTrigger asChild>
                      <motion.tr
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <TableCell className="font-medium">{appointment.customerName}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatDate(appointment.date)}</div>
                            <div className="text-sm text-gray-500">{appointment.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === 'confirmed' ? 'default' :
                              appointment.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {appointment.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {appointment.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </motion.tr>
                    </SheetTrigger>

                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Appointment Details</SheetTitle>
                        <SheetDescription>
                          Manage this appointment and communicate with the customer.
                        </SheetDescription>
                      </SheetHeader>
                      
                      {selectedAppointment && (
                        <div className="space-y-6 mt-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold">Customer Information</h3>
                              <div className="space-y-2 mt-2">
                                <p><strong>Name:</strong> {selectedAppointment.customerName}</p>
                                <p><strong>Email:</strong> {selectedAppointment.email}</p>
                                <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold">Appointment Details</h3>
                              <div className="space-y-2 mt-2">
                                <p><strong>Service:</strong> {selectedAppointment.service}</p>
                                <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
                                <p><strong>Time:</strong> {selectedAppointment.time}</p>
                                <p><strong>Status:</strong> 
                                  <Badge className="ml-2" variant={
                                    selectedAppointment.status === 'confirmed' ? 'default' :
                                    selectedAppointment.status === 'pending' ? 'secondary' :
                                    'destructive'
                                  }>
                                    {selectedAppointment.status}
                                  </Badge>
                                </p>
                              </div>
                            </div>

                            {selectedAppointment.notes && (
                              <div>
                                <h3 className="font-semibold">Notes</h3>
                                <p className="text-sm text-gray-600 mt-2">{selectedAppointment.notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 pt-4 border-t">
                            <Button className="w-full gradient-primary text-white">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm Appointment
                            </Button>
                            <Button variant="outline" className="w-full">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Customer
                            </Button>
                            <Button variant="destructive" className="w-full">
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Appointment
                            </Button>
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Appointments;
