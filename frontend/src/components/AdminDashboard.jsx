import React, { useState } from 'react';
import { Layout, Tabs, Typography } from 'antd';
import { 
  FileTextOutlined, 
  LinkOutlined, 
  FilePdfOutlined,
  DashboardOutlined 
} from '@ant-design/icons';
import FAQManagement from './admin/FAQManagement';
import LinkManagement from './admin/LinkManagement';
import PDFManagement from './admin/PDFManagement';

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('faqs');

  const tabItems = [
    {
      key: 'faqs',
      label: (
        <span>
          <FileTextOutlined />
          FAQs
        </span>
      ),
      children: <FAQManagement />,
    },
    {
      key: 'links',
      label: (
        <span>
          <LinkOutlined />
          Web Links
        </span>
      ),
      children: <LinkManagement />,
    },
    {
      key: 'pdfs',
      label: (
        <span>
          <FilePdfOutlined />
          PDFs
        </span>
      ),
      children: <PDFManagement />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <DashboardOutlined /> Admin Dashboard
            </Title>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>
              Manage FAQs, Web Links, and PDFs with full CRUD operations
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
