import React from 'react';
import { Card, Select, AutoComplete, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchInterface = ({
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchInputChange,
  onSearch,
  suggestions,
  loading,
  searchResults,
  instantFilter,
  onInstantFilter
}) => {
  return (
    <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Select
          placeholder="All Types"
          style={{ width: '100%', maxWidth: '200px' }}
          value={typeFilter}
          onChange={onTypeFilterChange}
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
          onSearch={onSearchInputChange}
          onSelect={(value) => onSearch(value)}
          value={searchQuery}
          style={{ width: '100%' }}
        >
          <Input.Search
            placeholder="Start typing to search instantly..."
            enterButton={
              <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: '80px' }}>
                Search
              </Button>
            }
            size="large"
            onSearch={onSearch}
            loading={loading}
          />
        </AutoComplete>
        
        {searchResults.length > 0 && (
          <Input
            placeholder="Filter results instantly..."
            prefix={<SearchOutlined />}
            value={instantFilter}
            onChange={(e) => onInstantFilter(e.target.value)}
            style={{ width: '100%' }}
            allowClear
          />
        )}
      </div>
    </Card>
  );
};

export default SearchInterface;
