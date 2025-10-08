import { query } from '../config/db.js';
export const FaqModel = {
  // get all FAQs with pagination
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT id, title, content, tags, created_at, updated_at 
       FROM faqs 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM faqs');
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

  // get FAQ by ID
  async getById(id) {
    const result = await query(
      'SELECT id, title, content, tags, created_at, updated_at FROM faqs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // create new FAQ
  async create(faqData) {
    const { title, content, tags = [] } = faqData;
    const result = await query(
      `INSERT INTO faqs (title, content, tags) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, content, tags, created_at, updated_at`,
      [title, content, tags]
    );
    return result.rows[0];
  },

  // update FAQ
  async update(id, faqData) {
    const { title, content, tags } = faqData;
    const result = await query(
      `UPDATE faqs 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content), 
           tags = COALESCE($3, tags)
       WHERE id = $4 
       RETURNING id, title, content, tags, created_at, updated_at`,
      [title, content, tags, id]
    );
    return result.rows[0];
  },

  // delete FAQ
  async delete(id) {
    const result = await query(
      'DELETE FROM faqs WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};
