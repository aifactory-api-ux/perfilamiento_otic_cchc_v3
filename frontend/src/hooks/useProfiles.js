import { useCallback, useState } from 'react';
import api from '../services/api.service.js';

export default function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/profiles');
      setProfiles(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = async (payload) => {
    const response = await api.post('/profiles', payload);
    await fetchProfiles();
    return response.data.data;
  };

  const updateProfile = async (id, payload) => {
    const response = await api.patch(`/profiles/${id}`, payload);
    await fetchProfiles();
    return response.data.data;
  };

  const deleteProfile = async (id) => {
    const response = await api.delete(`/profiles/${id}`);
    await fetchProfiles();
    return response.data.data;
  };

  const getProfile = useCallback(async (id) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data.data;
  }, []);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
  };
}
