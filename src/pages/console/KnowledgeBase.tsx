import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, CheckCircle, Clock, Download, FileText, Link, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { knowledgeService } from '@/services/knowledgeService';
import { motion } from 'framer-motion';

interface Chunk {
  id: string;
  name: string;
  source_type: 'website' | 'file' | 'text';
  source_id: string;
  content: string;
  description?: string;
  created_at?: string;
}

interface FetchState {
  chunks: Chunk[];
  loading: boolean;
  error?: string;
}

interface DocumentItem {
  id: string;
  name: string;
  size?: string;
  uploadedAt?: string;
  status?: string;
}

const documents: DocumentItem[] = []; // Placeholder until document upload integration

// Placeholder receptionistId – in a real console route this should come from router params or context
const receptionistId = '';

const KnowledgeBase = () => {
  const [dragActive, setDragActive] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [state, setState] = useState<FetchState>({ chunks: [], loading: true });

  const fetchChunks = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const { data, error } = await knowledgeService.listChunks(receptionistId);
    if (error) {
      setState({ chunks: [], loading: false, error });
    } else {
      setState({ chunks: data?.chunks || [], loading: false });
    }
  }, []);

  useEffect(() => {
    fetchChunks();
  }, [fetchChunks]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const urls = state.chunks.filter((c) => c.source_type === 'website');

  const totalSources = documents.length + urls.length;
  const readyCount = urls.length; // For now all fetched chunks are considered ready
  const processingCount = 0; // Could be derived from chunk metadata later

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600 mt-2">
          Train your AI receptionist with documents and web content to provide accurate answers.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSources}</div>
              <p className="text-xs text-gray-500">documents & URLs</p>
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
              <CardTitle className="text-base">Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {readyCount}
              </div>
              <p className="text-xs text-gray-500">processed & searchable</p>
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
              <CardTitle className="text-base">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {processingCount}
              </div>
              <p className="text-xs text-gray-500">being vectorized</p>
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
              <CardTitle className="text-base">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">47%</div>
              <Progress value={47} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">of 100MB limit</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Knowledge Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Accordion type="multiple" defaultValue={["documents", "urls"]} className="space-y-4">
          {/* Documents Section */}
          <AccordionItem value="documents" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents ({documents.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, DOCX, TXT files up to 10MB each
                </p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusColor(doc.status)} className="flex items-center gap-1">
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </Badge>
                      {doc.status === 'processing' && (
                        <Progress value={65} className="w-20" />
                      )}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* URLs Section */}
          <AccordionItem value="urls" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Web URLs ({urls.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {/* Add URL Form */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter website URL (e.g., https://example.com/help)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                />
                <Button className="gradient-primary text-white">
                  <Link className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>

              {/* URLs List */}
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <motion.div
                    key={url.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Link className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="font-medium">{url.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{url.source_id}</p>
                        {url.created_at && (
                          <p className="text-xs text-gray-400">
                            Added {new Date(url.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* All chunks considered ready */}
                      <Badge variant="default" className="flex items-center gap-1">
                        {getStatusIcon('ready')}
                        ready
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </div>
  );
};

export default KnowledgeBase;
