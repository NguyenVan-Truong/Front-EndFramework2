import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import instance from '~/apis';
import { Category } from '~/interfaces/Category';
import { TProduct } from '~/interfaces/Product';

const CategoryDetail = () => {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<TProduct[]>([]);
    const navigate = useNavigate()
    useEffect(() => {
        const getCategory = async () => {
            try {
                const { data } = await instance.get(`/categorys/${id}`);
                setCategory(data.data);
                setProducts(data.data.products); // Giả sử danh sách sản phẩm nằm trong data.data.products
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        getCategory();
    }, [id]);
    const handleBuyNow = async (productId: string) => {
        try {
            const quantity = 1;

            const response = await instance.post('/orders/one', {
                productId,
                quantity
            });

            console.log('Response Data:', response.data);

            const product = response.data.order.products[0]?.product;
            console.log('Product:', product);

            if (!product) {
                throw new Error('Không tìm thấy thông tin sản phẩm.');
            }

            message.success('Đơn hàng đã được tạo thành công!');

            navigate('/bill/one', {
                state: {
                    product,
                    quantity
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            message.error('Đã xảy ra lỗi khi tạo đơn hàng.');
        }
    };
    return (
        <div className="container my-5">
            <h2 className="mb-4">Danh Mục: {category?.name}</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {products.map((product) => (
                    <div className="col" key={product._id}>
                        <div className="card shadow-sm d-flex flex-column" style={{ height: '100%' }}>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="card-img-top"
                                style={{ height: '250px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h3 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {product.title}
                                </h3>
                                <p className="card-text flex-grow-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {product.description}
                                </p>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="btn-group">
                                        <Link to={`/products/${product._id}`}>
                                            <button type="button" className="btn btn-sm btn-outline-secondary">
                                                Xem Chi Tiết
                                            </button>
                                        </Link>
                                        <button type="button" onClick={() => handleBuyNow(product._id as string)} className="btn btn-sm btn-outline-secondary">
                                            Mua Ngay
                                        </button>
                                    </div>
                                    <small className="text-body-secondary">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryDetail;
