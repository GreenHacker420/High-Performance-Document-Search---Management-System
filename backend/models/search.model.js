import { query } from '../config/db.js';

export const SearchModel = {
  async search(searchQuery, filters = {}) {
    const { type, limit = 20 } = filters;
    
    // build the query based on filters aaplied by the user
    let queries = [];
    
    if (!type || type === 'faq') {
      queries.push(`
        SELECT 
          'faq' as type,
          id,
          title,
          content,
          ts_headline('english', content, websearch_to_tsquery('english', $1)) as highlighted_snippet,
          substring(content, 1, 200) as snippet,
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
          description as content,
          ts_headline('english', description, websearch_to_tsquery('english', $1)) as highlighted_snippet,
          substring(description, 1, 200) as snippet,
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
          content_text as content,
          ts_headline('english', content_text, websearch_to_tsquery('english', $1)) as highlighted_snippet,
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

  // search suggestion
  async getSuggestions(partialQuery, limit = 5) {
    if (!partialQuery || partialQuery.length < 2) {
      return [];
    }

    const suggestionQuery = `
      SELECT DISTINCT title, 'faq' as type
      FROM faqs 
      WHERE title ILIKE '%' || $1 || '%'
      UNION ALL
      SELECT DISTINCT title, 'link' as type
      FROM web_links 
      WHERE title ILIKE '%' || $1 || '%'
      UNION ALL
      SELECT DISTINCT file_name as title, 'pdf' as type
      FROM pdfs 
      WHERE file_name ILIKE '%' || $1 || '%'
      ORDER BY length(title) ASC
      LIMIT $2
    `;

    const result = await query(suggestionQuery, [partialQuery, limit]);
    return result.rows;
  }
};
