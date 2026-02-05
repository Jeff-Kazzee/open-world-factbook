/**
 * Open World Factbook - API Documentation Page
 */

import Link from 'next/link';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data API - Open World Factbook',
  description: 'Access Open World Factbook data programmatically through our JSON data files.',
};

export default function APIPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="py-8 px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container mx-auto max-w-3xl">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-serif text-[var(--text-primary)]">
            Data Access
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Access country data programmatically
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 px-6">
        <div className="container mx-auto max-w-3xl">

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">JSON Data Files</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              All country data is available as JSON files in our GitHub repository. Each country has its own
              JSON file containing comprehensive information about geography, demographics, government, economy, and more.
            </p>
            <a
              href="https://github.com/Jeff-Kazzee/open-world-factbook/tree/master/data"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
            >
              Browse Data Files →
            </a>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Data Structure</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Each country JSON file contains the following sections:
            </p>
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-subtle)]">
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Introduction</strong> - Background and history</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Geography</strong> - Location, area, climate, terrain, resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">People and Society</strong> - Population, languages, religions, demographics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Government</strong> - Government type, capital, leaders, legal system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Economy</strong> - GDP, industries, trade, employment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Communications</strong> - Internet, phones, broadcast media</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Transportation</strong> - Airports, railways, roadways, ports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--accent-gold)]">•</span>
                  <span><strong className="text-[var(--text-primary)]">Military</strong> - Armed forces, expenditure, service age</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Example Usage</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Fetch country data directly from the raw GitHub content:
            </p>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 font-mono text-sm overflow-x-auto border border-[var(--border-subtle)]">
              <pre className="text-[var(--text-secondary)]">
{`// Fetch United States data
const response = await fetch(
  'https://raw.githubusercontent.com/Jeff-Kazzee/open-world-factbook/master/data/north-america/us.json'
);
const data = await response.json();

console.log(data.Government.Capital.name.text);
// Output: "Washington, D.C."`}
              </pre>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">Region Folders</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Data is organized by region:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'africa',
                'antarctica',
                'australia-oceania',
                'central-america-n-caribbean',
                'central-asia',
                'east-n-southeast-asia',
                'europe',
                'middle-east',
                'north-america',
                'oceans',
                'south-america',
                'south-asia',
              ].map(region => (
                <code key={region} className="bg-[var(--bg-secondary)] px-3 py-2 rounded text-sm text-[var(--text-muted)]">
                  /data/{region}/
                </code>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-4">License</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              All data is in the <strong className="text-[var(--text-primary)]">public domain</strong> and free to use
              for any purpose - commercial or non-commercial, with or without attribution.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
