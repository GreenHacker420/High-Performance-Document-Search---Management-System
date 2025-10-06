import { WebLinkModel } from '../models/weblink.model.js';
import { scrapeWebPage } from '../utils/webScraper.js';

export const WebLinkController = {
  // GET /api/links
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await WebLinkModel.getAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching web links:', error);
      res.status(500).json({ error: 'Failed to fetch web links' });
    }
  },

  // GET /api/links/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const link = await WebLinkModel.getById(id);
      
      if (!link) {
        return res.status(404).json({ error: 'Web link not found' });
      }
      
      res.json(link);
    } catch (error) {
      console.error('Error fetching web link:', error);
      res.status(500).json({ error: 'Failed to fetch web link' });
    }
  },

  // POST /api/links
  async create(req, res) {
    try {
      const { url, title, description, autoScrape = true } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      let linkData = { url, title, description };
      
      // Auto-scrape if enabled and title/description not provided
      if (autoScrape && (!title || !description)) {
        try {
          const scrapedData = await scrapeWebPage(url);
          linkData = {
            url,
            title: title || scrapedData.title,
            description: description || scrapedData.description,
            content_text: scrapedData.content_text,
          };
        } catch (scrapeError) {
          console.error('Scraping failed, using provided data:', scrapeError);
        }
      }
      
      const link = await WebLinkModel.create(linkData);
      res.status(201).json(link);
    } catch (error) {
      console.error('Error creating web link:', error);
      
      if (error.message.includes('duplicate key')) {
        return res.status(409).json({ error: 'URL already exists' });
      }
      
      res.status(500).json({ error: 'Failed to create web link' });
    }
  },

  // PUT /api/links/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { url, title, description } = req.body;
      
      const link = await WebLinkModel.update(id, { url, title, description });
      
      if (!link) {
        return res.status(404).json({ error: 'Web link not found' });
      }
      
      res.json(link);
    } catch (error) {
      console.error('Error updating web link:', error);
      res.status(500).json({ error: 'Failed to update web link' });
    }
  },

  // DELETE /api/links/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const link = await WebLinkModel.delete(id);
      
      if (!link) {
        return res.status(404).json({ error: 'Web link not found' });
      }
      
      res.json({ message: 'Web link deleted successfully', id: link.id });
    } catch (error) {
      console.error('Error deleting web link:', error);
      res.status(500).json({ error: 'Failed to delete web link' });
    }
  },
};
