import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Login from './components/Login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import Users from './pages/Users/Users.jsx';
import Profiles from './pages/Profiles/Profiles.jsx';
import ProfileView from './pages/Profiles/ProfileView.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import RoleGuard from './components/RoleGuard/RoleGuard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="users"
          element={
            <RoleGuard roles={['admin']}>
              <Users />
            </RoleGuard>
          }
        />
        <Route path="profiles" element={<Profiles />} />
        <Route path="profiles/:id" element={<ProfileView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
