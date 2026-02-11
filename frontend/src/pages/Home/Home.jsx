import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import authService from '../../services/auth.service.js';

export default function Home() {
  const profile = authService.getProfile();

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Typography variant="h4">Bienvenido</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Resumen de sesion</Typography>
          <Typography variant="body2">
            Usuario: {profile?.username ?? 'N/D'}
          </Typography>
          <Typography variant="body2">
            Roles: {(profile?.roles ?? []).join(', ') || 'Sin roles'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
