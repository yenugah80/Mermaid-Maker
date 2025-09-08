
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Settings } from "lucide-react";
import { cn } from '@/lib/utils';
import { generateMermaidDiagram } from '@/utils/api';
import { toast } from "@/components/ui/use-toast";
import ApiKeyInput from './ApiKeyInput';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AIPromptProps {
  prompt: string;
  onDiagramGenerated: (diagram: string) => void;
  className?: string;
}

const AIPrompt: React.FC<AIPromptProps> = ({ prompt, onDiagramGenerated, className }) => {
  const [loading, setLoading] = useState(false);
  const [apiKeyPopoverOpen, setApiKeyPopoverOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please describe the diagram you want to create above",
        variant: "destructive",
      });
      return;
    }

    // Check if API key is set
    const hasApiKey = localStorage.getItem('openai_api_key');
    if (!hasApiKey) {
      setApiKeyPopoverOpen(true);
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key first. Click the settings button to add it.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const diagram = await generateMermaidDiagram(prompt);
      onDiagramGenerated(diagram);
      toast({
        title: "Diagram generated!",
        description: "Your AI-generated diagram is ready",
      });
    } catch (error) {
      console.error('Error generating diagram:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasApiKey = localStorage.getItem('openai_api_key');

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3 flex-1">
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()} 
          className="flex-1 sm:flex-none sm:min-w-32"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted hidden sm:block">
          {hasApiKey ? "Using GPT-4o-mini" : "API key required"}
        </div>
      </div>
      
      <Popover open={apiKeyPopoverOpen} onOpenChange={setApiKeyPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-9 h-9 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">OpenAI API Configuration</h4>
              <p className="text-xs text-muted">
                Add your OpenAI API key to enable AI diagram generation. Your key is stored locally and never sent to our servers.
              </p>
            </div>
            <ApiKeyInput />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AIPrompt;
