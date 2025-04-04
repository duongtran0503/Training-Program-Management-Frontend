import { Button, styled } from '@mui/material';

export const FormButtonCustom = styled(Button)`
    width: 100%;
    padding: 10px;
    border: 2px solid #030712;
    font-weight: 600;
    font-size: 16px;
    color: white;
    background: #030712;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: inline-block;
    overflow: hidden;
    position: relative;
    text-transform: capitalize;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    &::before {
        content: '';
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        padding: 0;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.9),
            transparent
        );
        transition: all 0.5s linear;
    }

    &:hover {
        background-color: rgb(255, 255, 255);
        color: black;

        &::before {
            left: 100%;
            transition: all 0.5s linear;
        }
    }
`;
