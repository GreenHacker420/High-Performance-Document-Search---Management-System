import React, { useState, useEffect } from 'react';
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
  message
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  LinkOutlined, 
  FilePdfOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import { searchAPI, pdfAPI } from '../services/api';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const PublicSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      message.warning('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await searchAPI.search(value, typeFilter);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      message.error('Search failed. Please try again.');
      setSearchResults([]);
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
              <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                {item.snippet}
              </Paragraph>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
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
              <Search
                placeholder="Enter your search query..."
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: '80px' }}>
                    <span className="search-btn-text">Search</span>
                  </Button>
                }
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                loading={loading}
                style={{ width: '100%' }}
              />
            </div>
          </Card>

          {/* Results */}
          <Card title={
            hasSearched && (
              <Space>
                <SearchOutlined />
                <span style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Search Results 
                  {searchResults.length > 0 && ` (${searchResults.length} found)`}
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
              ) : searchResults.length === 0 ? (
                <Empty
                  description="No results found"
                  style={{ padding: '60px 0' }}
                />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={searchResults}
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
      </Content>
    </Layout>
  );
};

export default PublicSearch;
