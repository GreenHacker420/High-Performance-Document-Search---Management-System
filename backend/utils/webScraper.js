import * as cheerio from 'cheerio';

export async function scrapeWebPage(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // only basic cleanup
    $('script, style, nav, footer, header').remove();
    
    // title extract 
    const title = $('title').text().trim() || 
                  $('h1').first().text().trim() || 
                  'Untitled';
    
    // description extract
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       '';
    
    // content extract
    const contentText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit to 10k characters
    
    return {
      title,
      description,
      content_text: contentText,
    };
  } catch (error) {
    console.error('Error scraping web page:', error);
    throw new Error(`Failed to scrape web page: ${error.message}`);
  }
}
