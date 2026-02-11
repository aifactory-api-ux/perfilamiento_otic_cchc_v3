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
  email: '',
  name: '',
  roles: '',
};

export default function UserForm({ open, onClose, onSubmit, initialValues }) {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        email: initialValues.email ?? '',
        name: initialValues.name ?? '',
        roles: (initialValues.roles ?? []).join(', '),
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues, open]);

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    const roles = values.roles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);
    onSubmit({ email: values.email, name: values.name, roles });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
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
          label="Roles (separados por coma)"
          name="roles"
          value={values.roles}
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
