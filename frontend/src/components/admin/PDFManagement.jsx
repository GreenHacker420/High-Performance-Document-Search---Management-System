import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Upload,
  Space,
  message,
  Popconfirm,
  Typography,
  Card,
  Progress,
  Modal,
  Tooltip,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { pdfAPI } from '../../services/api';

const { Dragger } = Upload;
const { Title } = Typography;

const PDFManagement = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchPDFs();
  }, [pagination.current, pagination.pageSize]);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const response = await pdfAPI.getAll(pagination.current, pagination.pageSize);
      setPdfs(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      message.error('Failed to fetch PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await pdfAPI.upload(formData);
      message.success('PDF uploaded and processed successfully');
      setUploadModalVisible(false);
      fetchPDFs();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      message.error('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pdfAPI.delete(id);
      message.success('PDF deleted successfully');
      fetchPDFs();
    } catch (error) {
      console.error('Error deleting PDF:', error);
      message.error('Failed to delete PDF');
    }
  };

  const handleDownload = async (id, fileName) => {
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

  const handleTableChange = (paginationInfo) => {
    setPagination({
      ...pagination,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('You can only upload PDF files!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      
      handleUpload(file);
      return false; // Prevent default upload
    },
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      width: '40%',
      ellipsis: true,
      render: (fileName) => (
        <Space>
          <FilePdfOutlined style={{ color: '#ff4d4f' }} />
          <Tooltip title={fileName}>
            {fileName}
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'File Size',
      dataIndex: 'file_size',
      key: 'file_size',
      width: '15%',
      className: 'mobile-hide',
      responsive: ['md'],
      render: (size) => formatFileSize(size),
    },
    {
      title: 'Content Preview',
      key: 'content_preview',
      width: '30%',
      ellipsis: true,
      className: 'mobile-hide',
      responsive: ['lg'],
      render: (_, record) => {
        // This would show extracted text preview if available
        return (
          <div style={{ maxWidth: '250px', color: '#666' }}>
            Text extracted and indexed for search
          </div>
        );
      },
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      width: '10%',
      className: 'mobile-hide',
      responsive: ['lg'],
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id, record.file_name)}
            title="Download"
          />
          <Popconfirm
            title="Are you sure you want to delete this PDF?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            PDF Management
          </Title>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
          >
            Upload PDF
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={pdfs}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="Upload PDF"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          <Dragger {...uploadProps} disabled={uploading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag PDF file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for single PDF file upload. Maximum file size: 10MB.
              Text will be automatically extracted and indexed for search.
            </p>
          </Dragger>
          
          {uploading && (
            <div style={{ marginTop: '16px' }}>
              <Progress percent={100} status="active" />
              <p style={{ textAlign: 'center', marginTop: '8px' }}>
                Uploading and processing PDF...
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PDFManagement;
