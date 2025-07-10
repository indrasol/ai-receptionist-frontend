import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  Star,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Volume2
} from 'lucide-react';
import FeatureRow from '@/components/FeatureRow';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  // Voice teaser state
  const [voiceSettings, setVoiceSettings] = useState({
    gender: '',
    accent: '',
    country: ''
  });

  // Voice preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVoicePreview = () => {
    if (!voiceSettings.gender || !voiceSettings.accent || !voiceSettings.country) {
      toast({
        title: "Please select all options",
        description: "Choose gender, accent, and country to preview the voice.",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying) {
      // Stop playing
      setIsPlaying(false);
      setProgress(0);
    } else {
      // Start playing
      setIsPlaying(true);
      toast({
        title: "Voice Preview",
        description: `Playing ${voiceSettings.gender} voice with ${voiceSettings.accent} accent from ${voiceSettings.country}`,
      });
    }
  };

  // Progress animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Blobs */}
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -left-48"></div>
        <div className="blob-bg w-80 h-80 bg-aquamarine top-40 -right-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
              Your AI Receptionist That{' '}
              <span className="gradient-primary-text">Never Sleeps</span>
            </h1>
            
            {/* AI Receptionist Animation Card */}
            <div className="glass-card rounded-3xl p-8 mb-8 animate-float">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-lg font-medium">AI Receptionist Animation</p>
                  <p className="text-muted-foreground">Interactive demo coming soon</p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
              <Link to="/start-free">
                <Button size="lg" className="gradient-primary hover-glow text-white text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    <Play className="w-5 h-5 mr-2" />
                    Want a Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-yellow-800">
                      Call our AI Receptionist
                    </DialogTitle>
                    <DialogDescription className="text-yellow-700">
                      Experience the future of customer service firsthand
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-6 py-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-yellow-600 mb-2">Call now to test our AI:</p>
                      <a 
                        href="tel:+14244046372" 
                        className="text-2xl font-heading font-bold text-yellow-700 hover:text-yellow-800 hover:underline transition-colors"
                      >
                        +1 424 404 6372
                      </a>
                      <p className="text-xs text-yellow-600 mt-4 max-w-xs mx-auto">
                        Our AI is available 24/7 to demonstrate its capabilities. Try asking about our services or booking a demo!
                      </p>
                    </div>

                    {/* Voice Teaser Section inside Modal */}
                    <div className="border-t border-yellow-200 pt-6">
                      <h3 className="text-lg font-heading font-bold mb-4 text-center text-yellow-800">
                        Experience Our AI Voice
                      </h3>
                      <p className="text-sm text-yellow-600 mb-6 text-center">
                        Customize and preview our AI receptionist's voice with different accents and styles.
                      </p>
                      
                      <div className="space-y-4">
                        {/* Gender Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-3 text-yellow-700">Gender</label>
                          <RadioGroup 
                            value={voiceSettings.gender} 
                            onValueChange={(value) => setVoiceSettings(prev => ({...prev, gender: value}))}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" className="border-yellow-500 text-yellow-500" />
                              <label htmlFor="male" className="text-sm font-medium cursor-pointer text-yellow-700">Male</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" className="border-yellow-500 text-yellow-500" />
                              <label htmlFor="female" className="text-sm font-medium cursor-pointer text-yellow-700">Female</label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Accent Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-yellow-700">Accent</label>
                          <Select onValueChange={(value) => setVoiceSettings(prev => ({...prev, accent: value}))}>
                            <SelectTrigger className="border-yellow-200 focus:border-yellow-500 text-yellow-700">
                              <SelectValue placeholder="Select an accent" className="text-yellow-500" />
                            </SelectTrigger>
                            <SelectContent className="bg-yellow-50 border-yellow-200">
                              <SelectItem value="american" className="text-yellow-700 hover:bg-yellow-100">American</SelectItem>
                              <SelectItem value="british" className="text-yellow-700 hover:bg-yellow-100">British</SelectItem>
                              <SelectItem value="australian" className="text-yellow-700 hover:bg-yellow-100">Australian</SelectItem>
                              <SelectItem value="canadian" className="text-yellow-700 hover:bg-yellow-100">Canadian</SelectItem>
                              <SelectItem value="irish" className="text-yellow-700 hover:bg-yellow-100">Irish</SelectItem>
                              <SelectItem value="scottish" className="text-yellow-700 hover:bg-yellow-100">Scottish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Country Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-yellow-700">Country</label>
                          <Select onValueChange={(value) => setVoiceSettings(prev => ({...prev, country: value}))}>
                            <SelectTrigger className="border-yellow-200 focus:border-yellow-500 text-yellow-700">
                              <SelectValue placeholder="Select a country" className="text-yellow-500" />
                            </SelectTrigger>
                            <SelectContent className="bg-yellow-50 border-yellow-200">
                              <SelectItem value="usa" className="text-yellow-700 hover:bg-yellow-100">United States</SelectItem>
                              <SelectItem value="uk" className="text-yellow-700 hover:bg-yellow-100">United Kingdom</SelectItem>
                              <SelectItem value="canada" className="text-yellow-700 hover:bg-yellow-100">Canada</SelectItem>
                              <SelectItem value="australia" className="text-yellow-700 hover:bg-yellow-100">Australia</SelectItem>
                              <SelectItem value="ireland" className="text-yellow-700 hover:bg-yellow-100">Ireland</SelectItem>
                              <SelectItem value="scotland" className="text-yellow-700 hover:bg-yellow-100">Scotland</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Voice Nodes and Preview Section */}
                        <div className="pt-4 space-y-4">
                          {/* Voice Visualization Nodes */}
                          <div className="flex justify-center items-center space-x-2 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div 
                                key={i}
                                className={`w-1 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full transition-all duration-150 ${
                                  isPlaying 
                                    ? `animate-pulse h-${4 + (i % 3) * 2}` 
                                    : 'h-4'
                                }`}
                                style={{
                                  animationDelay: `${i * 0.1}s`,
                                  animationDuration: '0.8s'
                                }}
                              />
                            ))}
                          </div>

                          {/* Progress Bar */}
                          {isPlaying && (
                            <div className="space-y-2">
                              <Progress 
                                value={progress} 
                                className="w-full h-2"
                              />
                              <div className="flex justify-between text-xs text-yellow-600">
                                <span>{Math.floor(progress / 20)}s</span>
                                <span>5s</span>
                              </div>
                            </div>
                          )}

                          {/* Preview Button */}
                          <Button 
                            onClick={handleVoicePreview}
                            className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                              isPlaying 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                            } text-white`}
                            size="lg"
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="w-5 h-5 mr-2" />
                                Stop Preview
                              </>
                            ) : (
                              <>
                                <Play className="w-5 h-5 mr-2" />
                                Preview Voice
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Get in Touch with
              <span className="gradient-primary-text"> Our Team</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions about our AI Receptionist? We're here to help. 
              Reach out to us and we'll respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-bold mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Select onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="sales">Sales Question</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="press">Press Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us how we can help you..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full gradient-primary hover-glow text-white"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">sales@indrasol.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">+1 (424) 40INDRA</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">
                          San Ramon, California, USA
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-muted-foreground">
                          Mon - Fri: 9:00 AM - 6:00 PM PST<br />
                          Sat - Sun: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:gradient-primary hover:text-white transition-all duration-300">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:gradient-primary hover:text-white transition-all duration-300">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:gradient-primary hover:text-white transition-all duration-300">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
