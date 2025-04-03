import { Box, Typography } from '@mui/material';
import { images } from '../../assets/images';
import ButtonAccountMenu from '../ButtonAccoutMenu';

export default function Header() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '10px',
                }}
            >
                <img
                    src={images.logo}
                    style={{ width: '60px', height: '60px' }}
                />
                <Typography sx={{ fontWeight: '500' }}>
                    Training program management
                </Typography>
            </Box>
            <Box>
                <ButtonAccountMenu />
            </Box>
        </Box>
    );
}
