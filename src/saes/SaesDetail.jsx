import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField, 
  MenuItem,
  Alert
} from '@mui/material';

export default function SaesDetail({ saesId, refreshKey, onClose }) {
  const [saes, setSaes] = useState(null);
  const [auditoria, setAuditoria] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
const esTecnico = user?.rol === 'TECNICO';
const [aaRetiro, setAaRetiro] = useState('');
const [retirando, setRetirando] = useState(false);
const [aas, setAas] = useState([]);
const [numeroOrden, setNumeroOrden] = useState([]);
  useEffect(() => {
    api.get(`/saes/${saesId}`).then(res => {setSaes(res.data); setNumeroOrden(res.data.numero_orden_instalacion)});
    api.get(`/auditoria/${saesId}`).then(res => setAuditoria(res.data));
   
  }, [saesId, refreshKey]);

  useEffect(() => {
  api.get('/usuarios/aa').then(res => setAas(res.data));  
}, [])

const exportarAuditoriaExcel = async () => {
  try {
    const response = await api.get(
      '/auditoria/export/excel',
      { responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Auditoria_SAES.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
  console.error('ERROR EXPORTANDO AUDITORIA:', error);
  res.status(500).json({ error: error.message });
}
};

const retirarSaes = async () => {
  if (!aaRetiro) {
    alert('Debe indicar el AA que aprueba el retiro');
    return;
  }

  if (!window.confirm('¿Está seguro de retirar este SAES? Esta acción no se puede revertir.')) {
    return;
  }

  try {
    await api.put(`/saes/${saesId}/retirar`, {
      tecnico_retiro_id: user.id,
      aa_retiro_id: aaRetiro,
      numero_orden: numeroOrden
    });

    alert('SAES retirado correctamente');
    window.location.reload();
  } catch (e) {
    alert(e.response?.data?.error || 'Error al retirar SAES');
  }
};

  if (!saes) return null;

  return (
    <Box sx={{ m: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Button variant="outlined" onClick={onClose}>
        Cerrar
      </Button>
<Button variant="outlined" onClick={exportarAuditoriaExcel}>
  Exportar Auditoría
</Button>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Detalle SAES
      </Typography>
  {saes.estado === 'RETIRADO' && (
    <Alert severity="info" sx={{ mb: 2 }}>
      Este SAES fue retirado el{' '}
      {new Date(saes.fecha_retiro).toLocaleDateString()}.
      No se permiten más acciones.
    </Alert>
  )}

      <Divider sx={{ my: 1 }} />


      <Typography><b>N° SAES:</b> {saes.numero_saes}</Typography>
      <Typography><b>Orden de instalación:</b> {saes.numero_orden_instalacion}</Typography>
      <Typography><b>Orden de Retiro:</b> {saes.numero_orden_retiro || '-'}</Typography>
      <Typography><b>Campo:</b> {saes.campo}</Typography>
      <Typography><b>Equipo:</b> {saes.equipo}</Typography>
      <Typography><b>Actividad:</b> {saes.actividad}</Typography>
      <Typography><b>Estado:</b> {saes.estado}</Typography>
      <Typography><b>Fecha instalación:</b> {saes.fecha_instalacion}</Typography>
      <Typography><b>Fecha retiro:</b> {saes.fecha_retiro || '-'}</Typography>
{saes.estado === 'INSTALADO' && esTecnico && (
  <Box sx={{ mt: 2 }}>
    <Divider sx={{ my: 2 }} />

    <Typography variant="subtitle1">
      Retiro de SAES
    </Typography>
<TextField
label= "Número de Orden / Aviso (Retiro)"
value={numeroOrden}
onChange={e =>
  setNumeroOrden(e.target.value)
}
fullWidth
sx={{mt:2}}
/>
<TextField
  select
  fullWidth
  label="AA que aprueba el retiro"
  margin="normal"
  value={aaRetiro}
  onChange={e => setAaRetiro(e.target.value)}
>
  {aas.map(aa => (
    <MenuItem key={aa.id} value={aa.id}>
      {aa.nombre}
    </MenuItem>
  ))}
</TextField>

    <Button
      variant="contained"
      color="error"
      onClick={retirarSaes}
      disabled={retirando}
    >
      Retirar SAES
    </Button>
  </Box>
)}
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Auditoría</Typography>

      <List dense>
        {auditoria.map((a, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={`${a.fecha} - ${a.accion}`}
              secondary={`${a.nombre} (${a.rol}) - ${a.detalle}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}