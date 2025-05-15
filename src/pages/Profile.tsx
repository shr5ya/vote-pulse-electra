
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Phone, Building, MapPin, Calendar, Key } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className="text-xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="capitalize">{user?.role || 'voter'}</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline">Change Avatar</Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ''} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" defaultValue="Electra Inc." />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="joined">Member Since</Label>
                  <Input id="joined" defaultValue="January 2024" disabled />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Button type="submit" onClick={handleChangePassword}>Update Password</Button>
              <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2">Account Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-amber-600">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
