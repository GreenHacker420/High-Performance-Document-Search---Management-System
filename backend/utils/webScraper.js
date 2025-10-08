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
    
    // only basic cleanup
    $('script, style, nav, footer, header, iframe, noscript').remove();
    
    // title extract 
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') ||
                  $('h1').first().text().trim() || 
                  'Untitled';
    
    // description extract
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') ||
                       $('p').first().text().trim().substring(0, 200) ||
                       '';
    
    // content extract
    const contentText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit to 10k characters
    
    console.log(`[WebScraper] Successfully scraped: ${title.substring(0, 50)}...`);
    
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
