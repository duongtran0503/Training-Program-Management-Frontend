import { Box, Modal } from '@mui/material';
import { ReactNode } from 'react';
interface Props {
    open: boolean;
    handleClose: () => void;
    children: ReactNode;
}
const styled = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};
export default function ModalWrapper(props: Props) {
    const { open, handleClose, children } = props;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            disableEscapeKeyDown={true}
            BackdropProps={{
                onClick: (event) => {
                    event.stopPropagation();
                },
            }}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            component='div'
        >
            <Box sx={styled}>{children}</Box>
        </Modal>
    );
}
