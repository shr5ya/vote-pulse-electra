
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-fade-in">
                Modern Voting Made Simple
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                Secure, transparent, and accessible elections for organizations of all sizes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link to="/register">
                <Button className="glass-button px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
              Everything you need to run successful elections, from start to finish.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Voting</h3>
              <p className="text-gray-600 dark:text-gray-300">
                End-to-end encryption and blockchain technology ensure the integrity of every vote.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-panel p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customizable Elections</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Configure elections with different voting methods, eligibility rules, and more.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-panel p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Watch results update live with beautiful charts and detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
              Setting up and running elections has never been easier.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set up your election with custom questions, options, and settings.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Invite</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Invite voters via email or generate secure single-use voting links.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get real-time results and insightful analytics when voting ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              Trusted By
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
              Organizations of all sizes rely on Electra for their voting needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">University</span>
            </div>
            <div className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Corporation</span>
            </div>
            <div className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Association</span>
            </div>
            <div className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Government</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="glass-panel p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 font-heading">Ready to get started?</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Join thousands of organizations using Electra for their voting needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="glass-button px-8 py-6 text-lg min-w-[180px]">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="px-8 py-6 text-lg min-w-[180px]">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
