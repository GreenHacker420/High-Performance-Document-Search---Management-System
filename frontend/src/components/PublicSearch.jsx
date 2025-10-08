import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, 
  Input, 
  Card, 
  List, 
  Tag, 
  Button, 
  Select, 
  Empty, 
  Spin, 
  Typography,
  Space,
  message,
  AutoComplete,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  LinkOutlined, 
  FilePdfOutlined,
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { searchAPI, pdfAPI } from '../services/api';
import PDFViewer from './PDFViewer';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const PublicSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ visible: false, pdfId: null, fileName: '' });
  const [instantFilter, setInstantFilter] = useState('');

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoadingSuggestions(true);
      try {
        const response = await searchAPI.getSuggestions(query);
        const suggestionOptions = response.data.suggestions.map(item => ({
          value: item.title,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.title}</span>
              <Tag size="small" color={getTypeColor(item.type)}>{item.type.toUpperCase()}</Tag>
            </div>
          )
        }));
        setSuggestions(suggestionOptions);
      } catch (error) {
        console.error('Suggestions error:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  const handleSearch = async (value) => {
    if (!value.trim()) {
      message.warning('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await searchAPI.search(value, typeFilter);
      const results = response.data.results || [];
      setSearchResults(results);
      setFilteredResults(results);
      
      if (response.data.cached) {
        message.success('Results loaded from cache', 1);
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Search failed. Please try again.');
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Instant filtering
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

  // Handle search input change for suggestions
  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    debouncedGetSuggestions(value);
  };

  // Debounce utility function
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'faq':
        return <FileTextOutlined style={{ color: '#52c41a' }} />;
      case 'link':
        return <LinkOutlined style={{ color: '#1890ff' }} />;
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'faq':
        return 'green';
      case 'link':
        return 'blue';
      case 'pdf':
        return 'red';
      default:
        return 'default';
    }
  };

  const renderResultItem = (item) => {
    const actions = [];
    
    if (item.type === 'link' && item.url) {
      actions.push(
        <Button 
          type="link" 
          icon={<LinkOutlined />}
          onClick={() => window.open(item.url, '_blank')}
        >
          Visit
        </Button>
      );
    }
    
    if (item.type === 'pdf') {
      actions.push(
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewPDF(item.id, item.title)}
        >
          View
        </Button>,
        <Button 
          type="link" 
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadPDF(item.id, item.title)}
        >
          Download
        </Button>
      );
    }

    return (
      <List.Item actions={actions}>
        <List.Item.Meta
          avatar={getTypeIcon(item.type)}
          title={
            <Space>
              <span>{item.title}</span>
              <Tag color={getTypeColor(item.type)}>{item.type.toUpperCase()}</Tag>
            </Space>
          }
          description={
            <div>
              <div 
                style={{ marginBottom: '8px' }}
                dangerouslySetInnerHTML={{ 
                  __html: item.highlighted_snippet || item.snippet 
                }}
              />
              <Space size="small">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <ClockCircleOutlined style={{ marginRight: '4px' }} />
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
                {item.rank && (
                  <Tooltip title="Search relevance score">
                    <Tag size="small" color="blue">
                      Score: {(item.rank * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                )}
              </Space>
            </div>
          }
        />
      </List.Item>
    );
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
              Search across FAQs, Web Links, and PDFs instantly
            </Text>
          </div>

          {/* Search Interface */}
          <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
            <div className="search-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Select
                placeholder="All Types"
                style={{ width: '100%', maxWidth: '200px' }}
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                size="large"
              >
                <Option value="">All Types</Option>
                <Option value="faq">FAQs</Option>
                <Option value="link">Links</Option>
                <Option value="pdf">PDFs</Option>
              </Select>
              
              <AutoComplete
                options={suggestions}
                onSearch={handleSearchInputChange}
                onSelect={(value) => {
                  setSearchQuery(value);
                  handleSearch(value);
                }}
                value={searchQuery}
                style={{ width: '100%' }}
              >
                <Input.Search
                  placeholder="Enter your search query..."
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: '80px' }}>
                      <span className="search-btn-text">Search</span>
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  loading={loading || loadingSuggestions}
                />
              </AutoComplete>
              
              {/* Instant Filter */}
              {searchResults.length > 0 && (
                <Input
                  placeholder="Filter results instantly..."
                  prefix={<SearchOutlined />}
                  value={instantFilter}
                  onChange={(e) => handleInstantFilter(e.target.value)}
                  style={{ width: '100%' }}
                  allowClear
                />
              )}
            </div>
          </Card>

          {/* Results */}
          <Card title={
            hasSearched && (
              <Space>
                <SearchOutlined />
                <span style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Search Results 
                  {filteredResults.length > 0 && ` (${filteredResults.length} found)`}
                  {instantFilter && ` - filtered by "${instantFilter}"`}
                </span>
              </Space>
            )
          } style={{ borderRadius: '12px' }}>
            <Spin spinning={loading}>
              {!hasSearched ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Enter a search query to get started"
                  style={{ padding: '60px 0' }}
                />
              ) : filteredResults.length === 0 ? (
                <Empty
                  description={instantFilter ? `No results match "${instantFilter}"` : "No results found"}
                  style={{ padding: '60px 0' }}
                />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={filteredResults}
                  renderItem={renderResultItem}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} results`,
                  }}
                />
              )}
            </Spin>
          </Card>
        </div>
        
        {/* PDF Viewer Modal */}
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
