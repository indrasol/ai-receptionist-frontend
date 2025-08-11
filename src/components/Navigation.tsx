
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Bot, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleIndrasolClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ensure the link opens properly
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
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "glass-card shadow-lg" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 font-heading font-bold text-xl gradient-primary-text">
            <div className="relative">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Phone className="w-2 h-2 text-white" />
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/out-bound" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/out-bound" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Outbound
            </Link>
            <Link 
              to="/in-bound" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/in-bound" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Inbound
            </Link>
          </div>

          {/* CTA and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              className="gradient-primary hover-glow text-white font-medium"
              onClick={handleContactClick}
            >
              Contact Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 p-0"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card border-t animate-slide-in-right">
          <div className="px-4 py-6 space-y-4">
            <Link 
              to="/out-bound" 
              className={cn(
                "block px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                location.pathname === "/out-bound" ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              Outbound
            </Link>
            <Link 
              to="/in-bound" 
              className={cn(
                "block px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                location.pathname === "/in-bound" ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              Inbound
            </Link>
            <Button 
              className="w-full gradient-primary hover-glow text-white font-medium"
              onClick={handleContactClick}
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
