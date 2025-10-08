import { SearchModel } from '../models/search.model.js';
import { getCachedSearch, setCachedSearch, getCachedSuggestions, setCachedSuggestions } from '../services/cache.service.js';

export const SearchController = {
  // GET /api/search?q=query&type=faq|link|pdf&limit=20
  async search(req, res) {
    try {
      const { q: searchQuery, type, limit } = req.query;
      
      if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const searchLimit = parseInt(limit) || 20;
      
      // try to get cached results first, if not then we will search from the db
      const cachedResults = await getCachedSearch(searchQuery, type || '', searchLimit);
      if (cachedResults) {
        return res.json({
          query: searchQuery,
          count: cachedResults.length,
          results: cachedResults,
          cached: true
        });
      }
      
      // If not cached -> perform search
      const results = await SearchModel.search(searchQuery, {
        type,
        limit: searchLimit,
      });
      
      // Cache the results
      await setCachedSearch(searchQuery, type || '', searchLimit, results);
      
      res.json({
        query: searchQuery,
        count: results.length,
        results,
        cached: false
      });
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  },

  // GET /api/search/suggestions?q=partial_query
  async getSuggestions(req, res) {
    try {
      const { q: partialQuery } = req.query;
      
      if (!partialQuery || partialQuery.length < 2) {
        return res.json({ suggestions: [] });
      }
      
      // try to get cached results first, if not then we will search from the db
      const cachedSuggestions = await getCachedSuggestions(partialQuery);
      if (cachedSuggestions) {
        return res.json({
          suggestions: cachedSuggestions,
          cached: true
        });
      }
      
      // If not cached -> get suggestions
      const suggestions = await SearchModel.getSuggestions(partialQuery);
      
      // Cache the suggestions
      await setCachedSuggestions(partialQuery, suggestions);
      
      res.json({
        suggestions,
        cached: false
      });
    } catch (error) {
      console.error('Error getting suggestions:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  }
};
