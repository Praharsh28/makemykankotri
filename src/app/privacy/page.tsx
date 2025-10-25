'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-neutral max-w-none">
          <p>We respect your privacy. This page describes how we handle your data.</p>
          <h2>Data We Collect</h2>
          <ul>
            <li>Account information (name, email)</li>
            <li>Templates and invitation content you create</li>
          </ul>
          <h2>How We Use Data</h2>
          <ul>
            <li>Provide core functionality of the app</li>
            <li>Improve product experience</li>
          </ul>
          <h2>Your Rights</h2>
          <p>You can request deletion of your account and data at any time by contacting support.</p>
        </div>
      </section>
    </div>
  );
}
