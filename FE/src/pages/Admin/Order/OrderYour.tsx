import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, message } from 'antd';
// import axios from 'axios';
import { Order } from '~/interfaces/Order';
import instance from '~/apis';
// import './OrderYour.css'; // Đảm bảo đường dẫn chính xác

const OrderYour: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Lấy userId từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await instance.get(`/orders/user/${userId}`);

                // Kiểm tra kiểu dữ liệu của response.data
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error('Dữ liệu không phải là mảng:', response.data);
                    message.error('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error('Lỗi khi tải đơn hàng:', error);
                message.error('Lỗi khi tải danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const handleConfirm = async (orderId: string) => {
        // Xử lý logic huỷ đơn hàng
        console.log('Huỷ đơn hàng với ID:', orderId);

        try {
            await instance.delete(`/orders/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId));
            message.success('Đơn hàng đã được huỷ thành công');
        } catch (error) {
            message.error('Lỗi khi huỷ đơn hàng');
            console.error('Lỗi khi huỷ đơn hàng:', error);

        }
    };

    const handleCancel = () => {
        // Xử lý logic khi huỷ hành động huỷ đơn hàng
        console.log('Huỷ hành động huỷ đơn hàng');
        message.error('Huỷ Xoá Đơn hàng Thành Công ');
    };

    const columns = [
        { title: 'Mã đơn hàng', dataIndex: '_id', key: '_id' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice: number) => totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Tên sản phẩm',
            key: 'productName',
            render: (text: any, record: Order) => (
                <div>
                    {record.products.map((item, index) => (
                        <div className="text-truncate" style={{ maxWidth: '150px' }} key={index}>{item.product.title}</div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (text: any, record: Order) => (
                <div>
                    {record.products.map((item, index) => (
                        <div key={index}>{item.quantity}</div>
                    ))}
                </div>
            ),
        },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_id: string, record: Order) => (
                <span>
                    {record.status === 'pending' ? (
                        <Popconfirm
                            title="Bạn chắc chắn muốn huỷ đơn hàng này?"
                            onConfirm={() => handleConfirm(record._id)}
                            onCancel={handleCancel}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button danger>
                                Huỷ
                            </Button>
                        </Popconfirm>
                    ) : null}
                </span>
            ),
        },
    ];

    return (
        <div className="container">
            <h2 className="text-center mb-4">Đơn Hàng của bạn</h2>
            <div className="table-container">
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    locale={{ emptyText: 'Không có đơn hàng nào' }}
                />
            </div>
        </div>
    );
};

export default OrderYour;
