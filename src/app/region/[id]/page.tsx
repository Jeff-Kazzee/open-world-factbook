/**
 * Open World Factbook - Region Page
 * SSG: Statically generates all 14 region pages at build time
 */

import { getAllRegions, getCountriesByRegion } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Regional interesting facts
const REGION_FACTS: Record<string, { 
  description: string;
  facts: string[];
  mapCenter: { lat: number; lng: number; zoom: number };
}> = {
  'africa': {
    description: 'The second-largest and second-most populous continent, home to 54 countries and over 1.3 billion people.',
    facts: [
      '🌍 Africa has over 2,000 languages spoken across the continent',
      '🦁 The Sahara Desert is larger than the entire United States',
      '💎 Africa produces 80% of the world\'s diamonds and 50% of its gold',
      '🏔️ Mount Kilimanjaro is the world\'s tallest free-standing mountain',
    ],
    mapCenter: { lat: 0, lng: 20, zoom: 3 }
  },
  'europe': {
    description: 'A continent of rich history, diverse cultures, and economic powerhouses spanning 55 countries.',
    facts: [
      '🏛️ Home to the world\'s oldest republics: San Marino (301 CE) and Vatican City',
      '🌐 The EU is the world\'s largest single market with 27 member states',
      '🗼 Europe has over 400 UNESCO World Heritage Sites',
      '🚄 The continent has the world\'s most extensive high-speed rail network',
    ],
    mapCenter: { lat: 50, lng: 10, zoom: 4 }
  },
  'east-n-southeast-asia': {
    description: 'A dynamic region of ancient civilizations and modern megacities, home to over 2.3 billion people.',
    facts: [
      '🏙️ Home to 5 of the world\'s 10 largest cities by population',
      '🌏 Contains the world\'s two most populous countries: China and Indonesia',
      '💹 Produces over 50% of global manufacturing output',
      '🍜 Birthplace of rice cultivation over 10,000 years ago',
    ],
    mapCenter: { lat: 20, lng: 110, zoom: 3 }
  },
  'north-america': {
    description: 'From Arctic tundra to tropical beaches, three major countries spanning 9.5 million square miles.',
    facts: [
      '🗽 The United States has the world\'s largest economy at $27 trillion GDP',
      '🍁 Canada has the world\'s longest coastline at 202,080 km',
      '🌮 Mexico City is the oldest capital in the Americas (1325)',
      '🏞️ Contains 5 of the world\'s 25 largest lakes',
    ],
    mapCenter: { lat: 45, lng: -100, zoom: 3 }
  },
  'south-america': {
    description: 'A continent of superlatives: the Amazon, the Andes, and incredible biodiversity across 12 countries.',
    facts: [
      '🌳 The Amazon rainforest produces 20% of the world\'s oxygen',
      '🏔️ The Andes is the world\'s longest continental mountain range (7,000 km)',
      '🦜 Home to 1/3 of all bird species on Earth',
      '⚽ Brazil has won the FIFA World Cup 5 times, more than any other nation',
    ],
    mapCenter: { lat: -15, lng: -60, zoom: 3 }
  },
  'south-asia': {
    description: 'The most densely populated region on Earth, home to 1.9 billion people across 9 countries.',
    facts: [
      '🕉️ Birthplace of four major world religions: Hinduism, Buddhism, Jainism, and Sikhism',
      '🏔️ Home to 8 of the world\'s 10 highest mountain peaks',
      '🎬 India\'s Bollywood produces more films annually than Hollywood',
      '📱 India has the world\'s largest youth population (600M under age 25)',
    ],
    mapCenter: { lat: 22, lng: 78, zoom: 4 }
  },
  'middle-east': {
    description: 'The cradle of civilization, where ancient history meets modern innovation across 19 nations.',
    facts: [
      '📜 Home to some of the world\'s oldest continuously inhabited cities',
      '🛢️ Contains 48% of the world\'s proven oil reserves',
      '🏗️ Dubai\'s Burj Khalifa is the world\'s tallest building (828 meters)',
      '💧 The Dead Sea is the lowest point on Earth (430 meters below sea level)',
    ],
    mapCenter: { lat: 29, lng: 47, zoom: 4 }
  },
  'central-asia': {
    description: 'The historic Silk Road crossroads, featuring vast steppes and ancient cities across 6 nations.',
    facts: [
      '🐎 Kazakhstan is the world\'s largest landlocked country',
      '🏛️ Uzbekistan has over 7,400 architectural monuments',
      '⛰️ Kyrgyzstan is 90% mountainous',
      '🌾 The region produces 25% of the world\'s cotton',
    ],
    mapCenter: { lat: 45, lng: 65, zoom: 4 }
  },
  'australia-oceania': {
    description: 'Thousands of islands scattered across the Pacific, from Australia to tiny atolls.',
    facts: [
      '🦘 Australia is the world\'s 6th largest country by area',
      '🏝️ Oceania contains over 25,000 islands',
      '🐠 The Great Barrier Reef is the world\'s largest coral reef system',
      '🗿 Easter Island\'s Moai statues were carved between 1400-1650 CE',
    ],
    mapCenter: { lat: -25, lng: 140, zoom: 3 }
  },
  'central-america-n-caribbean': {
    description: 'A bridge between continents, featuring rainforests, ancient ruins, and turquoise waters.',
    facts: [
      '🌴 The Caribbean has over 7,000 islands',
      '🏛️ Guatemala has the most Mayan ruins in Central America',
      '🐢 Costa Rica has 5% of the world\'s biodiversity',
      '🌊 The Panama Canal connects the Atlantic and Pacific oceans',
    ],
    mapCenter: { lat: 15, lng: -80, zoom: 4 }
  },
  'antarctica': {
    description: 'The coldest, driest, and windiest continent, dedicated to science and peace.',
    facts: [
      '🧊 Contains 90% of the world\'s ice and 70% of its fresh water',
      '🌡️ Lowest temperature recorded: -89.2°C (-128.6°F)',
      '🔬 Over 30 countries operate research stations',
      '🐧 Home to 5 million breeding pairs of penguins',
    ],
    mapCenter: { lat: -75, lng: 0, zoom: 2 }
  },
  'oceans': {
    description: 'The world\'s major oceanic regions and international waters.',
    facts: [
      '🌊 Oceans cover 71% of Earth\'s surface',
      '🐋 The Pacific Ocean is larger than all land combined',
      '🌪️ The Atlantic Ocean is growing by 2-3 cm per year',
      '🏝️ Only 5% of the ocean has been explored',
    ],
    mapCenter: { lat: 0, lng: -30, zoom: 2 }
  },
  'world': {
    description: 'Global statistics and international organizations.',
    facts: [
      '🌍 Global population: 8.1 billion (2024)',
      '🏛️ 193 UN member states',
      '💰 Global GDP: $105 trillion',
      '🗣️ Over 7,000 languages spoken worldwide',
    ],
    mapCenter: { lat: 30, lng: 0, zoom: 2 }
  },
};

