import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Github, Moon, Sun, Menu } from "lucide-react";
import Logo from './Logo';

interface HeaderProps {
  onExport: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onExport,
  toggleTheme,
  isDarkMode
}) => {
  return (
    <header className="header-modern sticky top-0 z-50">
      <div className="container-swiss py-4">
        <div className="flex items-center justify-between">
          {/* Brand section */}
          <div className="flex items-center gap-4">
            <Logo />
            
            {/* Status badges */}
            <div className="hidden md:flex items-center gap-2 ml-6">
              <div className="px-2.5 py-1 rounded-[4px] bg-surface-secondary text-xs font-medium text-secondary border border-border-secondary">
                Beta
              </div>
              <div className="px-2.5 py-1 rounded-[4px] bg-text-accent/10 text-xs font-medium text-accent border border-text-accent/20">
                AI Enhanced
              </div>
            </div>
          </div>
          
          {/* Actions section */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              className="hidden sm:flex"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export SVG</span>
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github size={16} />
                <span className="hidden lg:inline">View Source</span>
              </a>
            </Button>

            {/* Mobile menu */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 w-9 p-0 sm:hidden"
            >
              <Menu size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;