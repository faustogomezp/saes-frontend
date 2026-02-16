import api from '../api/axios';

export const getUsuarios = () => api.get('/usuarios');

export const crearUsuario  = (data) => api.post('/usuarios', data);

export const toggleUsuarioActivo = (id, activo) => api.patch(`/usuarios/${id}/activo`, {activo});

export const resetPasswordUsuario = (id) => api.patch(`/usuarios/${id}/reset-password`);