import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      localStorage.clear();

      const res = await api.post('/auth/login', {
        username,
        password
      });

      const { token, usuario } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      // 🔐 FORZAR CAMBIO DE PASSWORD
      if (usuario.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }

      if (typeof onLogin === 'function') {
        onLogin();
      }

    } catch (e) {
      setError('Credenciales inválidas');
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

        <Typography variant="h6">Sistema de Gestión de SAES</Typography>
        <Typography variant="body2" color="text.secondary">
          Control y trazabilidad de aislamientos seguros
        </Typography>

        <TextField
          fullWidth
          label="Usuario"
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Box>
    </Box>
  );
}