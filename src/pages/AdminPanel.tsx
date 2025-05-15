
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useElection } from '@/contexts/ElectionContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ElectionsManagement from './admin/ElectionsManagement';

// Admin Dashboard sub-page
const AdminDashboard = () => {
  const { elections, activeElections, completedElections, upcomingElections } = useElection();
  const navigate = useNavigate();
  
  // Sample data for charts
  const electionStatusData = [
    { name: 'Active', value: activeElections.length, color: '#3498db' },
    { name: 'Upcoming', value: upcomingElections.length, color: '#f39c12' },
    { name: 'Completed', value: completedElections.length, color: '#27ae60' },
  ];
  
  const voterActivityData = [
    { name: 'Day 1', voters: 24 },
    { name: 'Day 2', voters: 13 },
    { name: 'Day 3', voters: 38 },
    { name: 'Day 4', voters: 52 },
    { name: 'Day 5', voters: 69 },
    { name: 'Day 6', voters: 41 },
    { name: 'Day 7', voters: 26 },
  ];
  
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Monitor and manage election activity">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{elections.length}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Active Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-500">{activeElections.length}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {elections.reduce((acc, election) => acc + election.totalVotes, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Avg. Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {elections.length
                ? Math.round(
                    (elections.reduce((acc, election) => {
                      return acc + (election.totalVotes / election.voterCount) * 100;
                    }, 0) / elections.length)
                  )
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Election Status</CardTitle>
            <CardDescription>Distribution of election statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {electionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Voter Activity (Last 7 Days)</CardTitle>
            <CardDescription>Number of votes cast each day</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voterActivityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="voters" name="Votes" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Elections */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Recent Elections</CardTitle>
          <CardDescription>Latest election activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Start Date</th>
                  <th className="py-3 text-left font-medium">End Date</th>
                  <th className="py-3 text-left font-medium">Participation</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.slice(0, 5).map((election) => (
                  <tr key={election.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3">{election.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        election.status === 'active'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : election.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="py-3">{election.startDate.toLocaleDateString()}</td>
                    <td className="py-3">{election.endDate.toLocaleDateString()}</td>
                    <td className="py-3">
                      {Math.round((election.totalVotes / election.voterCount) * 100)}%
                    </td>
                    <td className="py-3">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/elections/${election.id}`)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/elections')}>View All Elections</Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

// Admin Voters component
const AdminVoters = () => {
  return (
    <AdminLayout title="Voter Management" subtitle="Manage voter registration and access">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Voter Management</CardTitle>
          <CardDescription>Manage voter registration and access</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Voter management tools coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

// Admin Settings component
const AdminSettings = () => {
  return (
    <AdminLayout title="System Settings" subtitle="Configure your voting system">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure your voting system</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings tools coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

// Main AdminPanel component
const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to /admin/dashboard if we're at /admin
  React.useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/elections" element={<ElectionsManagement />} />
      <Route path="/voters" element={<AdminVoters />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminPanel;
