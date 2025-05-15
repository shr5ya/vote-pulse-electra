
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Bell, Mail, Lock, User, Moon, Sun, Globe, Eye, Smartphone } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('UTC');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="general" className="w-full mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Manage your basic account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select value={timeZone} onValueChange={setTimeZone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select Time Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select Date Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY (US)</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY (Europe/Asia)</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD (ISO)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about election updates and results</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get push notifications on your devices</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="mr-2 h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="mr-2 h-5 w-5 text-primary" />
                  )}
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme-toggle">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <Switch 
                      id="theme-toggle" 
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select Font Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color-scheme">Color Scheme</Label>
                    <Select defaultValue="blue">
                      <SelectTrigger id="color-scheme">
                        <SelectValue placeholder="Select Color Scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue (Default)</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor-auth" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="login-history">Login Activity Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new login attempts</p>
                    </div>
                    <Switch id="login-history" defaultChecked />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-2">Recent Login Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Chrome on Windows</p>
                          <p className="text-muted-foreground">San Francisco, CA — May 14, 2025</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Current
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Safari on iPhone</p>
                          <p className="text-muted-foreground">San Francisco, CA — May 12, 2025</p>
                        </div>
                        <Button variant="ghost" size="sm">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
