import { Box } from '@mui/material';
import Header from '../components/Header';

export default function AppLayout({ user, onLogout, children }) {

    return (
        <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Header user={user} onLogout={onLogout} />

            <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#f4f6f8' }}>
                {children}
            </Box>
        </Box>
    );
}