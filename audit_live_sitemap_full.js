const fs = require('fs');
const path = require('path');

const sitemapUrl = 'https://industrialcalculation.com/sitemap.xml';
const timeoutMs = 20000;
const concurrency = 12;

async function get(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': 'IndustrialCalculationHub-ReleaseAudit/1.0' } });
    await response.text();
    return { url, status: response.status, finalUrl: response.url, error: '' };
  } catch (error) {
    return { url, status: 0, finalUrl: '', error: error.name === 'AbortError' ? 'Timed out' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const sitemap = await get(sitemapUrl);
  if (sitemap.status !== 200) throw new Error(`Sitemap request failed: ${sitemap.status} ${sitemap.error}`);
  const xml = await (await fetch(sitemapUrl)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  const results = new Array(urls.length);
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      results[index] = await get(urls[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  const failures = results.filter((result) => result.status < 200 || result.status >= 400);
  const redirects = results.filter((result) => result.status >= 300 && result.status < 400 || (result.finalUrl && result.finalUrl !== result.url));
  const report = { checked: results.length, passed: results.length - failures.length, failureCount: failures.length, redirectCount: redirects.length, failures, redirects };
  const destination = path.join(process.cwd(), 'outputs', 'literature-audit', 'LIVE-SITEMAP-RELEASE-AUDIT.json');
  fs.writeFileSync(destination, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, failures: failures.slice(0, 20), redirects: redirects.slice(0, 20), output: path.relative(process.cwd(), destination) }, null, 2));
}
main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
