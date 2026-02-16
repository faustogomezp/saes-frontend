import { Box, Typography, Button, Avatar } from '@mui/material';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
export default function Header({ user, onLogout }) {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 1,
                bgcolor: 'primary.main',
                color: 'white'
            }}
        >
            <img src={logo} alt="logo" height={36} />

            <Typography sx={{ ml: 2 }} fontWeight="bold">
                Sistema de Gestión de SAES
            </Typography>

            {/* 👇 empuja todo a la derecha */}
            <Box sx={{ flexGrow: 1 }} />

            <Typography sx={{ mr: 2 }}>
                {user.nombre}
            </Typography>

            {(location.pathname === '/saes' || location.pathname === '/usuarios') && user.rol !== 'TECNICO' && (
                <Button color="inherit" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </Button>
            )}

            {(location.pathname === '/dashboard' || location.pathname === '/usuarios') && (
                <Button color="inherit" onClick={() => navigate('/saes')}>
                    SAES
                </Button>
            )}

            {user.rol === 'ADMIN' && (
                <Button color="inherit" onClick={() => navigate('/usuarios')}>
                    Usuarios
                </Button>
            )}

            <Button color="inherit" onClick={onLogout}>
                Cerrar sesión
            </Button>

        </Box>
    );
}