import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import api from '../api/axios';
import logo from '../assets/logo.png';

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('Todos los campos son obligatorios');
    }

    if (newPassword.length < 8) {
      return setError('La nueva contraseña debe tener al menos 8 caracteres');
    }

    if (newPassword !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    try {
      await api.patch('/auth/change-password', {
        currentPassword,
        newPassword
      });

      setSuccess('Contraseña actualizada correctamente. Inicie sesión nuevamente.');

      // 🔒 cerrar sesión forzada
      setTimeout(() => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fa'
      }}
    >
      <Box
        sx={{
          width: 380,
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <img
          src={logo}
          alt="Consorcio Alianza Catenare Care"
          style={{ maxWidth: 160, marginBottom: 16 }}
        />
        <Typography variant="h6" align="center" gutterBottom>
          Cambio obligatorio de contraseña
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Por seguridad, debe cambiar su contraseña antes de continuar.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          fullWidth
          label="Contraseña actual / temporal"
          type="password"
          margin="normal"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />

        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          margin="normal"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        <TextField
          fullWidth
          label="Confirmar nueva contraseña"
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Cambiar contraseña
        </Button>
      </Box>
    </Box>
  );
}