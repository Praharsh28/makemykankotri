/**
 * How It Works Page
 * Step-by-step guide for users
 * Route: /how-it-works
 */

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                MakeMyKankotri
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/templates" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">Templates</Link>
              <Link href="/features" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">Features</Link>
              <Link href="/how-it-works" className="text-primary-600 font-semibold">How It Works</Link>
            </nav>
            <Link href="/templates" className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl sm:text-6xl text-neutral-900 mb-6">
            Create Your Invitation in
            <span className="block text-primary-600">3 Simple Steps</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            From template to invitation in less than 5 minutes. No design skills needed.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 mb-20 items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                1
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-3xl mb-4 text-neutral-900">
                Choose Your Template
              </h2>
              <p className="text-lg text-neutral-600 mb-4">
                Browse our curated collection of 50+ beautiful templates. Filter by style, category, or search for specific themes. Each template is professionally designed with traditional Indian wedding motifs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Traditional, Modern, and Fusion styles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Preview before selecting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Filter by region, religion, or occasion</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0 w-full md:w-80">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center text-6xl shadow-xl">
                🎨
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 mb-20 items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                2
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-3xl mb-4 text-neutral-900">
                Fill Your Details
              </h2>
              <p className="text-lg text-neutral-600 mb-4">
                Enter your wedding information in our smart form. See your invitation update in real-time as you type. Add bride and groom names, date, venue, and any custom messages.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Simple, guided form with validation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Live preview as you type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Auto-save so you never lose progress</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0 w-full md:w-80">
              <div className="aspect-[3/4] bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl flex items-center justify-center text-6xl shadow-xl">
                📝
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                3
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-3xl mb-4 text-neutral-900">
                Share & Celebrate
              </h2>
              <p className="text-lg text-neutral-600 mb-4">
                Get your unique invitation URL instantly. Share it with guests via WhatsApp, email, or social media. Download as PDF or image for printing. Track views and engagement (coming soon).
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">One-click share to WhatsApp, email, social</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Download PDF for printing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-neutral-600">Works on all devices - mobile, tablet, desktop</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0 w-full md:w-80">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center text-6xl shadow-xl">
                🎉
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section (Placeholder) */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-4xl mb-6 text-neutral-900">
            See It In Action
          </h2>
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
            <div>
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-neutral-600">Video tutorial coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-bold text-4xl mb-12 text-center text-neutral-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2 text-neutral-900">Is it really free?</h3>
              <p className="text-neutral-600">Yes! Creating and sharing invitations is 100% free. No credit card required.</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2 text-neutral-900">Can I edit my invitation after creating it?</h3>
              <p className="text-neutral-600">Yes, save it to your dashboard and edit anytime. Changes update instantly.</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2 text-neutral-900">How long does my invitation stay online?</h3>
              <p className="text-neutral-600">Forever! Your invitation link never expires and remains accessible.</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2 text-neutral-900">Can I print my invitation?</h3>
              <p className="text-neutral-600">Absolutely! Download as high-quality PDF and print at any print shop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-4xl mb-6">
            Ready to Create Yours?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands creating beautiful invitations in minutes
          </p>
          <Link
            href="/templates"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition-all shadow-lg"
          >
            Start Creating Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neutral-400">© 2025 MakeMyKankotri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
