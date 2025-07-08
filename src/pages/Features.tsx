
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  Brain, 
  BarChart3, 
  Shield,
  Zap,
  Globe,
  Users,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

const Features = () => {
  const [activeTab, setActiveTab] = useState('communication');

  const featureCategories = {
    communication: {
      title: 'Communication',
      features: [
        {
          icon: <Phone className="w-8 h-8" />,
          title: 'Smart Phone Handling',
          description: 'AI-powered voice recognition and natural conversation flow that handles complex customer inquiries with human-like responses.',
          benefits: ['Natural voice synthesis', 'Multi-language support', 'Emotion detection', 'Call routing intelligence']
        },
        {
          icon: <MessageSquare className="w-8 h-8" />,
          title: 'Omnichannel Messaging',
          description: 'Unified inbox for SMS, WhatsApp, Facebook Messenger, and live chat with consistent AI responses across all platforms.',
          benefits: ['Cross-platform sync', 'Rich media support', 'Auto-translation', 'Context preservation']
        },
        {
          icon: <Globe className="w-8 h-8" />,
          title: 'Global Reach',
          description: 'Support customers worldwide with 40+ languages and timezone-aware responses that feel local and personal.',
          benefits: ['40+ languages', 'Cultural adaptation', 'Local compliance', 'Regional customization']
        }
      ]
    },
    automation: {
      title: 'Automation',
      features: [
        {
          icon: <Calendar className="w-8 h-8" />,
          title: 'Smart Scheduling',
          description: 'Intelligent appointment booking with conflict detection, reminder systems, and automatic rescheduling capabilities.',
          benefits: ['Conflict detection', 'Auto-reminders', 'Calendar sync', 'Reschedule management']
        },
        {
          icon: <Zap className="w-8 h-8" />,
          title: 'Workflow Automation',
          description: 'Create custom workflows that trigger actions based on customer interactions, ensuring consistent follow-up and task completion.',
          benefits: ['Custom triggers', 'Multi-step workflows', 'Integration hooks', 'Performance tracking']
        },
        {
          icon: <Brain className="w-8 h-8" />,
          title: 'AI Decision Making',
          description: 'Advanced AI that makes intelligent decisions about call routing, priority handling, and escalation based on context and urgency.',
          benefits: ['Smart routing', 'Priority detection', 'Escalation rules', 'Learning algorithms']
        }
      ]
    },
    analytics: {
      title: 'Analytics',
      features: [
        {
          icon: <BarChart3 className="w-8 h-8" />,
          title: 'Performance Analytics',
          description: 'Comprehensive dashboards showing call volume, response times, customer satisfaction, and conversion metrics in real-time.',
          benefits: ['Real-time dashboards', 'Custom reports', 'Trend analysis', 'Goal tracking']
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: 'Customer Insights',
          description: 'Deep customer behavior analysis with sentiment tracking, interaction history, and predictive analytics for better service.',
          benefits: ['Sentiment analysis', 'Behavior tracking', 'Predictive insights', 'Customer journey maps']
        },
        {
          icon: <Clock className="w-8 h-8" />,
          title: 'Performance Monitoring',
          description: 'Monitor system performance, uptime, and response quality with alerts and automated optimization suggestions.',
          benefits: ['Uptime monitoring', 'Quality scores', 'Alert system', 'Auto-optimization']
        }
      ]
    }
  };

  const comparisonData = [
    { feature: '24/7 Availability', traditional: false, ai: true },
    { feature: 'Instant Response', traditional: false, ai: true },
    { feature: 'Unlimited Capacity', traditional: false, ai: true },
    { feature: 'Consistent Quality', traditional: false, ai: true },
    { feature: 'Multi-language Support', traditional: false, ai: true },
    { feature: 'Cost per Interaction', traditional: '$2-5', ai: '$0.10' },
    { feature: 'Setup Time', traditional: '2-4 weeks', ai: '15 minutes' },
    { feature: 'Training Required', traditional: 'Extensive', ai: 'None' },
    { feature: 'Scalability', traditional: 'Limited', ai: 'Unlimited' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -right-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Powerful Features for
              <span className="gradient-primary-text"> Modern Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover how our AI-powered front desk solution transforms customer interactions 
              with advanced features designed for today's digital-first world.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="glass-card rounded-full p-2 flex space-x-2">
              {Object.entries(featureCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={activeTab === key ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(key)}
                  className={activeTab === key ? 'gradient-primary text-white' : ''}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featureCategories[activeTab as keyof typeof featureCategories].features.map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 hover-glow">
                <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              AI vs Traditional Front Desk
            </h2>
            <p className="text-xl text-muted-foreground">
              See how AI FrontDesk Pro compares to traditional customer service solutions.
            </p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Header */}
              <div className="p-6 border-b border-r">
                <h3 className="font-heading font-semibold text-center">Feature</h3>
              </div>
              <div className="p-6 border-b border-r bg-red-50 dark:bg-red-950/20">
                <h3 className="font-heading font-semibold text-center">Traditional Front Desk</h3>
              </div>
              <div className="p-6 border-b bg-green-50 dark:bg-green-950/20">
                <h3 className="font-heading font-semibold text-center gradient-primary-text">AI FrontDesk Pro</h3>
              </div>

              {/* Comparison Rows */}
              {comparisonData.map((row, index) => (
                <div key={index} className="contents">
                  <div className="p-4 border-b border-r">
                    <span className="font-medium">{row.feature}</span>
                  </div>
                  <div className="p-4 border-b border-r bg-red-50/50 dark:bg-red-950/10 text-center">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-red-600 dark:text-red-400">{row.traditional}</span>
                    )}
                  </div>
                  <div className="p-4 border-b bg-green-50/50 dark:bg-green-950/10 text-center">
                    {typeof row.ai === 'boolean' ? (
                      row.ai ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-semibold">{row.ai}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-muted-foreground">
              Your data and customer information are protected with industry-leading security measures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'SOC 2 Compliant',
                description: 'Independently audited security controls and procedures.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'GDPR Ready',
                description: 'Full compliance with European data protection regulations.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'End-to-End Encryption',
                description: 'All data encrypted in transit and at rest with AES-256.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: '99.9% Uptime SLA',
                description: 'Guaranteed availability with redundant infrastructure.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and see how AI FrontDesk Pro can transform your customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary hover-glow text-white">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
