import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './auth/Login';
import ChangePassword from './auth/ChangePassword';

import RequirePasswordChange from './auth/RequirePasswordChange';
import RequireChangePassword from './auth/RequireChangePassword';

import SaesList from './saes/SaesList';
import UsuariosList from './usuarios/UsuariosList';
import DashboardSaes from './pages/DashboardSaes';
import AppLayout from './layout/AppLayout';

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogin = () => setLogged(true);

  const handleLogout = () => {
    localStorage.clear();
    setLogged(false);
  };

  return (
    <BrowserRouter>
      {!logged ? (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <Routes>
          {/* 🔐 Cambio obligatorio de contraseña */}
          <Route
            path="/change-password"
            element={
              <RequireChangePassword>
                <ChangePassword />
              </RequireChangePassword>
            }
          />

          {/* 🔐 App protegida */}
          <Route
            path="/*"
            element={
              <RequirePasswordChange>
                <AppLayout user={user} onLogout={handleLogout}>
                  <Routes>
                    {user.rol !== 'TECNICO' && (
                      <Route path="/dashboard" element={<DashboardSaes />} />
                    )}

                    <Route path="/saes" element={<SaesList user={user} />} />

                    {user.rol === 'ADMIN' && (
                      <Route path="/usuarios" element={<UsuariosList user={user} />} />
                    )}

                    <Route
                      path="*"
                      element={
                        <Navigate
                          to={user.rol !== 'TECNICO' ? '/dashboard' : '/saes'}
                        />
                      }
                    />
                  </Routes>
                </AppLayout>
              </RequirePasswordChange>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;