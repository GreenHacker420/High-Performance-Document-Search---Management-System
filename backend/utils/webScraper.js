import * as cheerio from 'cheerio';

export async function scrapeWebPage(url) {
  try {
    console.log(`[WebScraper] Starting scrape for: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      redirect: 'follow',
      timeout: 10000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    console.log('[WebScraper] HTML loaded, extracting data...');
    console.log('[WebScraper] HTML preview:', html.substring(0, 500));
    
    // Extract all meta tags first (before cleanup)
    const metaTags = {
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || '',
      pageTitle: $('title').text().trim() || '',
    };
    
    console.log('[WebScraper] Meta tags found:', metaTags);
    
    // only basic cleanup
    $('script, style, nav, footer, header, iframe, noscript').remove();
    
    // title extract with multiple fallbacks
    let title = metaTags.pageTitle;
    if (!title || title === '') {
      title = metaTags.ogTitle;
    }
    if (!title || title === '') {
      title = metaTags.twitterTitle;
    }
    if (!title || title === '') {
      title = $('h1').first().text().trim() || '';
    }
    if (!title || title === '') {
      // Extract from URL as last resort
      const urlObj = new URL(url);
      title = urlObj.hostname.replace('www.', '');
    }
    
    // description extract with multiple fallbacks
    let description = metaTags.description;
    if (!description || description === '') {
      description = metaTags.ogDescription;
    }
    if (!description || description === '') {
      description = metaTags.twitterDescription;
    }
    if (!description || description === '') {
      const firstP = $('p').first().text().trim();
      description = firstP.substring(0, 200);
    }
    
    // content extract - get main content
    const contentText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit to 10k characters
    
    console.log(`[WebScraper] Successfully scraped:`);
    console.log(`  - Title: ${title}`);
    console.log(`  - Description: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`);
    console.log(`  - Content length: ${contentText.length} chars`);
    
    // Warn if page appears to be JavaScript-rendered
    if (contentText.length < 100 && !metaTags.ogTitle && !metaTags.description) {
      console.warn('[WebScraper] WARNING: Page appears to be JavaScript-rendered (SPA). Consider adding meta tags to the HTML.');
    }
    
    return {
      title,
      description,
      content_text: contentText,
    };
  } catch (error) {
    console.error('[WebScraper] Error scraping web page:', error);
    throw new Error(`Failed to scrape web page: ${error.message}`);
  }
}
