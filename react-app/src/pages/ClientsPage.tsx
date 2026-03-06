import { Table, Typography, Button, Modal, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ClientModel } from '../models/ClientModel';
import { PlusOutlined } from '@ant-design/icons';

export const ClientsPage = () => {
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Charger les clients
  const fetchClients = () => {
    axios.get('http://localhost:3000/clients').then((res) => {
      setClients(res.data);
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Fonction pour envoyer le nouveau client au Backend
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('http://localhost:3000/clients', values);
      message.success('Client ajouté avec succès !');
      setIsModalOpen(false);
      form.resetFields();
      fetchClients(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Typography.Title level={2}>Gestion des Clients</Typography.Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
        >
          Ajouter un client
        </Button>
      </div>

      <Table 
        dataSource={clients} 
        columns={[
          { title: 'Prénom', dataIndex: 'firstName', key: 'firstName' },
          { title: 'Nom', dataIndex: 'lastName', key: 'lastName' },
          { title: 'Email', dataIndex: 'email', key: 'email' },
        ]} 
        rowKey="id" 
      />

      <Modal 
        title="Nouveau Client" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Créer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="Prénom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};