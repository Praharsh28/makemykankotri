/**
 * Landing Page - MakeMyKankotri
 * Beautiful, premium landing page following 09_UI_UX_DESIGN.md design system
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                MakeMyKankotri
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/templates" 
                className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
              >
                Templates
              </Link>
              <Link 
                href="/features" 
                className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
              >
                How It Works
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/templates"
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">✨</span>
              AI-Powered Design • 100% Free
            </div>

            {/* Heading */}
            <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-neutral-900 mb-6 leading-tight">
              Create Beautiful
              <span className="block text-primary-600">Wedding Invitations</span>
              <span className="block">in Minutes</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-neutral-600 mb-10 max-w-2xl mx-auto">
              No design skills needed. Choose a template, fill your details, and share instantly with your guests.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/templates"
                className="w-full sm:w-auto bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
              >
                Browse Templates →
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                100% Free Forever
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                Instant Sharing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl sm:text-5xl text-neutral-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Professional features that make creating beautiful invitations effortless
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Easy to Use
              </h3>
              <p className="text-neutral-600">
                Fill a simple form with your wedding details. No design experience required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl border border-secondary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Beautiful Templates
              </h3>
              <p className="text-neutral-600">
                50+ professionally designed templates for every wedding style.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Instant Sharing
              </h3>
              <p className="text-neutral-600">
                Get a unique URL to share with guests via WhatsApp, email, or social media.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl border border-secondary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Mobile Friendly
              </h3>
              <p className="text-neutral-600">
                Perfect display on all devices - phones, tablets, and desktops.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Stunning Animations
              </h3>
              <p className="text-neutral-600">
                Beautiful entrance animations and effects that wow your guests.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl border border-secondary-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral-900">
                Export Options
              </h3>
              <p className="text-neutral-600">
                Download your invitation as PDF or high-quality images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl sm:text-5xl text-neutral-900 mb-4">
              Create in 3 Simple Steps
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              From template to invitation in less than 5 minutes
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="font-heading font-semibold text-2xl mb-4 text-neutral-900">
                Choose Template
              </h3>
              <p className="text-neutral-600 text-lg">
                Browse our beautiful collection and pick your favorite design
              </p>
            </div>

            {/* Arrow (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-1/3 w-1/3 border-t-2 border-dashed border-primary-300"></div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="font-heading font-semibold text-2xl mb-4 text-neutral-900">
                Fill Details
              </h3>
              <p className="text-neutral-600 text-lg">
                Add your names, date, venue, and other wedding information
              </p>
            </div>

            {/* Arrow (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 right-0 w-1/3 border-t-2 border-dashed border-primary-300"></div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="font-heading font-semibold text-2xl mb-4 text-neutral-900">
                Share & Celebrate
              </h3>
              <p className="text-neutral-600 text-lg">
                Get your unique link and share with family and friends
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/templates"
              className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
            >
              Start Creating Now →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-6">
            Ready to Create Your Perfect Invitation?
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Join thousands of couples who chose MakeMyKankotri for their special day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/templates"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition-all shadow-lg"
            >
              Browse Templates
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">💍</span>
                <span className="font-heading font-bold text-xl">MakeMyKankotri</span>
              </div>
              <p className="text-neutral-400 max-w-md">
                Create beautiful, animated wedding invitations with AI. Design, customize, and share your perfect invitation in minutes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/templates" className="text-neutral-400 hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-neutral-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="text-neutral-400 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
            <p>© 2025 MakeMyKankotri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
