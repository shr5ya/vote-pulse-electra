
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Vote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection, castVote, voters } = useElection();
  const { user } = useAuth();
  
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoteComplete, setIsVoteComplete] = useState(false);
  
  const election = getElection(id || '');
  
  if (!election) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Election Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The election you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Check if election is active
  if (election.status !== 'active') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Voting Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {election.status === 'upcoming' 
              ? 'This election has not started yet.'
              : 'This election has ended.'}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Check if user has already voted
  const currentVoter = user ? voters.find(v => v.id === user.id) : null;
  const hasVoted = currentVoter?.hasVoted && currentVoter?.electionId === election.id;
  
  if (hasVoted && !isVoteComplete) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Already Voted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have already cast your vote in this election.
          </p>
          <Button onClick={() => navigate(`/results/${election.id}`)}>
            View Results
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleVote = () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate to vote for.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to vote.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit vote with a slight delay to show loading state
    setTimeout(() => {
      const success = castVote(election.id, selectedCandidate, user.id);
      
      if (success) {
        setIsVoteComplete(true);
        toast.success('Your vote has been cast successfully!');
      } else {
        toast.error('There was an error casting your vote. Please try again.');
      }
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  if (isVoteComplete) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-fade-in">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Vote Submitted Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
            Thank you for participating in this election. Your vote has been securely recorded.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate(`/results/${election.id}`)}>
              View Results
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="glass-card mb-6">
        <CardHeader>
          <Badge className="w-fit mb-2">Vote Now</Badge>
          <CardTitle className="text-2xl">{election.title}</CardTitle>
          <CardDescription>{election.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select one candidate to cast your vote. This action cannot be undone.
          </p>
          
          <RadioGroup 
            value={selectedCandidate || ''} 
            onValueChange={setSelectedCandidate}
            className="space-y-4"
          >
            {election.candidates.map((candidate) => (
              <Label
                key={candidate.id}
                htmlFor={candidate.id}
                className={`flex items-center space-x-4 rounded-md border p-4 cursor-pointer ${
                  selectedCandidate === candidate.id 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <RadioGroupItem value={candidate.id} id={candidate.id} />
                <Avatar>
                  <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                  <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-base font-medium">{candidate.name}</div>
                  <div className="text-sm text-gray-500">{candidate.position}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleVote} disabled={!selectedCandidate || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Cast Your Vote'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                Your vote is anonymous and secure. Once cast, it cannot be changed or retracted. 
                Please confirm your selection before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vote;
