/**
 * Open World Factbook - Homepage
 * SSG: Statically generated at build time
 */

import Link from 'next/link';
import { getCountryIndex, getAllRegions } from '@/lib/data';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

export default function HomePage() {
  const countries = getCountryIndex();
  const regions = getAllRegions();
  
  // Featured countries for quick access
  const featuredCodes = ['us', 'cn', 'jp', 'de', 'gb', 'fr', 'br', 'in'];
  const featured = countries.filter(c => featuredCodes.includes(c.code));
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Open World Factbook
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            The world&apos;s most comprehensive open-source country database.
            <br />
            <span className="text-[var(--accent-gold)]">262 countries & territories</span> — free forever.
          </p>
          
          {/* Search Bar */}
          <SearchBar countries={countries} />
          
          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="stat-card">
              <div className="label">Countries</div>
              <div className="value">{countries.length}</div>
            </div>
            <div className="stat-card">
              <div className="label">Regions</div>
              <div className="value">{regions.length}</div>
            </div>
            <div className="stat-card">
              <div className="label">Data Points</div>
              <div className="value">50K+</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Countries */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-serif mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Featured Countries
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(country => (
              <Link 
                key={country.code}
                href={`/country/${country.slug}`}
                className="country-card"
              >
                <div 
                  className="flag"
                  style={{
                    backgroundImage: `url(https://flagcdn.com/w80/${country.code === 'us' ? 'us' : country.code}.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="info">
                  <h4>{country.name}</h4>
                  <span className="region">{country.region.replace(/-/g, ' ')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Browse by Region */}
      <section className="py-16 px-6 bg-[var(--bg-secondary)]">
        <div className="container mx-auto">
          <h2 className="text-2xl font-serif mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Browse by Region
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regions.filter(r => r.id !== 'world' && r.id !== 'meta').map(region => (
              <Link 
                key={region.id}
                href={`/region/${region.id}`}
                className="card hover:border-[var(--accent-gold)]"
              >
                <h3 className="text-lg font-medium mb-2">{region.displayName}</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {region.countries.length} {region.countries.length === 1 ? 'country' : 'countries'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Countries A-Z */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-serif mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            All Countries A-Z
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {countries.slice(0, 50).map(country => (
              <Link 
                key={country.code}
                href={`/country/${country.slug}`}
                className="px-3 py-2 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-sm transition-colors"
              >
                {country.name}
              </Link>
            ))}
          </div>
          {countries.length > 50 && (
            <div className="mt-6 text-center">
              <Link href="/countries" className="btn-secondary inline-block">
                View all {countries.length} countries →
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
