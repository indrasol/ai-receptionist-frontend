import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Plus, Settings, ArrowRight, Edit, Trash2, Search, Filter, Calendar, Tag, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface Receptionist {
  id: string;
  name: string;
  description: string;
  useCase?: string;
  createdAt: string;
}

const Launch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receptionistData, setReceptionistData] = useState({
    name: '',
    description: '',
    useCase: ''
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByUseCase, setFilterByUseCase] = useState('all');
  const [filterByCreated, setFilterByCreated] = useState('all');

  // Initialize receptionists from localStorage or use mock data
  const getInitialReceptionists = (): Receptionist[] => {
    const saved = localStorage.getItem('receptionists');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default mock data
    return [
      {
        id: '1',
        name: 'Customer Service Bot',
        description: 'Handles customer inquiries and support requests with friendly, professional responses.',
        useCase: 'Customer Support',
        createdAt: new Date().toISOString().split('T')[0] // Today
      },
      {
        id: '2',
        name: 'Appointment Scheduler',
        description: 'Manages appointment bookings, cancellations, and reminders for healthcare practices.',
        useCase: 'Healthcare',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days ago
      },
      {
        id: '3',
        name: 'Sales Assistant',
        description: 'Helps qualify leads and provides product information to potential customers.',
        useCase: 'Sales',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 20 days ago
      },
      {
        id: '4',
        name: 'Technical Support',
        description: 'Provides technical assistance and troubleshooting guidance for software issues.',
        useCase: 'Support',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days ago
      }
    ];
  };

  const [receptionists, setReceptionists] = useState<Receptionist[]>(getInitialReceptionists);

  // Save initial data to localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem('receptionists');
    if (!saved) {
      localStorage.setItem('receptionists', JSON.stringify(getInitialReceptionists()));
    }
  }, []); // Empty dependency array - only run once on mount

  // Get organization name from user data or fallback
  const organizationName = user?.organization_name || user?.organizationName || 'Your Organization';

  // Get unique use cases for filter dropdown
  const availableUseCases = [...new Set(receptionists.map(r => r.useCase).filter(Boolean))];

  // Helper function to check if date matches filter
  const matchesDateFilter = (createdAt: string, filter: string) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    switch (filter) {
      case 'today':
        return createdDate >= startOfDay;
      case 'week':
        const weekAgo = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        return createdDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000);
        return createdDate >= monthAgo;
      case 'year':
        const yearAgo = new Date(startOfDay.getTime() - 365 * 24 * 60 * 60 * 1000);
        return createdDate >= yearAgo;
      default:
        return true;
    }
  };

  // Filter and sort receptionists
  const filteredReceptionists = receptionists
    .filter(receptionist => {
      // Search filter
      const matchesSearch = !searchQuery || 
        receptionist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receptionist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (receptionist.useCase && receptionist.useCase.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Use case filter
      const matchesUseCase = filterByUseCase === 'all' || receptionist.useCase === filterByUseCase;
      
      // Created date filter
      const matchesCreated = filterByCreated === 'all' || matchesDateFilter(receptionist.createdAt, filterByCreated);
      
      return matchesSearch && matchesUseCase && matchesCreated;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleCreateReceptionist = () => {
    if (receptionistData.name && receptionistData.description) {
      // Create new receptionist object
      const newReceptionist: Receptionist = {
        id: Date.now().toString(), // Generate unique ID
        name: receptionistData.name,
        description: receptionistData.description,
        useCase: receptionistData.useCase,
        createdAt: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
      };

      // Add to receptionists list
      const updatedReceptionists = [...receptionists, newReceptionist];
      setReceptionists(updatedReceptionists);
      
      // Save to localStorage to share with other pages
      localStorage.setItem('receptionists', JSON.stringify(updatedReceptionists));
      
      // Close modal and reset form
      setIsModalOpen(false);
      setReceptionistData({
        name: '',
        description: '',
        useCase: ''
      });
    }
  };

  const handleReceptionistClick = (receptionistId: string) => {
    navigate(`/knowledge/${receptionistId}`);
  };

  const handleEditReceptionist = (e: React.MouseEvent, receptionist: Receptionist) => {
    e.stopPropagation(); // Prevent card click
    // In a real app, this would open an edit modal with pre-filled data
    setReceptionistData({
      name: receptionist.name,
      description: receptionist.description,
      useCase: receptionist.useCase || ''
    });
    setIsModalOpen(true);
    // For now, we'll delete the old one when a new one is created
    // In a real app, you'd have edit functionality
  };

  const handleDeleteReceptionist = (e: React.MouseEvent, receptionistId: string) => {
    e.stopPropagation(); // Prevent card click
    if (confirm('Are you sure you want to delete this receptionist?')) {
      const updatedReceptionists = receptionists.filter(r => r.id !== receptionistId);
      setReceptionists(updatedReceptionists);
      // Save to localStorage
      localStorage.setItem('receptionists', JSON.stringify(updatedReceptionists));
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-gradient-to-br from-background via-muted/30 to-background overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-16 sm:w-32 h-16 sm:h-32 bg-primary/10 rounded-full blur-2xl sm:blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 bg-secondary/10 rounded-full blur-2xl sm:blur-3xl"></div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 px-2">
            Welcome {organizationName}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Manage your AI receptionists and launch new ones
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full mb-6 sm:mb-8 px-2 sm:px-0"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search receptionists by name, description, or use case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {/* Use Case Filter */}
              <Select value={filterByUseCase} onValueChange={setFilterByUseCase}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Use Cases</SelectItem>
                  {availableUseCases.map((useCase) => (
                    <SelectItem key={useCase} value={useCase!}>
                      {useCase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Created Date Filter */}
              <Select value={filterByCreated} onValueChange={setFilterByCreated}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by created" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results Summary and Clear Filters */}
          {(searchQuery || filterByUseCase !== 'all' || filterByCreated !== 'all') && (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReceptionists.length} of {receptionists.length} receptionists
                {searchQuery && ` matching "${searchQuery}"`}
                {filterByUseCase !== 'all' && ` in "${filterByUseCase}"`}
                {filterByCreated !== 'all' && ` created ${filterByCreated === 'today' ? 'today' : 
                  filterByCreated === 'week' ? 'in last 7 days' :
                  filterByCreated === 'month' ? 'in last 30 days' :
                  filterByCreated === 'year' ? 'in last year' : filterByCreated}`}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterByUseCase('all');
                  setFilterByCreated('all');
                  setSortBy('newest');
                }}
                className="text-xs"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </motion.div>

        {/* Launch New Receptionist Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8 sm:mb-12 px-4"
        >
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 hover-glow w-full sm:w-auto max-w-sm"
              >
                <div className="relative mr-2">
                  <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-white/20 rounded flex items-center justify-center">
                    <Bot className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-green-400 rounded-full border border-white flex items-center justify-center">
                    <Phone className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 text-white" />
                  </div>
                </div>
                Launch your new Receptionist
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-5 h-5 gradient-primary rounded flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white flex items-center justify-center">
                      <Phone className="w-1 h-1 text-white" />
                    </div>
                  </div>
                  Create New Receptionist
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="receptionist-name">Receptionist Name</Label>
                  <Input
                    id="receptionist-name"
                    placeholder="e.g., Customer Service Bot"
                    value={receptionistData.name}
                    onChange={(e) => setReceptionistData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receptionist-description">Description</Label>
                  <Textarea
                    id="receptionist-description"
                    placeholder="Describe what this receptionist will handle..."
                    rows={4}
                    value={receptionistData.description}
                    onChange={(e) => setReceptionistData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="use-case">Use Case (Optional)</Label>
                  <Input
                    id="use-case"
                    placeholder="e.g., Customer Support, Healthcare, Sales"
                    value={receptionistData.useCase}
                    onChange={(e) => setReceptionistData(prev => ({ ...prev, useCase: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    This section can be extended with predefined use case templates
                  </p>
                </div>

                <Button 
                  onClick={handleCreateReceptionist}
                  className="w-full"
                  disabled={!receptionistData.name || !receptionistData.description}
                >
                  Create Receptionist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Receptionist Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full px-2 sm:px-0"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 text-center sm:text-left">Your Receptionists</h2>
          
          {receptionists.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground/30 rounded-full border-2 border-background flex items-center justify-center">
                    <Phone className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No receptionists yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create your first AI receptionist to get started
                </p>
              </CardContent>
            </Card>
          ) : filteredReceptionists.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No receptionists found</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
              {filteredReceptionists.map((receptionist, index) => (
                <motion.div
                  key={receptionist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="h-full"
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 group h-full flex flex-col"
                    onClick={() => handleReceptionistClick(receptionist.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-md">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                              <Phone className="w-1.5 h-1.5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditReceptionist(e, receptionist)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteReceptionist(e, receptionist.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {receptionist.name}
                      </CardTitle>
                      {receptionist.useCase && (
                        <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full w-fit font-semibold">
                          {receptionist.useCase}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <CardDescription className="text-sm mb-3 flex-1">
                        {receptionist.description}
                      </CardDescription>
                      <div className="text-xs text-muted-foreground mt-auto">
                        <span><span className="font-semibold">Created:</span> {new Date(receptionist.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              

            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Launch;
