
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Phone, Bot, Zap, Clock, Users, Shield } from 'lucide-react';

const StartFree = () => {
  const navigate = useNavigate();

  const features = [
    'No setup fees or hidden costs',
    '24/7 AI receptionist service',
    'Unlimited call handling',
    'Smart call routing',
    'Appointment scheduling',
    'Real-time analytics',
    'Knowledge base integration',
    'Cancel anytime'
  ];

  const benefits = [
    {
      icon: Phone,
      title: 'Never Miss a Call',
      description: 'Your AI receptionist answers every call instantly, 24/7'
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Get started in minutes with our simple onboarding process'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate routine calls and focus on growing your business'
    },
    {
      icon: Users,
      title: 'Improve Experience',
      description: 'Provide consistent, professional service to every caller'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Start Your <span className="gradient-primary-text">Free Trial</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your business with an AI receptionist that never sleeps. 
                Handle unlimited calls, book appointments, and provide 24/7 customer service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="gradient-primary hover-glow text-white text-lg px-8 py-4"
                  onClick={() => navigate('/onboard')}
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to get started
          </h2>
          <p className="text-lg text-gray-600">
            Your free trial includes all premium features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What's included in your free trial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="gradient-primary text-white p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white">Ready to get started?</CardTitle>
                <CardDescription className="text-blue-100">
                  Join thousands of businesses already using AI receptionists
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4 mb-6">
                  <div className="text-4xl font-bold">14 Days</div>
                  <div className="text-blue-100">Completely free trial</div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full text-lg py-3"
                  onClick={() => navigate('/onboard')}
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-blue-100 mt-4">
                  No setup fees • No contracts • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-500 mb-8">Trusted by growing businesses worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {/* Placeholder for company logos */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-medium">Company {i}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StartFree;
