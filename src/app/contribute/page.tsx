/**
 * Open World Factbook - Contribute Page
 */

import Link from 'next/link';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute - Open World Factbook',
  description: 'Help improve the Open World Factbook by contributing code, data corrections, or translations.',
};

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="py-8 px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container mx-auto max-w-3xl">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-serif text-[var(--text-primary)]">
            Contribute
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Help us improve the Open World Factbook
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 px-6">
        <div className="container mx-auto max-w-3xl">

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Ways to Contribute</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              The Open World Factbook is an open-source project and we welcome contributions of all kinds!
            </p>

            <div className="space-y-6">
              {/* Code Contributions */}
              <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-subtle)]">
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">🛠️ Code Contributions</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Help improve the website by fixing bugs, adding features, or improving performance.
                </p>
                <ul className="list-disc list-inside text-[var(--text-muted)] space-y-1 mb-4">
                  <li>Fix UI/UX issues</li>
                  <li>Improve accessibility</li>
                  <li>Add new features</li>
                  <li>Optimize performance</li>
                </ul>
                <a
                  href="https://github.com/Jeff-Kazzee/open-world-factbook/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-gold)] hover:underline"
                >
                  View open issues →
                </a>
              </div>

              {/* Data Corrections */}
              <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-subtle)]">
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">📊 Data Corrections</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Found incorrect or outdated information? Help us keep the data accurate.
                </p>
                <ul className="list-disc list-inside text-[var(--text-muted)] space-y-1 mb-4">
                  <li>Report data errors</li>
                  <li>Suggest updates</li>
                  <li>Add missing information</li>
                </ul>
                <a
                  href="https://github.com/Jeff-Kazzee/open-world-factbook/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-gold)] hover:underline"
                >
                  Report an issue →
                </a>
              </div>

              {/* Documentation */}
              <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-subtle)]">
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">📝 Documentation</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Improve documentation to help others understand and use the project.
                </p>
                <ul className="list-disc list-inside text-[var(--text-muted)] space-y-1">
                  <li>Improve README</li>
                  <li>Add code comments</li>
                  <li>Write tutorials</li>
                </ul>
              </div>

              {/* Spread the Word */}
              <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-subtle)]">
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">📢 Spread the Word</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Help others discover this resource by sharing it.
                </p>
                <ul className="list-disc list-inside text-[var(--text-muted)] space-y-1">
                  <li>Share on social media</li>
                  <li>Tell your colleagues</li>
                  <li>Star the repository on GitHub</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Getting Started</h2>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-6 font-mono text-sm border border-[var(--border-subtle)]">
              <pre className="text-[var(--text-secondary)] whitespace-pre-wrap">
{`# Clone the repository
git clone https://github.com/Jeff-Kazzee/open-world-factbook.git

# Navigate to the web directory
cd open-world-factbook/web

# Install dependencies
npm install

# Start development server
npm run dev`}
              </pre>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Support the Project</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              If you find this project useful, consider supporting its development:
            </p>
            <a
              href="https://buymeacoffee.com/openworld"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              <span>☕</span>
              <span>Buy us a coffee</span>
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Contact</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Have questions or suggestions? Open an issue on{' '}
              <a
                href="https://github.com/Jeff-Kazzee/open-world-factbook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-gold)] hover:underline"
              >
                GitHub
              </a>
              {' '}and we&apos;ll get back to you.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
