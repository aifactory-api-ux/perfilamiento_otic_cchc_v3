import React from 'react';
import { Box, Typography } from '@mui/material';
import authService from '../../services/auth.service.js';

export default function RoleGuard({ roles, children }) {
  const hasRole = authService.hasRole(roles);
  if (!hasRole) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Acceso restringido</Typography>
        <Typography variant="body2">
          No tienes permisos para ver esta seccion.
        </Typography>
      </Box>
    );
  }
  return children;
}
