import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const defaultValues = {
  userId: '',
  name: '',
  email: '',
  skills: '',
  experienceYears: '',
  certifications: '',
};

export default function ProfileForm({ open, onClose, onSubmit, initialValues }) {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        userId: String(initialValues.userId ?? ''),
        name: initialValues.name ?? '',
        email: initialValues.email ?? '',
        skills: (initialValues.skills ?? []).join(', '),
        experienceYears: String(initialValues.experienceYears ?? 0),
        certifications: (initialValues.certifications ?? []).join(', '),
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues, open]);

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    const skills = values.skills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const certifications = values.certifications
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    onSubmit({
      userId: Number(values.userId),
      name: values.name,
      email: values.email,
      skills,
      experienceYears: Number(values.experienceYears),
      certifications,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? 'Editar perfil' : 'Nuevo perfil'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
        <TextField
          label="ID Usuario"
          name="userId"
          value={values.userId}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Nombre"
          name="name"
          value={values.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Skills (separados por coma)"
          name="skills"
          value={values.skills}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Anios de experiencia"
          name="experienceYears"
          value={values.experienceYears}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Certificaciones (separadas por coma)"
          name="certifications"
          value={values.certifications}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
