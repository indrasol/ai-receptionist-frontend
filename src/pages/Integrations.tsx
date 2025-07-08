
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink } from 'lucide-react';

const Integrations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Integrations' },
    { id: 'crm', name: 'CRM' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'communication', name: 'Communication' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'productivity', name: 'Productivity' }
  ];

  const integrations = [
    {
      name: 'Salesforce',
      category: 'crm',
      logo: 'https://logo.clearbit.com/salesforce.com',
      description: 'Sync customer data and automate lead capture with Salesforce CRM.',
      status: 'available'
    },
    {
      name: 'HubSpot',
      category: 'crm',
      logo: 'https://logo.clearbit.com/hubspot.com',
      description: 'Connect with HubSpot to manage contacts and track interactions.',
      status: 'available'
    },
    {
      name: 'Google Calendar',
      category: 'calendar',
      logo: 'https://logo.clearbit.com/google.com',
      description: 'Seamlessly schedule appointments in Google Calendar.',
      status: 'available'
    },
    {
      name: 'Outlook Calendar',
      category: 'calendar',
      logo: 'https://logo.clearbit.com/microsoft.com',
      description: 'Sync appointments with Microsoft Outlook Calendar.',
      status: 'available'
    },
    {
      name: 'Slack',
      category: 'communication',
      logo: 'https://logo.clearbit.com/slack.com',
      description: 'Get notifications and updates in your Slack workspace.',
      status: 'available'
    },
    {
      name: 'Shopify',
      category: 'ecommerce',
      logo: 'https://logo.clearbit.com/shopify.com',
      description: 'Handle customer support for your Shopify store.',
      status: 'available'
    },
    {
      name: 'Zapier',
      category: 'productivity',
      logo: 'https://logo.clearbit.com/zapier.com',
      description: 'Connect with 5000+ apps through Zapier automation.',
      status: 'available'
    },
    {
      name: 'WhatsApp Business',
      category: 'communication',
      logo: 'https://logo.clearbit.com/whatsapp.com',
      description: 'Provide customer support through WhatsApp Business API.',
      status: 'coming-soon'
    },
    {
      name: 'Zoom',
      category: 'communication',
      logo: 'https://logo.clearbit.com/zoom.us',
      description: 'Schedule and manage Zoom meetings automatically.',
      status: 'available'
    },
    {
      name: 'Stripe',
      category: 'ecommerce',
      logo: 'https://logo.clearbit.com/stripe.com',
      description: 'Handle billing inquiries and payment support.',
      status: 'coming-soon'
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -left-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Powerful
              <span className="gradient-primary-text"> Integrations</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Connect AI FrontDesk Pro with your favorite tools and platforms. 
              Streamline your workflow with seamless integrations.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'gradient-primary text-white' : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration, index) => (
              <div key={index} className="glass-card rounded-xl p-6 hover-glow relative">
                {integration.status === 'coming-soon' && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-12 h-12 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${integration.name}&background=random&color=fff&size=48`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold">{integration.name}</h3>
                      {integration.status === 'available' && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>
                    <Button
                      size="sm"
                      variant={integration.status === 'available' ? 'default' : 'secondary'}
                      disabled={integration.status === 'coming-soon'}
                      className={integration.status === 'available' ? 'gradient-primary text-white' : ''}
                    >
                      {integration.status === 'available' ? 'Connect' : 'Coming Soon'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No integrations found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Integration CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Need a Custom Integration?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't see the integration you need? Our team can build custom 
              integrations for your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary hover-glow text-white">
                Request Integration
              </Button>
              <Button size="lg" variant="outline">
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Integrations;
