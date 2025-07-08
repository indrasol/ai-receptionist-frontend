
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      slug: 'future-of-ai-customer-service',
      title: 'The Future of AI in Customer Service: Trends to Watch in 2024',
      excerpt: 'Explore the latest trends and innovations shaping the future of AI-powered customer service, from advanced natural language processing to predictive analytics.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      category: 'Industry Insights',
      featured: true
    },
    {
      slug: 'roi-ai-customer-service',
      title: 'Calculating ROI: How AI Customer Service Pays for Itself',
      excerpt: 'A comprehensive guide to measuring the return on investment of AI customer service solutions, including cost savings and revenue impact analysis.',
      author: 'Mike Chen',
      date: '2024-01-12',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      category: 'Business Strategy'
    },
    {
      slug: 'best-practices-ai-implementation',
      title: '10 Best Practices for Implementing AI in Your Business',
      excerpt: 'Learn from successful AI implementations with our comprehensive guide covering planning, execution, and optimization strategies.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
      category: 'Implementation'
    },
    {
      slug: 'ai-vs-human-customer-service',
      title: 'AI vs Human Customer Service: Finding the Perfect Balance',
      excerpt: 'Discover how to create the optimal mix of AI automation and human touch in your customer service strategy.',
      author: 'David Park',
      date: '2024-01-08',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      category: 'Strategy'
    },
    {
      slug: 'small-business-ai-guide',
      title: 'AI for Small Businesses: A Practical Getting Started Guide',
      excerpt: 'Everything small business owners need to know about implementing AI customer service solutions on a budget.',
      author: 'Lisa Thompson',
      date: '2024-01-05',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      category: 'Small Business'
    },
    {
      slug: 'multilingual-ai-support',
      title: 'Breaking Language Barriers: Multilingual AI Customer Support',
      excerpt: 'How AI is revolutionizing global customer service by providing seamless multilingual support across all channels.',
      author: 'Carlos Rodriguez',
      date: '2024-01-03',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      category: 'Technology'
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="blob-bg w-96 h-96 gradient-primary top-20 -left-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              AI Customer Service
              <span className="gradient-primary-text"> Insights & Guides</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay updated with the latest trends, best practices, and insights 
              in AI-powered customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="text-primary font-medium">{featuredPost.category}</span>
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Link to={`/blog/${featuredPost.slug}`}>
                      <Button className="gradient-primary hover-glow text-white">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Masonry Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.slug} className="glass-card rounded-xl overflow-hidden hover-glow group">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {post.author}
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter and get the latest AI customer service 
              insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
              />
              <Button className="gradient-primary hover-glow text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
