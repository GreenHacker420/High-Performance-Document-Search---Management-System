import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import AdminDashboard from './components/AdminDashboard';
import PublicSearch from './components/PublicSearch';
import Navigation from './components/Navigation';
import './App.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <Router>
          <div className="app">
            <Navigation />
            <div className="app-content">
              <Routes>
                <Route path="/" element={<Navigate to="/search" replace />} />
                <Route path="/search" element={<PublicSearch />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;