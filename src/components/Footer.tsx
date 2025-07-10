
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Instagram, Bot, Phone } from 'lucide-react';

const Footer = () => {
  const handleIndrasolClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    window.open('https://indrasol.com', '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    const contactSection = document.querySelector('section:nth-of-type(2)');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center space-x-3 font-heading font-bold text-xl gradient-primary-text mb-4">
              <div className="relative">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                  <Phone className="w-1.5 h-1.5 text-white" />
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span>AI Receptionist</span>
                <a 
                  href="https://indrasol.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleIndrasolClick}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-1 cursor-pointer"
                >
                  by Indrasol
                </a>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your business with AI-powered customer service that never sleeps. 
              Handle unlimited calls, messages, and appointments 24/7.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:gradient-primary hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:text-right">
            <h4 className="font-heading font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-muted-foreground">
              <p>Ready to experience the future of customer service?</p>
              <p>We're here to help you get started.</p>
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="hover:gradient-primary hover:text-white"
                  onClick={handleContactClick}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AI Receptionist. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
