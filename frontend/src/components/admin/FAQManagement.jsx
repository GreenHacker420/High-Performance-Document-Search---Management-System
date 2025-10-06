import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Tag,
  Typography,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { faqAPI } from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFAQs();
  }, [pagination.current, pagination.pageSize]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await faqAPI.getAll(pagination.current, pagination.pageSize);
      setFaqs(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      message.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingFaq(record);
    setModalVisible(true);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      tags: record.tags || [],
    });
  };

  const handleDelete = async (id) => {
    try {
      await faqAPI.delete(id);
      message.success('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Failed to delete FAQ');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingFaq) {
        await faqAPI.update(editingFaq.id, values);
        message.success('FAQ updated successfully');
      } else {
        await faqAPI.create(values);
        message.success('FAQ created successfully');
      }
      setModalVisible(false);
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      message.error('Failed to save FAQ');
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
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      width: '40%',
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: '300px' }}>
          {text?.substring(0, 100)}
          {text?.length > 100 && '...'}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '15%',
      className: 'mobile-hide',
      responsive: ['md'],
      render: (tags) => (
        <div>
          {tags?.map((tag, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
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
            title="Are you sure you want to delete this FAQ?"
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
            FAQ Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add FAQ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={faqs}
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
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
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
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter FAQ title' }]}
          >
            <Input placeholder="Enter FAQ title" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter FAQ content' }]}
          >
            <TextArea
              rows={6}
              placeholder="Enter FAQ content"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Enter tags (press Enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FAQManagement;
