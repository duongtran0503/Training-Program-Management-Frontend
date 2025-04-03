import { InputBase, styled } from '@mui/material';
export const FormInputCustom = styled(InputBase)`
    width: 100%;
    padding: 0 10px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;

    &:focus-within {
        border-color: #1976d2;
    }
`;
