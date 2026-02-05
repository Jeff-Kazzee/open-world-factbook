/**
 * Open World Factbook - About Page
 */

import Link from 'next/link';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Open World Factbook',
  description: 'Learn about the Open World Factbook project - an open-source initiative to preserve and democratize global country data.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="py-8 px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container mx-auto max-w-3xl">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-serif text-[var(--text-primary)]">
            About Open World Factbook
          </h1>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 px-6">
        <div className="container mx-auto max-w-3xl prose prose-invert">

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Our Mission</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              The Open World Factbook is an open-source initiative dedicated to preserving and democratizing
              comprehensive country data for researchers, educators, students, and curious minds worldwide.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We believe that factual information about the world&apos;s nations should be freely accessible
              to everyone, without barriers or restrictions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Data Source</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Our data is sourced from public domain archives, including comprehensive country profiles
              covering geography, demographics, government, economy, infrastructure, and more.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The database includes <strong className="text-[var(--text-primary)]">261 countries and territories</strong> with
              over <strong className="text-[var(--text-primary)]">50,000 data points</strong> across
              <strong className="text-[var(--text-primary)]"> 13 world regions</strong>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Open Source</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              This project is fully open source. You can view, fork, and contribute to the codebase on GitHub.
            </p>
            <a
              href="https://github.com/Jeff-Kazzee/open-world-factbook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-lg hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Technology</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Built with modern web technologies for speed and reliability:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
              <li><strong className="text-[var(--text-primary)]">Next.js 16</strong> - React framework with static generation</li>
              <li><strong className="text-[var(--text-primary)]">TypeScript</strong> - Type-safe development</li>
              <li><strong className="text-[var(--text-primary)]">Tailwind CSS</strong> - Utility-first styling</li>
              <li><strong className="text-[var(--text-primary)]">Vercel</strong> - Edge deployment</li>
              <li><strong className="text-[var(--text-primary)]">OpenStreetMap</strong> - Interactive maps</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">License</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Content is available under the <strong className="text-[var(--text-primary)]">Public Domain</strong>.
              The source code is licensed under the MIT License. Feel free to use, modify, and distribute.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
