import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, MenuItem, Alert
} from '@mui/material';
import { useState } from 'react';
import { crearUsuario } from './usuarios.api';

export default function UsuarioForm({ open, onClose, onSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    username: '',
    nombre: '',
    rol: '',
    password: ''
  });

  const handleSubmit = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');


      const res = await crearUsuario(form);
      setSuccessMsg(res.data.message);


      onSuccess();
      onClose();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Error al crear usuario')
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Usuario</DialogTitle>

      <DialogContent>
        {errorMsg && (
          <Alert severity='error' sx={{ mb: 2 }} >
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity='success' sx={{ mb: 2 }} >
            {successMsg}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Usuario"
          margin="normal"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="Nombre"
          margin="normal"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <TextField
          select
          fullWidth
          label="Rol"
          margin="normal"
          value={form.rol}
          onChange={e => setForm({ ...form, rol: e.target.value })}
        >
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
          <MenuItem value="TECNICO">TECNICO</MenuItem>
        </TextField>
        <TextField
          fullWidth
          type="password"
          label="Password inicial"
          margin="normal"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}