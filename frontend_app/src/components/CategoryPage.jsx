import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { makeSlug } from './BusinessProfilePage';

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function CategoryPage() {
  const { state, city, category } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const cityName = toTitleCase(city);
  const stateName = toTitleCase(state);
  const categoryName = toTitleCase(category);

  useEffect(() => {
    fetch('/businesses.json')
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : data.businesses || [];
        const filtered = all.filter(b => {
          const bCity = (b.city || '').toLowerCase().replace(/\s+/g, '-');
          const bState = (b.state || '').toLowerCase().replace(/\s+/g, '-');
          const bCat = (b.category || b.type || '').toLowerCase().replace(/\s+/g, '-');
          const cityMatch = bCity === city.toLowerCase();
          const stateMatch = bState === state.toLowerCase();
          const catMatch = bCat === category.toLowerCase();
          return (cityMatch || stateMatch) && catMatch;
        });
        setBusinesses(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city, state, category]);

  const pageTitle = `${categoryName} in ${cityName}, ${stateName} — Minority-Owned | Melanin Market`;
  const pageDesc = `Find ${businesses.length}+ minority-owned ${categoryName.toLowerCase()} businesses in ${cityName}, ${stateName}. Support Black-owned, Hispanic-owned, Asian-owned and other minority ${categoryName.toLowerCase()} businesses near you.`;
  const canonicalUrl = `https://www.melanin-market.com/${state}/${city}/${category}`;

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Melanin Market', item: 'https://www.melanin-market.com' },
      { '@type': 'ListItem', position: 2, name: cityName, item: `https://www.melanin-market.com/${state}/${city}` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: canonicalUrl },
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen bg-orange-50">
        <header className="bg-amber-900 text-white py-4 px-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.PNG" alt="Melanin Market" className="w-8 h-8 rounded-md object-contain bg-white p-0.5"
                onError={e => { e.target.style.display = 'none'; }} />
              <span className="text-lg font-bold">Melanin Market</span>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/${state}/${city}`} className="hover:text-orange-500">{cityName}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{categoryName}</span>
          </nav>

          {/* Hero */}
          <div className="bg-amber-900 text-white rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Minority-Owned {categoryName} in {cityName}
            </h1>
            <p className="text-amber-200 text-lg">
              {loading ? 'Loading...' : `${businesses.length} ${categoryName.toLowerCase()} businesses in ${cityName}, ${stateName}`}
            </p>
            <p className="text-amber-300 text-sm mt-2">
              Supporting Black-owned, Hispanic-owned, Asian-owned, and all minority {categoryName.toLowerCase()} businesses
            </p>
          </div>

          {/* Business List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading businesses...</div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No {categoryName.toLowerCase()} businesses found in {cityName} yet.</p>
              <Link to={`/${state}/${city}`}
                className="text-orange-500 hover:underline mr-4">
                All businesses in {cityName}
              </Link>
              <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 inline-block mt-4">
                Browse All Businesses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map(b => {
                const slug = makeSlug(b.name, b.city);
                const ethnicity = b.ownerEthnicity || b.owner || '';
                return (
                  <Link key={b.id} to={`/biz/${slug}`}
                    className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow block">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {ethnicity && (
                        <span className="bg-purple-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {ethnicity}
                        </span>
                      )}
                      {b.verified && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{b.name}</h3>
                    <p className="text-amber-700 text-sm font-medium mb-1">{b.category || b.type}</p>
                    {b.address && <p className="text-gray-500 text-xs">📍 {b.address}</p>}
                    {b.phone && <p className="text-gray-500 text-xs mt-1">📞 {b.phone}</p>}
                    {b.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{b.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Related Links */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Related Searches</h2>
            <div className="flex flex-wrap gap-2">
              <Link to={`/${state}/${city}`}
                className="bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-200">
                All businesses in {cityName}
              </Link>
              <Link to="/"
                className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200">
                Browse all cities
              </Link>
            </div>
          </div>
        </main>

        <footer className="bg-amber-900 text-amber-100 py-6 mt-8 text-center text-sm">
          <p>© 2025 Melanin Market — Supporting minority-owned businesses across America</p>
          <Link to="/" className="text-amber-300 hover:text-white mt-1 inline-block">melanin-market.com</Link>
        </footer>
      </div>
    </>
  );
}
