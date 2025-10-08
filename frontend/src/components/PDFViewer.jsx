import React, { useState } from 'react';
import { Modal, Button, Spin, message } from 'antd';
import { EyeOutlined, CloseOutlined } from '@ant-design/icons';
import { pdfAPI } from '../services/api';

const PDFViewer = ({ pdfId, fileName, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const loadPDF = async () => {
    if (!pdfId || pdfUrl) return;
    
    setLoading(true);
    try {
      const response = await pdfAPI.download(pdfId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading PDF:', error);
      message.error('Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    if (visible && !pdfUrl) {
      loadPDF();
    }
  };

  const handleModalClose = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      handleModalOpen();
    }
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [visible]);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOutlined />
          <span>{fileName}</span>
        </div>
      }
      open={visible}
      onCancel={handleModalClose}
      width="90%"
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={handleModalClose}>
          Close
        </Button>
      ]}
    >
      <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <Spin size="large" tip="Loading PDF..." />
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px'
            }}
            title={fileName}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            <p>Unable to load PDF preview</p>
            <Button type="primary" onClick={loadPDF}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PDFViewer;
