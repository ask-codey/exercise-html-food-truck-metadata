// Checks the head of your Rolling Tacos page: what a search engine, a chat app and a validator read.
// Run it with: npm test (run npm install once first). You don't need to change this file.
// Each check prints what it found, as "N) name: value", so you can see what the page says right now.
const nodeTest = require('node:test');

// Runs one check. When it fails, the output starts "Not yet:" and says what to fix, with no stack trace to scroll past.
function test(name, run) {
  return nodeTest(name, async (context) => {
    try {
      await run(context);
    } catch (error) {
      const problem = new Error(error.message);
      problem.stack = `Not yet: ${error.message}`;
      throw problem;
    }
  });
}
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM } = require('jsdom');
const { HtmlValidate } = require('html-validate');

const html = readFileSync('index.html', 'utf8');
const page = new JSDOM(html).window.document;

// The content of <meta name="..."> or <meta property="...">, or null when the page doesn't have it.
const meta = (attribute, value) => page.querySelector(`meta[${attribute}="${value}"]`)?.getAttribute('content')?.trim() ?? null;
const isFullAddress = (address) => /^https:\/\/[^/\s]+\.[^/\s]+/.test(address ?? '');

// Reads the JSON-LD block. It returns the object, or a message that says what is wrong.
function structuredData() {
  const block = page.querySelector('script[type="application/ld+json"]');
  if (!block) {
    return { problem: 'Add a <script type="application/ld+json"> block to the <head>.' };
  }
  try {
    return { data: JSON.parse(block.textContent) };
  } catch (error) {
    return { problem: `The JSON-LD block isn't valid JSON yet: ${error.message}. Check the commas, quotes and braces.` };
  }
}

test('1) the title says what the page is', () => {
  const title = page.title.trim();
  console.log(`1) title: ${title} (${title.length} characters)`);
  assert.notEqual(title.toLowerCase(), 'home', 'A title of "Home" tells a searcher nothing. Say what the page offers, then the site name.');
  assert.ok(title.includes('Rolling Tacos'), 'Put the site name, Rolling Tacos, in the title (at the end).');
  assert.ok(title.length <= 60, `The title is ${title.length} characters. Keep it to 60 or fewer, so search results don't cut it off.`);
});

test('2) a meta description of 50 to 160 characters', () => {
  const description = meta('name', 'description');
  console.log(`2) description: ${description ?? '(none)'}${description ? ` (${description.length} characters)` : ''}`);
  assert.ok(description, 'Add <meta name="description" content="..."> to the <head>.');
  assert.ok(description.length >= 50, `The description is ${description.length} characters. Give searchers a reason to click: 50 characters or more.`);
  assert.ok(description.length <= 160, `The description is ${description.length} characters. Keep it to 160 or fewer, so it isn't cut off.`);
});

test('3) a canonical link with the full address', () => {
  const canonical = page.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  console.log(`3) canonical: ${canonical ?? '(none)'}`);
  assert.ok(canonical, 'Add <link rel="canonical" href="..."> to the <head>.');
  assert.ok(isFullAddress(canonical), 'The canonical link needs the full address, starting https://.');
});

test('4) the Open Graph tags for the preview card', () => {
  for (const name of ['og:title', 'og:description', 'og:type', 'og:url']) {
    const value = meta('property', name);
    console.log(`4) ${name}: ${value ?? '(none)'}`);
    assert.ok(value, `Add <meta property="${name}" content="...">. Open Graph tags use property, not name.`);
  }
  assert.ok(isFullAddress(meta('property', 'og:url')), 'og:url needs the full address, starting https://.');
});

test('5) a share picture with a full address and a description', () => {
  const image = meta('property', 'og:image');
  const alt = meta('property', 'og:image:alt');
  const card = meta('name', 'twitter:card');
  console.log(`5) og:image: ${image ?? '(none)'}`);
  console.log(`5) og:image:alt: ${alt ?? '(none)'}`);
  console.log(`5) twitter:card: ${card ?? '(none)'}`);
  assert.ok(image, 'Add <meta property="og:image" content="..."> for the share picture.');
  assert.ok(isFullAddress(image), 'og:image needs the full address, starting https://. A chat app reads your page from somewhere else, so share-image.jpg on its own leads nowhere.');
  assert.ok(alt, 'Add <meta property="og:image:alt" content="..."> that says what the picture shows.');
  assert.equal(card, 'summary_large_image', 'Add <meta name="twitter:card" content="summary_large_image">, so X shows the big picture.');
});

test('6) structured data that describes the business', () => {
  const { data, problem } = structuredData();
  console.log(`6) structured data: ${data ? `${data['@type']} named ${data.name}` : '(none)'}`);
  assert.ok(data, problem);
  assert.ok(String(data['@context'] ?? '').includes('schema.org'), 'Set "@context" to "https://schema.org".');
  assert.ok(data['@type'], 'Set "@type", the kind of business, such as "FoodEstablishment".');
  assert.ok(data.name, 'Give the business its "name".');
  assert.ok(data.address && typeof data.address === 'object', 'Add an "address": an object with "@type": "PostalAddress".');
  assert.ok(data.address.streetAddress, 'Give the address its "streetAddress".');
  const hours = data.openingHoursSpecification ?? data.openingHours;
  assert.ok(hours && (!Array.isArray(hours) || hours.length > 0), 'Add the schedule: "openingHoursSpecification" (or "openingHours").');
});

test('7) the structured data matches the page', () => {
  const { data, problem } = structuredData();
  assert.ok(data, problem);
  const h1 = page.querySelector('h1')?.textContent.trim();
  const shown = page.body.textContent.replace(/\s+/g, ' ');
  console.log(`7) name: ${data.name} (the h1 says ${h1})`);
  console.log(`7) streetAddress: ${data.address?.streetAddress}`);
  assert.equal(data.name, h1, 'The structured data\'s "name" must be the business name the page shows in its <h1>.');
  assert.ok(shown.includes(String(data.address?.streetAddress ?? '').trim()),
    'The "streetAddress" must be the address the page shows. The truck moved for the fall: use the new spot.');
});

test('8) the validator finds no errors', async () => {
  const report = await new HtmlValidate({ extends: ['html-validate:standard'] }).validateString(html, 'index.html');
  const messages = report.results.flatMap((result) => result.messages).map((m) => `line ${m.line}: ${m.message}`);
  console.log(`8) validator errors: ${messages.length}`);
  assert.equal(messages.length, 0, `Fix these, then run the tests again:\n${messages.join('\n')}`);
});
