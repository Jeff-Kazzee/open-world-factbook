import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Brand & Description */}
          <div className="max-w-md">
            <div className="font-serif text-lg font-medium text-[var(--accent-gold)] mb-2">
              Open World Factbook
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              An open-source initiative to preserve and democratize global country data. 
              Sourced from public domain archives.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://github.com/Jeff-Kazzee/open-world-factbook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links & Donation */}
          <div className="flex flex-col sm:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col gap-2 text-sm text-center md:text-left">
              <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--accent-gold)]">About Project</Link>
              <Link href="/api" className="text-[var(--text-muted)] hover:text-[var(--accent-gold)]">Data API</Link>
              <Link href="/contribute" className="text-[var(--text-muted)] hover:text-[var(--accent-gold)]">Contribute</Link>
            </div>
            
            <a
              href="https://buymeacoffee.com/openworld" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20"
            >
              <span>☕</span>
              <span>Buy us a coffee</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Open World Factbook. Content available under Public Domain (USG).</p>
        </div>
      </div>
    </footer>
  );
}
