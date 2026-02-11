import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import authService from '../../services/auth.service.js';

export default function Login() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, maxWidth: 420, textAlign: 'center' }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Acceso al sistema
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Inicia sesion con tu cuenta institucional para continuar.
        </Typography>
        <Button variant="contained" onClick={() => authService.login()}>
          Ingresar con Keycloak
        </Button>
      </Paper>
    </Box>
  );
}