// Generate static params for all regions
export async function generateStaticParams() {
  const regions = getAllRegions();
  return regions.map(region => ({
    id: region.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const regions = getAllRegions();
  const region = regions.find(r => r.id === id);
  
  if (!region) {
    return { title: 'Region Not Found' };
  }
  
  return {
    title: `${region.displayName} - Open World Factbook`,
    description: REGION_FACTS[id]?.description || `Explore countries in ${region.displayName}`,
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { id } = await params;
  const regions = getAllRegions();
  const region = regions.find(r => r.id === id);
  
  if (!region) {
    notFound();
  }
  
  const countries = getCountriesByRegion(id);
  const regionInfo = REGION_FACTS[id] || {
    description: `Explore the countries of ${region.displayName}`,
    facts: [],
    mapCenter: { lat: 0, lng: 0, zoom: 2 }
  };
  
  // Calculate region stats
  const totalPopulation = countries.reduce((sum, c) => {
    const pop = c.population?.replace(/[^0-9]/g, '');
    return sum + (pop ? parseInt(pop) : 0);
  }, 0);
  
  const totalArea = countries.reduce((sum, c) => {
    const area = c.area?.replace(/[^0-9]/g, '');
    return sum + (area ? parseInt(area) : 0);
  }, 0);
  
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 py-4 px-6 bg-[var(--bg-secondary)]/95 backdrop-blur border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[var(--accent-gold)] hover:underline font-medium">
            ← Open World Factbook
          </Link>
          <span className="text-[var(--text-muted)] text-sm">{region.countries.length} countries</span>
        </div>
      </nav>
      
      {/* Hero Section */}
      <header className="bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-serif text-[var(--text-primary)] mb-4">
            {region.displayName}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl">
            {regionInfo.description}
          </p>
          
          {/* Region Map */}
          <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-lg mb-8">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${regionInfo.mapCenter.lng - 40}%2C${regionInfo.mapCenter.lat - 30}%2C${regionInfo.mapCenter.lng + 40}%2C${regionInfo.mapCenter.lat + 30}&layer=mapnik`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              title={`Map of ${region.displayName}`}
            />
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Countries</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{countries.length}</div>
            </div>
            {totalPopulation > 0 && (
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border-subtle)]">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Population</div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {(totalPopulation / 1_000_000_000).toFixed(1)}B
                </div>
              </div>
            )}
            {totalArea > 0 && (
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border-subtle)]">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Total Area</div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {(totalArea / 1_000_000).toFixed(1)}M km²
                </div>
              </div>
            )}
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Explore</div>
              <div className="text-lg font-semibold text-[var(--accent-gold)]">Browse Below</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Interesting Facts */}
      {regionInfo.facts.length > 0 && (
        <section className="py-12 px-6 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-6">
              Did You Know?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {regionInfo.facts.map((fact, i) => (
                <div 
                  key={i}
                  className="bg-[var(--bg-secondary)] rounded-lg p-5 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] transition-colors"
                >
                  <p className="text-[var(--text-primary)] text-lg leading-relaxed">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Countries Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-8">
            Countries in {region.displayName}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countries.map(country => (
              <Link
                key={country.code}
                href={`/country/${country.slug}`}
                className="group bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    alt={`${country.name} flag`}
                    width={48}
                    height={32}
                    className="rounded shadow-sm"
                    unoptimized
                  />
                  <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                    {country.name}
                  </h3>
                </div>
                
                {(country.capital || country.population) && (
                  <div className="text-sm text-[var(--text-muted)] space-y-1">
                    {country.capital && (
                      <div>📍 {country.capital}</div>
                    )}
                    {country.population && (
                      <div>👥 {country.population.split(' ')[0]}</div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
