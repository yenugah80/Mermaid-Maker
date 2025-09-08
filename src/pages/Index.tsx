
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import AIPrompt from '@/components/AIPrompt';
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveAs } from 'file-saver';
import { Sparkles, Zap, Code2 } from "lucide-react";

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative Action]
    C --> E[Result]
    D --> E`;

const Index = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [prompt, setPrompt] = useState<string>("");
  const [debouncedCode, setDebouncedCode] = useState<string>(DEFAULT_DIAGRAM);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme & restore saved state on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const savedCode = localStorage.getItem('diagramCode');
    if (savedCode) {
      setCode(savedCode);
      setDebouncedCode(savedCode);
    }
    const savedPrompt = localStorage.getItem('diagramPrompt');
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  // Persist code & prompt state
  useEffect(() => {
    localStorage.setItem('diagramCode', code);
  }, [code]);
  useEffect(() => {
    localStorage.setItem('diagramPrompt', prompt);
  }, [prompt]);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Debounce code updates for heavy preview rendering
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setDebouncedCode(code);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [code]);

  const handleExport = () => {
    try {
      // Try multiple selectors to find the SVG
      let svgElement = document.querySelector('.diagram-container svg') || 
                      document.querySelector('svg') ||
                      document.querySelector('[data-testid="mermaid-svg"]');
      
      if (!svgElement) {
        toast({
          title: "Export failed",
          description: "No diagram to export. Please generate a diagram first.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Get SVG content
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      
      // Generate filename from first line of diagram or use default
      let filename = 'mermaid-diagram.svg';
      const firstLine = code.split('\n')[0];
      if (firstLine) {
        const cleanName = firstLine
          .replace(/[^\w\s]/gi, '')
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase();
        if (cleanName && cleanName.length > 2) {
          filename = `${cleanName}.svg`;
        }
      }
      
      saveAs(svgBlob, filename);
      
      toast({
        title: "Export successful",
        description: `Saved as ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export diagram. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDiagramGenerated = (generatedCode: string) => {
    setCode(generatedCode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onExport={handleExport} 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      {/* Hero Section */}
      <section className="py-2 border-b bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-3">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-foreground mb-1">
              Create Beautiful Diagrams with AI
            </h2>
            <p className="text-xs text-muted-foreground mb-2">
              Transform ideas into visual diagrams using natural language.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-secondary/20 text-secondary-foreground">
                <Zap className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent-foreground">
                <Code2 className="w-3 h-3 mr-1" />
                Mermaid
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editor Section */}
      <main className="py-2">
        <div className="max-w-7xl mx-auto px-3">
          <div className="grid gap-2 grid-cols-1 xl:grid-cols-[280px_1fr_280px] 2xl:grid-cols-[300px_1fr_300px]">
            {/* Left Panel - Editor & AI */}
            <div className="space-y-2">
              {/* AI Prompt Card */}
              <Card className="rounded-lg border shadow-sm bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">AI Assistant</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Describe your diagram in natural language
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Prompt Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Describe your diagram:</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Create a flowchart for user login process..."
                      id="ai-prompt"
                      aria-label="Describe your diagram for AI generation"
                      className="w-full h-16 p-2 rounded-lg border border-primary/30 bg-background text-foreground text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  {/* AI Generate Button */}
                  <AIPrompt 
                    prompt={prompt} 
                    onDiagramGenerated={handleDiagramGenerated} 
                  />
                </CardContent>
              </Card>

              {/* Code Editor Card */}
              <Card className="rounded-lg border shadow-sm bg-gradient-to-br from-secondary/10 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Mermaid Editor</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Edit the diagram syntax directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-lg border border-secondary/30 bg-background p-2 min-h-[200px]">
                    <Editor 
                      value={code} 
                      onChange={setCode} 
                      className="w-full h-full bg-transparent border-0 p-0"
                      promptValue={prompt}
                      onPromptChange={setPrompt}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Center Panel - Preview */}
            <div className="lg:col-span-1">
              <Card className="rounded-lg border shadow-sm h-full bg-gradient-to-br from-accent/10 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-foreground">Live Preview</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Your diagram renders in real-time
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground border-accent/30">
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-lg border border-accent/20 bg-background p-2 min-h-[300px]">
                    <Preview code={debouncedCode} className="w-full h-full" theme={isDarkMode ? 'dark' : 'default'} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Tools & Info */}
            <div className="space-y-2">
              {/* Quick Actions */}
              <Card className="rounded-lg border shadow-sm bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="grid gap-1">
                    <button 
                      onClick={handleExport} 
                      disabled={!code.trim()}
                      className="w-full inline-flex items-center justify-start rounded-lg bg-primary px-2 py-1.5 text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Export diagram as SVG"
                    >
                      Export as SVG
                    </button>
                    <button 
                      onClick={() => {
                        setCode(DEFAULT_DIAGRAM);
                        toast({ title: "Reset", description: "Diagram reset to default" });
                      }} 
                      className="w-full inline-flex items-center justify-start rounded-lg border border-secondary/30 bg-secondary/20 px-2 py-1.5 text-xs font-medium hover:bg-secondary/30 transition-colors"
                      aria-label="Reset to default diagram"
                    >
                      Reset to Default
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(code);
                          toast({ title: "Copied", description: "Mermaid code copied to clipboard" });
                        } catch (err) {
                          toast({ title: "Copy failed", description: "Could not access clipboard", variant: "destructive" });
                        }
                      }} 
                      disabled={!code.trim()}
                      className="w-full inline-flex items-center justify-start rounded-lg border border-accent/30 bg-accent/20 px-2 py-1.5 text-xs font-medium hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Copy Mermaid code"
                    >
                      Copy Code
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Diagram Types */}
              <Card className="rounded-lg border shadow-sm bg-gradient-to-br from-secondary/10 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Diagram Types</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Popular diagram formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      className="p-1.5 rounded-lg border border-primary/30 bg-primary/20 text-left hover:bg-primary/30 transition-colors text-foreground"
                      onClick={() => setCode(`flowchart TD\n  A[Start] --> B{Condition?}\n  B -- Yes --> C[Do thing]\n  B -- No --> D[Do other]\n  C --> E[End]\n  D --> E`)}
                      aria-label="Insert Flowchart template"
                    >
                      Flowchart
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-secondary/30 bg-secondary/20 text-left hover:bg-secondary/30 transition-colors text-foreground"
                      onClick={() => setCode(`sequenceDiagram\n  participant U as User\n  participant A as App\n  participant S as Server\n  U->>A: Click button\n  A->>S: Request data\n  S-->>A: Respond\n  A-->>U: Show result`)}
                      aria-label="Insert Sequence template"
                    >
                      Sequence
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-accent/30 bg-accent/20 text-left hover:bg-accent/30 transition-colors text-foreground"
                      onClick={() => setCode(`gantt\n  title Project Plan\n  dateFormat  YYYY-MM-DD\n  section Design\n  Spec     :a1, 2024-01-01, 7d\n  UI       :after a1, 10d\n  section Build\n  Backend  :2024-01-15, 14d\n  Frontend :2024-01-18, 14d`)}
                      aria-label="Insert Gantt template"
                    >
                      Gantt
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-primary/30 bg-primary/20 text-left hover:bg-primary/30 transition-colors text-foreground"
                      onClick={() => setCode(`classDiagram\n  class User {\n    +id: string\n    +name: string\n    +login(): void\n  }\n  class Session {\n    +token: string\n    +expiresAt: Date\n  }\n  User --> Session`)}
                      aria-label="Insert Class template"
                    >
                      Class
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-secondary/30 bg-secondary/20 text-left hover:bg-secondary/30 transition-colors text-foreground"
                      onClick={() => setCode(`stateDiagram-v2\n  [*] --> Idle\n  Idle --> Loading: Start\n  Loading --> Success: OK\n  Loading --> Error: Fail\n  Success --> [*]\n  Error --> Idle: Retry`)}
                      aria-label="Insert State template"
                    >
                      State
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-accent/30 bg-accent/20 text-left hover:bg-accent/30 transition-colors text-foreground"
                      onClick={() => setCode(`erDiagram\n  USER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains\n  USER {\n    string id\n    string name\n  }\n  ORDER {\n    string id\n    date createdAt\n  }`)}
                      aria-label="Insert ER template"
                    >
                      ER
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-2 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Built with precision and care. Powered by Mermaid.js and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
