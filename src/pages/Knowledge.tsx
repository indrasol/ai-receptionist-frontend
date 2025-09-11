import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload,
  Globe,
  FileText,
  Link,
  Trash2,
  Download,
  Plus,
  ArrowLeft,
  Bot,
  Type,
  Maximize2,
  Grid3X3,
  List,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface KnowledgeEntry {
  id: string;
  type: 'document' | 'url' | 'text';
  name: string;
  source: string;
  content?: string;
  isSelected: boolean;
  uploadedAt: string;
  size?: string;
  status: 'processed' | 'processing' | 'error';
}

const Knowledge = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: receptionistId } = useParams<{ id: string }>();
  const [domainUrl, setDomainUrl] = useState('');
  const [textKnowledge, setTextKnowledge] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get receptionist data from localStorage or use mock data
  const getReceptionistById = (id: string) => {
    // Try to get from localStorage first (shared with Launch page)
    const saved = localStorage.getItem('receptionists');
    let allReceptionists = [];
    
    if (saved) {
      allReceptionists = JSON.parse(saved);
    } else {
      // Fallback to mock data
      allReceptionists = [
        {
          id: '1',
          name: 'Customer Service Bot',
          description: 'Handles customer inquiries and support requests with friendly, professional responses.',
          useCase: 'Customer Support',
        },
        {
          id: '2',
          name: 'Appointment Scheduler',
          description: 'Manages appointment bookings, cancellations, and reminders for healthcare practices.',
          useCase: 'Healthcare',
        }
      ];
    }
    
    // Find the receptionist by ID
    const found = allReceptionists.find(r => r.id === id);
    if (found) return found;
    
    // For newly created receptionists that somehow weren't saved, create a placeholder
    return {
      id,
      name: `Receptionist ${id}`,
      description: 'A newly created AI receptionist',
      useCase: 'General'
    };
  };

  const currentReceptionist = receptionistId ? getReceptionistById(receptionistId) : null;

  // If no receptionist ID is provided, redirect to launch page
  if (!receptionistId) {
    navigate('/launch');
    return null;
  }

  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([
    {
      id: '1',
      type: 'document',
      name: 'Customer Service Guidelines.pdf',
      source: 'uploaded',
      content: 'Comprehensive guidelines for handling customer inquiries, complaints, and providing excellent service standards...',
      isSelected: true,
      uploadedAt: '2024-01-15T10:30:00Z',
      size: '2.4 MB',
      status: 'processed'
    },
    {
      id: '2',
      type: 'url',
      name: 'Company FAQ Page',
      source: 'https://example.com/faq',
      content: 'Frequently asked questions about our products and services, including pricing, features, and support information...',
      isSelected: true,
      uploadedAt: '2024-01-14T14:20:00Z',
      size: '1.2 MB',
      status: 'processed'
    },
    {
      id: '3',
      type: 'document',
      name: 'Product Catalog.pdf',
      source: 'uploaded',
      content: 'Complete product specifications, pricing, and feature comparisons for all available products and services...',
      isSelected: false,
      uploadedAt: '2024-01-12T09:15:00Z',
      size: '5.1 MB',
      status: 'processing'
    },
    {
      id: '4',
      type: 'text',
      name: 'Business Hours & Contact Info',
      source: 'text',
      content: 'We are open Monday through Friday from 9 AM to 6 PM EST. For urgent matters, please call our emergency line at (555) 123-4567.',
      isSelected: true,
      uploadedAt: '2024-01-13T16:45:00Z',
      size: '0.1 KB',
      status: 'processed'
    }
  ]);

  const organizationName = user?.organization_name || user?.organizationName || user?.name || 'Your Organization';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    // Simulate file upload process
    for (const file of Array.from(files)) {
      const newEntry: KnowledgeEntry = {
        id: Date.now().toString() + Math.random(),
        type: 'document',
        name: file.name,
        source: 'uploaded',
        content: `Document content from ${file.name}. This file contains important information for the AI receptionist training...`,
        isSelected: true,
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'processing'
      };

      setKnowledgeEntries(prev => [...prev, newEntry]);

      // Simulate processing delay
      setTimeout(() => {
        setKnowledgeEntries(prev =>
          prev.map(entry =>
            entry.id === newEntry.id
              ? { ...entry, status: 'processed' as const }
              : entry
          )
        );
      }, 2000);
    }

    setIsUploading(false);
    // Reset file input
    event.target.value = '';
  };

    const handleAddDomainUrl = () => {
    if (!domainUrl.trim()) return;

    const newEntry: KnowledgeEntry = {
      id: Date.now().toString(),
      type: 'url',
      name: `Content from ${new URL(domainUrl).hostname}`,
      source: domainUrl,
      content: `Web content scraped from ${domainUrl}. This includes pages, articles, and information from the website...`,
      isSelected: true,
      uploadedAt: new Date().toISOString(),
      size: '2.1 MB',
      status: 'processing'
    };

    setKnowledgeEntries(prev => [...prev, newEntry]);
    setDomainUrl('');

    // Simulate processing
    setTimeout(() => {
      setKnowledgeEntries(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, status: 'processed' as const }
            : entry
        )
      );
    }, 3000);
  };

  const handleAddTextKnowledge = () => {
    if (!textKnowledge.trim()) return;

    const newEntry: KnowledgeEntry = {
      id: Date.now().toString(),
      type: 'text',
      name: `Text Knowledge - ${textKnowledge.substring(0, 30)}${textKnowledge.length > 30 ? '...' : ''}`,
      source: 'text',
      content: textKnowledge,
      isSelected: true,
      uploadedAt: new Date().toISOString(),
      size: `${(textKnowledge.length / 1024).toFixed(1)} KB`,
      status: 'processing'
    };

    setKnowledgeEntries(prev => [...prev, newEntry]);
    setTextKnowledge('');

    // Simulate processing
    setTimeout(() => {
      setKnowledgeEntries(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, status: 'processed' as const }
            : entry
        )
      );
    }, 2000);
  };

  const toggleKnowledgeSelection = (id: string) => {
    setKnowledgeEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, isSelected: !entry.isSelected } : entry
      )
    );
  };

  const removeKnowledgeEntry = (id: string) => {
    setKnowledgeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleViewContent = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setIsContentModalOpen(true);
  };

  const selectedCount = knowledgeEntries.filter(entry => entry.isSelected).length;

  // Calculate progress based on processed entries
  const processedCount = knowledgeEntries.filter(entry => entry.status === 'processed').length;
  const totalCount = knowledgeEntries.length;
  const progressPercentage = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  // Handle refresh when all entries are processed
  useEffect(() => {
    if (progressPercentage === 100 && totalCount > 0 && !isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(true);
        // Simulate content refresh
        setTimeout(() => {
          setIsRefreshing(false);
          // Here you could trigger actual content refresh logic
          console.log('Knowledge base training completed and refreshed!');
        }, 2000);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progressPercentage, totalCount, isRefreshing]);

  // Grid View Component
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {knowledgeEntries.map((entry) => (
        <Card key={entry.id} className="group hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {entry.type === 'document' ? (
                  <FileText className="w-4 h-4 text-blue-500" />
                ) : entry.type === 'url' ? (
                  <Link className="w-4 h-4 text-green-500" />
                ) : (
                  <Type className="w-4 h-4 text-purple-500" />
                )}
                <Badge 
                  variant={
                    entry.status === 'processed' ? 'default' : 
                    entry.status === 'processing' ? 'secondary' : 'destructive'
                  }
                  className="text-xs"
                >
                  {entry.status}
                </Badge>
              </div>
              <Switch
                checked={entry.isSelected}
                onCheckedChange={() => toggleKnowledgeSelection(entry.id)}
                disabled={entry.status !== 'processed'}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <CardTitle className="text-sm font-medium truncate" title={entry.name}>
              {entry.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div className="text-sm text-muted-foreground overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4em',
                maxHeight: '4.2em'
              }}>
                {entry.content || 'No content available'}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(entry.uploadedAt).toLocaleDateString()}
                </div>
                <span>{entry.size || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end mt-3 pt-3 border-t border-muted/30">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewContent(entry)}
                  className="h-7 w-7 p-0 hover:bg-muted"
                  title="View content"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                {entry.type === 'document' && entry.status === 'processed' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-muted"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeKnowledgeEntry(entry.id)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
          className="mb-6 sm:mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/launch')}
            className="mb-4 hover:bg-muted text-sm sm:text-base"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Launch
          </Button>

          <div className="text-center px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Add your Business Info
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload documents or/and your website info -  The Receptionist will use them to answer callers
            </p>
            {selectedCount > 0 && (
              <Badge variant="secondary" className="mt-2">
                {selectedCount} source{selectedCount !== 1 ? 's' : ''} selected for training
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="w-full space-y-6 sm:space-y-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0"
          >
            {/* Document Upload Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload PDFs, Word docs, and text files to help the <span className="font-semibold">{currentReceptionist?.name || 'receptionist'}</span> to understand your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, TXT, MD files
                      </p>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain URL Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Add your Website URL
                </CardTitle>
                <CardDescription>
                  Import content from your website to help the {currentReceptionist?.name || 'receptionist'} learn about your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain-url">Website URL</Label>
                    <Input
                      id="domain-url"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={domainUrl}
                      onChange={(e) => setDomainUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddDomainUrl}
                    className="w-full"
                    disabled={!domainUrl.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Text Knowledge Base Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Add Custom Text
                </CardTitle>
                <CardDescription>
                  Add custom text content for the <span className="font-semibold">{currentReceptionist?.name || 'receptionist'}</span> to reference when helping customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-knowledge">Knowledge Text</Label>
                    <textarea
                      id="text-knowledge"
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Enter knowledge content, policies, FAQs, or any information your receptionist should know..."
                      value={textKnowledge}
                      onChange={(e) => setTextKnowledge(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddTextKnowledge}
                    className="w-full"
                    disabled={!textKnowledge.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Knowledge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Knowledge Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span>{currentReceptionist?.name || 'Receptionist'}'s Knowledge</span>
                    {totalCount > 0 && (
                      <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="flex-1">
                          <Progress 
                            value={progressPercentage} 
                            className="h-2 bg-muted"
                          />
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {isRefreshing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                              <span className="text-primary">Refreshing...</span>
                            </>
                          ) : (
                            <>
                              <span className={progressPercentage === 100 ? "text-green-600" : "text-muted-foreground"}>
                                {progressPercentage}%
                              </span>
                              {progressPercentage === 100 && (
                                <span className="text-green-600 text-xs ml-1">Complete!</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-r-none h-8"
                        title="List view"
                      >
                        <List className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">List</span>
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-l-none h-8"
                        title="Grid view"
                      >
                        <Grid3X3 className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Grid</span>
                      </Button>
                    </div>
                    <Badge variant="outline">
                      {knowledgeEntries.length} total
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Select the sources below for the '{currentReceptionist?.name || 'this receptionist'}' to use to speak to your customers.
                  {totalCount > 0 && (
                    <span className="ml-2 text-xs">
                      Processing: {processedCount}/{totalCount} sources
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className={viewMode === 'grid' ? 'p-0' : 'p-0'}>
                {knowledgeEntries.length === 0 ? (
                  <div className="text-center py-8 px-6">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No knowledge sources yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload documents or add URLs to get started
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  renderGridView()
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead className="w-20">Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="min-w-[300px]">Content</TableHead>
                          <TableHead className="w-32">Created</TableHead>
                          <TableHead className="w-20">Size</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {knowledgeEntries.map((entry, index) => (
                          <TableRow
                            key={entry.id}
                            className="group"
                          >
                            <TableCell>
                              <Switch
                                checked={entry.isSelected}
                                onCheckedChange={() => toggleKnowledgeSelection(entry.id)}
                                disabled={entry.status !== 'processed'}
                                className="data-[state=checked]:bg-primary"
                              />
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center">
                                {entry.type === 'document' ? (
                                  <FileText className="w-4 h-4 text-blue-500" />
                                ) : entry.type === 'url' ? (
                                  <Link className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Type className="w-4 h-4 text-purple-500" />
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="font-medium text-sm">{entry.name}</div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {entry.content || 'No content available'}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewContent(entry)}
                                  className="h-6 w-6 p-0"
                                  title="Expand content"
                                >
                                  <Maximize2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {new Date(entry.uploadedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {entry.size || 'N/A'}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Badge 
                                variant={
                                  entry.status === 'processed' ? 'default' : 
                                  entry.status === 'processing' ? 'secondary' : 'destructive'
                                }
                                className="text-xs"
                              >
                                {entry.status}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {entry.type === 'document' && entry.status === 'processed' && (
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeKnowledgeEntry(entry.id)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          >

            {knowledgeEntries.length > 0 && (
              <Button 
                onClick={() => {
                  // In a real app, this would save the knowledge configuration
                  console.log('Selected knowledge sources:', knowledgeEntries.filter(e => e.isSelected));
                  // For now, just show success message
                }}
                disabled={selectedCount === 0}
                variant="outline"
                className="w-full sm:w-auto order-3 sm:order-2"
              >
                Save Knowledge Configuration
              </Button>
            )}
            
            <Button 
              onClick={() => navigate(`/receptionist/${receptionistId}`)}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-3"
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="truncate">Go to {currentReceptionist?.name || 'Receptionist'} Dashboard</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content View Modal */}
      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEntry?.type === 'document' ? (
                <FileText className="w-5 h-5 text-blue-500" />
              ) : selectedEntry?.type === 'url' ? (
                <Link className="w-5 h-5 text-green-500" />
              ) : (
                <Type className="w-5 h-5 text-purple-500" />
              )}
              {selectedEntry?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Source</h4>
                <p className="text-sm break-all">{selectedEntry?.source}</p>
              </div>
              
              {selectedEntry?.content && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Content</h4>
                  <div className="max-h-[300px] overflow-y-auto bg-muted/30 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedEntry.content}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Created: {selectedEntry ? new Date(selectedEntry.uploadedAt).toLocaleDateString() : ''}</span>
                  {selectedEntry?.size && <span>Size: {selectedEntry.size}</span>}
                  <Badge 
                    variant={
                      selectedEntry?.status === 'processed' ? 'default' : 
                      selectedEntry?.status === 'processing' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {selectedEntry?.status}
                  </Badge>
                </div>
                <span className="text-muted-foreground">
                  {selectedEntry?.content ? `${selectedEntry.content.length.toLocaleString()} characters` : '0 characters'}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Knowledge;
