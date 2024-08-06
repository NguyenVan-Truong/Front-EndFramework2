import React, { useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import instance from '~/apis'; // Đảm bảo đường dẫn đúng
import { useParams } from 'react-router-dom';
import { TProduct } from '~/interfaces/Product';

const ProductItem: React.FC = () => {
    const [quantity, setQuantity] = useState<number>(1);
    const [product, setProduct] = useState<TProduct | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        // Fetch product data by ID
        const fetchProduct = async () => {
            try {
                const response = await instance.get(`/products/${id}`);
                setProduct(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                message.error('Failed to load product.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);


    const addToCart = async () => {
        if (!product) return;

        try {
            await instance.post('/carts', {
                productId: product._id,
                quantity,
            });

            message.success('Product added to cart successfully!');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            message.error('Failed to add product to cart.');
        }
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="img-fluid"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>{product?.title}</h2>
                    <p className="lead">Giá: {product?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p>{product?.description}</p>
                    <div className="form-group">
                        <label>Số Lượng</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={decreaseQuantity} disabled={quantity <= 1}>-</Button>
                            <div style={{ width: '50px', textAlign: 'center' }}>{quantity}</div>
                            <Button onClick={increaseQuantity}>+</Button>
                        </div>
                    </div>
                    <Button onClick={addToCart} className='mt-3'>
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
