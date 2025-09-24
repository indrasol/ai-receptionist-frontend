import { ArrowRight, Bot, Calendar, Edit, Filter, Loader2, LogOut, Phone, Plus, Search, Settings, Tag, Trash2, User } from 'lucide-react';
import { Assistant, PhoneNumber, receptionistService } from '@/services/receptionistService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { type ReceptionistRecord } from '@/services/receptionistService';

interface Receptionist {
  id: string;
  name: string;
  description: string;
  assistant?: string;
  phoneNumber?: string;
  createdAt: string;
}

const Launch = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const organizationName = currentUser?.organization_name ?? 'Your Organization';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [receptionistData, setReceptionistData] = useState({
    name: '',
    description: '',
    assistant: '',
    phoneNumber: ''
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByUseCase, setFilterByUseCase] = useState('all');
  const [filterByCreated, setFilterByCreated] = useState('all');

  // API data states
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loadingAssistants, setLoadingAssistants] = useState(false);
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(false);

  // Fallback data in case API calls fail
  const fallbackAssistants: Assistant[] = [
    {
      display_name: "Alex",
      age: "22",
      gender: "male",
      ethnicity: "white",
      tone: "deeper tone",
      personality: ["calming", "professional"],
      description: "22 year old white male with deeper tone, calming and professional"
    },
    {
      display_name: "Emma",
      age: "23",
      gender: "female",
      ethnicity: "american",
      description: "23 year old American female"
    },
    {
      display_name: "Priya",
      age: "30",
      gender: "female",
      ethnicity: "indian",
      personality: ["professional", "charming"],
      description: "30 year old Indian female, professional and charming"
    }
  ];

  const fallbackPhoneNumbers: PhoneNumber[] = [
    {
      id: "phone_001",
      number: "+1-555-123-6186",
      provider: "Twilio",
      country: "US",
      country_code: "+1",
      status: "active",
      description: "US local number for general outbound calls"
    },
    {
      id: "phone_002",
      number: "+1-555-123-6187",
      provider: "Twilio",
      country: "US",
      country_code: "+1", 
      status: "active",
      description: "US local number for sales calls"
    }
  ];

  // Initialize receptionists from localStorage or use mock data
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch assistants and phone numbers on component mount, but only if user is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchAssistants();
      fetchPhoneNumbers();
    } else {
      // Use fallback data when user is not authenticated
      console.warn('User not authenticated, using fallback data for assistants and phone numbers');
      setAssistants(fallbackAssistants);
      setPhoneNumbers(fallbackPhoneNumbers);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadReceptionists = async () => {
      try {
        const { data, error } = await receptionistService.getReceptionists();
        if (error) {
          toast.error(error);
          return;
        }

        const mapped: Receptionist[] = (data?.receptionists || []).map((r: ReceptionistRecord) => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          assistant: r.assistant_voice || '',
          phoneNumber: r.phone_number || '',
          createdAt: r.created_at || '',
        }));

        setReceptionists(mapped);
      } catch (e) {
        toast.error('Failed to load receptionists');
      }
    };

    if (currentUser) {
      loadReceptionists();
    }
  }, [currentUser]);

  const fetchAssistants = async () => {
    if (!currentUser) {
      console.warn('Cannot fetch assistants: User not authenticated');
      return;
    }
    
    setLoadingAssistants(true);
    try {
      const response = await receptionistService.getAssistants();
      if (response.data) {
        setAssistants(response.data.assistants);
      } else if (response.error) {
        console.error('Failed to load assistants:', response.error);
        toast.error(`Failed to load assistants: ${response.error}`);
      }
    } catch (error) {
      console.error('Error fetching assistants:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load assistants';
      
      // Use fallback data when API fails
      console.warn('Using fallback assistants data due to API error');
      setAssistants(fallbackAssistants);
      
      if (errorMessage.includes('authentication token')) {
        toast.error('Please sign in to load latest assistants. Using default options.');
      } else {
        toast.error(`Failed to load assistants from server. Using default options.`);
      }
    } finally {
      setLoadingAssistants(false);
    }
  };

  const fetchPhoneNumbers = async () => {
    if (!currentUser) {
      console.warn('Cannot fetch phone numbers: User not authenticated');
      return;
    }
    
    setLoadingPhoneNumbers(true);
    try {
      const response = await receptionistService.getPhoneNumbers();
      if (response.data) {
        setPhoneNumbers(response.data.phone_numbers);
      } else if (response.error) {
        console.error('Failed to load phone numbers:', response.error);
        toast.error(`Failed to load phone numbers: ${response.error}`);
      }
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load phone numbers';
      
      // Use fallback data when API fails
      console.warn('Using fallback phone numbers data due to API error');
      setPhoneNumbers(fallbackPhoneNumbers);
      
      if (errorMessage.includes('authentication token')) {
        toast.error('Please sign in to load latest phone numbers. Using default options.');
      } else {
        toast.error(`Failed to load phone numbers from server. Using default options.`);
      }
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  // Helper function to get assistant display name
  const getAssistantDisplayName = (assistantValue: string) => {
    const assistant = assistants.find(a => a.display_name.toLowerCase() === assistantValue.toLowerCase());
    return assistant ? assistant.display_name : assistantValue;
  };

  // Helper function to get phone number display
  const getPhoneNumberDisplay = (phoneValue: string) => {
    const phone = phoneNumbers.find(p => p.number === phoneValue);
    return phone ? phone.number : phoneValue;
  };

  // Helper function to get avatar gradient based on assistant properties
  const getAssistantAvatarStyle = (assistant: Assistant) => {
    // Using consistent yellow brand color for all avatars
    return 'gradient-primary'; // Yellow brand color
  };

  // Helper function to get avatar URL from DiceBear (free avatar service)
  const getAvatarUrl = (assistant: Assistant, size: number = 40) => {
    const seed = assistant.display_name.toLowerCase().replace(/\s+/g, '');
    const style = assistant.gender === 'female' ? 'avataaars' : 'micah';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=${size}&backgroundColor=transparent`;
  };

  // Helper function to determine if we should use generated avatar or gradient
  const shouldUseGeneratedAvatar = (assistant: Assistant) => {
    // 🎨 AVATAR STYLE: Using beautiful gradient avatars with initials and brand colors
    return false; // Using gradient avatars with initials for clean, branded look
  };

  // Helper function to get better initials from assistant name
  const getAssistantInitials = (name: string) => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      // First letter of first name + first letter of last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else {
      // Just first two letters of single name
      return name.substring(0, 2).toUpperCase();
    }
  };

  // Get organization name from user data or fallback with title casing
  const getFormattedOrganizationName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get unique assistants for filter dropdown (if needed in future)
  const availableAssistants = [...new Set(receptionists.map(r => r.assistant).filter(Boolean))];

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
        (receptionist.assistant && receptionist.assistant.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (receptionist.phoneNumber && receptionist.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Use case filter (keeping for backwards compatibility, always true now)
      const matchesUseCase = true;
      
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

  const handleCreateReceptionist = async () => {
    if (!receptionistData.name || !receptionistData.description) return;

    try {
      setIsCreating(true);
      const { data, error } = await receptionistService.createReceptionist({
        name: receptionistData.name,
        description: receptionistData.description,
        assistant_voice: receptionistData.assistant,
        phone_number: receptionistData.phoneNumber,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Receptionist created');
      if (data) {
        // Map backend fields to card model
        const rec: Receptionist = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          assistant: data.assistant_voice || '',
          phoneNumber: data.phone_number || '',
          createdAt: data.created_at || new Date().toISOString(),
        };
        setReceptionists(prev => [...prev, rec]);
      } else {
        // Fallback: refetch list
        const { data: listData } = await receptionistService.getReceptionists();
        if (listData) {
          const mapped = listData.receptionists.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description || '',
            assistant: r.assistant_voice || '',
            phoneNumber: r.phone_number || '',
            createdAt: r.created_at,
          }));
          setReceptionists(mapped);
        }
      }

      setIsModalOpen(false);
      setReceptionistData({ name: '', description: '', assistant: '', phoneNumber: '' });
    } catch (e) {
      toast.error('Failed to create receptionist');
    } finally {
      setIsCreating(false);
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
      assistant: receptionist.assistant || '',
      phoneNumber: receptionist.phoneNumber || ''
    });
    setIsModalOpen(true);
    // For now, we'll delete the old one when a new one is created
    // In a real app, you'd have edit functionality
  };

  const handleDeleteReceptionist = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const { error } = await receptionistService.deleteReceptionist(id);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Receptionist deleted');
    setReceptionists(prev => prev.filter(r => r.id !== id));
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      const result = await signOut();
      
      if (result.success) {
        toast.success('Signed out successfully!');
        // Add a small delay to show the loading animation
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to sign out');
        setIsSigningOut(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsSigningOut(false);
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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8"
        >
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 px-2">
              Welcome to <span className="gradient-primary-text">{organizationName}</span>
            </h1>
            {currentUser && (
              <p className="text-sm text-muted-foreground mb-1 px-2">
                Logged in as {`${currentUser.first_name ?? ''} ${currentUser.last_name ?? ''}`.trim()} • {currentUser.email}
              </p>
            )}
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Manage your AI receptionists and launch new ones
            </p>
          </div>
          
          {/* Sign Out Button */}
          <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 px-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              disabled={isSigningOut}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
            >
              {isSigningOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
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
                placeholder="Search receptionists by name, description, assistant, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {/* Use Case Filter - Hidden for now */}
              {/* <Select value={filterByUseCase} onValueChange={setFilterByUseCase}>
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
              </Select> */}
              
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
          {(searchQuery || filterByCreated !== 'all') && (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReceptionists.length} of {receptionists.length} receptionists
                {searchQuery && ` matching "${searchQuery}"`}
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
                Launch your new Receptionist
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-5 h-5 gradient-primary rounded-xl flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
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
                  <Label htmlFor="assistant">Assistant</Label>
                  <Select 
                    value={receptionistData.assistant} 
                    onValueChange={(value) => setReceptionistData(prev => ({ ...prev, assistant: value }))}
                    disabled={loadingAssistants}
                  >
                    <SelectTrigger className="h-auto min-h-[40px]">
                      {loadingAssistants ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading assistants...
                        </div>
                      ) : receptionistData.assistant ? (
                        <div className="flex items-center gap-3 py-1">
                          {(() => {
                            const assistant = assistants.find(a => a.display_name === receptionistData.assistant);
                            if (assistant && shouldUseGeneratedAvatar(assistant)) {
                              return (
                                <img 
                                  src={getAvatarUrl(assistant, 32)} 
                                  alt={assistant.display_name}
                                  className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm"
                                  onError={(e) => {
                                    // Fallback to gradient if image fails to load
                                    const img = e.currentTarget;
                                    const fallback = img.nextElementSibling as HTMLElement;
                                    if (fallback) {
                                      img.style.display = 'none';
                                      fallback.style.display = 'flex';
                                    }
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md ${
                              assistants.find(a => a.display_name === receptionistData.assistant) 
                                ? getAssistantAvatarStyle(assistants.find(a => a.display_name === receptionistData.assistant)!)
                                : 'gradient-primary'
                            }`}
                            style={{ 
                              display: assistants.find(a => a.display_name === receptionistData.assistant) && shouldUseGeneratedAvatar(assistants.find(a => a.display_name === receptionistData.assistant)!) ? 'none' : 'flex' 
                            }}
                          >
                            {getAssistantInitials(getAssistantDisplayName(receptionistData.assistant))}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{getAssistantDisplayName(receptionistData.assistant)}</div>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select an assistant" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="max-w-[400px]">
                      {assistants.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          {loadingAssistants ? 'Loading assistants...' : 'No assistants available'}
                        </div>
                      ) : (
                        assistants.map((assistant) => (
                          <SelectItem 
                            key={assistant.display_name} 
                            value={assistant.display_name}
                            className="cursor-pointer hover:bg-accent/50 p-0"
                          >
                            <div className="flex items-start gap-3 p-3 w-full">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                {shouldUseGeneratedAvatar(assistant) ? (
                                  <>
                                    <img 
                                      src={getAvatarUrl(assistant, 40)} 
                                      alt={assistant.display_name}
                                      className="w-10 h-10 rounded-full bg-white p-1 shadow-md border border-gray-100"
                                      onError={(e) => {
                                        // Fallback to gradient if image fails to load
                                        const img = e.currentTarget;
                                        const fallback = img.nextElementSibling as HTMLElement;
                                        if (fallback) {
                                          img.style.display = 'none';
                                          fallback.style.display = 'flex';
                                        }
                                      }}
                                    />
                                    <div 
                                      className={`w-10 h-10 ${getAssistantAvatarStyle(assistant)} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}
                                      style={{ display: 'none' }}
                                    >
                                      {getAssistantInitials(assistant.display_name)}
                                    </div>
                                  </>
                                ) : (
                                  <div className={`w-10 h-10 ${getAssistantAvatarStyle(assistant)} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
                                    {getAssistantInitials(assistant.display_name)}
                                  </div>
                                )}
                              </div>
                              
                              {/* Assistant Info */}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-foreground mb-1">
                                  {assistant.display_name}
                                </div>
                                
                                {/* Details */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {assistant.age} years old
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">
                                    {assistant.gender}
                                  </span>
                                  {assistant.ethnicity && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                                      {assistant.ethnicity}
                                    </span>
                                  )}
                                  {assistant.tone && (
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                      {assistant.tone}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Personality traits */}
                                {assistant.personality && assistant.personality.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {assistant.personality.map((trait, index) => (
                                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                        {trait}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Description */}
                                <p className="text-xs text-muted-foreground overflow-hidden" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {assistant.description}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Select 
                    value={receptionistData.phoneNumber} 
                    onValueChange={(value) => setReceptionistData(prev => ({ ...prev, phoneNumber: value }))}
                    disabled={loadingPhoneNumbers}
                  >
                    <SelectTrigger className="h-auto min-h-[40px]">
                      {loadingPhoneNumbers ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading phone numbers...
                        </div>
                      ) : receptionistData.phoneNumber ? (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs shadow-md">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{getPhoneNumberDisplay(receptionistData.phoneNumber)}</div>
                          </div>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a phone number" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="max-w-[350px]">
                      {phoneNumbers.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          {loadingPhoneNumbers ? 'Loading phone numbers...' : 'No phone numbers available'}
                        </div>
                      ) : (
                        phoneNumbers.map((phone) => (
                          <SelectItem 
                            key={phone.id} 
                            value={phone.number}
                            className="cursor-pointer hover:bg-accent/50 p-0"
                          >
                            <div className="flex items-center gap-3 p-3 w-full">
                              {/* Phone Icon */}
                              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                                <Phone className="w-4 h-4" />
                              </div>
                              
                              {/* Phone Info */}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-foreground mb-1">
                                  {phone.number}
                                </div>
                                
                                {/* Details */}
                                <div className="flex flex-wrap gap-2 mb-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {phone.provider}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    {phone.country}
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                                    {phone.status}
                                  </span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-xs text-muted-foreground">
                                  {phone.description}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCreateReceptionist}
                  className="w-full"
                  disabled={isCreating || !receptionistData.name || !receptionistData.description}
                >
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                      <div className="flex flex-wrap gap-1 mt-1">
                        {receptionist.assistant && (
                          <div className="text-xs text-white gradient-primary px-2 py-1 rounded-full w-fit font-semibold shadow-sm">
                            {getAssistantDisplayName(receptionist.assistant)}
                          </div>
                        )}
                        {receptionist.phoneNumber && (
                          <div className="text-xs text-white gradient-primary px-2 py-1 rounded-full w-fit font-semibold shadow-sm">
                            {getPhoneNumberDisplay(receptionist.phoneNumber)}
                        </div>
                      )}
                      </div>
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

      {/* Animated Sign Out Loader Overlay */}
      {isSigningOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-lg p-8 shadow-2xl border border-border/50 max-w-sm mx-4"
          >
            <div className="text-center space-y-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-foreground"
                >
                  Logging out...
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground"
                >
                  Thank you for using AI Receptionist
                </motion.p>
              </div>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Launch;
