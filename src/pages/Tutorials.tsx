
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Clock, User } from 'lucide-react';

const Tutorials = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with AI FrontDesk Pro',
      description: 'Learn the basics of setting up your AI front desk and configuring your first responses.',
      duration: '8:45',
      instructor: 'Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      category: 'Getting Started',
      featured: true
    },
    {
      id: 2,
      title: 'Advanced Call Routing & Escalation',
      description: 'Master complex call routing scenarios and set up intelligent escalation rules.',
      duration: '12:30',
      instructor: 'Mike Chen',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      category: 'Advanced Features'
    },
    {
      id: 3,
      title: 'Customizing Your AI Personality',
      description: 'Personalize your AI assistant to match your brand voice and customer expectations.',
      duration: '10:15',
      instructor: 'Emily Rodriguez',
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop',
      category: 'Customization'
    },
    {
      id: 4,
      title: 'Integration with Popular CRM Systems',
      description: 'Connect your AI front desk with Salesforce, HubSpot, and other CRM platforms.',
      duration: '15:20',
      instructor: 'David Park',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      category: 'Integrations'
    },
    {
      id: 5,
      title: 'Analytics & Performance Monitoring',
      description: 'Understand your dashboard metrics and optimize your AI performance.',
      duration: '9:30',
      instructor: 'Lisa Thompson',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      category: 'Analytics'
    },
    {
      id: 6,
      title: 'Multi-language Support Setup',
      description: 'Configure your AI to handle customers in multiple languages effectively.',
      duration: '11:45',
      instructor: 'Carlos Rodriguez',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      category: 'Customization'
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredTutorial = tutorials.find(t => t.featured);
  const regularTutorials = tutorials.filter(t => !t.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -right-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Learn AI FrontDesk Pro with
              <span className="gradient-primary-text"> Video Tutorials</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Master every feature with our comprehensive video tutorial library. 
              From setup to advanced configurations, we've got you covered.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutorial */}
      {featuredTutorial && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative group cursor-pointer">
                  <img
                    src={featuredTutorial.thumbnail}
                    alt={featuredTutorial.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-sm text-primary font-medium mb-2">
                    {featuredTutorial.category}
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-4">
                    {featuredTutorial.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredTutorial.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {featuredTutorial.duration}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {featuredTutorial.instructor}
                    </div>
                  </div>
                  <Button className="gradient-primary hover-glow text-white w-fit">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tutorial Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.filter(t => !t.featured).map((tutorial) => (
              <div key={tutorial.id} className="glass-card rounded-xl overflow-hidden hover-glow group cursor-pointer">
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">
                    {tutorial.category}
                  </div>
                  <h3 className="font-heading font-semibold mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    {tutorial.instructor}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tutorials found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Watch our getting started tutorial and launch your AI front desk in minutes.
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

export default Tutorials;
