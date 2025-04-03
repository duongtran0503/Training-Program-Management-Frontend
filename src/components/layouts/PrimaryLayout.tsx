import { Box, Grid } from '@mui/material';
import { ReactNode } from 'react';
import Navigate from '../Navigate';
import Header from '../Header';

export default function Primarylayout({ children }: { children?: ReactNode }) {
    return (
        <Box
            sx={{
                padding: ' 0 20px',
            }}
        >
            <Box
                sx={{
                    height: '70px',
                    position: 'fixed',
                    top: 0,
                    left: '20px',
                    right: '20px',
                    zIndex: 100,
                    background: 'white',
                }}
            >
                <Header />
            </Box>
            <Grid container spacing={10}>
                <Grid size={2}>
                    <Navigate />
                </Grid>
                <Grid size={10}>
                    <Box sx={{ marginTop: '70px' }}>{children}</Box>
                </Grid>
            </Grid>
        </Box>
    );
}
