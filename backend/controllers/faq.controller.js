import { FaqModel } from '../models/faq.model.js';

export const FaqController = {
  // GET /api/faqs
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await FaqModel.getAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  },

  // GET /api/faqs/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const faq = await FaqModel.getById(id);
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }
      
      res.json(faq);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      res.status(500).json({ error: 'Failed to fetch FAQ' });
    }
  },

  // POST /api/faqs
  async create(req, res) {
    try {
      const { title, content, tags } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      const faq = await FaqModel.create({ title, content, tags });
      res.status(201).json(faq);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      res.status(500).json({ error: 'Failed to create FAQ' });
    }
  },

  // PUT /api/faqs/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      
      const faq = await FaqModel.update(id, { title, content, tags });
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }
      
      res.json(faq);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({ error: 'Failed to update FAQ' });
    }
  },

  // DELETE /api/faqs/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const faq = await FaqModel.delete(id);
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }
      
      res.json({ message: 'FAQ deleted successfully', id: faq.id });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  },
};
