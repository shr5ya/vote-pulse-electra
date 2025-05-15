
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useElection } from '@/contexts/ElectionContext';
import { Search, UserPlus, Trash2, Mail, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const VotersPage: React.FC = () => {
  const { voters, addVoter } = useElection();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newVoterName, setNewVoterName] = useState('');
  const [newVoterEmail, setNewVoterEmail] = useState('');

  const filteredVoters = voters.filter(voter => 
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    voter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVoter = () => {
    if (!newVoterName || !newVoterEmail) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!newVoterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    addVoter({
      name: newVoterName,
      email: newVoterEmail
    });

    setNewVoterName('');
    setNewVoterEmail('');
    setOpen(false);
    toast.success('Voter added successfully');
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Voter Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Voter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Voter</DialogTitle>
              <DialogDescription>
                Enter the details of the voter to add to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={newVoterName}
                  onChange={(e) => setNewVoterName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newVoterEmail}
                  onChange={(e) => setNewVoterEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddVoter}>Add Voter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Voters</CardTitle>
          <CardDescription>Manage voter registrations and access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Voting Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoters.length > 0 ? (
                  filteredVoters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell>{voter.name}</TableCell>
                      <TableCell>{voter.email}</TableCell>
                      <TableCell>
                        {voter.hasVoted ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="mr-1 h-3 w-3" /> Voted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            <X className="mr-1 h-3 w-3" /> Not Voted
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No voters found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total Voters: {voters.length}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="outline" size="sm">Import Voters</Button>
          </div>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default VotersPage;
