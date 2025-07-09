
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play,
  CheckCircle,
  Star
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
import { useState } from 'react';

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const features = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "24/7 Phone Support",
      description: "Never miss a call again with AI that handles customer inquiries round the clock."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Appointment Booking",
      description: "Automatically schedule appointments and sync with your calendar."
    }
  ];

  const stats = [
    { value: "10M+", label: "Calls Handled" },
    { value: "99.9%", label: "Uptime" },
    { value: "3s", label: "Avg Response" },
    { value: "50K+", label: "Happy Customers" }
  ];

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
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-up">
              Transform your business with AI-powered customer service that handles calls, 
              messages, and appointments 24/7. Increase satisfaction while reducing costs.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
              <Link to="/start-free">
                <Button size="lg" className="gradient-primary hover-glow text-white text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    <Play className="w-5 h-5 mr-2" />
                    Give It a Try
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-heading">
                      Call our AI Receptionist
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Experience the future of customer service firsthand
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-6 py-6">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Call now to test our AI:</p>
                      <a 
                        href="tel:+14244046372" 
                        className="text-2xl font-heading font-bold gradient-primary-text hover:underline"
                      >
                        +1 424 404 6372
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      Our AI is available 24/7 to demonstrate its capabilities. Try asking about our services or booking a demo!
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Hero Animation Placeholder */}
            <div className="glass-card rounded-3xl p-8 mb-16 animate-float">
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-heading font-bold gradient-primary-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Everything You Need to Automate Customer Service
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI front desk combines the best of human conversation with the reliability 
              of automation to deliver exceptional customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 hover-glow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          <div className="space-y-20">
            <FeatureRow
              icon={<Users className="w-6 h-6" />}
              heading="Scale Your Customer Support"
              description="Handle unlimited simultaneous conversations without compromising quality. Our AI learns from every interaction to provide increasingly personalized responses that feel genuinely human."
              image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
            />
            <FeatureRow
              icon={<TrendingUp className="w-6 h-6" />}
              heading="Boost Business Growth"
              description="Never lose a potential customer to missed calls or delayed responses. Our AI captures leads 24/7, schedules appointments, and follows up automatically to maximize your conversion rates."
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
              reverse
            />
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Be Among the First to Experience AI Reception
            </h2>
            <p className="text-xl text-muted-foreground">
              Join our early access program and get exclusive benefits when we launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Early Access</h3>
              <p className="text-muted-foreground">
                Be the first to try our revolutionary AI receptionist technology before public launch.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Exclusive Benefits</h3>
              <p className="text-muted-foreground">
                Get lifetime discounts and premium features reserved for early adopters.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Shape the Future</h3>
              <p className="text-muted-foreground">
                Your feedback will directly influence the final product features and design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Ready to Transform Your Customer Service?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our early access program and be among the first to experience 
              the future of AI-powered customer service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/start-free">
                <Button size="lg" className="gradient-primary hover-glow text-white text-lg px-8 py-4">
                  Join Early Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Schedule Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Free early access
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No commitment
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Exclusive benefits
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
