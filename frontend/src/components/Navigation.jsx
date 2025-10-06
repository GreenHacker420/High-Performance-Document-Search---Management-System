import React from 'react';
import { Layout, Menu } from 'antd';
import { SearchOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: 'Public Search',
    },
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Admin Dashboard',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Header style={{ padding: 0, background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px' }}>
        <div style={{ marginRight: 'auto', fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
          📚 Document Search System
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', background: 'transparent' }}
        />
      </div>
    </Header>
  );
};

export default Navigation;
