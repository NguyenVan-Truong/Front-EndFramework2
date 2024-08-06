import z from 'zod';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, message } from 'antd';
import instance from '~/apis';
import { User } from '~/interfaces/User';
import { UserContext } from '~/contexts/userContext';

// Định nghĩa schema với Zod bao gồm trường isLocked
const userSchema = z.object({
    email: z.string().email().min(2).max(255),
    role: z.enum(["member", "admin"]),
    avatar: z.string().optional(), // Thêm trường avatar nếu cần
    isLocked: z.boolean().optional(), // Thêm trường isLocked
});

const EditUser = () => {
    const { id } = useParams<{ id: string }>();
    const { handleEdit } = useContext(UserContext);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<User>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await instance.get(`/users/${id}`);
                reset(data.data);
            } catch (error) {
                message.error("Lỗi khi lấy dữ liệu người dùng.");
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };
        fetchUserData();
    }, [id, reset]);

    const onSubmit = async (data: User) => {
        try {
            await handleEdit({ ...data, _id: id });
            message.success("Cập nhật tài khoản thành công!");
        } catch (error) {
            message.error("Lỗi khi cập nhật người dùng.");
            console.error("Lỗi khi cập nhật người dùng:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="centered-form mb-3">
            <div className="container d-flex justify-content-center align-items-center">
                <div className="card p-4 border border-secondary shadow">
                    <h1>Sửa Tài Khoản</h1>
                    <hr />
                    <div className="mb-3 mt-3">
                        <label htmlFor="email" className="form-label">Tên tài khoản</label>
                        <input
                            type="email"
                            className="form-control"
                            disabled
                            id="email"
                            placeholder="Mời bạn nhập tên tài khoản"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Vai trò</label>
                        <select className="form-control" id="role" {...register('role', { required: true })}>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-danger">{errors.role.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Ảnh đại diện</label>
                        <input
                            type="text"
                            className="form-control"
                            id="avatar"
                            placeholder="URL ảnh đại diện"
                            {...register('avatar')}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="isLocked" className="form-label">Khóa tài khoản</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="isLocked"
                            {...register('isLocked')}
                        />
                    </div>
                    <Button type="primary" htmlType="submit" className="w-100">
                        Cập nhật
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default EditUser;
