import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Typography,
  Card,
  Switch,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { linkAPI } from '../../services/api';

const { TextArea } = Input;
const { Title } = Typography;

const LinkManagement = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLinks();
  }, [pagination.current, pagination.pageSize]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await linkAPI.getAll(pagination.current, pagination.pageSize);
      setLinks(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching links:', error);
      message.error('Failed to fetch web links');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLink(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ autoScrape: true });
  };

  const handleEdit = (record) => {
    setEditingLink(record);
    setModalVisible(true);
    form.setFieldsValue({
      url: record.url,
      title: record.title,
      description: record.description,
      autoScrape: false, // Don't auto-scrape when editing
    });
  };

  const handleDelete = async (id) => {
    try {
      await linkAPI.delete(id);
      message.success('Web link deleted successfully');
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      message.error('Failed to delete web link');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLink) {
        await linkAPI.update(editingLink.id, values);
        message.success('Web link updated successfully');
      } else {
        await linkAPI.create(values);
        message.success('Web link created successfully');
      }
      setModalVisible(false);
      fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      if (error.response?.status === 409) {
        message.error('URL already exists');
      } else {
        message.error('Failed to save web link');
      }
    }
  };

  const handleTableChange = (paginationInfo) => {
    setPagination({
      ...pagination,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: '30%',
      ellipsis: true,
      render: (url) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <LinkOutlined /> {url}
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: '250px' }}>
          {text?.substring(0, 80)}
          {text?.length > 80 && '...'}
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '10%',
      className: 'mobile-hide',
      responsive: ['lg'],
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this web link?"
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
            Web Links Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Web Link
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={links}
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
        title={editingLink ? 'Edit Web Link' : 'Add Web Link'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="url"
            label="URL"
            rules={[
              { required: true, message: 'Please enter URL' },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input 
              placeholder="https://example.com" 
              prefix={<GlobalOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
          >
            <Input placeholder="Enter title (leave empty for auto-scraping)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea
              rows={3}
              placeholder="Enter description (leave empty for auto-scraping)"
            />
          </Form.Item>

          {!editingLink && (
            <Form.Item
              name="autoScrape"
              label="Auto-scrape content"
              valuePropName="checked"
              extra="Automatically extract title and description from the webpage"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default LinkManagement;
