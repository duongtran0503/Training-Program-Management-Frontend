import { z } from 'zod';
export const loginSchema = z
    .object({
        username: z.string().min(5, 'Tên người dùng không hợp lệ!'),
        password: z
            .string()
            .nonempty({ message: 'Vui lòng nhập mật khẩu đăng nhập' })
            .min(1, { message: 'Mật khẩu phải tối thiểu 6 ký tự' }),
    })
    .strict();
export type loginSchemaType = z.infer<typeof loginSchema>;
