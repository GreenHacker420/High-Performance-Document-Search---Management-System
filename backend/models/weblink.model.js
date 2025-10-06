import { query } from '../config/db.js';

export const WebLinkModel = {
  // Get all web links with pagination
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT id, url, title, description, created_at, updated_at 
       FROM web_links 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM web_links');
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get web link by ID
  async getById(id) {
    const result = await query(
      'SELECT id, url, title, description, content_text, created_at, updated_at FROM web_links WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Create new web link
  async create(linkData) {
    const { url, title, description, content_text } = linkData;
    const result = await query(
      `INSERT INTO web_links (url, title, description, content_text) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, url, title, description, created_at, updated_at`,
      [url, title, description, content_text]
    );
    return result.rows[0];
  },

  // Update web link
  async update(id, linkData) {
    const { url, title, description, content_text } = linkData;
    const result = await query(
      `UPDATE web_links 
       SET url = COALESCE($1, url), 
           title = COALESCE($2, title), 
           description = COALESCE($3, description),
           content_text = COALESCE($4, content_text)
       WHERE id = $5 
       RETURNING id, url, title, description, created_at, updated_at`,
      [url, title, description, content_text, id]
    );
    return result.rows[0];
  },

  // Delete web link
  async delete(id) {
    const result = await query(
      'DELETE FROM web_links WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};
