import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { resetPasswordUsuario } from './usuarios.api';

export default function ResetPasswordDialog({ userId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await resetPasswordUsuario(userId);
      setResultado(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Error al resetear password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Boolean(userId)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Resetear contraseña</DialogTitle>

      <DialogContent>
        {!resultado && (
          <Alert severity="warning">
            Esta acción generará una contraseña temporal para el usuario.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {resultado && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography>
              <strong>{resultado.message}</strong>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Password temporal:
              <strong> {resultado.passwordTemporal}</strong>
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>

        {!resultado && (
          <Button
            variant="contained"
            color="warning"
            onClick={handleReset}
            disabled={loading}
          >
            Resetear
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}