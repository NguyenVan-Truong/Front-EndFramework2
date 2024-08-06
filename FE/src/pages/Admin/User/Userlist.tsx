import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '~/contexts/userContext';
import { Button, Flex, Image, message, Popconfirm } from 'antd';

const UserList = () => {
    const { state, onRemove } = useContext(UserContext);

    const handleConfirm = (id: number | string) => {
        onRemove(id);
        message.success('Tài khoản đã được xóa thành công!');
    };

    const handleCancel = () => {
        message.error('Hành động đã bị hủy!');
    };

    return (
        <div className="container mt-5">
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Ảnh</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th> {/* Thêm cột trạng thái */}
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {state.users.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-truncate">{item.email}</td>
                            <td>
                                <Image width={50} height={50} src={item.avatar} />
                            </td>
                            <td className="text-truncate">{item.role}</td>
                            <td>
                                {/* Hiển thị trạng thái khóa tài khoản */}
                                {item.isLocked ? (
                                    <span className="text-danger">Đã khóa</span>
                                ) : (
                                    <span className="text-success">Đang mở</span>
                                )}
                            </td>
                            <td>
                                <Flex gap="small" wrap>
                                    <Popconfirm
                                        title="Bạn chắc chắn muốn xóa tài khoản này?"
                                        onConfirm={() => handleConfirm(item._id as string)}
                                        onCancel={handleCancel}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button danger>Xóa</Button>
                                    </Popconfirm>
                                    <Link to={`/admin/user/edit/${item._id}`}>
                                        <Button>Cập nhật</Button>
                                    </Link>
                                </Flex>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
