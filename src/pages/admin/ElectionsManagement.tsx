
import React, { useState } from 'react';
import { 
  PlusCircle, Edit, Trash2, Calendar, Users, BarChart, Play, Pause, 
  AlertCircle, Search, Filter, Download, MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const ElectionsManagement = () => {
  const { elections, createElection } = useElection();
  const [isCreatingElection, setIsCreatingElection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // New election form state
  const [newElectionTitle, setNewElectionTitle] = useState('');
  const [newElectionDescription, setNewElectionDescription] = useState('');
  const [newElectionStartDate, setNewElectionStartDate] = useState('');
  const [newElectionEndDate, setNewElectionEndDate] = useState('');
  const [newElectionVoterCount, setNewElectionVoterCount] = useState('100');
  
  const handleCreateElection = () => {
    if (!newElectionTitle || !newElectionDescription || !newElectionStartDate || !newElectionEndDate) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    const startDate = new Date(newElectionStartDate);
    const endDate = new Date(newElectionEndDate);
    
    if (startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }
    
    createElection({
      title: newElectionTitle,
      description: newElectionDescription,
      startDate,
      endDate,
      candidates: [],
      voterCount: parseInt(newElectionVoterCount) || 100
    });
    
    // Reset form
    setNewElectionTitle('');
    setNewElectionDescription('');
    setNewElectionStartDate('');
    setNewElectionEndDate('');
    setNewElectionVoterCount('100');
    
    setIsCreatingElection(false);
  };
  
  const handleDeleteElection = () => {
    // In a real app, you would delete the election here
    toast.success('Election deleted successfully');
    setIsDeleteDialogOpen(false);
  };
  
  const filteredElections = elections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout
      title="Election Management"
      subtitle="Create and manage elections, add candidates, and monitor results"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search elections..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreatingElection(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Election
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Elections</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredElections.length > 0 ? (
            <div className="grid gap-4">
              {filteredElections.map((election) => (
                <ElectionCard 
                  key={election.id} 
                  election={election} 
                  onDelete={(id) => {
                    setSelectedElectionId(id);
                    setIsDeleteDialogOpen(true);
                  }}
                  onView={(id) => navigate(`/elections/${id}`)}
                  onResults={(id) => navigate(`/results/${id}`)}
                  onEdit={(id) => navigate(`/elections/${id}/edit`)}
                  onManageCandidates={(id) => navigate(`/elections/${id}/candidates`)}
                  onManageVoters={(id) => navigate(`/elections/${id}/voters`)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No elections found</p>
                  {searchTerm ? (
                    <p className="text-gray-500">
                      No elections match your search criteria. Try a different search term or clear the search.
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      You haven't created any elections yet. Click the "Create Election" button to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="active">
          {filteredElections.filter(e => e.status === 'active').length > 0 ? (
            <div className="grid gap-4">
              {filteredElections
                .filter(e => e.status === 'active')
                .map((election) => (
                  <ElectionCard 
                    key={election.id} 
                    election={election} 
                    onDelete={(id) => {
                      setSelectedElectionId(id);
                      setIsDeleteDialogOpen(true);
                    }}
                    onView={(id) => navigate(`/elections/${id}`)}
                    onResults={(id) => navigate(`/results/${id}`)}
                    onEdit={(id) => navigate(`/elections/${id}/edit`)}
                    onManageCandidates={(id) => navigate(`/elections/${id}/candidates`)}
                    onManageVoters={(id) => navigate(`/elections/${id}/voters`)}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No active elections</p>
                  <p className="text-gray-500">
                    There are no active elections at the moment. Create a new election or modify existing ones.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {/* Similar code structure for upcoming elections */}
          {filteredElections.filter(e => e.status === 'upcoming').length > 0 ? (
            <div className="grid gap-4">
              {filteredElections
                .filter(e => e.status === 'upcoming')
                .map((election) => (
                  <ElectionCard 
                    key={election.id} 
                    election={election} 
                    onDelete={(id) => {
                      setSelectedElectionId(id);
                      setIsDeleteDialogOpen(true);
                    }}
                    onView={(id) => navigate(`/elections/${id}`)}
                    onResults={(id) => navigate(`/results/${id}`)}
                    onEdit={(id) => navigate(`/elections/${id}/edit`)}
                    onManageCandidates={(id) => navigate(`/elections/${id}/candidates`)}
                    onManageVoters={(id) => navigate(`/elections/${id}/voters`)}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No upcoming elections</p>
                  <p className="text-gray-500">
                    There are no upcoming elections scheduled. Create a new election with a future start date.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {/* Similar code structure for completed elections */}
          {filteredElections.filter(e => e.status === 'completed').length > 0 ? (
            <div className="grid gap-4">
              {filteredElections
                .filter(e => e.status === 'completed')
                .map((election) => (
                  <ElectionCard 
                    key={election.id} 
                    election={election} 
                    onDelete={(id) => {
                      setSelectedElectionId(id);
                      setIsDeleteDialogOpen(true);
                    }}
                    onView={(id) => navigate(`/elections/${id}`)}
                    onResults={(id) => navigate(`/results/${id}`)}
                    onEdit={(id) => navigate(`/elections/${id}/edit`)}
                    onManageCandidates={(id) => navigate(`/elections/${id}/candidates`)}
                    onManageVoters={(id) => navigate(`/elections/${id}/voters`)}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No completed elections</p>
                  <p className="text-gray-500">
                    There are no completed elections yet. Elections will appear here after their end date has passed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Election Dialog */}
      <Dialog open={isCreatingElection} onOpenChange={setIsCreatingElection}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
            <DialogDescription>
              Create a new election with title, description, and time frame.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Student Council Election 2024"
                value={newElectionTitle}
                onChange={(e) => setNewElectionTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this election..."
                value={newElectionDescription}
                onChange={(e) => setNewElectionDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newElectionStartDate}
                  onChange={(e) => setNewElectionStartDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newElectionEndDate}
                  onChange={(e) => setNewElectionEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="voter-count">Expected Voter Count</Label>
              <Input
                id="voter-count"
                type="number"
                placeholder="100"
                value={newElectionVoterCount}
                onChange={(e) => setNewElectionVoterCount(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingElection(false)}>Cancel</Button>
            <Button onClick={handleCreateElection}>Create Election</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Election Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this election? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteElection}>Delete Election</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Election Card Component
interface ElectionCardProps {
  election: any;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onResults: (id: string) => void;
  onEdit: (id: string) => void;
  onManageCandidates: (id: string) => void;
  onManageVoters: (id: string) => void;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ 
  election, 
  onDelete,
  onView,
  onResults,
  onEdit,
  onManageCandidates,
  onManageVoters
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const participationRate = Math.round((election.totalVotes / election.voterCount) * 100);
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {getStatusBadge(election.status)}
              <span className="text-sm text-gray-500">
                ID: {election.id.substring(0, 8)}
              </span>
            </div>
            <CardTitle>{election.title}</CardTitle>
            <CardDescription className="mt-1">{election.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(election.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(election.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Election
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageCandidates(election.id)}>
                Manage Candidates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageVoters(election.id)}>
                Manage Voters
              </DropdownMenuItem>
              {election.status !== 'upcoming' && (
                <DropdownMenuItem onClick={() => onResults(election.id)}>
                  <BarChart className="h-4 w-4 mr-2" />
                  View Results
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(election.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Election
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Period</div>
              <div className="text-sm">
                {format(new Date(election.startDate), "MMM d, yyyy")} - {format(new Date(election.endDate), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Voters</div>
              <div className="text-sm">{election.totalVotes} / {election.voterCount}</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Participation</span>
            <span>{participationRate}%</span>
          </div>
          <Progress value={participationRate} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" onClick={() => onView(election.id)}>
            View Details
          </Button>
          {election.status === 'active' && (
            <Button size="sm" onClick={() => onResults(election.id)}>
              View Results
            </Button>
          )}
          {election.status === 'completed' && (
            <Button variant="secondary" size="sm" onClick={() => onResults(election.id)}>
              Final Results
            </Button>
          )}
          {election.status === 'upcoming' && (
            <Button variant="outline" size="sm" className="text-blue-500" onClick={() => onEdit(election.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ElectionsManagement;
