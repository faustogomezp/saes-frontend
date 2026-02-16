import { Navigate } from 'react-router-dom';

export default function RequireChangePassword({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si ya NO debe cambiar password, sacarlo de aquí
  if (!user.mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}