import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import authService from '../../services/auth.service.js';

export default function Layout() {
  const handleLogout = () => authService.logout();
  const showUsers = authService.hasRole(['admin']);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F2EA 0%, #E6F0EC 100%)',
      }}
    >
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Perfilamiento OTIC CCHC
          </Typography>
          <Button
            color="inherit"
            component={NavLink}
            to="/"
            sx={{ textTransform: 'none' }}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            component={NavLink}
            to="/profiles"
            sx={{ textTransform: 'none' }}
          >
            Perfiles
          </Button>
          {showUsers ? (
            <Button
              color="inherit"
              component={NavLink}
              to="/users"
              sx={{ textTransform: 'none' }}
            >
              Usuarios
            </Button>
          ) : null}
          <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
