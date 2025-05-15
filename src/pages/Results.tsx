
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Layout from '@/components/Layout';
import { useElection } from '@/contexts/ElectionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection } = useElection();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  
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
  
  // Format data for charts
  const chartData = election.candidates.map(candidate => ({
    name: candidate.name,
    value: candidate.votes,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));
  
  // Sort candidates by votes (descending)
  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
  
  // Calculate if we have a winner or tie
  const hasWinner = sortedCandidates.length > 0 && 
    sortedCandidates[0].votes > 0 && 
    (sortedCandidates.length === 1 || sortedCandidates[0].votes > sortedCandidates[1].votes);
  
  return (
    <Layout>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">{election.title} Results</h1>
          <p className="text-gray-600 dark:text-gray-300">{election.description}</p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Election Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-medium capitalize">{election.status}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Votes</div>
                <div className="font-medium">{election.totalVotes}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Eligible Voters</div>
                <div className="font-medium">{election.voterCount}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Participation Rate</div>
                <div className="font-medium">
                  {Math.round((election.totalVotes / election.voterCount) * 100)}%
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</div>
                <div className="font-medium">{election.endDate.toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Results Visualization</CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <Button 
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                >
                  Pie
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  Bar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {election.totalVotes > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No votes have been cast yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">Detailed Results</h2>
      
      {election.candidates.length > 0 ? (
        <div className="space-y-4 mb-8">
          {sortedCandidates.map((candidate, index) => (
            <Card key={candidate.id} className={`glass-card ${index === 0 && hasWinner ? 'border-2 border-yellow-500 dark:border-yellow-400' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800">
                      <AvatarImage src={candidate.imageUrl} />
                      <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                    </Avatar>
                    {index === 0 && hasWinner && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      {index === 0 && hasWinner && (
                        <span className="text-yellow-500 text-sm font-medium">Winner</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{candidate.position}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{candidate.votes} votes</span>
                          {index === 0 && hasWinner && (
                            <ChevronUp className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <span className="text-sm">
                          {election.totalVotes > 0 
                            ? `${Math.round((candidate.votes / election.totalVotes) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <Progress 
                        value={election.totalVotes > 0 ? (candidate.votes / election.totalVotes) * 100 : 0} 
                        className={index === 0 && hasWinner ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No candidates have been added to this election.
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Results;
