'use client';

import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-4">Contact Us</h1>
        <p className="text-neutral-600 mb-8">
          We&apos;d love to hear from you. For support, feedback, or partnership inquiries, reach out anytime.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-neutral-900">Support Email</h2>
            <p className="text-neutral-600">support@makemykankotri.com</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Feedback</h2>
            <p className="text-neutral-600">Have ideas? <Link className="text-primary-600 hover:underline" href="/features">Tell us what to build next</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
