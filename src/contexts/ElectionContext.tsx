
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

// Interfaces
export interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  votes: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
  totalVotes: number;
  voterCount: number;
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  hasVoted: boolean;
  electionId?: string;
}

interface ElectionContextType {
  elections: Election[];
  voters: Voter[];
  createElection: (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => void;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  addVoter: (voter: Omit<Voter, 'id' | 'hasVoted'>) => void;
  castVote: (electionId: string, candidateId: string, voterId: string) => boolean;
  getElection: (id: string) => Election | undefined;
  activeElections: Election[];
  completedElections: Election[];
  upcomingElections: Election[];
}

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    position: 'President',
    bio: 'Experienced leader with a track record of success.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 25,
  },
  {
    id: '2',
    name: 'John Doe',
    position: 'Vice President',
    bio: 'Passionate about innovation and technology.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 17,
  },
  {
    id: '3',
    name: 'Emily Johnson',
    position: 'Secretary',
    bio: 'Detail-oriented and efficient administrator.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 12,
  },
];

const mockElections: Election[] = [
  {
    id: '1',
    title: 'Student Council Election 2024',
    description: 'Annual election for student council positions.',
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-25'),
    status: 'active',
    candidates: mockCandidates,
    totalVotes: 54,
    voterCount: 100,
  },
  {
    id: '2',
    title: 'Faculty Board Election',
    description: 'Election for faculty board positions.',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-15'),
    status: 'upcoming',
    candidates: [],
    totalVotes: 0,
    voterCount: 50,
  },
  {
    id: '3',
    title: 'Club President Election',
    description: 'Election for the club president position.',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-15'),
    status: 'completed',
    candidates: [
      {
        id: '4',
        name: 'Michael Brown',
        position: 'President',
        bio: 'Dedicated to club growth and member engagement.',
        imageUrl: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        votes: 32,
      },
      {
        id: '5',
        name: 'Sarah Wilson',
        position: 'President',
        bio: 'Focusing on innovation and inclusivity.',
        imageUrl: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHlvdW5nJTIwd29tYW58ZW58MHx8MHx8fDA%3D',
        votes: 28,
      },
    ],
    totalVotes: 60,
    voterCount: 75,
  },
];

const mockVoters: Voter[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', hasVoted: false },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', hasVoted: true, electionId: '1' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', hasVoted: false },
];

// Create the context
const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [voters, setVoters] = useState<Voter[]>(mockVoters);

  // Get elections by status
  const activeElections = elections.filter(election => election.status === 'active');
  const completedElections = elections.filter(election => election.status === 'completed');
  const upcomingElections = elections.filter(election => election.status === 'upcoming');

  // Get a specific election
  const getElection = (id: string) => {
    return elections.find(election => election.id === id);
  };

  // Create a new election
  const createElection = (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => {
    const now = new Date();
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    
    if (election.startDate <= now && election.endDate >= now) {
      status = 'active';
    } else if (election.endDate < now) {
      status = 'completed';
    }
    
    const newElection: Election = {
      ...election,
      id: Math.random().toString(36).substring(2, 9),
      totalVotes: 0,
      status,
    };
    
    setElections([...elections, newElection]);
    toast.success('Election created successfully!');
  };

  // Add a candidate to an election
  const addCandidate = (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    setElections(prevElections => {
      return prevElections.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            candidates: [
              ...election.candidates,
              {
                ...candidate,
                id: Math.random().toString(36).substring(2, 9),
                votes: 0
              }
            ]
          };
        }
        return election;
      });
    });
    toast.success('Candidate added successfully!');
  };

  // Add a voter
  const addVoter = (voter: Omit<Voter, 'id' | 'hasVoted'>) => {
    const newVoter: Voter = {
      ...voter,
      id: Math.random().toString(36).substring(2, 9),
      hasVoted: false
    };
    setVoters([...voters, newVoter]);
    toast.success('Voter added successfully!');
  };

  // Cast a vote
  const castVote = (electionId: string, candidateId: string, voterId: string): boolean => {
    // Check if the voter has already voted
    const voter = voters.find(v => v.id === voterId);
    if (!voter || voter.hasVoted) {
      toast.error('You have already voted in this election.');
      return false;
    }

    // Update the elections state
    setElections(prevElections => {
      return prevElections.map(election => {
        if (election.id === electionId) {
          // Update the candidate's vote count
          const updatedCandidates = election.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              return { ...candidate, votes: candidate.votes + 1 };
            }
            return candidate;
          });
          
          return {
            ...election,
            candidates: updatedCandidates,
            totalVotes: election.totalVotes + 1
          };
        }
        return election;
      });
    });

    // Update the voter's status
    setVoters(prevVoters => {
      return prevVoters.map(v => {
        if (v.id === voterId) {
          return { ...v, hasVoted: true, electionId };
        }
        return v;
      });
    });

    toast.success('Vote cast successfully!');
    return true;
  };

  return (
    <ElectionContext.Provider value={{ 
      elections, 
      voters, 
      createElection, 
      addCandidate, 
      addVoter, 
      castVote, 
      getElection,
      activeElections,
      completedElections,
      upcomingElections
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
