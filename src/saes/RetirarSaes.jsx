import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Box
} from '@mui/material';

export default function RetirarSaes({ saesId, open, onClose, onSuccess }) {
  const user = JSON.parse(localStorage.getItem('user'));

  const [saes, setSaes] = useState(null);
  const [aas, setAas] = useState([]);
  const [aaRetiro, setAaRetiro] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
useEffect(() => {
  if (open) {
    setSaes(null);
    setAaRetiro('');
    setErrorMsg('');
  }
}, [saesId, open]);
useEffect(() => {
  if (!saesId || !open) return;

  api.get(`/saes/${saesId}`).then(res => {
    setSaes(res.data);
    setNumeroOrden(res.data.numero_orden_instalacion);
  });

  api.get('/usuarios/aa').then(res => setAas(res.data));
}, [saesId, open]);

const handleConfirm = async () => {
  setErrorMsg('');

  if (!aaRetiro || !numeroOrden) {
    setErrorMsg('Debe indicar el AA y el número de orden');
    return;
  }

  try {
    await api.put(`/saes/${saesId}/retirar`, {
      tecnico_retiro_id: user.id,
      aa_retiro_id: aaRetiro,
      numero_orden: numeroOrden
    });
    onSuccess();
  } catch (err) {
    setErrorMsg(err.response?.data?.error || 'Error al retirar SAES');
  }
};

  if (!saes) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Retiro de SAES</DialogTitle>

      <DialogContent dividers>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Typography fontWeight="bold">Información del SAES</Typography>
        <TextField label="Número SAES" value={saes.numero_saes} disabled fullWidth sx={{ mt: 1 }} />
        <TextField label="Campo" value={saes.campo} disabled fullWidth sx={{ mt: 1 }} />
        <TextField label="Equipo" value={saes.equipo} disabled fullWidth sx={{ mt: 1 }} />
        <Box sx={{ mt: 3 }}>
          <Typography fontWeight="bold">Datos del retiro</Typography>
          <TextField
            label="Técnico que retira"
            value={user.nombre}
            disabled
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Número de Orden / Aviso (retiro)"
            value={numeroOrden}
            onChange={e => setNumeroOrden(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            select
            label="AA que autoriza el retiro"
            value={aaRetiro}
            onChange={e => setAaRetiro(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Seleccione un AA</MenuItem>
            {aas.map(aa => (
              <MenuItem key={aa.id} value={aa.id}>
                {aa.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>

        <Button color="error" variant="contained" onClick={handleConfirm}>
          Confirmar retiro
        </Button>
      </DialogActions>
    </Dialog>
  );
}
