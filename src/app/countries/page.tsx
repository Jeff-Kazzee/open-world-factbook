/**
 * Open World Factbook - All Countries Page
 * Lists all countries alphabetically with search/filter
 */

import Link from 'next/link';
import { getCountryIndex, getAllRegions } from '@/lib/data';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Countries - Open World Factbook',
  description: 'Browse all 261 countries and territories in the Open World Factbook.',
};

export default function CountriesPage() {
  const countries = getCountryIndex();
  const regions = getAllRegions();

  // Group countries by first letter
  const grouped = countries.reduce((acc, country) => {
    const letter = country.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(country);
    return acc;
  }, {} as Record<string, typeof countries>);

  const letters = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="py-8 px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-2">
            All Countries
          </h1>
          <p className="text-[var(--text-secondary)]">
            {countries.length} countries and territories
          </p>
        </div>
      </header>

      {/* Letter Navigation */}
      <nav className="sticky top-0 z-40 bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)] py-3 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-secondary)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] text-sm font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Countries List */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {letters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="mb-12">
              <h2 className="text-3xl font-serif text-[var(--accent-gold)] mb-6 pb-2 border-b border-[var(--border-subtle)]">
                {letter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grouped[letter].map(country => (
                  <Link
                    key={country.code}
                    href={`/country/${country.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] transition-all"
                  >
                    {country.flagCode && (
                      <img
                        src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                        alt={`${country.name} flag`}
                        className="w-8 h-6 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] truncate">
                        {country.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] truncate">
                        {country.region.replace(/-/g, ' ').replace(/n\s/g, '& ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Region Quick Links */}
      <section className="py-12 px-6 bg-[var(--bg-secondary)]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-6">
            Browse by Region
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {regions.filter(r => r.id !== 'world' && r.id !== 'meta').map(region => (
              <Link
                key={region.id}
                href={`/region/${region.id}`}
                className="p-4 rounded-lg bg-[var(--bg-tertiary)] hover:border-[var(--accent-gold)] border border-[var(--border-subtle)] transition-colors"
              >
                <div className="font-medium text-[var(--text-primary)]">{region.displayName}</div>
                <div className="text-sm text-[var(--text-muted)]">{region.countries.length} countries</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
