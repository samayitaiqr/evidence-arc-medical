import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lines = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');
const list = (value) => Array.isArray(value) ? value : [];
const number = (index) => String(index + 1).padStart(2, '0');

export function loadContent(root = projectRoot) {
  return Object.fromEntries(readdirSync(join(root, 'content')).filter((name) => name.endsWith('.json')).map((name) => [name.slice(0, -5), JSON.parse(readFileSync(join(root, 'content', name), 'utf8'))]));
}

export function imagePath(value, root = projectRoot) {
  if (!value) return '';
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\?#\x00-\x1f]/.test(value)) throw new Error('Image paths must refer to an uploaded website image.');
  let decoded;
  try { decoded = decodeURIComponent(value); } catch { throw new Error('Invalid image path.'); }
  if (decoded.split('/').some((part) => part === '..' || part === '.') || /[\\\x00-\x1f]/.test(decoded)) throw new Error('Invalid image path.');
  const file = resolve(root, 'public', '.' + decoded);
  if (!file.startsWith(resolve(root, 'public') + '/') || !existsSync(file)) throw new Error(`Image file not found: ${value}`);
  return value;
}

function publicUrl(value) {
  if (!value) return '';
  let url;
  try { url = new URL(value); } catch { throw new Error('Website address must be a full https:// address.'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Website address must be an http(s) address without a query or credentials.');
  return url.href.replace(/\/+$/, '');
}

function validate(data) {
  for (const section of ['site', 'navigation', 'hero', 'highlights', 'services', 'approach', 'impact', 'expertise', 'engagement', 'compliance', 'contact', 'footer', 'privacy']) {
    if (!data[section] || typeof data[section] !== 'object') throw new Error(`Missing content section: ${section}`);
  }
  for (const [section, key] of [['site','page_title'],['site','brand_name'],['site','business_name'],['hero','headline'],['hero','accent_line'],['contact','email']]) {
    if (typeof data[section][key] !== 'string' || !data[section][key].trim()) throw new Error(`Please complete ${section}: ${key}.`);
  }
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(data.contact.email)) throw new Error('Please enter a valid contact email address.');
  for (const [section,key] of [['highlights','items'],['services','cards'],['approach','steps'],['impact','cases'],['expertise','facts'],['engagement','cards']]) {
    const items = data[section][key];
    if (!Array.isArray(items) || items.length < 1 || items.length > 12 || items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) throw new Error(`Keep between 1 and 12 entries in ${section}.`);
  }
  if (!Array.isArray(data.hero.steps) || data.hero.steps.length !== 4) throw new Error('The homepage diagram requires four stages.');
}

export function renderSite(data, { root = projectRoot, hostingUrl = process.env.SITE_URL || process.env.CF_PAGES_URL || '' } = {}) {
  validate(data);
  const e = escapeHtml;
  const base = publicUrl(data.site.website_url || hostingUrl);
  const basePath = base ? new URL(base).pathname.replace(/\/+$/, '') : '';
  const siteRoot = `${basePath}/`;
  const asset = (path) => `${basePath}${path}`;
  const icons = JSON.parse(readFileSync(join(root, 'templates/icons.json'), 'utf8'));
  const photo = (item, className = 'content-image', loading = 'lazy') => item.image ? `<img class="${className}" src="${e(asset(imagePath(item.image, root)))}" alt="${e(item.image_description)}" loading="${loading}" decoding="async">` : '';
  const logoPath = imagePath(data.site.logo, root);
  const socialPath = imagePath(data.site.social_image, root);
  const absolute = (path) => base ? `${base}${path}` : path;
  const schema = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: data.site.business_name,
    description: data.site.description, email: data.contact.email,
    ...(base ? { url: base, logo: absolute(logoPath || '/favicon.svg') } : {}),
    areaServed: ['Europe', 'North America'], knowsAbout: data.services.cards.map((card) => card.title)
  };
  const structuredData = JSON.stringify(schema).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const emailQuery = new URLSearchParams({ subject: data.contact.email_subject || '', body: data.contact.email_body || '' });
  const raw = {
    brand_logo: logoPath ? `<img class="brand-image" src="${e(asset(logoPath))}" alt="">` : readFileSync(join(root,'templates/logo.html'),'utf8'),
    metadata: `${base ? `<link rel="canonical" href="${e(base)}"><meta property="og:url" content="${e(base)}">` : ''}${socialPath ? `<meta property="og:image" content="${e(absolute(socialPath))}"><meta name="twitter:image" content="${e(absolute(socialPath))}"><meta property="og:image:alt" content="${e(data.site.social_image_description)}">` : ''}<script type="application/ld+json">${structuredData}</script>`,
    email_link: e(`mailto:${data.contact.email}?${emailQuery}`),
    hero_attributes: list(data.hero.attributes).map((item) => `<span>${e(item)}</span>`).join('\n'),
    hero_steps: data.hero.steps.map((item, i) => `<li><span>${number(i)}</span><strong>${e(item.title)}</strong><small>${e(item.description)}</small></li>`).join('\n'),
    highlights: data.highlights.items.map((item) => `<div class="proof-item reveal"><strong>${e(item.value)}</strong><span>${e(item.description)}</span></div>`).join('\n'),
    services: data.services.cards.map((item,i) => `<article class="service-card reveal"><div class="card-top"><span>${number(i)}</span>${icons[item.icon] || icons.strategy}</div>${photo(item)}<h3>${e(item.title)}</h3><p>${e(item.description)}</p><ul>${list(item.bullets).map((bullet) => `<li>${e(bullet)}</li>`).join('')}</ul></article>`).join('\n'),
    approach_steps: data.approach.steps.map((item,i) => `<li class="reveal"><span>${number(i)}</span><div><h3>${e(item.title)}</h3><p>${e(item.description)}</p></div></li>`).join('\n'),
    impact_cases: data.impact.cases.map((item) => `<article class="case-card${item.featured ? ' case-featured' : ''} reveal"><div class="case-meta"><span>${e(item.category)}</span><span>${e(item.topic)}</span></div>${photo(item)}<h3>${e(item.title)}</h3><p>${e(item.description)}</p><div class="case-result${item.featured ? '' : ' compact'}"><strong>${e(item.result)}</strong><span>${e(item.result_description)}</span></div></article>`).join('\n'),
    expertise_facts: data.expertise.facts.map((item) => `<div class="expertise-row"><span>${e(item.title)}</span><strong>${lines(item.description)}</strong></div>`).join('\n'),
    expertise_image: photo(data.expertise, 'content-image expertise-image'),
    engagement_cards: data.engagement.cards.map((item,i) => `<article class="engagement-card reveal"><span>${number(i)}</span><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('\n'),
    privacy_paragraphs: list(data.privacy.paragraphs).map((item) => `<p>${e(item)}</p>`).join('\n')
  };
  function expand(template) {
    return template.replace(/\{\{\{([a-z_]+)\}\}\}|\{\{(br:)?([a-zA-Z0-9_.]+)\}\}/g, (_, rawName, withLines, path) => {
      if (rawName) {
        if (!(rawName in raw)) throw new Error(`Unknown template block: ${rawName}`);
        return raw[rawName];
      }
      const value = path.split('.').reduce((current, key) => current?.[key], data);
      if (value != null && typeof value !== 'string') throw new Error(`Expected text at ${path}.`);
      return withLines ? lines(value) : e(value);
    });
  }
  raw.hero_visual = data.hero.image ? `<figure class="hero-photo-wrap reveal">${photo(data.hero,'hero-photo','eager')}</figure>` : expand(readFileSync(join(root,'templates/hero-diagram.html'),'utf8'));
  const page = expand(readFileSync(join(root,'templates/index.html'),'utf8'));
  return {
    html: page,
    robots: `User-agent: *\nAllow: ${siteRoot}\nDisallow: ${siteRoot}admin/\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`,
    sitemap: base ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${e(base)}/</loc></url></urlset>\n` : null,
    manifest: JSON.stringify({name:data.site.business_name, short_name:data.site.brand_name, start_url:siteRoot, scope:siteRoot, display:'browser', theme_color:'#111d43', background_color:'#f8f6f5', icons:[{src:asset('/favicon.svg'),sizes:'any',type:'image/svg+xml'}]},null,2),
    notFound: readFileSync(join(root,'public/404.html'),'utf8').replaceAll('{{site_root}}', e(siteRoot))
  };
}

export function build({ root = projectRoot, outDir = join(root,'dist'), data = loadContent(root), hostingUrl } = {}) {
  const rendered = renderSite(data, {root, hostingUrl});
  const destination = resolve(outDir);
  const source = resolve(root);
  if (destination === source || !destination.startsWith(source + '/') || destination === join(source,'public')) throw new Error('Build destination must be a dedicated directory inside this project.');
  rmSync(destination,{recursive:true,force:true});
  mkdirSync(destination,{recursive:true});
  cpSync(join(root,'public'),destination,{recursive:true});
  rmSync(join(destination,'uploads/.gitkeep'),{force:true});
  writeFileSync(join(destination,'index.html'),rendered.html);
  writeFileSync(join(destination,'404.html'),rendered.notFound);
  writeFileSync(join(destination,'robots.txt'),rendered.robots);
  if (rendered.sitemap) writeFileSync(join(destination,'sitemap.xml'),rendered.sitemap);
  writeFileSync(join(destination,'site.webmanifest'),rendered.manifest);
  return rendered;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  build();
  console.log('Website built successfully in dist/.');
}
