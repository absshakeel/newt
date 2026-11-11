import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve('public/images');
const WIDTH = 1600;
const USER_AGENT =
  'GTourDemoAssets/1.0 (educational project; contact: support@gtour.local)';

const SLOTS = [
  { slug: 'hero', queries: ['Aerial view tropical island turquoise sea', 'Coastal cliffs turquoise water aerial'], minRatio: 1.5, maxRatio: 3.2 },
  { slug: 'santorini', queries: ['Santorini Oia caldera', 'Oia Santorini white houses'], minRatio: 1.2, maxRatio: 2.4 },
  { slug: 'kyoto', queries: ['Fushimi Inari torii gates', 'Kiyomizu-dera Kyoto'], minRatio: 1.2, maxRatio: 2.4 },
  { slug: 'alps', queries: ['Matterhorn Zermatt', 'Swiss Alps mountain lake'], minRatio: 1.2, maxRatio: 2.4 },
  { slug: 'bali', queries: ['Tegalalang rice terrace Bali', 'Bali rice terraces'], minRatio: 1.2, maxRatio: 2.4 },
  { slug: 'marrakech', queries: ['Jemaa el-Fnaa Marrakech', 'Marrakech medina Morocco'], minRatio: 1.2, maxRatio: 2.4 },
  { slug: 'style-mountains', queries: ['Dolomites mountain landscape', 'Alps mountain range sunrise'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'style-beaches', queries: ['Maldives beach turquoise', 'Tropical beach palm trees'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'style-history', queries: ['Colosseum Rome', 'Ancient temple ruins historic'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'style-adventure', queries: ['Hiker backpack mountain trail', 'Trekking mountain path'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'style-culture', queries: ['Traditional market culture street', 'Local cultural festival'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'style-city', queries: ['City skyline at dusk', 'Modern city skyline'], minRatio: 1.1, maxRatio: 2.4 },
  { slug: 'stay-resort', queries: ['Luxury resort swimming pool', 'Hotel pool terrace sea view'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'stay-room', queries: ['Hotel room interior bed', 'Boutique hotel suite interior'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'stay-terrace', queries: ['Hotel terrace sea view balcony', 'Beachfront hotel terrace'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'service-photographer', queries: ['Photographer camera outdoors shooting', 'Travel photographer taking photo'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'service-vehicle', queries: ['Camper van scenic road trip', 'Car on mountain road travel'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'service-hotel', queries: ['Hotel reception lobby interior', 'Hotel lobby interior'], minRatio: 1.1, maxRatio: 2.2 },
  { slug: 'inspiration', queries: ['Northern lights Iceland landscape', 'Aurora borealis landscape'], minRatio: 1.4, maxRatio: 3.0 },
  { slug: 'auth', queries: ['Airplane wing above clouds sunset', 'Airplane window clouds view'], minRatio: 1.2, maxRatio: 2.6 },
];

async function api(params) {
  const url = `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
    ...params,
    format: 'json',
    origin: '*',
  })}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function search(query, limit = 20) {
  return api({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(WIDTH),
  });
}

function plain(html) {
  return String(html ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function pick(slot) {
  for (const query of slot.queries) {
    let data;
    try {
      data = await search(query);
    } catch {
      continue;
    }

    const pages = Object.values(data?.query?.pages ?? {});
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info?.thumburl) continue;

      const ratio = info.width / info.height;
      if (ratio < slot.minRatio || ratio > slot.maxRatio) continue;
      if (info.width < 1200) continue;
      if (/\.(svg|gif|tif|webp)$/i.test(info.url ?? '')) continue;

      const meta = info.extmetadata ?? {};
      const license = plain(meta.LicenseShortName?.value) || 'See source page';
      if (/fair use|non-free/i.test(license)) continue;

      return {
        slug: slot.slug,
        sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(
          page.title.replace(/ /g, '_')
        )}`,
        fileUrl: info.thumburl,
        title: plain(page.title),
        author: plain(meta.Artist?.value) || 'Wikimedia Commons contributor',
        license,
        licenseUrl: plain(meta.LicenseUrl?.value) || undefined,
        width: info.thumbwidth ?? info.width,
        height: info.thumbheight ?? info.height,
      };
    }
  }
  return null;
}

await mkdir(OUT_DIR, { recursive: true });

const credits = [];
for (const slot of SLOTS) {
  const found = await pick(slot);
  if (!found) {
    console.log(`MISS  ${slot.slug}`);
    continue;
  }

  const res = await fetch(found.fileUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    console.log(`FAIL  ${slot.slug} (${res.status})`);
    continue;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT_DIR, `${slot.slug}.jpg`), buffer);
  credits.push(found);
  console.log(`OK    ${slot.slug.padEnd(22)} ${(buffer.length / 1024).toFixed(0)}KB  ${found.license}`);
}

await writeFile(path.join(OUT_DIR, 'CREDITS.json'), `${JSON.stringify(credits, null, 2)}\n`);
console.log(`\n${credits.length}/${SLOTS.length} images saved.`);
