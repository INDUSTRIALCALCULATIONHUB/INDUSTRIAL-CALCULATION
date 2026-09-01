const sitemapUrl = 'https://industrialcalculation.com/sitemap.xml';
const concurrency = 6;
const timeoutMs = 20000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'IndustrialCalculationHub-PreAdSenseAudit/1.0' },
    });
    await response.body?.cancel();
    return { url, status: response.status, finalUrl: response.url, error: '' };
  } catch (error) {
    return { url, status: 0, finalUrl: '', error: error.name === 'AbortError' ? 'Timed out' : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const sitemap = await fetchWithTimeout(sitemapUrl);
  if (sitemap.status !== 200) throw new Error(`Could not fetch sitemap: ${sitemap.status} ${sitemap.error}`);

  const sitemapText = await (await fetch(sitemapUrl)).text();
  const urls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  const results = [];
  let next = 0;
  async function worker() {
    while (next < urls.length) {
      const index = next++;
      results[index] = await fetchWithTimeout(urls[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));

  const failures = results.filter((result) => result.status < 200 || result.status >= 400);
  const redirects = results.filter((result) => result.status >= 300 && result.status < 400 || (result.finalUrl && result.finalUrl !== result.url));
  console.log(JSON.stringify({
    checked: results.length,
    passed: results.length - failures.length,
    failures,
    redirects,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
