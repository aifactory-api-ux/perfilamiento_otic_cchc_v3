import { useCallback, useState } from 'react';
import api from '../services/api.service.js';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (payload) => {
    const response = await api.post('/users', payload);
    await fetchUsers();
    return response.data.data;
  };

  const updateUser = async (id, payload) => {
    const response = await api.patch(`/users/${id}`, payload);
    await fetchUsers();
    return response.data.data;
  };

  const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    await fetchUsers();
    return response.data.data;
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
