
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCases, UseCase } from '@/data/mockData';
import { Bot, Phone, Plus } from 'lucide-react';

const Onboard = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [customUseCase, setCustomUseCase] = useState({
    title: '',
    description: '',
    baseTemplate: '',
    color: '#7B61FF'
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedUseCase) {
      // Store onboarding data
      localStorage.setItem('onboardingData', JSON.stringify({
        useCase: selectedUseCase,
        businessName,
        businessType
      }));
      navigate(`/app/${selectedUseCase.slug}`);
    }
  };

  const handleCustomUseCaseCreate = () => {
    const newUseCase: UseCase = {
      id: Date.now().toString(),
      title: customUseCase.title,
      description: customUseCase.description,
      icon: '🎯',
      color: customUseCase.color,
      slug: customUseCase.title.toLowerCase().replace(/\s+/g, '-')
    };
    setSelectedUseCase(newUseCase);
    setIsCustomModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl gradient-primary-text">AI Receptionist</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">1</div>
                <span className="text-sm font-medium text-primary">Use Case</span>
                <div className="w-8 h-1 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-medium">2</div>
                <span className="text-sm text-gray-400">Setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Use Cases */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your use case</h1>
              <p className="text-gray-600 mb-8">Select what you'd like your AI receptionist to handle first. You can add more later.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={useCase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedUseCase?.id === useCase.id
                          ? 'ring-2 ring-primary border-primary'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedUseCase(useCase)}
                    >
                      <CardHeader className="pb-4">
                        <div className="text-3xl mb-2">{useCase.icon}</div>
                        <CardTitle className="text-lg">{useCase.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {useCase.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}

                {/* Custom Use Case Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: useCases.length * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 border-dashed border-2">
                        <CardHeader className="pb-4 text-center">
                          <div className="text-3xl mb-2 text-gray-400">
                            <Plus className="w-8 h-8 mx-auto" />
                          </div>
                          <CardTitle className="text-lg text-gray-600">Create custom use case</CardTitle>
                          <CardDescription className="text-sm">
                            Build something specific to your business
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Custom Use Case</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={customUseCase.title}
                            onChange={(e) => setCustomUseCase(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Handle Product Returns"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={customUseCase.description}
                            onChange={(e) => setCustomUseCase(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of what this use case will handle"
                          />
                        </div>
                        <div>
                          <Label htmlFor="template">Base Template</Label>
                          <Select value={customUseCase.baseTemplate} onValueChange={(value) => setCustomUseCase(prev => ({ ...prev, baseTemplate: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a starting template" />
                            </SelectTrigger>
                            <SelectContent>
                              {useCases.map((useCase) => (
                                <SelectItem key={useCase.id} value={useCase.id}>
                                  {useCase.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleCustomUseCaseCreate}
                          disabled={!customUseCase.title || !customUseCase.description}
                          className="w-full gradient-primary text-white"
                        >
                          Create & Continue
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Business Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Business Snapshot</CardTitle>
                  <CardDescription>
                    Help us personalize your experience (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Acme Corp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="professional-services">Professional Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedUseCase}
                    className="w-full gradient-primary text-white mt-6"
                    size="lg"
                  >
                    Continue to Setup
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
