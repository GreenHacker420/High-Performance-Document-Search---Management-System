import { query } from '../config/db.js';

export const SearchModel = {
  // Unified search across all content types
  async search(searchQuery, filters = {}) {
    const { type, limit = 20 } = filters;
    
    // Build the search query based on filters
    let queries = [];
    
    if (!type || type === 'faq') {
      queries.push(`
        SELECT 
          'faq' as type,
          id,
          title,
          content as snippet,
          NULL as url,
          NULL as file_path,
          created_at,
          ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
        FROM faqs
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
      `);
    }
    
    if (!type || type === 'link') {
      queries.push(`
        SELECT 
          'link' as type,
          id,
          title,
          description as snippet,
          url,
          NULL as file_path,
          created_at,
          ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
        FROM web_links
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
      `);
    }
    
    if (!type || type === 'pdf') {
      queries.push(`
        SELECT 
          'pdf' as type,
          id,
          file_name as title,
          substring(content_text, 1, 200) as snippet,
          NULL as url,
          file_path,
          uploaded_at as created_at,
          ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
        FROM pdfs
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
      `);
    }
    
    const unionQuery = `
      ${queries.join(' UNION ALL ')}
      ORDER BY rank DESC
      LIMIT $2
    `;
    
    const result = await query(unionQuery, [searchQuery, limit]);
    return result.rows;
  },
};
