import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Generate a URL-safe slug from a business name and city
export function makeSlug(name, city) {
  const base = `${name || ''} ${city || ''}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return base;
}

export default function BusinessProfilePage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/businesses.json')
      .then(r => r.json())
      .then(data => {
        const businesses = Array.isArray(data) ? data : data.businesses || [];
        const match = businesses.find(b => makeSlug(b.name, b.city) === slug);
        if (match) {
          setBusiness(match);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="text-4xl mb-3">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-4">This business listing may have moved or been removed.</p>
          <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600">
            Back to Melanin Market
          </Link>
        </div>
      </div>
    );
  }

  const ethnicity = business.ownerEthnicity || business.owner || 'Minority-owned';
  const city = business.city || '';
  const state = business.state || '';
  const category = business.category || business.type || 'Business';
  const pageTitle = `${business.name} — ${ethnicity} ${category} in ${city}${state ? ', ' + state : ''} | Melanin Market`;
  const pageDesc = business.description
    ? business.description.slice(0, 155)
    : `${business.name} is a ${ethnicity} ${category.toLowerCase()} located in ${city}${state ? ', ' + state : ''}. Find and support minority-owned businesses on Melanin Market.`;
  const canonicalUrl = `https://www.melanin-market.com/biz/${slug}`;

  // LocalBusiness JSON-LD Schema
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: pageDesc,
    url: business.website || canonicalUrl,
    telephone: business.phone || undefined,
    image: business.image || undefined,
    address: business.address ? {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: city,
      addressRegion: state,
      postalCode: business.zip || undefined,
      addressCountry: 'US',
    } : undefined,
    openingHours: business.hours || undefined,
    priceRange: business.priceRange || undefined,
    sameAs: business.website ? [business.website] : undefined,
  };

  // Clean up undefined fields
  Object.keys(schemaOrg).forEach(k => schemaOrg[k] === undefined && delete schemaOrg[k]);
  if (schemaOrg.address) {
    Object.keys(schemaOrg.address).forEach(k => schemaOrg.address[k] === undefined && delete schemaOrg.address[k]);
  }

  const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="business.business" />
        {business.image && <meta property="og:image" content={business.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <div className="min-h-screen bg-orange-50">
        {/* Header */}
        <header className="bg-amber-900 text-white py-4 px-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.PNG" alt="Melanin Market" className="w-8 h-8 rounded-md object-contain bg-white p-0.5"
                onError={e => { e.target.style.display = 'none'; }} />
              <span className="text-lg font-bold">Melanin Market</span>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            {stateSlug && citySlug && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/${stateSlug}/${citySlug}`} className="hover:text-orange-500 capitalize">{city}</Link>
              </>
            )}
            {stateSlug && citySlug && categorySlug && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/${stateSlug}/${citySlug}/${categorySlug}`} className="hover:text-orange-500 capitalize">{category}</Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{business.name}</span>
          </nav>

          {/* Business Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Image */}
            {business.image && (
              <div className="h-56 bg-gray-100 flex items-center justify-center">
                <img src={business.image} alt={business.name}
                  className="w-full h-full object-contain p-4" />
              </div>
            )}

            <div className="p-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {ethnicity && (
                  <span className="bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {ethnicity}
                  </span>
                )}
                {business.verified && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✓ Verified Business
                  </span>
                )}
                {category && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                    {category}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h1>

              {(city || state) && (
                <p className="text-gray-500 text-sm mb-4">
                  📍 {[business.address, city, state, business.zip].filter(Boolean).join(', ')}
                </p>
              )}

              {business.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">{business.description}</p>
              )}

              {/* Contact Details */}
              <div className="space-y-3 border-t pt-4">
                {business.phone && (
                  <a href={`tel:${business.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500">
                    <span className="text-xl">📞</span>
                    <span>{business.phone}</span>
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500">
                    <span className="text-xl">✉️</span>
                    <span>{business.email}</span>
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-500">
                    <span className="text-xl">🌐</span>
                    <span className="break-all">{business.website}</span>
                  </a>
                )}
                {business.hours && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🕐</span>
                    <span>{business.hours}</span>
                  </div>
                )}
                {business.service_area && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🗺️</span>
                    <span>Serves: {business.service_area}</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-col gap-3">
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer"
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-center hover:bg-orange-600 transition-colors">
                    Visit Website
                  </a>
                )}
                {business.phone && (
                  <a href={`tel:${business.phone}`}
                    className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-bold text-center hover:bg-orange-50 transition-colors">
                    Call Now
                  </a>
                )}
                <Link to="/"
                  className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors">
                  ← Back to Directory
                </Link>
              </div>
            </div>
          </div>

          {/* SEO: Related searches */}
          {stateSlug && citySlug && (
            <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                More {ethnicity} businesses in {city}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link to={`/${stateSlug}/${citySlug}`}
                  className="bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-200">
                  All businesses in {city}
                </Link>
                {category && (
                  <Link to={`/${stateSlug}/${citySlug}/${categorySlug}`}
                    className="bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-200">
                    {category} in {city}
                  </Link>
                )}
                <Link to="/"
                  className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200">
                  Browse all cities
                </Link>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-amber-900 text-amber-100 py-6 mt-8 text-center text-sm">
          <p>© 2025 Melanin Market — Supporting minority-owned businesses across America</p>
          <Link to="/" className="text-amber-300 hover:text-white mt-1 inline-block">melanin-market.com</Link>
        </footer>
      </div>
    </>
  );
}
