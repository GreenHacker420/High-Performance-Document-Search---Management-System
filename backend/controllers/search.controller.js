import { SearchModel } from '../models/search.model.js';

export const SearchController = {
  // GET /api/search?q=query&type=faq|link|pdf&limit=20
  async search(req, res) {
    try {
      const { q: searchQuery, type, limit } = req.query;
      
      if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const results = await SearchModel.search(searchQuery, {
        type,
        limit: parseInt(limit) || 20,
      });
      
      res.json({
        query: searchQuery,
        count: results.length,
        results,
      });
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  },
};
