#!/usr/bin/env python3
"""
Generate sitemap.xml for Melanin Market.
Includes: homepage, all business profile pages, city pages, city+category pages.
"""
import json
import re
from datetime import date

def make_slug(name, city=''):
    base = f"{name or ''} {city or ''}".lower()
    base = re.sub(r'[^a-z0-9\s-]', '', base).strip()
    base = re.sub(r'\s+', '-', base)
    base = re.sub(r'-+', '-', base)
    return base

def to_url_part(s):
    return (s or '').lower().replace(' ', '-').replace('/', '-')

with open('frontend_app/public/businesses.json') as f:
    data = json.load(f)

businesses = data if isinstance(data, list) else data.get('businesses', [])
today = date.today().isoformat()
base = 'https://www.melanin-market.com'

urls = []

# Homepage
urls.append({'loc': base, 'changefreq': 'daily', 'priority': '1.0'})

# Business profile pages
for b in businesses:
    slug = make_slug(b.get('name', ''), b.get('city', ''))
    if slug and slug != '-':
        urls.append({
            'loc': f"{base}/biz/{slug}",
            'changefreq': 'weekly',
            'priority': '0.8',
            'lastmod': b.get('dateAdded', today)
        })

# City pages and city+category pages
city_cats = {}
for b in businesses:
    city = b.get('city', '').strip()
    state = b.get('state', '').strip()
    cat = (b.get('category') or b.get('type') or '').strip()
    if city and state:
        key = (to_url_part(state), to_url_part(city))
        if key not in city_cats:
            city_cats[key] = set()
        if cat:
            city_cats[key].add(to_url_part(cat))

for (state_slug, city_slug), cats in city_cats.items():
    urls.append({
        'loc': f"{base}/{state_slug}/{city_slug}",
        'changefreq': 'weekly',
        'priority': '0.7'
    })
    for cat_slug in cats:
        if cat_slug:
            urls.append({
                'loc': f"{base}/{state_slug}/{city_slug}/{cat_slug}",
                'changefreq': 'weekly',
                'priority': '0.6'
            })

# Write sitemap.xml
lines = ['<?xml version="1.0" encoding="UTF-8"?>']
lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
for u in urls:
    lines.append('  <url>')
    lines.append(f'    <loc>{u["loc"]}</loc>')
    if 'lastmod' in u:
        lines.append(f'    <lastmod>{u["lastmod"]}</lastmod>')
    lines.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
    lines.append(f'    <priority>{u["priority"]}</priority>')
    lines.append('  </url>')
lines.append('</urlset>')

sitemap_content = '\n'.join(lines)
with open('frontend_app/public/sitemap.xml', 'w') as f:
    f.write(sitemap_content)

print(f"Generated sitemap.xml with {len(urls)} URLs")
print(f"  - 1 homepage")
print(f"  - {sum(1 for u in urls if '/biz/' in u['loc'])} business profiles")
print(f"  - {sum(1 for u in urls if u['loc'].count('/') == 4)} city pages")
print(f"  - {sum(1 for u in urls if u['loc'].count('/') == 5)} city+category pages")
