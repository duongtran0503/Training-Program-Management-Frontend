import { Box, Button } from '@mui/material';
import { styledSystem } from '../../constans/styled';

interface Props {
    handlClose: () => void;
}
export default function FormAddLecturer(props: Props) {
    const { handlClose } = props;
    return (
        <Box
            sx={{
                width: '400px',
                height: '400px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: styledSystem.primaryBoxShadow,
            }}
        >
            form
            <Button onClick={handlClose}>close</Button>
        </Box>
    );
}
