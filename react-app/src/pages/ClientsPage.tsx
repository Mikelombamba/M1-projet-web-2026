import { Table, Typography, Button, Modal, Form, Input, message, Space, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ClientModel } from '../models/ClientModel';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ClientsPage = () => {
  // --- ÉTATS (STATES) ---
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientModel | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // --- LOGIQUE BACKEND ---
  
  // Charger les clients
  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:3000/clients');
      setClients(res.data);
    } catch (error) {
      message.error('Impossible de charger les clients');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Supprimer un client
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/clients/${id}`);
      message.success('Client supprimé');
      fetchClients();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  // Sauvegarder (Créer ou Modifier)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClient) {
        // Mode ÉDITION
        await axios.patch(`http://localhost:3000/clients/${editingClient.id}`, values);
        message.success('Client mis à jour !');
      } else {
        // Mode CRÉATION
        await axios.post('http://localhost:3000/clients', values);
        message.success('Client créé !');
      }

      closeModal();
      fetchClients();
    } catch (error) {
      message.error("Erreur lors de l'enregistrement");
    }
  };

  // --- GESTION DE LA MODAL ---
  const openCreateModal = () => {
    setEditingClient(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: ClientModel) => {
    setEditingClient(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    form.resetFields();
  };

  // --- FILTRE DE RECHERCHE ---
  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* EN-TÊTE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Gestion des Clients</Title>
          <Text type="secondary">Consultez, ajoutez ou modifiez les membres de la bibliothèque</Text>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={openCreateModal}
        >
          Ajouter un client
        </Button>
      </div>

      {/* BARRE DE RECHERCHE */}
      <Input.Search 
        placeholder="Rechercher par nom, prénom ou email..." 
        allowClear
        enterButton
        size="large"
        style={{ marginBottom: '20px', maxWidth: '500px' }}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* TABLEAU */}
      <Table 
        dataSource={filteredClients} 
        rowKey="id" 
        pagination={{ pageSize: 8 }}
        columns={[
          {
            title: 'Client',
            key: 'client_info',
            render: (_, record) => (
              <Space>
                <Avatar 
                  src={record.photoUrl} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {record.firstName[0]}
                </Avatar>
                <Text strong>{record.firstName} {record.lastName}</Text>
              </Space>
            ),
          },
          { 
            title: 'Email', 
            dataIndex: 'email', 
            key: 'email',
            render: (email) => email || <Text type="secondary">Non renseigné</Text>
          },
          {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
              <Space>
                <Button 
                  type="link" 
                  icon={<EditOutlined />} 
                  onClick={() => openEditModal(record)}
                >
                  Modifier
                </Button>
                <Button 
                  danger 
                  type="text" 
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                >
                  Supprimer
                </Button>
              </Space>
            ),
          },
        ]} 
      />

      {/* MODAL UNIQUE (CREATE/EDIT) */}
      <Modal 
        title={editingClient ? "Modifier les informations" : "Nouveau Client"} 
        open={isModalOpen} 
        onOk={handleSave} 
        onCancel={closeModal}
        okText={editingClient ? "Enregistrer les modifications" : "Créer le client"}
        cancelText="Annuler"
        destroyOnClose // Vide la modal proprement à la fermeture
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item 
              name="firstName" 
              label="Prénom" 
              rules={[{ required: true, message: 'Le prénom est obligatoire' }]}
            >
              <Input placeholder="Jean" />
            </Form.Item>
            <Form.Item 
              name="lastName" 
              label="Nom" 
              rules={[{ required: true, message: 'Le nom est obligatoire' }]}
            >
              <Input placeholder="Dupont" />
            </Form.Item>
          </Space>

          <Form.Item 
            name="email" 
            label="Adresse Email"
            rules={[{ type: 'email', message: 'Format email invalide' }]}
          >
            <Input placeholder="jean.dupont@exemple.com" />
          </Form.Item>

          <Form.Item name="photoUrl" label="URL de la photo (optionnel)">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};