/**
 * AI Generator Page
 * Generate templates with AI
 * Route: /admin/generate
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // TODO: Will be used when AI generation is fully integrated

export default function AIGeneratorPage() {
  // const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      // TODO: Integrate with V0Generator
      // const generator = new V0Generator();
      // const result = await generator.generateTemplate(prompt);
      
      // For now, show coming soon message
      alert('AI Generation coming soon! For now, use the visual editor to create templates manually.');
      
      // Would redirect to editor with generated template
      // router.push(`/admin/editor/${result.templateId}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                AI Generator
              </span>
            </Link>
            <Link href="/admin" className="text-neutral-600 hover:text-neutral-900 font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤖✨</div>
          <h1 className="font-heading font-bold text-5xl text-neutral-900 mb-4">
            Generate with AI
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Describe your dream wedding invitation and let AI create it for you
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 mb-8">
          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block font-semibold text-lg text-neutral-900 mb-3">
              Describe Your Template
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Traditional Gujarati kankotri with peacock motifs, gold and red color scheme, space for bride/groom names, date, venue, and Ganesh blessing at top..."
              className="w-full h-48 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none text-neutral-900 placeholder-neutral-400"
              disabled={generating}
            />
            <p className="text-sm text-neutral-500 mt-2">
              💡 Be specific: mention style, colors, motifs, and required fields
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating... (This may take 30 seconds)
              </span>
            ) : (
              'Generate Template with AI ✨'
            )}
          </button>
        </div>

        {/* Example Prompts */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-4 text-neutral-900">
            Example Prompts
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setPrompt('Modern minimalist wedding invitation with elegant typography, soft pastel colors (blush pink and sage green), space for couple names, date, and venue')}
              className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <p className="text-sm text-neutral-700">
                Modern minimalist with soft pastels...
              </p>
            </button>
            <button
              onClick={() => setPrompt('Traditional South Indian wedding invitation with temple borders, lotus flowers, and golden accents. Include space for bride and groom names, wedding date, venue, and auspicious muhurat time')}
              className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <p className="text-sm text-neutral-700">
                Traditional South Indian with temple borders...
              </p>
            </button>
            <button
              onClick={() => setPrompt('Elegant Punjabi wedding invitation with phulkari embroidery patterns, rich red and gold colors, decorative kalash, and peacock motifs. Space for couple names, venue, and wedding ceremony details')}
              className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <p className="text-sm text-neutral-700">
                Punjabi style with phulkari patterns...
              </p>
            </button>
          </div>
        </div>

        {/* Alternative Option */}
        <div className="text-center mt-8">
          <p className="text-neutral-600 mb-4">
            Prefer to design manually?
          </p>
          <Link
            href="/admin/editor/new"
            className="inline-block border-2 border-primary-500 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all"
          >
            Open Visual Editor
          </Link>
        </div>
      </main>
    </div>
  );
}
