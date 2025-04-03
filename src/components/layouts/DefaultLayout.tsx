import { Box } from '@mui/material';
import { ReactNode } from 'react';

export default function Defaultlayout({ children }: { children?: ReactNode }) {
    return <Box> {children}</Box>;
}
