/**
 * AI Prompt Dialog Component
 * Modal for entering prompts to generate templates with v0.dev
 */

import React, { useState } from 'react';
import { V0Generator } from './V0Generator';
import { featureFlags } from '@/core/feature-flags';
import type { Template } from '@/core/types';
import type { V0GenerationResult } from './types';

export interface AIPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (template: Template) => void;
}

export function AIPromptDialog({ isOpen, onClose, onGenerate }: AIPromptDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<V0GenerationResult | null>(null);

  // Check feature flag
  if (!featureFlags.isEnabled('ai-generator')) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const handleGenerate = async () => {
    if (prompt.length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generator = new V0Generator();
      const generationResult = await generator.generateTemplate(prompt);

      setResult(generationResult);

      if (generationResult.success && generationResult.template) {
        setLoading(false);
        // Give user a moment to see success before callback
        setTimeout(() => {
          onGenerate(generationResult.template!);
          handleClose();
        }, 500);
      } else {
        setError(generationResult.error || 'Generation failed');
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setError(null);
    setResult(null);
    setLoading(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const examplePrompts = [
    'Create a traditional Gujarati wedding invitation with peacock motifs',
    'Design a modern minimalist wedding card with gold accents',
    'Make an elegant South Indian wedding invitation with temple borders',
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-neutral-900">
                  Generate Template with AI
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Describe your wedding invitation and let AI create it for you
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-neutral-700 mb-2">
                Describe your template
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Create a traditional Gujarati wedding invitation with peacock motifs, gold borders, and elegant fonts..."
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none font-body"
                rows={5}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${prompt.length < 10 ? 'text-neutral-400' : 'text-primary-500'}`}>
                  {prompt.length} / 10 minimum characters
                </span>
                <span className="text-xs text-neutral-500">
                  Press Cmd/Ctrl + Enter to generate
                </span>
              </div>
            </div>

            {/* Example Prompts */}
            {!loading && !result && (
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">
                  Try these examples:
                </p>
                <div className="space-y-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-600 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {result && result.success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Template Generated!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Generated in {result.timestamp}ms. Opening editor...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
            <p className="text-xs text-neutral-500">
              Powered by v0.dev • AI-generated templates may need refinement
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || prompt.length < 10}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
