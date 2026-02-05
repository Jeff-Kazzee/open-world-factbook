/**
 * Open World Factbook - Country Profile Page
 * SSG: Statically generates all 262 country pages at build time
 * Features: Map, flag, organized sections, clean typography
 */

import { getAllCountries, getCountryBySlug, stripHtml } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Country } from '@/lib/types';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate all country routes at build time
export async function generateStaticParams() {
  const countries = getAllCountries();
  return countries.map(country => ({
    slug: country.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  
  if (!country) {
    return { title: 'Country Not Found' };
  }
  
  return {
    title: `${country.name} - Open World Factbook`,
    description: `Comprehensive data about ${country.name}: geography, government, economy, demographics, and more.`,
  };
}

// Clean text helper
function cleanText(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') return stripHtml(obj);
  if (obj?.text) return stripHtml(obj.text);
  return '';
}

// Format field names for display
function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\s+/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Simple data field
function DataItem({ label, value }: { label: string; value: string }) {
  if (!value || value === 'undefined') return null;
  
  return (
    <div className="py-4 border-b border-[var(--border-subtle)] last:border-b-0">
      <dt className="text-sm font-semibold text-[var(--accent-gold)] uppercase tracking-wide mb-2">
        {label}
      </dt>
      <dd className="text-[var(--text-primary)] leading-relaxed text-base">
        {value}
      </dd>
    </div>
  );
}

// Section component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-6 pb-3 border-b-2 border-[var(--accent-gold)]">
        {title}
      </h2>
      <dl className="space-y-0">
        {children}
      </dl>
    </section>
  );
}

// Extract organized data from country
function extractSectionData(country: Country) {
  const geo = country.Geography as any || {};
  const people = country['People and Society'] as any || {};
  const govt = country.Government as any || {};
  const econ = country.Economy as any || {};
  const intro = country.Introduction as any || {};
  const env = country.Environment as any || {};
  const comm = country.Communications as any || {};
  const trans = country.Transportation as any || {};
  
  return {
    overview: {
      background: cleanText(intro?.Background),
    },
    geography: {
      location: cleanText(geo?.Location),
      area: cleanText(geo?.Area?.['total ']) || cleanText(geo?.Area?.total),
      climate: cleanText(geo?.Climate),
      terrain: cleanText(geo?.Terrain),
      naturalResources: cleanText(geo?.['Natural resources']),
      coastline: cleanText(geo?.Coastline),
      borders: cleanText(geo?.['Land boundaries']?.total),
    },
    people: {
      population: cleanText(people?.Population?.total),
      languages: cleanText(people?.Languages),
      religions: cleanText(people?.Religions),
      ethnicGroups: cleanText(people?.['Ethnic groups']),
      lifeExpectancy: cleanText(people?.['Life expectancy at birth']?.['total population']),
      literacy: cleanText(people?.Literacy?.['total population']),
      urbanization: cleanText(people?.Urbanization?.['urban population']),
    },
    government: {
      type: cleanText(govt?.['Government type']),
      capital: cleanText(govt?.Capital?.name),
      independence: cleanText(govt?.Independence),
      constitution: cleanText(govt?.Constitution?.history),
      legalSystem: cleanText(govt?.['Legal system']),
      executive: cleanText(govt?.['Executive branch']?.['chief of state']),
      legislature: cleanText(govt?.['Legislative branch']?.description),
    },
    economy: {
      overview: cleanText(econ?.['Economic overview']),
      gdp: cleanText(econ?.['GDP (official exchange rate)']),
      gdpPerCapita: cleanText(econ?.['GDP - per capita (PPP)']?.['Real GDP per capita']),
      industries: cleanText(econ?.Industries),
      exports: cleanText(econ?.Exports?.commodities),
      imports: cleanText(econ?.Imports?.commodities),
      unemployment: cleanText(econ?.['Unemployment rate']),
      inflation: cleanText(econ?.['Inflation rate (consumer prices)']),
    },
    infrastructure: {
      internet: cleanText(comm?.['Internet users']?.total),
      mobilePhones: cleanText(comm?.['Mobile cellular']?.['total subscriptions']),
      airports: cleanText(trans?.Airports?.total),
      railways: cleanText(trans?.Railways?.total),
      roadways: cleanText(trans?.Roadways?.total),
    },
    environment: {
      issues: cleanText(env?.['Environment - current issues']),
      agreements: cleanText(env?.['Environment - international agreements']?.['party to']),
    },
  };
}

// Get coordinates for map
function getCoordinates(country: Country): { lat: number; lng: number } | null {
  const geo = country.Geography as any;
  const coords = geo?.['Geographic coordinates']?.text;
  if (!coords) return null;
  
  // Parse coordinates like "35 41 N, 139 45 E"
  const match = coords.match(/(\d+)\s+(\d+)\s+([NS]),?\s+(\d+)\s+(\d+)\s+([EW])/);
  if (!match) return null;
  
  let lat = parseInt(match[1]) + parseInt(match[2]) / 60;
  let lng = parseInt(match[4]) + parseInt(match[5]) / 60;
  
  if (match[3] === 'S') lat = -lat;
  if (match[6] === 'W') lng = -lng;
  
  return { lat, lng };
}

export default async function CountryPage({ params }: PageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  
  if (!country) {
    notFound();
  }
  
  const data = extractSectionData(country);
  const coords = getCoordinates(country);
  
  // Format region name
  const regionName = country.region
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 py-4 px-6 bg-[var(--bg-secondary)]/95 backdrop-blur border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium">
            ← Open World Factbook
          </Link>
          <span className="text-[var(--text-muted)] text-sm">{regionName}</span>
        </div>
      </nav>
      
      {/* Hero with Flag and Map */}
      <header className="bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Country Title */}
          <div className="flex items-center gap-6 mb-8">
            {/* Large Flag */}
            {country.flagCode && (
              <img
                src={`https://flagcdn.com/w320/${country.flagCode}.png`}
                alt={`Flag of ${country.name}`}
                className="w-32 h-auto rounded-lg shadow-lg border border-[var(--border-subtle)]"
              />
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">
                {country.name}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">{regionName}</p>
            </div>
          </div>
          
          {/* Map */}
          {coords && (
            <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-lg">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 5}%2C${coords.lat - 4}%2C${coords.lng + 5}%2C${coords.lat + 4}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                title={`Map of ${country.name}`}
              />
              <a 
                href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=6/${coords.lat}/${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm py-2 bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-gold)]"
              >
                View larger map ↗
              </a>
            </div>
          )}
        </div>
      </header>
      
      {/* Quick Stats Bar */}
      <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {data.geography.area && (
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Area</div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">{data.geography.area}</div>
              </div>
            )}
            {data.people.population && (
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Population</div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">{data.people.population.split(' ')[0]}</div>
              </div>
            )}
            {data.government.capital && (
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Capital</div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">{data.government.capital}</div>
              </div>
            )}
            {data.economy.gdp && (
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">GDP</div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">{data.economy.gdp.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Overview */}
        {data.overview.background && (
          <Section title="Overview">
            <p className="text-lg leading-relaxed text-[var(--text-primary)]">
              {data.overview.background}
            </p>
          </Section>
        )}
        
        {/* Geography */}
        <Section title="Geography">
          <DataItem label="Location" value={data.geography.location} />
          <DataItem label="Total Area" value={data.geography.area} />
          <DataItem label="Climate" value={data.geography.climate} />
          <DataItem label="Terrain" value={data.geography.terrain} />
          <DataItem label="Natural Resources" value={data.geography.naturalResources} />
          <DataItem label="Coastline" value={data.geography.coastline} />
          <DataItem label="Land Borders" value={data.geography.borders} />
        </Section>
        
        {/* People & Society */}
        <Section title="People & Society">
          <DataItem label="Population" value={data.people.population} />
          <DataItem label="Languages" value={data.people.languages} />
          <DataItem label="Religions" value={data.people.religions} />
          <DataItem label="Ethnic Groups" value={data.people.ethnicGroups} />
          <DataItem label="Life Expectancy" value={data.people.lifeExpectancy} />
          <DataItem label="Literacy Rate" value={data.people.literacy} />
          <DataItem label="Urbanization" value={data.people.urbanization} />
        </Section>
        
        {/* Government */}
        <Section title="Government">
          <DataItem label="Government Type" value={data.government.type} />
          <DataItem label="Capital" value={data.government.capital} />
          <DataItem label="Independence" value={data.government.independence} />
          <DataItem label="Constitution" value={data.government.constitution} />
          <DataItem label="Legal System" value={data.government.legalSystem} />
          <DataItem label="Executive Branch" value={data.government.executive} />
          <DataItem label="Legislature" value={data.government.legislature} />
        </Section>
        
        {/* Economy */}
        <Section title="Economy">
          <DataItem label="Economic Overview" value={data.economy.overview} />
          <DataItem label="GDP (Official Rate)" value={data.economy.gdp} />
          <DataItem label="GDP Per Capita" value={data.economy.gdpPerCapita} />
          <DataItem label="Major Industries" value={data.economy.industries} />
          <DataItem label="Main Exports" value={data.economy.exports} />
          <DataItem label="Main Imports" value={data.economy.imports} />
          <DataItem label="Unemployment" value={data.economy.unemployment} />
          <DataItem label="Inflation Rate" value={data.economy.inflation} />
        </Section>
        
        {/* Infrastructure */}
        <Section title="Infrastructure & Communications">
          <DataItem label="Internet Users" value={data.infrastructure.internet} />
          <DataItem label="Mobile Phone Subscriptions" value={data.infrastructure.mobilePhones} />
          <DataItem label="Airports" value={data.infrastructure.airports} />
          <DataItem label="Railways" value={data.infrastructure.railways} />
          <DataItem label="Roadways" value={data.infrastructure.roadways} />
        </Section>
        
        {/* Environment */}
        {(data.environment.issues || data.environment.agreements) && (
          <Section title="Environment">
            <DataItem label="Current Issues" value={data.environment.issues} />
            <DataItem label="International Agreements" value={data.environment.agreements} />
          </Section>
        )}
        
      </article>
      
      <Footer />
    </main>
  );
}
