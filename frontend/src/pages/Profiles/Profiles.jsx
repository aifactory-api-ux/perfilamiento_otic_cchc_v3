import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import useProfiles from '../../hooks/useProfiles.js';
import ProfileForm from './ProfileForm.jsx';

export default function Profiles() {
  const { profiles, loading, fetchProfiles, createProfile, updateProfile, deleteProfile } =
    useProfiles();
  const [openForm, setOpenForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleCreate = () => {
    setSelectedProfile(null);
    setOpenForm(true);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setOpenForm(true);
  };

  const handleSubmit = async (payload) => {
    if (selectedProfile) {
      await updateProfile(selectedProfile.id, payload);
    } else {
      await createProfile(payload);
    }
    setOpenForm(false);
  };

  const handleDelete = async (profileId) => {
    await deleteProfile(profileId);
  };

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Perfiles</Typography>
        <Button variant="contained" onClick={handleCreate}>
          Nuevo perfil
        </Button>
      </Stack>
      <Card>
        <CardContent>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{(profile.skills ?? []).slice(0, 3).join(', ')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/profiles/${profile.id}`)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(profile)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(profile.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ProfileForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialValues={selectedProfile}
      />
    </Box>
  );
}
