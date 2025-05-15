
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Printer, Share2, ChevronDown, 
  ChevronUp, Trophy, BarChart2, PieChart as PieChartIcon, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection } = useElection();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const election = getElection(id || '');

  useEffect(() => {
    // Set shareable URL
    if (election) {
      setShareUrl(`${window.location.origin}/results/${id}`);
    }
  }, [election, id]);
  
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

  const handleExport = (format: string) => {
    setIsExporting(true);
    
    // Mock export functionality
    setTimeout(() => {
      toast.success(`Results exported as ${format} successfully!`);
      setIsExporting(false);
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success('Link copied to clipboard!');
        setShowShareDialog(false);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handlePrint = () => {
    window.print();
  };
  
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
            <DropdownMenuTrigger asChild disabled={isExporting}>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('PDF')}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('CSV')}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('Image')}>
                <Download className="mr-2 h-4 w-4" />
                Export as Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          
          <Button variant="outline" onClick={() => setShowShareDialog(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Election Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-medium capitalize flex items-center gap-2">
                  {election.status === 'completed' && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {election.status === 'active' && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  {election.status === 'upcoming' && (
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                  )}
                  {election.status}
                </div>
              </div>
              <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Votes</div>
                <div className="font-medium text-lg">{election.totalVotes}</div>
              </div>
              <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Eligible Voters</div>
                <div className="font-medium text-lg">{election.voterCount}</div>
              </div>
              <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Participation Rate</div>
                <div className="font-medium text-lg flex items-center gap-2">
                  {Math.round((election.totalVotes / election.voterCount) * 100)}%
                  {election.totalVotes / election.voterCount > 0.5 ? (
                    <ChevronUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg">
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
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {election.totalVotes > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
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
                  ) : (
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                      <Bar dataKey="value" nameKey="name">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
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
      
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
        Detailed Results
      </h2>
      
      {election.candidates.length > 0 ? (
        <div className="space-y-4 mb-8">
          {sortedCandidates.map((candidate, index) => (
            <Card 
              key={candidate.id} 
              className={`glass-card transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg ${
                index === 0 && hasWinner ? 'border-2 border-yellow-500 dark:border-yellow-400' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800">
                      <AvatarImage src={candidate.imageUrl} />
                      <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                    </Avatar>
                    {index === 0 && hasWinner && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1 shadow-lg animate-pulse-soft">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      {index === 0 && hasWinner && (
                        <span className="text-yellow-500 text-sm font-medium animate-pulse-soft">Winner</span>
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
                        className={`h-2 ${index === 0 && hasWinner ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}
                        indicatorClassName={index === 0 && hasWinner ? 'bg-yellow-500' : undefined}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 border-t pt-3 border-gray-200 dark:border-gray-700">
                  {candidate.bio}
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

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Share Election Results</DialogTitle>
            <DialogDescription>
              Copy the link below to share these results.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-white/50 backdrop-blur px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={shareUrl}
              readOnly
            />
            <Button onClick={handleShare}>Copy</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Results;
