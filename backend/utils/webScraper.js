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
    
    // only basic cleanup
    $('script, style, nav, footer, header, iframe, noscript').remove();
    
    // title extract with multiple fallbacks
    let title = $('title').text().trim();
    if (!title || title === '') {
      title = $('meta[property="og:title"]').attr('content') || '';
    }
    if (!title || title === '') {
      title = $('meta[name="twitter:title"]').attr('content') || '';
    }
    if (!title || title === '') {
      title = $('h1').first().text().trim() || '';
    }
    if (!title || title === '') {
      title = 'Untitled';
    }
    
    // description extract with multiple fallbacks
    let description = $('meta[name="description"]').attr('content') || '';
    if (!description || description === '') {
      description = $('meta[property="og:description"]').attr('content') || '';
    }
    if (!description || description === '') {
      description = $('meta[name="twitter:description"]').attr('content') || '';
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
