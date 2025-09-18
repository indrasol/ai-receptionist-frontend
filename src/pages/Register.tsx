 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Mail, User, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
// Using uploaded AI receptionist image

type AuthStep = 'form' | 'otp';
type AuthMode = 'signup' | 'login';

const Register = () => {
  const navigate = useNavigate();
  const { sendOTPForSignup, sendOTPForLogin, verifyOTPAndSignup, verifyOTPAndLogin } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState<AuthMode>('signup');
  const [currentStep, setCurrentStep] = useState<AuthStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Form data
  const [signupData, setSignupData] = useState({
    organizationName: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [loginData, setLoginData] = useState({
    email: ''
  });
  
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateSignupForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!signupData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!signupData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};

    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submissions
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup' && !validateSignupForm()) return;
    if (activeTab === 'login' && !validateLoginForm()) return;

    setIsLoading(true);
    
    try {
      let result;
      
      if (activeTab === 'signup') {
        result = await sendOTPForSignup(
          signupData.email,
          signupData.organizationName,
          signupData.firstName,
          signupData.lastName
        );
      } else {
        result = await sendOTPForLogin(loginData.email);
      }
      
      if (result.success) {
        toast.success(result.message || 'OTP sent successfully!');
        setCurrentStep('otp');
        setOtpSent(true);
      } else {
        // Handle user not found for login
        if (result.error === 'USER_NOT_FOUND' || result.message?.includes('No account found')) {
          setActiveTab('signup');
          setSignupData(prev => ({ ...prev, email: loginData.email }));
          toast.error('No account found with this email. Please sign up first.');
          setErrors({ general: 'No account found with this email. Please sign up first.' });
        } else {
          toast.error(result.error || 'Failed to send OTP');
          setErrors({ general: result.error || 'Failed to send OTP' });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) return;

    setIsLoading(true);
    
    try {
      let result;
      
      if (activeTab === 'signup') {
        result = await verifyOTPAndSignup(
          signupData.email,
          otp,
          signupData.organizationName,
          signupData.firstName,
          signupData.lastName
        );
      } else {
        result = await verifyOTPAndLogin(loginData.email, otp);
      }
      
      if (result.success) {
        toast.success(result.message || 'Verification successful!');
        navigate('/launch');
      } else {
        // Handle user not found during login verification
        if (result.error === 'USER_NOT_FOUND') {
          setActiveTab('signup');
          setSignupData(prev => ({ ...prev, email: loginData.email }));
          setCurrentStep('form');
          setOtpSent(false);
          toast.error(result.message || 'No account found. Please sign up first.');
        } else {
          toast.error(result.error || 'Verification failed');
          setErrors({ otp: result.error || 'Verification failed' });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setErrors({ otp: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handlers
  const handleSignupInputChange = (field: keyof typeof signupData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLoginInputChange = (field: keyof typeof loginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  // Reset form when switching tabs
  const handleTabChange = (newTab: AuthMode) => {
    setActiveTab(newTab);
    setCurrentStep('form');
    setOtpSent(false);
    setOtp('');
    setErrors({});
    
    if (newTab === 'login') {
      setLoginData({ email: '' });
    } else {
      setSignupData({ organizationName: '', firstName: '', lastName: '', email: '' });
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setOtpSent(false);
    setOtp('');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-background via-muted/30 to-background items-center justify-center p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <img 
            src="/lovable-uploads/cc5bbc60-f97d-45dd-b5ff-d5d348fb6914.png" 
            alt="AI Receptionist" 
            className="w-full h-auto mb-8 animate-float"
          />
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Welcome to AI Receptionist
          </h2>
          <p className="text-muted-foreground">
            Transform your business communication with intelligent call handling and seamless customer experience.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Back to Home Link */}
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {currentStep === 'form' ? 'Welcome' : 'Verify Your Email'}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 'form' 
                ? "Let's get started. It's totally free." 
                : `We've sent a verification code to ${activeTab === 'signup' ? signupData.email : loginData.email}`
              }
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6">
              {errors.general && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {currentStep === 'form' ? (
                // Form Step - Tabbed Interface
                <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as AuthMode)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signup" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sign Up
                    </TabsTrigger>
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Login
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signup">
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      {/* Organization Name */}
                      <div className="space-y-2">
                        <Label htmlFor="organizationName" className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Organization Name
                        </Label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Enter your organization name"
                          value={signupData.organizationName}
                          onChange={handleSignupInputChange('organizationName')}
                          className={errors.organizationName ? 'border-destructive' : ''}
                        />
                        {errors.organizationName && (
                          <p className="text-sm text-destructive">{errors.organizationName}</p>
                        )}
                      </div>

                      {/* First Name */}
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={signupData.firstName}
                          onChange={handleSignupInputChange('firstName')}
                          className={errors.firstName ? 'border-destructive' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-destructive">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          value={signupData.lastName}
                          onChange={handleSignupInputChange('lastName')}
                          className={errors.lastName ? 'border-destructive' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-destructive">{errors.lastName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={signupData.email}
                          onChange={handleSignupInputChange('email')}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full hover-glow" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          'Send OTP →'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="login">
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={loginData.email}
                          onChange={handleLoginInputChange('email')}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full hover-glow" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          'Send OTP →'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                // OTP Verification Step
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code we sent to your email
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={handleOTPChange}
                        className={`text-center text-lg tracking-widest ${errors.otp ? 'border-destructive' : ''}`}
                        maxLength={6}
                      />
                      {errors.otp && (
                        <p className="text-sm text-destructive">{errors.otp}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full hover-glow" 
                        disabled={isLoading || otp.length !== 6}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Continue →'
                        )}
                      </Button>

                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={handleBackToForm}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ← Back to form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                          disabled={isLoading}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

          {currentStep === 'form' && (
            <p className="text-center text-sm text-muted-foreground">
              {activeTab === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => handleTabChange('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleTabChange('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;