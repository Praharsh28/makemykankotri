/**
 * View Invitation Page
 * Display final generated invitation with share/export options
 * Route: /invitation/[id]
 * CRITICAL PAGE - End of user flow
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { templateStorage } from '@/core/template-system';
import { TemplateRenderer } from '@/plugins/template-renderer';
import { ExportPDFButton } from '@/components/export/ExportPDFButton';
import { ExportImageButton } from '@/components/export/ExportImageButton';
import type { Template } from '@/core/types';

export default function ViewInvitationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const searchParams = useSearchParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [invitationData, setInvitationData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadInvitation() {
    try {
      setLoading(true);

      // Get template ID and data from URL params (temporary solution)
      const templateId = searchParams.get('template');
      const dataParam = searchParams.get('data');

      if (!templateId || !dataParam) {
        throw new Error('Missing invitation data');
      }

      // Load template
      const loadedTemplate = await templateStorage.load(templateId);
      setTemplate(loadedTemplate);

      // Parse invitation data
      const data = JSON.parse(decodeURIComponent(dataParam));
      setInvitationData(data);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out my wedding invitation!');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-300 text-lg">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center max-w-md p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="font-heading text-2xl font-semibold text-white mb-2">
            Invitation Not Found
          </h2>
          <p className="text-neutral-400 mb-6">
            {error || 'The invitation you\'re looking for doesn\'t exist.'}
          </p>
          <Link
            href="/templates"
            className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md"
          >
            Create New Invitation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Invitation Display - Full Screen */}
      <div id="invitation-content" className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <TemplateRenderer
            template={template}
            data={invitationData}
            mode="export"
          />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-neutral-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">💍</span>
              <span className="font-heading font-semibold text-sm text-neutral-700">
                MakeMyKankotri
              </span>
            </div>

            {/* Center: Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Share Button */}
              <button
                onClick={copyShareLink}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all shadow-md flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <span>✓</span> Copied!
                  </>
                ) : (
                  <>
                    <span>🔗</span> Copy Link
                  </>
                )}
              </button>

              {/* WhatsApp Share */}
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all shadow-md flex items-center gap-2"
              >
                <span>📱</span> WhatsApp
              </button>

              {/* Export PDF */}
              <ExportPDFButton
                elementId="invitation-content"
                filename={`wedding-invitation-${params.id}.pdf`}
              />

              {/* Export Image */}
              <ExportImageButton
                elementId="invitation-content"
                filename={`wedding-invitation-${params.id}.png`}
                format="png"
              />
            </div>

            {/* Right: Create New */}
            <Link
              href="/templates"
              className="px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-all flex items-center gap-2"
            >
              <span>+</span> Create New
            </Link>
          </div>
        </div>
      </div>

      {/* Help Text (Above Action Bar) */}
      <div className="fixed bottom-20 left-0 right-0 text-center pointer-events-none">
        <div className="inline-block bg-neutral-800/90 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
          💡 Share this link with your guests!
        </div>
      </div>
    </div>
  );
}
