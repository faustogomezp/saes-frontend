import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Chip, Box, Typography
} from '@mui/material';
import UsuarioForm from './UsuarioForm';
import ResetPasswordDialog from './ResetPasswordDialog';
import { getUsuarios, toggleUsuarioActivo } from './usuarios.api';

export default function UsuariosList({ user }) {
  const [usuarios, setUsuarios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);

  const cargarUsuarios = async () => {
    const res = await getUsuarios();
    setUsuarios(res.data);
  };



  const handleToggleActivo = async (usuario) => {
    const confirmacion = window.confirm(
      `¿Desea ${usuario.activo ? 'desactivar' : 'activar'} al usuario ${usuario.nombre}?`
    );

    if (!confirmacion) return;

    try {
      await toggleUsuarioActivo(usuario.id);
      cargarUsuarios(); // 🔁 recarga tabla
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar usuario');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (user.rol !== 'ADMIN') {
    return <Typography>No autorizado</Typography>;
  }

  return (
    <Box sx={{ m: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Gestión de Usuarios</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Nuevo Usuario
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuarios.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>
                <Chip label={u.rol} />
              </TableCell>
              <TableCell>
                <Chip
                  label={u.activo ? 'Activo' : 'Inactivo'}
                  color={u.activo ? 'success' : 'error'}
                />
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color={u.activo ? 'error' : 'success'}
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleToggleActivo(u)}
                >
                  {u.activo ? 'Desactivar' : 'Activar'}
                </Button>

                <Button
                  size="small"
                  color="warning"
                  onClick={() => setResetUserId(u.id)}
                >
                  Reset Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UsuarioForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={cargarUsuarios}
      />

      <ResetPasswordDialog
        userId={resetUserId}
        onClose={() => setResetUserId(null)}
      />
    </Box>
  );
}