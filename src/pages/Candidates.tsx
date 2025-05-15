
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useElection } from '@/contexts/ElectionContext';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CandidatesPage: React.FC = () => {
  const { elections, addCandidate } = useElection();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  
  // Form state
  const [selectedElection, setSelectedElection] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [candidateBio, setCandidateBio] = useState('');
  const [candidateImage, setCandidateImage] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D');

  // Get all candidates from all elections
  const allCandidates = elections.flatMap(election => 
    election.candidates.map(candidate => ({
      ...candidate,
      electionTitle: election.title,
      electionId: election.id,
      electionStatus: election.status
    }))
  );

  const filteredCandidates = allCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.electionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCandidate = () => {
    if (!selectedElection || !candidateName || !candidatePosition || !candidateBio) {
      toast.error('Please fill in all required fields');
      return;
    }

    addCandidate(selectedElection, {
      name: candidateName,
      position: candidatePosition,
      bio: candidateBio,
      imageUrl: candidateImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    });

    // Reset form
    setSelectedElection('');
    setCandidateName('');
    setCandidatePosition('');
    setCandidateBio('');
    setCandidateImage('');
    setOpen(false);
  };

  // Filter elections to only active and upcoming for adding candidates
  const eligibleElections = elections.filter(election => 
    election.status === 'active' || election.status === 'upcoming'
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Candidates</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Add a candidate to an existing election
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="election">Election</Label>
                <Select 
                  value={selectedElection} 
                  onValueChange={setSelectedElection}
                >
                  <SelectTrigger id="election">
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleElections.length > 0 ? (
                      eligibleElections.map(election => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No eligible elections
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Candidate name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Position (e.g., President, Secretary)"
                  value={candidatePosition}
                  onChange={(e) => setCandidatePosition(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief candidate biography"
                  value={candidateBio}
                  onChange={(e) => setCandidateBio(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={candidateImage}
                  onChange={(e) => setCandidateImage(e.target.value)}
                />
                <div className="text-xs text-gray-500">
                  Leave blank to use default avatar
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCandidate}>Add Candidate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>Manage candidates across all elections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, position or election..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Election</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{candidate.name}</span>
                      </TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>{candidate.electionTitle}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          candidate.electionStatus === 'active'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : candidate.electionStatus === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {candidate.electionStatus}
                        </span>
                      </TableCell>
                      <TableCell>{candidate.votes}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Edit Candidate"
                            disabled={candidate.electionStatus === 'completed'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            title="Remove Candidate"
                            disabled={candidate.electionStatus === 'completed'}
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
                      No candidates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total Candidates: {filteredCandidates.length}
          </div>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default CandidatesPage;
