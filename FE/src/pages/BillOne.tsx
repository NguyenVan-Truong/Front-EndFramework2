import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Image, message } from 'antd';
import instance from '~/apis';
import { TProduct } from '~/interfaces/Product';
import { User } from '~/interfaces/User';

const BillOne = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { product, quantity, user } = location.state as {
        product: TProduct;
        quantity: number;
        user: User;
    } || {};

    const handleCheckout = async () => {
        try {
            const productId = product._id;
            // Thực hiện xử lý thanh toán ở đây (ví dụ: gọi API)
            const response = await instance.post('/orders/one', {
                productId,
                quantity,
            });
            message.success('Thanh toán thành công!');
            navigate(`/orders/${response.data.order._id}`); // Điều hướng đến trang cảm ơn sau khi thanh toán
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error);
            message.error('Đã xảy ra lỗi khi thanh toán.');
        }
    };

    if (!product || !user) {
        return <div>Thông tin sản phẩm hoặc người dùng không hợp lệ.</div>;
    }

    return (
        <div className="container my-5">
            <div className="card p-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 className="mb-4 text-center">Xác Nhận Đơn Hàng</h1>
                <div className="card mb-3 p-3 bg-light">
                    <h5 className="card-title">Thông tin người dùng</h5>
                    <p className="card-text"><strong>Tên:</strong> {user.name}</p>
                    <p className="card-text"><strong>SĐT:</strong> 0{user.phone}</p>
                    <p className="card-text"><strong>Địa chỉ:</strong> {user.address}</p>
                    <p className="card-text"><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="card mb-3 p-3 bg-light">
                    <h5 className="card-title">Thông tin sản phẩm</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ảnh</th>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Số</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                        {product.title}
                                    </td>
                                    <td>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td>{quantity}</td>
                                    <td>{(quantity * product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="text-end">
                    <Button type="primary" onClick={handleCheckout}>Xác nhận thanh toán</Button>
                </div>
            </div>
        </div>
    );
};

export default BillOne;
