
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, User, LogOut, Settings, HelpCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  return (
    <nav className="glass-panel py-4 px-6 mb-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary/90 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Electra
          </h1>
        </Link>
        
        {isAuthenticated && (
          <div className="hidden md:flex ml-8 space-x-4">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname.includes('/dashboard') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/elections" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname.includes('/elections') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Elections
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link 
                  to="/candidates" 
                  className={`px-3 py-2 rounded-md transition-colors ${
                    location.pathname.includes('/candidates') 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Candidates
                </Link>
                <Link 
                  to="/voters" 
                  className={`px-3 py-2 rounded-md transition-colors ${
                    location.pathname.includes('/voters') 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Voters
                </Link>
              </>
            )}
            <Link 
              to="/results" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname.includes('/results') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Results
            </Link>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full h-10 w-10 p-0">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-200 dark:border-gray-800">
                <div className="rounded-full h-8 w-8 bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link to="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/help">
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Log In
                </Button>
              </Link>
            )}
            {location.pathname !== '/register' && location.pathname !== '/login' && (
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
