import React, { useState } from 'react';
import { Layout, Typography, message } from 'antd';
import { useSearch } from '../hooks/useSearch';
import SearchInterface from './SearchInterface';
import SearchResults from './SearchResults';
import PDFViewer from './PDFViewer';
import { pdfAPI } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;

const PublicSearch = () => {
  const [pdfViewer, setPdfViewer] = useState({ visible: false, pdfId: null, fileName: '' });
  
  const {
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
  } = useSearch();

  const handleDownloadPDF = async (id, fileName) => {
    try {
      const response = await pdfAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Download failed. Please try again.');
    }
  };

  const handleViewPDF = (id, fileName) => {
    setPdfViewer({ visible: true, pdfId: id, fileName });
  };

  const handleClosePDFViewer = () => {
    setPdfViewer({ visible: false, pdfId: null, fileName: '' });
  };

  const handleSuggestionSelect = (value) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={1} style={{ color: '#1890ff', marginBottom: '8px', fontSize: 'clamp(24px, 5vw, 36px)' }}>
              🔍 Document Search
            </Title>
            <Text type="secondary" style={{ fontSize: 'clamp(14px, 3vw, 16px)', display: 'block', padding: '0 16px' }}>
              Live search across FAQs, Web Links, and PDFs - results appear as you type!
            </Text>
          </div>

          <SearchInterface
            typeFilter={typeFilter}
            onTypeFilterChange={handleTypeFilterChange}
            searchQuery={searchQuery}
            onSearchInputChange={handleSearchInputChange}
            onSearch={handleSearch}
            suggestions={suggestions}
            loading={loading}
            searchResults={searchResults}
            instantFilter={instantFilter}
            onInstantFilter={handleInstantFilter}
          />

          <SearchResults
            hasSearched={hasSearched}
            filteredResults={filteredResults}
            instantFilter={instantFilter}
            loading={loading}
            onViewPDF={handleViewPDF}
            onDownloadPDF={handleDownloadPDF}
          />
        </div>
        
        <PDFViewer
          pdfId={pdfViewer.pdfId}
          fileName={pdfViewer.fileName}
          visible={pdfViewer.visible}
          onClose={handleClosePDFViewer}
        />
      </Content>
    </Layout>
  );
};

export default PublicSearch;
