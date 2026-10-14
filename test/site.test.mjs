import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadContent, renderSite, projectRoot } from '../scripts/build.mjs';

test('the exported website preserves its existing sections and has no ChatGPT hosting dependency', () => {
  const site = renderSite(loadContent(), {hostingUrl:'https://evidence-arc-test.pages.dev'});
  for (const anchor of ['home','services','approach','impact','expertise','contact']) assert.ok(site.html.includes(`id="${anchor}"`));
  for (const title of ['Evidence that moves decisions.', 'Medical strategy &amp; planning', 'Evidence generation', 'Scientific communications']) assert.ok(site.html.includes(title));
  assert.equal((site.html.match(/class="service-card reveal"/g) || []).length, 6);
  assert.ok(!site.html.includes('chatgpt.site'));
  assert.ok(!site.html.includes('data-template-placeholder'));
  assert.ok(!site.html.includes('{{'));
  assert.ok(site.sitemap.includes('https://evidence-arc-test.pages.dev/'));
  assert.ok(site.robots.includes('https://evidence-arc-test.pages.dev/sitemap.xml'));
});

test('editor changes update headings, contact buttons, service order and added cards', () => {
  const content = loadContent();
  content.hero.headline = 'New medical strategy headline';
  content.contact.email = 'hello@example.org';
  content.contact.email_subject = 'Discuss research & strategy';
  content.services.cards.reverse();
  content.services.cards.push({title:'A new advisory service',description:'A service added in the editor.',bullets:['One new deliverable'],icon:'evidence'});
  const {html} = renderSite(content,{hostingUrl:''});
  assert.ok(html.includes('New medical strategy headline'));
  assert.ok(html.includes('mailto:hello@example.org?'));
  assert.ok(html.includes('data-contact-email="hello@example.org"'));
  assert.ok(html.includes('subject=Discuss+research+%26+strategy'));
  assert.ok(html.includes('A new advisory service'));
  assert.equal((html.match(/class="service-card reveal"/g)||[]).length,7);
  assert.ok(html.indexOf('Medical governance &amp; delivery</h3>') < html.indexOf('Medical strategy &amp; planning</h3>'));
  const script = readFileSync(join(projectRoot,'public/script.js'),'utf8');
  assert.ok(script.includes('dataset.contactEmail'));
  assert.ok(!script.includes('samayita@'));
});

test('uploaded images replace the diagram and appear on content cards', () => {
  const content = loadContent();
  content.hero.image = '/social-card.png';
  content.hero.image_description = 'A chosen hero photograph';
  content.services.cards[0].image = '/social-card.png';
  content.services.cards[0].image_description = 'Service illustration';
  content.expertise.image = '/social-card.png';
  const {html} = renderSite(content,{hostingUrl:''});
  assert.ok(html.includes('class="hero-photo"'));
  assert.ok(html.includes('alt="A chosen hero photograph"'));
  assert.ok(html.includes('alt="Service illustration"'));
  assert.ok(html.includes('class="content-image expertise-image"'));
  assert.ok(!html.includes('class="arc-steps"'));
});

test('editor text is escaped and cannot become HTML, scripts or template instructions', () => {
  const content = loadContent();
  content.hero.headline = '<img src=x onerror=alert(1)> {{site.brand_name}}';
  content.site.business_name = '</script><script>alert(1)</script>';
  const {html} = renderSite(content,{hostingUrl:''});
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt; {{site.brand_name}}'));
  assert.ok(!html.includes('<img src=x onerror='));
  assert.ok(!html.includes('</script><script>alert(1)</script>'));
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(json).name, content.site.business_name);
});

test('invalid uploads, email addresses and website URLs fail before publication', () => {
  for (const value of ['/uploads/../../content/site.json','/%2e%2e/content/site.json','//example.org/a.png','javascript:alert(1)','/uploads/missing.png']) {
    const data=loadContent(); data.hero.image=value;
    assert.throws(()=>renderSite(data,{hostingUrl:''}),/image|Image/);
  }
  const email=loadContent(); email.contact.email='person@example.org?bcc=other@example.org';
  assert.throws(()=>renderSite(email),/email/);
  const url=loadContent(); url.site.website_url='javascript:alert(1)';
  assert.throws(()=>renderSite(url),/address/);
});

test('custom domain replaces hosting URLs throughout metadata', () => {
  const data=loadContent(); data.site.website_url='https://www.example.org/';
  const result=renderSite(data,{hostingUrl:'https://preview.pages.dev'});
  assert.ok(result.html.includes('rel="canonical" href="https://www.example.org"'));
  assert.ok(result.html.includes('https://www.example.org/social-card.png'));
  assert.ok(!result.html.includes('preview.pages.dev'));
  assert.ok(result.sitemap.includes('https://www.example.org/'));
});
