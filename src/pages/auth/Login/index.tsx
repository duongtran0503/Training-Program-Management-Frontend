import { Box, FormLabel, Typography } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { images } from '../../../assets/images';
import { useForm } from 'react-hook-form';
import { loginSchema, loginSchemaType } from '../../../schemas/auth/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import { Link, useNavigate } from 'react-router-dom';
import { authServices } from '../../../services/authServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';
import { localStorageName } from '../../../constans/localStorageName';
export default function LoginPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (value: loginSchemaType) => {
        try {
            const res = await authServices.login(value);
            console.log(res);
            if (res.statusCode === 401) {
                setError('password', {
                    type: 'manual',
                    message: 'Mật khẩu không chính xác',
                });
            } else {
                const token = res.data?.token;
                localStorage.setItem(
                    localStorageName.token,
                    JSON.stringify(token)
                );
                navigate('/home');
            }
        } catch (error) {
            errorAPIRequest.serverError({ error });
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
            }}
        >
            <Box
                sx={{
                    marginTop: '40px',
                    width: '380px',
                    height: '450px',
                    borderRadius: '16px',
                    boxShadow: styledSystem.primaryBoxShadow,
                    padding: '10px',
                }}
            >
                <Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '14px',
                        }}
                    >
                        <Box
                            sx={{
                                width: '80px',
                                height: '80px',
                                marginBottom: '10px',
                            }}
                        >
                            <img
                                src={images.logo}
                                style={{
                                    objectFit: 'cover',
                                    width: '100px',
                                    height: '100px',
                                }}
                            />
                        </Box>
                        <Typography
                            sx={{
                                fontWeight: '200',
                                textAlign: 'center',
                            }}
                        >
                            Chào mừng quay trở lại!
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ width: '100%', marginBottom: '25px' }}>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormInputCustom
                                type='text'
                                {...register('username')}
                                sx={{
                                    height: '40px',
                                }}
                            />
                            {errors.username ? (
                                <Typography color='red'>
                                    {errors.username.message}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Box>
                        <Box sx={{ width: '100%', marginBottom: '25px' }}>
                            <FormLabel>Mật khẩu đăng nhập</FormLabel>
                            <FormInputCustom
                                type='password'
                                {...register('password')}
                                sx={{
                                    height: '40px',
                                }}
                            />
                            {errors.password ? (
                                <Typography color='red'>
                                    {errors.password.message}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Box>
                        <Box>
                            <FormButtonCustom type='submit'>
                                Đăng nhập
                            </FormButtonCustom>
                        </Box>
                    </form>
                </Box>
                <Box
                    sx={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography>
                        Nếu bạn quên mật khẩu vui lòng nhấn vào{' '}
                        <Link to={'/'}> Đây</Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
