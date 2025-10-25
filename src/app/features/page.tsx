/**
 * Features Page
 * Showcase all platform features
 * Route: /features
 */

import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl sm:text-6xl text-neutral-900 mb-6">
            Powerful Features for
            <span className="block text-primary-600">Perfect Invitations</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Everything you need to create, customize, and share beautiful wedding invitations
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl">
                  🎨
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Beautiful Templates
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Choose from 50+ professionally designed templates. Each template is crafted with attention to detail, featuring elegant typography, traditional motifs, and modern aesthetics perfect for Indian weddings.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center text-3xl">
                  🤖
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  AI-Powered Design
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Generate custom templates with AI. Describe your vision, and our AI creates a unique design in seconds. Perfect for couples wanting something truly personalized without starting from scratch.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl">
                  📝
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Smart Forms
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Simple, intelligent forms that only ask for what&apos;s needed. No design skills required—just fill in your details and watch your invitation come to life with real-time preview.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center text-3xl">
                  ✨
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Stunning Animations
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Bring your invitation to life with smooth entrance animations, particle effects, and physics-based interactions. 60fps performance guaranteed on all devices for that wow factor.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl">
                  📱
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Mobile Perfection
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Flawless on every device. Your invitations look stunning whether viewed on a phone, tablet, or desktop. Responsive design ensures perfect display for all your guests.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center text-3xl">
                  🔗
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Instant Sharing
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Get a unique URL to share instantly. Share via WhatsApp, email, social media, or copy the link. Track views and know who&apos;s seen your invitation (coming soon).
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl">
                  💾
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Export Options
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Download your invitation as high-quality PDF or PNG image. Perfect for printing physical copies or sharing as image files with guests who prefer offline copies.
                </p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center text-3xl">
                  🎭
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-900">
                  Cultural Authenticity
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Templates designed for Indian weddings. Traditional motifs, auspicious symbols, and culturally appropriate designs that honor your heritage while embracing modern aesthetics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-4xl mb-6">
            Ready to Create Your Perfect Invitation?
          </h2>
          <Link
            href="/templates"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition-all shadow-lg"
          >
            Browse Templates →
          </Link>
        </div>
      </section>
    </>
  );
}
