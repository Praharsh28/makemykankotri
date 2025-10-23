/**
 * Create Invitation Page
 * User fills form to create their wedding invitation
 * Route: /create/[templateId]
 * CRITICAL PAGE - Core user flow
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { templateStorage } from '@/core/template-system';
import { FormGenerator } from '@/plugins/form-builder';
import { TemplateRenderer } from '@/plugins/template-renderer';
import type { Template } from '@/core/types';

export default function CreateInvitationPage({ 
  params 
}: { 
  params: { templateId: string } 
}) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.templateId]);

  async function loadTemplate() {
    try {
      setLoading(true);
      const loaded = await templateStorage.load(params.templateId);
      setTemplate(loaded);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(data: Record<string, unknown>) {
    try {
      setGenerating(true);
      setFormData(data);

      // Save invitation to database
      const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In real app, save to Supabase here
      // await supabase.from('invitations').insert({ ... })

      // For now, redirect with data in URL (temporary)
      const dataParam = encodeURIComponent(JSON.stringify(data));
      router.push(`/invitation/${invitationId}?template=${params.templateId}&data=${dataParam}`);
    } catch (err) {
      setError((err as Error).message);
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center max-w-md p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="font-heading text-2xl font-semibold text-neutral-900 mb-2">
            Template Not Found
          </h2>
          <p className="text-neutral-600 mb-6">
            {error || 'The template you\'re looking for doesn\'t exist.'}
          </p>
          <Link
            href="/templates"
            className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md"
          >
            ← Browse Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                MakeMyKankotri
              </span>
            </Link>

            <Link
              href="/templates"
              className="text-neutral-600 hover:text-neutral-900 font-medium"
            >
              ← Back to Templates
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-2">
            Create Your Invitation
          </h1>
          <p className="text-lg text-neutral-600">
            Fill in your wedding details below
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                Wedding Details
              </h2>
              <p className="text-sm text-neutral-600">
                Tell us about your special day
              </p>
            </div>

            <FormGenerator
              template={template}
              onSubmit={handleGenerate}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-1">
                  Live Preview
                </h2>
                <p className="text-sm text-neutral-600">
                  See how your invitation looks
                </p>
              </div>

              {/* Preview Container */}
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 bg-neutral-50">
                {Object.keys(formData).length > 0 ? (
                  <div className="transform scale-75 origin-top">
                    <TemplateRenderer
                      template={template}
                      data={formData}
                      mode="preview"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-neutral-300 text-5xl mb-3">📝</div>
                    <p className="text-neutral-500 text-sm">
                      Fill the form to see live preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Need help? Contact us at <a href="mailto:support@makemykankotri.com" className="text-primary-600 hover:underline">support@makemykankotri.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}
