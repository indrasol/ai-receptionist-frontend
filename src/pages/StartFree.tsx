
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Sparkles } from 'lucide-react';

const StartFree = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    website: ''
  });

  const testimonials = [
    {
      quote: "Our AI receptionist has been a game-changer. We used to miss calls when we were under the hood, but now every customer gets immediate attention. Bookings are up 40%!",
      author: "Sarah Johnson",
      business: "Johnson's Auto Repair",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "The appointment scheduling feature is incredible. Patients can book 24/7, and the AI handles rescheduling perfectly. It's like having a full-time receptionist at a fraction of the cost.",
      author: "Mike Chen",
      business: "Smile Dental",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "I was skeptical at first, but clients love how professional and quick the responses are. The AI perfectly answers all my customer's questions and allows me to focus on running my salon!",
      author: "Lisa Rodriguez",
      business: "Bella Beauty Salon",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const businessTypes = [
    "Restaurant",
    "Dental Office", 
    "Auto Repair",
    "Beauty Salon",
    "Medical Practice",
    "Law Firm",
    "Real Estate",
    "Fitness Center",
    "Pet Services",
    "Home Services",
    "Retail Store",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Testimonials */}
          <div className="text-white space-y-6">
            {/* Trust Badge */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="flex items-center space-x-1">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Trusted by 1,000+ businesses</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">
                <span className="text-yellow-300">Double your revenue</span> with AI Receptionist.
              </h1>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-sm leading-relaxed mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-sm">{testimonial.author}</p>
                        <p className="text-xs text-white/80">{testimonial.business}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:sticky lg:top-8">
            <Card className="glass-card border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Start for Free Today</CardTitle>
                <CardDescription>
                  Get your AI receptionist up and running in just 5 minutes
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select 
                      value={formData.businessType} 
                      onValueChange={(value) => setFormData({...formData, businessType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="e.g., Restaurant, Dental Office, Auto Repair" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase().replace(' ', '-')}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://your-website.com"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary hover-glow text-white font-semibold py-3 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Build My Receptionist
                  </Button>

                  {/* Benefits */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Setup in 5 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Keep your existing phone number</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartFree;
