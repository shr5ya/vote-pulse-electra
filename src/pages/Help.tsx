
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started with Electra</CardTitle>
            <CardDescription>
              Learn the basics of using the Electra voting platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Welcome to Electra, the secure and transparent voting platform. 
              This help page will guide you through the main features and answer common questions.
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I vote in an election?</AccordionTrigger>
                <AccordionContent>
                  To vote in an election, navigate to the Dashboard page and find the active election you're eligible to vote in.
                  Click "Vote Now" to access the voting page. Select your preferred candidate and submit your vote.
                  Your vote is secure and anonymous.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I see election results?</AccordionTrigger>
                <AccordionContent>
                  Results for completed elections are available on the Results page. You can view detailed breakdowns
                  of votes, including charts and statistics. Results are published after the election end date.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What should I do if I encounter technical issues?</AccordionTrigger>
                <AccordionContent>
                  If you experience any technical difficulties, please contact our support team at support@electra.com.
                  Include details about the issue you're facing, including any error messages and the steps to reproduce the problem.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How secure is my vote?</AccordionTrigger>
                <AccordionContent>
                  Electra uses state-of-the-art encryption and security practices to ensure the integrity of every election.
                  Your vote is anonymous and cannot be traced back to you. Our system is regularly audited by independent security experts.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I change my vote after submitting it?</AccordionTrigger>
                <AccordionContent>
                  No, once a vote is submitted, it cannot be changed. Please review your selection carefully before submitting your vote.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our support team is available Monday through Friday, 9am-5pm EST.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">support@electra.com</p>
              </div>
              
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-400">Available on our website during business hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;
