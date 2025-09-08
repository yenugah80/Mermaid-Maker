
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    // Simple validation - OpenAI keys typically start with "sk-"
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key Format",
        description: "OpenAI API keys typically start with 'sk-'. Please check your key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setIsSaved(true);
    setIsVisible(false);
    toast({
      title: "API Key Saved Successfully!",
      description: "You can now generate diagrams with AI",
    });
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSaved(false);
    toast({
      title: "API Key Removed",
      description: "API key has been removed from local storage",
    });
  };

  return (
    <div className="p-4 rounded-md border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted" />
          <span className="text-sm font-medium text-primary">OpenAI API Key</span>
        </div>
        {isSaved && (
          <div className="flex items-center text-xs text-text-accent font-medium">
            <Check className="h-3 w-3 mr-1" />
            Configured
          </div>
        )}
      </div>

      {!isSaved && !isVisible && (
        <div className="space-y-3">
          <div className="p-3 rounded border border-border-secondary bg-surface-primary text-xs text-secondary">
            <p className="font-medium mb-1">How to get your OpenAI API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted">
              <li>Go to <strong>platform.openai.com</strong></li>
              <li>Sign up or log in to your account</li>
              <li>Navigate to <strong>API Keys</strong> section</li>
              <li>Create a new secret key</li>
              <li>Copy and paste it below</li>
            </ol>
          </div>
          <Button size="sm" onClick={() => setIsVisible(true)} className="w-full">
            Add API Key
          </Button>
        </div>
      )}

      {isVisible && (
        <div className="space-y-3">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveKey} className="flex-1">
              Save Key
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isSaved && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsVisible(true)} className="flex-1">
            Update Key
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-destructive hover:text-destructive" 
            onClick={handleRemoveKey}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;
