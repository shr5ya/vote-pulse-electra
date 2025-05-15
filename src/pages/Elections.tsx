
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Search, CalendarCheck, Clock, CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ElectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    elections, 
    activeElections, 
    upcomingElections, 
    completedElections,
    createElection,
    deleteElection 
  } = useElection();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  
  // New election form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newVoterCount, setNewVoterCount] = useState('50');

  const filteredElections = (() => {
    let filtered;
    
    switch(filter) {
      case 'active':
        filtered = activeElections;
        break;
      case 'upcoming':
        filtered = upcomingElections;
        break;
      case 'completed':
        filtered = completedElections;
        break;
      default:
        filtered = elections;
    }
    
    if (searchTerm) {
      return filtered.filter(election => 
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        election.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  })();

  const handleCreateElection = () => {
    if (!newTitle || !newDescription || !newStartDate || !newEndDate || !newVoterCount) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }
    
    createElection({
      title: newTitle,
      description: newDescription,
      startDate,
      endDate,
      voterCount: parseInt(newVoterCount),
      candidates: [],
      createdBy: user?.id
    });
    
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewStartDate('');
    setNewEndDate('');
    setNewVoterCount('50');
    setOpen(false);
  };

  const handleDeleteElection = (id: string) => {
    if (confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      deleteElection(id);
      toast.success('Election deleted successfully');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Elections</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Election
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Election</DialogTitle>
              <DialogDescription>
                Set up a new election by providing the required details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter election title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter election description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="voterCount">Number of Voters</Label>
                <Input
                  id="voterCount"
                  type="number"
                  value={newVoterCount}
                  onChange={(e) => setNewVoterCount(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateElection}>Create Election</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Elections</CardTitle>
          <CardDescription>Manage elections for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('all')}
                className="flex items-center gap-1"
              >
                All
              </Button>
              <Button 
                variant={filter === 'active' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('active')}
                className="flex items-center gap-1"
              >
                <CalendarCheck className="h-3 w-3" /> Active
              </Button>
              <Button 
                variant={filter === 'upcoming' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('upcoming')}
                className="flex items-center gap-1"
              >
                <Clock className="h-3 w-3" /> Upcoming
              </Button>
              <Button 
                variant={filter === 'completed' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('completed')}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" /> Completed
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElections.length > 0 ? (
                  filteredElections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>{getStatusBadge(election.status)}</TableCell>
                      <TableCell>{election.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{election.endDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {Math.round((election.totalVotes / election.voterCount) * 100)}%
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/elections/${election.id}`)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={election.status === 'completed'}
                            title="Edit Election"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteElection(election.id)}
                            title="Delete Election"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No elections found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total Elections: {filteredElections.length}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="outline" size="sm">Import</Button>
          </div>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default ElectionsPage;
