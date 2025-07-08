
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Building, Palette, Users, DollarSign, Star } from 'lucide-react';
import TestimonialCard from '@/components/TestimonialCard';

const WhiteLabel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const benefits = [
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Your Brand, Your Business',
      description: 'Complete white-label solution with your branding, domain, and custom styling. Your customers will never know we exist.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Full Customization',
      description: 'Customize everything from the interface design to AI personality and voice to match your brand perfectly.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Dedicated Support',
      description: 'Get priority support, dedicated account management, and training resources for your team.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Recurring Revenue',
      description: 'Build a profitable recurring revenue stream by reselling our AI solution to your clients.'
    }
  ];

  const testimonials = [
    {
      quote: "White-labeling AI FrontDesk Pro has been a game-changer for our agency. We now offer AI customer service as a premium service to all our clients.",
      author: "David Park",
      role: "CEO",
      company: "Digital Solutions Agency",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The white-label program allowed us to scale our service offerings overnight. Our clients love having AI receptionists under our brand.",
      author: "Lisa Thompson",
      role: "Founder",
      company: "TechStart Consulting",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "Outstanding support and seamless integration. We've increased our monthly revenue by 40% since launching our AI service division.",
      author: "Carlos Rodriguez",
      role: "Partner",
      company: "Innovation Partners",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const pricingTiers = [
    {
      name: 'Reseller',
      description: 'Perfect for agencies and consultants',
      commissionRate: '30%',
      minimumClients: '5',
      features: [
        'White-label dashboard',
        'Custom branding',
        '30% recurring commission',
        'Dedicated support',
        'Marketing materials',
        'Training resources'
      ]
    },
    {
      name: 'Partner',
      description: 'For established service providers',
      commissionRate: '40%',
      minimumClients: '15',
      features: [
        'Everything in Reseller',
        '40% recurring commission',
        'Priority technical support',
        'Custom integrations',
        'Co-marketing opportunities',
        'Quarterly business reviews'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Large-scale deployment partners',
      commissionRate: '50%',
      minimumClients: '50+',
      features: [
        'Everything in Partner',
        '50% recurring commission',
        'Dedicated account manager',
        'Custom development',
        'SLA guarantees',
        'Revenue sharing programs'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -right-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              White Label AI Solutions for
              <span className="gradient-primary-text"> Your Business</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Offer AI-powered customer service under your own brand. Perfect for agencies, 
              consultants, and service providers looking to expand their offerings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary hover-glow text-white">
                Become a Partner
              </Button>
              <Button size="lg" variant="outline">
                Download Partner Kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Why Choose Our White Label Program?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to offer world-class AI customer service under your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 hover-glow">
                <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Partner Program Tiers
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the partnership level that fits your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`glass-card rounded-2xl p-8 ${
                  index === 1 ? 'ring-2 ring-primary shadow-xl' : 'hover-glow'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                      Recommended
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-6">{tier.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-heading font-bold gradient-primary-text mb-2">
                      {tier.commissionRate}
                    </div>
                    <div className="text-muted-foreground">Recurring Commission</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Minimum {tier.minimumClients} clients
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Star className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  className={`w-full ${
                    index === 1 
                      ? 'gradient-primary hover-glow text-white' 
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Success Stories from Our Partners
            </h2>
            <p className="text-xl text-muted-foreground">
              See how our white-label partners are growing their businesses.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={prevTestimonial}
                className="absolute left-0 z-10 w-12 h-12 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="max-w-2xl mx-auto">
                <TestimonialCard {...testimonials[currentTestimonial]} />
              </div>

              <Button
                variant="ghost"
                size="lg"
                onClick={nextTestimonial}
                className="absolute right-0 z-10 w-12 h-12 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started with our white-label program in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Apply & Get Approved',
                description: 'Submit your application and get approved within 24 hours. We review each partner to ensure quality.'
              },
              {
                step: '2',
                title: 'Setup Your Brand',
                description: 'Customize the platform with your branding, domain, and styling. We handle all the technical setup.'
              },
              {
                step: '3',
                title: 'Start Selling',
                description: 'Launch your AI service offering and start earning recurring commissions from day one.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Ready to Become a Partner?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our white-label program and start offering AI customer service 
              solutions under your brand today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary hover-glow text-white">
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhiteLabel;
