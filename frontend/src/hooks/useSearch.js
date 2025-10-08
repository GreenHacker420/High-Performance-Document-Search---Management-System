import { useState, useCallback } from 'react';
import { message } from 'antd';
import { searchAPI } from '../services/api';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [instantFilter, setInstantFilter] = useState('');

  // search as you type
  const debouncedLiveSearch = useCallback(
    debounce(async (query, type = '') => {
      if (query.length < 2) {
        setSearchResults([]);
        setFilteredResults([]);
        setHasSearched(false);
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      setHasSearched(true);
      
      try {
        const [searchResponse, suggestionsResponse] = await Promise.all([
          searchAPI.search(query, type),
          searchAPI.getSuggestions(query)
        ]);
        
        const results = searchResponse.data.results || [];
        setSearchResults(results);
        setFilteredResults(results);
        
        const suggestionOptions = suggestionsResponse.data.suggestions.map(item => ({
          value: item.title,
          label: item.title,
          type: item.type
        }));
        setSuggestions(suggestionOptions);
        
        if (searchResponse.data.cached) {
          message.success('Results loaded from cache', 1);
        }
      } catch (error) {
        console.error('Live search error:', error);
        setSearchResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    debouncedLiveSearch(value, typeFilter);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    if (searchQuery.length >= 2) {
      debouncedLiveSearch(searchQuery, value);
    }
  };

  const handleInstantFilter = (value) => {
    setInstantFilter(value);
    if (!value.trim()) {
      setFilteredResults(searchResults);
      return;
    }
    
    const filtered = searchResults.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.snippet.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      message.warning('Please enter a search query');
      return;
    }
    debouncedLiveSearch(value, typeFilter);
  };

  return {
    searchQuery,
    searchResults,
    filteredResults,
    loading,
    typeFilter,
    hasSearched,
    suggestions,
    instantFilter,
    handleSearchInputChange,
    handleTypeFilterChange,
    handleInstantFilter,
    handleSearch,
    setSearchQuery
  };
};
