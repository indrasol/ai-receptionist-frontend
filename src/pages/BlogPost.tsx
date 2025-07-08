
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();

  // Mock blog post data - in a real app, this would be fetched based on the slug
  const post = {
    title: 'The Future of AI in Customer Service: Trends to Watch in 2024',
    excerpt: 'Explore the latest trends and innovations shaping the future of AI-powered customer service, from advanced natural language processing to predictive analytics.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    category: 'Industry Insights',
    content: `
      <p>Artificial Intelligence is revolutionizing customer service at an unprecedented pace. As we move through 2024, businesses are discovering new ways to leverage AI technologies to create more efficient, personalized, and effective customer experiences.</p>

      <h2>The Current State of AI Customer Service</h2>
      <p>Today's AI customer service solutions have evolved far beyond simple chatbots. Modern systems can understand context, maintain conversation continuity, and even detect emotional nuances in customer communications. This evolution has opened up new possibilities for businesses of all sizes.</p>

      <h2>Key Trends Shaping 2024</h2>
      
      <h3>1. Conversational AI Gets More Human</h3>
      <p>The latest developments in natural language processing are making AI conversations increasingly indistinguishable from human interactions. Advanced models can now understand sarcasm, cultural references, and complex queries that would have stumped earlier systems.</p>

      <h3>2. Predictive Customer Service</h3>
      <p>AI systems are becoming proactive rather than reactive. By analyzing customer behavior patterns, purchase history, and interaction data, AI can now predict when customers might need help and reach out before problems escalate.</p>

      <h3>3. Omnichannel Integration</h3>
      <p>Modern AI customer service platforms seamlessly integrate across all communication channels - phone, email, chat, social media, and messaging apps. This creates a unified customer experience regardless of how customers choose to reach out.</p>

      <h2>Implementation Best Practices</h2>
      <p>Successfully implementing AI customer service requires careful planning and execution. Here are the key considerations:</p>

      <ul>
        <li><strong>Start with clear objectives:</strong> Define what you want to achieve with AI customer service</li>
        <li><strong>Choose the right technology partner:</strong> Look for solutions that can scale with your business</li>
        <li><strong>Train your AI properly:</strong> Invest time in training your AI with quality data</li>
        <li><strong>Monitor and optimize:</strong> Continuously analyze performance and make improvements</li>
      </ul>

      <h2>Looking Ahead</h2>
      <p>The future of AI customer service is bright, with emerging technologies like GPT-4 and advanced voice synthesis promising even more natural interactions. Businesses that invest in AI customer service today will be well-positioned to deliver exceptional customer experiences tomorrow.</p>

      <p>As we continue to see rapid advancement in AI technologies, one thing is clear: the businesses that embrace these innovations will have a significant competitive advantage in delivering superior customer service.</p>
    `
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <section className="py-8 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-primary font-medium mb-4">
              <span>{post.category}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <span>{formatDate(post.date)}</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Ready to Transform Your Customer Service?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              See how AI FrontDesk Pro can help you implement the trends discussed in this article.
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
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
