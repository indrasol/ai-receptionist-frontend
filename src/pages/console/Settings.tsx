
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bot, Phone, Bell, Shield, CreditCard } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your AI receptionist and account preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Customize your AI receptionist's behavior and responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="Acme Corp" />
              </div>
              
              <div>
                <Label htmlFor="ai-name">AI Receptionist Name</Label>
                <Input id="ai-name" defaultValue="Alex" />
              </div>

              <div>
                <Label htmlFor="greeting">Custom Greeting</Label>
                <Textarea
                  id="greeting"
                  placeholder="Hello! Thank you for calling [Business Name]. I'm [AI Name], your AI assistant. How can I help you today?"
                  defaultValue="Hello! Thank you for calling Acme Corp. I'm Alex, your AI assistant. How can I help you today?"
                />
              </div>

              <div>
                <Label htmlFor="voice">Voice Style</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sentiment-analysis">Sentiment Analysis</Label>
                  <p className="text-sm text-gray-500">Detect caller emotions and adjust responses</p>
                </div>
                <Switch id="sentiment-analysis" defaultChecked />
              </div>

              <Button className="w-full gradient-primary text-white">
                Save AI Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Phone Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Phone Settings
              </CardTitle>
              <CardDescription>
                Configure call handling and routing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone-number">Primary Phone Number</Label>
                <Input id="phone-number" defaultValue="+1 (555) 123-4567" />
              </div>

              <div>
                <Label htmlFor="business-hours">Business Hours</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select defaultValue="9">
                    <SelectTrigger>
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="17">
                    <SelectTrigger>
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="max-call-duration">Max Call Duration (minutes)</Label>
                <Input id="max-call-duration" type="number" defaultValue="15" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="call-recording">Call Recording</Label>
                  <p className="text-sm text-gray-500">Record calls for quality and training</p>
                </div>
                <Switch id="call-recording" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voicemail">Voicemail Fallback</Label>
                  <p className="text-sm text-gray-500">Take messages when AI can't help</p>
                </div>
                <Switch id="voicemail" defaultChecked />
              </div>

              <Button className="w-full gradient-primary text-white">
                Save Phone Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose when and how you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-notifications">Email Address</Label>
                <Input id="email-notifications" type="email" defaultValue="admin@acmecorp.com" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Appointments</Label>
                    <p className="text-sm text-gray-500">When AI books new appointments</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Missed Calls</Label>
                    <p className="text-sm text-gray-500">When calls go unanswered</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Transfer Requests</Label>
                    <p className="text-sm text-gray-500">When AI needs to transfer calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Summary of weekly performance</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="w-full gradient-primary text-white">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Billing
              </CardTitle>
              <CardDescription>
                Manage your account security and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing & Usage
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  API Keys
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
