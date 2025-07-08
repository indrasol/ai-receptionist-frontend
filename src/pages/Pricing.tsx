
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, X, Star, Zap } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with AI customer service.',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 500 calls/month',
        'Basic phone & chat support',
        'Simple appointment booking',
        'Email support',
        'Basic analytics dashboard',
        'Standard voice options'
      ],
      limitations: [
        'No custom integrations',
        'Limited customization',
        'Standard response time'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses that need advanced AI capabilities.',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Up to 2,500 calls/month',
        'Advanced phone, chat & SMS',
        'Smart appointment booking',
        'Priority support',
        'Advanced analytics & reporting',
        'Custom voice & personality',
        'CRM integrations',
        'Multi-language support',
        'Workflow automations'
      ],
      limitations: [
        'Limited white-label options'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations requiring maximum flexibility and control.',
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        'Unlimited calls & messages',
        'Full omnichannel support',
        'Advanced AI customization',
        'Dedicated account manager',
        'Custom analytics & reporting',
        'Full white-label solution',
        'All integrations included',
        'Custom development',
        'SLA guarantees',
        'Advanced security features'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
    },
    {
      question: 'What happens if I exceed my call limit?',
      answer: 'We\'ll notify you when you approach your limit. You can upgrade your plan or purchase additional call credits at $0.10 per call.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees ever. We believe in transparent pricing with no hidden costs.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. Cancel anytime with no penalties. Your service continues until the end of your current billing period.'
    },
    {
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes, we work with enterprise customers to create custom solutions that meet their specific needs and scale requirements.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -left-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Simple, Transparent
              <span className="gradient-primary-text"> Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Choose the perfect plan for your business. Start with our free trial and 
              scale as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`font-medium ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`font-medium ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                Save 20%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card rounded-2xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover-glow'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-heading font-bold">
                        ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.annualPrice}/year)
                      </div>
                    )}
                  </div>

                  <Button 
                    size="lg" 
                    className={`w-full ${
                      plan.popular 
                        ? 'gradient-primary hover-glow text-white' 
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    What's Included
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start">
                            <X className="w-4 h-4 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 text-center">
            <Zap className="w-16 h-16 gradient-primary text-white rounded-xl mx-auto mb-6 p-4" />
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Something Custom?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We work with enterprise customers to create tailored solutions that meet 
              their unique requirements, scale, and integration needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary hover-glow text-white">
                Contact Sales Team
              </Button>
              <Button size="lg" variant="outline">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses already using AI FrontDesk Pro. 
            Start your free 14-day trial today – no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary hover-glow text-white">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
