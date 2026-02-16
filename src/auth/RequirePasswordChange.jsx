import { Navigate } from 'react-router-dom';

export default function RequirePasswordChange({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // Si no hay usuario, volver al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🚨 Si debe cambiar password, forzar ruta
  if (user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}