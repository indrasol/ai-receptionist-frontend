import {
  ArrowLeft,
  Bot,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Globe,
  Grid3X3,
  Link,
  List,
  Loader2,
  Maximize2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Type,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { knowledgeService } from '@/services/knowledgeService';
import { motion } from 'framer-motion';
import { receptionistService } from '@/services/receptionistService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  // loading states for async actions
  const [urlLoading, setUrlLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [receptionistLoading, setReceptionistLoading] = useState(true);
  
  // AI enhancement disabled for now due to issues
  const useAiEnhancement = false;

  /* -------------------- handlers --------------------- */
  const handleDocumentSelect = async (file: File) => {
    if (!receptionistId) return;
    setIsUploading(true);
    const { error, data } = await knowledgeService.uploadDocument(receptionistId, file);
    setIsUploading(false);
    if (error) return toast.error(error);
    
    // Refresh the chunks list to show newly added chunks
    await fetchChunks();
    
    // Use the API response message
    toast.success(data?.message || `Added ${data?.chunks_generated ?? 0} chunks from document`);
  };

  const handleAddDomainUrl = async () => {
    if (!domainUrl || !receptionistId) return;
    setUrlLoading(true);
    const { error, data } = await knowledgeService.scrapeUrl(receptionistId, domainUrl);
    setUrlLoading(false);
    if (error) return toast.error(error);
    
    // Refresh the chunks list to show newly added chunks
    await fetchChunks();
    
    // Clear the URL field after successful addition
    setDomainUrl('');
    
    // Use the API response message
    toast.success(data?.message || `Added ${data?.chunks_generated ?? 0} chunks from URL`);
  };

  const handleAddTextKnowledge = async () => {
    if (!textKnowledge || !receptionistId) return;
    setTextLoading(true);
    const { error, data } = await knowledgeService.processText(
      receptionistId,
      textKnowledge,
      'Custom text',
      'Added via UI',
      useAiEnhancement
    );
    setTextLoading(false);
    if (error) return toast.error(error);
    
    // Fix 1: Refresh the chunks list to show newly added chunk
    await fetchChunks();
    
    // Fix 2: Clear the text field after successful addition
    setTextKnowledge('');
    
    // Fix 3: Use the API response message instead of custom message
    toast.success(data?.message || 'Knowledge added successfully');
  };

  const [currentReceptionist, setCurrentReceptionist] = useState<any>(null);

  // Fetch receptionist data from API
  useEffect(() => {
    const fetchReceptionist = async () => {
      if (!receptionistId || !user) return;
      
      setReceptionistLoading(true);
      try {
        const { data, error } = await receptionistService.getReceptionistById(receptionistId);
        if (error) {
          toast.error(error);
          // Fallback to a default name if API fails
          setCurrentReceptionist({
            id: receptionistId,
            name: 'CSA San Francisco Chapter Receptionist',
            description: 'AI receptionist for CSA San Francisco Chapter',
            useCase: 'Non-profit Organization'
          });
        } else {
          setCurrentReceptionist(data);
        }
      } catch (error) {
        console.error('Error fetching receptionist:', error);
        toast.error('Failed to load receptionist information');
        // Fallback to a default name if API fails
        setCurrentReceptionist({
          id: receptionistId,
          name: 'CSA San Francisco Chapter Receptionist',
          description: 'AI receptionist for CSA San Francisco Chapter',
          useCase: 'Non-profit Organization'
        });
      } finally {
        setReceptionistLoading(false);
      }
    };

    fetchReceptionist();
  }, [receptionistId, user]);

  // If no receptionist ID is provided, redirect to launch page
  if (!receptionistId) {
    navigate('/launch');
    return null;
  }

  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);

  // Function to fetch chunks from API
  const fetchChunks = async () => {
    if (!receptionistId || !user) return;
    try {
      const { data, error } = await knowledgeService.listChunks(receptionistId);
      if (error) {
        toast.error(error);
        return;
      }
      const mapped: KnowledgeEntry[] = (data?.chunks || []).map((c: any) => ({
        id: c.id,
        type: c.source_type,
        name: c.name,
        source: c.source_id,
        content: c.content,
        isSelected: true,
        uploadedAt: c.created_at,
        size: '',
        status: 'processed',
      }));
      setKnowledgeEntries(mapped);
    } catch (error) {
      console.error('Error fetching chunks:', error);
      toast.error('Failed to load knowledge entries');
    }
  };

  // fetch chunks for receptionist
  useEffect(() => {
    fetchChunks();
  }, [receptionistId, user]);

  const organizationName = user?.organization_name || user?.organizationName || user?.name || 'Your Organization';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !receptionistId) return;

    setIsUploading(true);

    // Process each file
    for (const file of Array.from(files)) {
      await handleDocumentSelect(file);
    }

    setIsUploading(false);
    // Reset file input
    event.target.value = '';
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
    setIsEditMode(false);
    setIsContentModalOpen(true);
  };

  const handleEditContent = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setEditContent(entry.content || '');
    setIsEditMode(true);
    setIsContentModalOpen(true);
  };

  const handleSaveContent = () => {
    if (selectedEntry) {
      // Update the knowledge entry with edited content
      setKnowledgeEntries(prev => 
        prev.map(entry => 
          entry.id === selectedEntry.id 
            ? { ...entry, content: editContent }
            : entry
        )
      );
      setIsEditMode(false);
      console.log('Content saved for entry:', selectedEntry.id);
    }
  };

  const selectedCount = knowledgeEntries.filter(entry => entry.isSelected).length;

  // Calculate progress based on selected entries
  const totalCount = knowledgeEntries.length;
  const progressPercentage = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

  // Calculate total character count from all knowledge entries
  const totalCharacters = knowledgeEntries.reduce((total, entry) => {
    return total + (entry.content ? entry.content.length : 0);
  }, 0);

  // Handle refresh when all entries are selected (100% progress)
  useEffect(() => {
    if (progressPercentage === 100 && totalCount > 0 && selectedCount === totalCount && !isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(true);
        // Simulate content refresh and training completion
        setTimeout(() => {
          setIsRefreshing(false);
          // Here you could trigger actual content refresh logic
          console.log('Knowledge base training completed and refreshed!');
          console.log(`Training completed with ${selectedCount} sources and ${totalCharacters.toLocaleString()} characters`);
        }, 2000);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progressPercentage, totalCount, selectedCount, totalCharacters, isRefreshing]);

  // Grid View Component
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {knowledgeEntries.map((entry) => (
        <Card key={entry.id} className="group hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2">
                {entry.type === 'document' ? (
                  <FileText className="w-4 h-4 text-blue-500" />
                ) : entry.type === 'url' ? (
                  <Link className="w-4 h-4 text-green-500" />
                ) : (
                  <Type className="w-4 h-4 text-purple-500" />
                )}
                <CardTitle className="text-sm font-medium break-words flex-1" title={entry.name}>
                  {entry.name}
                </CardTitle>
                <Switch
                  checked={entry.isSelected}
                  onCheckedChange={() => toggleKnowledgeSelection(entry.id)}
                  className="ml-auto flex-shrink-0 data-[state=checked]:bg-primary"
                />
            </div>
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
                <span>({(entry.content?.length || 0).toLocaleString()}/100,000) characters</span>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditContent(entry)}
                  className="h-7 w-7 p-0 hover:bg-muted"
                  title="Edit content"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveContent}
                  className="h-7 w-7 p-0 hover:bg-muted text-green-600 hover:text-green-600"
                  title="Save content"
                >
                  <Save className="w-3 h-3" />
                </Button>
                {entry.type === 'document' && (
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
                  
                  {/* Processing Info */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Automatic Reading</p>
                        <p className="text-xs text-muted-foreground">
                          Your documents are automatically read and organized so the AI can understand them better
                        </p>
                      </div>
                    </div>
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
                  
                  {/* Website Reading Info */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Smart Reading</p>
                        <p className="text-xs text-muted-foreground">
                          Automatically reads and learns from your website content to help answer questions
                        </p>
                      </div>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <span>{currentReceptionist?.name || 'Receptionist'}'s Knowledge</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTrainingModalOpen(true)}
                        className="h-6 w-6 p-0 hover:bg-muted"
                        title="View training steps"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    </div>
                    {totalCount > 0 && (
                      <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="flex-1">
                          <Progress 
                            value={progressPercentage} 
                            className="h-2 bg-muted"
                          />
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium">
                          {isRefreshing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                              <span className="text-primary">Training...</span>
                            </>
                          ) : selectedCount === 0 ? (
                            <span className="text-yellow-600 text-xs">Select sources to begin training</span>
                          ) : (
                            <>
                              <span className={progressPercentage === 100 ? "text-green-600" : "text-primary"}>
                                {progressPercentage}%
                              </span>
                              {progressPercentage === 100 && (
                                <span className="text-green-600 text-xs ml-1">Training Complete!</span>
                              )}
                            </>
                          )}
                          <span className="text-muted-foreground text-xs">
                            ({totalCharacters.toLocaleString()}/1,000,000) characters
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        // Update the training with selected knowledge sources
                        const selectedEntries = knowledgeEntries.filter(e => e.isSelected);
                        console.log('Updating training with selected sources:', selectedEntries);
                        console.log(`Training updated with ${selectedEntries.length} sources and ${selectedEntries.reduce((total, entry) => total + (entry.content?.length || 0), 0).toLocaleString()} characters`);
                        // Here you would typically make an API call to update the training
                        // For now, we'll show a success indication
                        alert(`Training updated successfully with ${selectedEntries.length} selected sources!`);
                      }}
                      disabled={selectedCount === 0}
                      size="sm"
                      className="h-8"
                      title="Update training with selected sources"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Update</span>
                    </Button>
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
                  Select the sources below for the <span className="font-bold">'{currentReceptionist?.name || 'this receptionist'}'</span> to use to speak to your customers.
                  {totalCount > 0 && (
                    <span className="ml-2 text-xs">
                      Selected: {selectedCount}/{totalCount} sources
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
                          <TableHead className="w-32">Characters</TableHead>
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
                                ({(entry.content?.length || 0).toLocaleString()}/100,000)
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewContent(entry)}
                                  className="h-6 w-6 p-0"
                                  title="View content"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditContent(entry)}
                                  className="h-6 w-6 p-0"
                                  title="Edit content"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleSaveContent}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-600"
                                  title="Save content"
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                {entry.type === 'document' && (
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
            <Button 
              onClick={() => navigate(`/receptionist/${receptionistId}`)}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="truncate">Go to {currentReceptionist?.name || 'Receptionist'} Dashboard</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content View Modal */}
      <Dialog open={isContentModalOpen} onOpenChange={(open) => {
        setIsContentModalOpen(open);
        if (!open) {
          setIsEditMode(false);
          setEditContent('');
        }
      }}>
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
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
                    {!isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditContent(selectedEntry)}
                        className="h-6 text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {isEditMode ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-[300px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        placeholder="Enter content..."
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditMode(false);
                            setEditContent(selectedEntry.content || '');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveContent}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto bg-muted/30 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{selectedEntry.content}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Created: {selectedEntry ? new Date(selectedEntry.uploadedAt).toLocaleDateString() : ''}</span>
                </div>
                <span className="text-muted-foreground">
                  ({isEditMode ? editContent.length.toLocaleString() : (selectedEntry?.content ? selectedEntry.content.length.toLocaleString() : '0')}/100,000) characters
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Training Steps Modal */}
      <Dialog open={isTrainingModalOpen} onOpenChange={setIsTrainingModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              How to Train {currentReceptionist?.name || 'Your Receptionist'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid gap-4">
              {/* Progress Bar Info */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
                <RefreshCw className="w-4 h-4" />
                <span>Progress bar shows your selection completion</span>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  ✨
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-sm text-green-800 dark:text-green-400">Update Training & Launch</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the "Update" button to apply your selected knowledge sources to the AI training. Once complete, your receptionist will be ready to handle customer calls with your business knowledge.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                    <Bot className="w-3 h-3" />
                    <span>Your AI receptionist will be trained and ready to use</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Limit Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">💡</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400">Training Tips</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Keep your total content under 1,000,000 characters for optimal performance</li>
                    <li>• Each individual source should be under 100,000 characters</li>
                    <li>• More relevant, specific content leads to better AI responses</li>
                    <li>• You can edit any source content using the edit button</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Knowledge;
