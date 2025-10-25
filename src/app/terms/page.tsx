'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-6">Terms of Service</h1>
        <div className="prose prose-neutral max-w-none">
          <p>By using MakeMyKankotri, you agree to these terms.</p>
          <h2>Use of Service</h2>
          <p>Create invitations for personal and commercial use according to applicable laws.</p>
          <h2>Content</h2>
          <p>You retain ownership of your content. You are responsible for ensuring you have rights to any assets you upload.</p>
        </div>
      </section>
    </div>
  );
}
