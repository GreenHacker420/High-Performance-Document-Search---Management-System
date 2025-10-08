import React from 'react';
import { Card, List, Empty, Spin, Space, Tag, Button, Typography, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  LinkOutlined, 
  FilePdfOutlined,
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { pdfAPI } from '../services/api';

const { Text } = Typography;

const getTypeIcon = (type) => {
  switch (type) {
    case 'faq': return <FileTextOutlined style={{ color: '#52c41a' }} />;
    case 'link': return <LinkOutlined style={{ color: '#1890ff' }} />;
    case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    default: return <FileTextOutlined />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'faq': return 'green';
    case 'link': return 'blue';
    case 'pdf': return 'red';
    default: return 'default';
  }
};

const SearchResults = ({ 
  hasSearched, 
  filteredResults, 
  instantFilter, 
  loading, 
  onViewPDF, 
  onDownloadPDF 
}) => {
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
          onClick={() => onViewPDF(item.id, item.title)}
        >
          View
        </Button>,
        <Button 
          type="link" 
          icon={<DownloadOutlined />}
          onClick={() => onDownloadPDF(item.id, item.title)}
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
    <Card 
      title={
        hasSearched && (
          <Space>
            <SearchOutlined />
            <span>
              Search Results 
              {filteredResults.length > 0 && ` (${filteredResults.length} found)`}
              {instantFilter && ` - filtered by "${instantFilter}"`}
            </span>
          </Space>
        )
      } 
      style={{ borderRadius: '12px' }}
    >
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
  );
};

export default SearchResults;
