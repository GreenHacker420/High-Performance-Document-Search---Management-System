import { query } from '../config/db.js';

export const PdfModel = {
  // Get all PDFs with pagination
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT id, file_name, file_path, file_size, uploaded_at 
       FROM pdfs 
       ORDER BY uploaded_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM pdfs');
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

  // Get PDF by ID
  async getById(id) {
    const result = await query(
      'SELECT id, file_name, file_path, content_text, file_size, uploaded_at FROM pdfs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Create new PDF record
  async create(pdfData) {
    const { file_name, file_path, content_text, file_size } = pdfData;
    const result = await query(
      `INSERT INTO pdfs (file_name, file_path, content_text, file_size) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, file_name, file_path, file_size, uploaded_at`,
      [file_name, file_path, content_text, file_size]
    );
    return result.rows[0];
  },

  // Delete PDF
  async delete(id) {
    const result = await query(
      'DELETE FROM pdfs WHERE id = $1 RETURNING id, file_path',
      [id]
    );
    return result.rows[0];
  },
};
