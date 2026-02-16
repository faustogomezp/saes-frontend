import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import api from '../api/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar
} from '@mui/material';

export default function CrearSaes({ onCreated }) {
  const user = JSON.parse(localStorage.getItem('user'));
const [campos, setCampos] = useState([]);
const [aas, setAas] = useState([]);
const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
};
  const [form, setForm] = useState({
    numero_saes: '',
    numero_orden: '',
    campo: '',
    equipo: '',
    actividad: '',
    aa_id: ''
  });
const [submitted, setSubmitted] = useState(false);
const [errorMsg, setErrorMsg] = useState('');
const [openConfirm, setOpenConfirm] = useState(false);
const [success, setSuccess] = useState(false);
const handleOpenConfirm = () => {
  setSubmitted(true);
  setErrorMsg('');

  if (
    !form.numero_saes ||
    !form.numero_orden ||
    !form.campo ||
    !form.equipo ||
    !form.actividad ||
    !form.aa_id
  ) {
    setErrorMsg('Debe completar todos los campos obligatorios');
    return;
  }

  setOpenConfirm(true);
};

  useEffect(() => {
  api.get('/campos').then(res => setCampos(res.data));
}, []);

useEffect(() => {
  api.get('/usuarios/aa').then(res => setAas(res.data));
}, []);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  

  const handleSubmit = async () => {
    try {


      setSubmitted(true);
      setErrorMsg('');

      if (
        !form.numero_saes ||
        !form.numero_orden ||
        !form.campo ||
        !form.equipo ||
        !form.actividad ||
        !form.aa_id
      ) {
        setErrorMsg('Debe completar todos los campos obligatorios');
        return;
      }

      await api.post('/saes', {
        ...form,
        tecnico_id: user.id
      });
      
      setSuccess(true);

    setForm({
      numero_saes: '',
      numero_orden: '',
      campo: '',
      equipo: '',
      actividad: '',
      aa_id: ''
    });
    setSubmitted(false);
      
 setTimeout(() => {
      onCreated();
    }, 1000);
    } catch (error) {
      setErrorMsg(
      error.response?.data?.error ||
      'Error al crear el SAES'
    );
    }
  };

  return (
<>
    <Box sx={{ maxWidth: 500, m: 3 }}>


      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Registro de SAES – Instalación
        </Typography>

      </Box>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }} fontWeight="bold">
        Identificación del SAES
      </Typography>

      {errorMsg && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <TextField
        label="Técnico que instala"
        value={user.nombre}
        disabled
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          style: { backgroundColor: '#f5f5f5' }
        }}
      />
      <TextField
        fullWidth
        label="Número SAES"
        name="numero_saes"
        margin="normal"
        value={form.numero_saes}
        onChange={handleChange}
        required
        error={!form.numero_saes && submitted}
        helperText={
          !form.numero_saes && submitted
            ? 'Número de SAES obligatorio'
            : ''
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Número de Orden / Aviso"
        name="numero_orden"
        value={form.numero_orden}
        onChange={handleChange}
        required
        error={!form.numero_orden && submitted}
        helperText={
          !form.numero_orden && submitted
            ? 'Número de orden obligatorio'
            : ''
        }
        sx={{ mb: 2 }}
      />
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }} fontWeight="bold">
        Ubicación y Equipo
      </Typography>
      <TextField
        select
        fullWidth
        label="Campo"
        name="campo"
        margin="normal"
        value={form.campo}
        onChange={handleChange}
        required
        error={!form.campo && submitted}
        helperText={
          !form.campo && submitted
            ? 'Debe seleccionar un campo'
            : ''
        }
      >
        <MenuItem value="" disabled>
          Seleccione un campo
        </MenuItem>

        {campos.map(c => (
          <MenuItem key={c.id} value={c.nombre}>
            {c.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Equipo"
        name="equipo"
        margin="normal"
        value={form.equipo}
        onChange={handleChange}
        required
        error={!form.equipo && submitted}
        helperText={
          !form.equipo && submitted
            ? 'Debe indicar el equipo'
            : ''
        }
      />

      <TextField
        fullWidth
        label="Actividad"
        name="actividad"
        margin="normal"
        value={form.actividad}
        onChange={handleChange}
        required
        multiline
        rows={2}
        error={!form.actividad && submitted}
        helperText={
          !form.actividad && submitted
            ? 'Debe describir la actividad'
            : ''
        }
      />
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }} fontWeight="bold">
        Autorización
      </Typography>
      <TextField
        select
        fullWidth
        label="AA que aprueba"
        name="aa_id"
        margin="normal"
        value={form.aa_id}
        onChange={handleChange}
        required
        error={!form.aa_id && submitted}
        helperText={
          !form.aa_id && submitted
            ? 'Debe seleccionar un AA'
            : ''
        }
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>
          Seleccione un AA
        </MenuItem>

        {aas.map(aa => (
          <MenuItem key={aa.id} value={aa.id}>
            {aa.nombre}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Fecha de instalación"
        value={new Date().toLocaleDateString()}
        disabled
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        sx={{ mt: 3, width: '100%' }}
        onClick={handleOpenConfirm}
      >
        Registrar SAES
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          SAES creado correctamente
        </Alert>
      </Snackbar>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar registro de SAES</DialogTitle>

        <DialogContent dividers>
          <Typography><strong>Número SAES:</strong> {form.numero_saes}</Typography>
          <Typography><strong>Orden / Aviso:</strong> {form.numero_orden}</Typography>
          <Typography><strong>Campo:</strong> {form.campo}</Typography>
          <Typography><strong>Equipo:</strong> {form.equipo}</Typography>
          <Typography><strong>Actividad:</strong> {form.actividad}</Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>AA que aprueba:</strong>{' '}
            {aas.find(a => a.id === form.aa_id)?.nombre}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenConfirm(false);
              handleSubmit();
            }}
          >
            Confirmar registro
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
    </>
  );
}

