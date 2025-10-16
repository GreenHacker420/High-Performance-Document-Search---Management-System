import * as cheerio from 'cheerio';

export async function scrapeWebPage(url) {
  try {
    console.log(`[WebScraper] Starting scrape for: ${url}`);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Extract content BEFORE removing elements to preserve more text
    let contentText = '';
    
    // Try to find main content area first
    const mainSelectors = [
      'main',
      'article', 
      '[role="main"]',
      '.main-content',
      '#main-content',
      '.content',
      '#content',
      '.post-content',
      '.article-content',
      'body'
    ];
    
    for (const selector of mainSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        // Clone to avoid modifying original
        const clone = element.clone();
        // Remove unwanted elements from clone
        clone.find('script, style, nav, footer, header, iframe, noscript, .sidebar, .advertisement, .ad, .comments').remove();
        
        const text = clone.text()
          .replace(/\s+/g, ' ')
          .trim();
        
        if (text.length > 100) {
          contentText = text;
          console.log(`[WebScraper] Content extracted from: ${selector}`);
          break;
        }
      }
    }
    
    // Fallback: get all paragraphs if main content not found
    if (!contentText || contentText.length < 100) {
      console.log('[WebScraper] Main content not found, extracting all paragraphs...');
      const paragraphs = [];
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20) { // Only include substantial paragraphs
          paragraphs.push(text);
        }
      });
      contentText = paragraphs.join(' ');
    }
    
    // Limit to 10k characters
    contentText = contentText.substring(0, 10000).trim();
    
    // Final fallback: if content is still empty, use title + description
    if (!contentText || contentText.length < 50) {
      console.warn('[WebScraper] WARNING: Very little content extracted. Using title + description as fallback.');
      contentText = `${title} ${description}`.trim();
    }
    
    console.log(`[WebScraper] Successfully scraped:`);
    console.log(`  - Title: ${title}`);
    console.log(`  - Description: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`);
    console.log(`  - Content length: ${contentText.length} chars`);
    
    // Warn if page appears to be JavaScript-rendered
    if (contentText.length < 100 && !metaTags.ogTitle && !metaTags.description) {
      console.warn('[WebScraper] WARNING: Page appears to be JavaScript-rendered (SPA). Limited content available.');
    }
    
    return {
      title,
      description,
      content_text: contentText || '', // Ensure never null
    };
  } catch (error) {
    console.error('[WebScraper] Error scraping web page:', error);
    throw new Error(`Failed to scrape web page: ${error.message}`);
  }
}
