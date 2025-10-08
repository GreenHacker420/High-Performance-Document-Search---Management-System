import { query } from '../config/db.js';

export const SearchModel = {
  async search(searchQuery, filters = {}) {
    const { type, limit = 20 } = filters;
    
    // build the query based on filters applied by the user
    let queries = [];
    
    if (!type || type === 'faq') {
      queries.push(`
        SELECT 
          'faq' as type,
          id,
          title,
          content,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_headline('english', content, websearch_to_tsquery('english', $1))
            ELSE
              ts_headline('english', content, plainto_tsquery('english', $1 || ':*'))
          END as highlighted_snippet,
          substring(content, 1, 200) as snippet,
          NULL as url,
          NULL as file_path,
          created_at,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_rank(search_vector, websearch_to_tsquery('english', $1))
            WHEN search_vector @@ plainto_tsquery('english', $1 || ':*') THEN
              ts_rank(search_vector, plainto_tsquery('english', $1 || ':*')) * 0.8
            ELSE
              CASE 
                WHEN LOWER(title) LIKE LOWER('%' || $1 || '%') THEN 0.6
                WHEN LOWER(content) LIKE LOWER('%' || $1 || '%') THEN 0.4
                ELSE 0.2
              END
          END as rank
        FROM faqs
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
           OR search_vector @@ plainto_tsquery('english', $1 || ':*')
           OR LOWER(title) LIKE LOWER('%' || $1 || '%')
           OR LOWER(content) LIKE LOWER('%' || $1 || '%')
      `);
    }
    
    if (!type || type === 'link') {
      queries.push(`
        SELECT 
          'link' as type,
          id,
          title,
          description as content,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_headline('english', description, websearch_to_tsquery('english', $1))
            ELSE
              ts_headline('english', description, plainto_tsquery('english', $1 || ':*'))
          END as highlighted_snippet,
          substring(description, 1, 200) as snippet,
          url,
          NULL as file_path,
          created_at,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_rank(search_vector, websearch_to_tsquery('english', $1))
            WHEN search_vector @@ plainto_tsquery('english', $1 || ':*') THEN
              ts_rank(search_vector, plainto_tsquery('english', $1 || ':*')) * 0.8
            ELSE
              CASE 
                WHEN LOWER(title) LIKE LOWER('%' || $1 || '%') THEN 0.6
                WHEN LOWER(description) LIKE LOWER('%' || $1 || '%') THEN 0.4
                ELSE 0.2
              END
          END as rank
        FROM web_links
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
           OR search_vector @@ plainto_tsquery('english', $1 || ':*')
           OR LOWER(title) LIKE LOWER('%' || $1 || '%')
           OR LOWER(description) LIKE LOWER('%' || $1 || '%')
      `);
    }
    
    if (!type || type === 'pdf') {
      queries.push(`
        SELECT 
          'pdf' as type,
          id,
          file_name as title,
          content_text as content,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_headline('english', content_text, websearch_to_tsquery('english', $1))
            ELSE
              ts_headline('english', content_text, plainto_tsquery('english', $1 || ':*'))
          END as highlighted_snippet,
          substring(content_text, 1, 200) as snippet,
          NULL as url,
          file_path,
          uploaded_at as created_at,
          CASE 
            WHEN search_vector @@ websearch_to_tsquery('english', $1) THEN
              ts_rank(search_vector, websearch_to_tsquery('english', $1))
            WHEN search_vector @@ plainto_tsquery('english', $1 || ':*') THEN
              ts_rank(search_vector, plainto_tsquery('english', $1 || ':*')) * 0.8
            ELSE
              CASE 
                WHEN LOWER(file_name) LIKE LOWER('%' || $1 || '%') THEN 0.6
                WHEN LOWER(content_text) LIKE LOWER('%' || $1 || '%') THEN 0.4
                ELSE 0.2
              END
          END as rank
        FROM pdfs
        WHERE search_vector @@ websearch_to_tsquery('english', $1)
           OR search_vector @@ plainto_tsquery('english', $1 || ':*')
           OR LOWER(file_name) LIKE LOWER('%' || $1 || '%')
           OR LOWER(content_text) LIKE LOWER('%' || $1 || '%')
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

  //search suggestions
  async getSuggestions(partialQuery, limit = 5) {
    if (!partialQuery || partialQuery.length < 2) {
      return [];
    }

    try {
      // start with FAQs only to avoid table issues
      const suggestionQuery = `
        SELECT title, 'faq' as type
        FROM faqs 
        WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')
        ORDER BY length(title) ASC
        LIMIT $2
      `;

      const result = await query(suggestionQuery, [partialQuery, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
};
