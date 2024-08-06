import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import instance from '~/apis';
import { TProduct } from '~/interfaces/Product';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo Bootstrap được import vào dự án của bạn

const Sidebar = () => {
    const [latestProducts, setLatestProducts] = useState<TProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setLoading(true);
            try {
                const { data } = await instance.get('/products', {
                    params: {
                        _page: 1,
                        _limit: 5, // Số lượng sản phẩm mới nhất hiển thị ở sidebar
                        _sort: 'createdAt',
                        _order: 'desc'
                    },
                });
                setLatestProducts(data.data.docs);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm mới nhất:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    return (
        <div className="sidebar bg-light rounded shadow position-sticky top-0" style={{ width: '250px' }}>
            <h4 className="fs-5 mb-3">Sản Phẩm Mới Nhất</h4>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <ul className="list-unstyled">
                    {latestProducts.map((product) => (
                        <li key={product._id} className="mb-3">
                            <div className="d-flex align-items-center">
                                <Link to={`/products/${product._id}`}>
                                    <img src={product.image} alt={product.title} className="img-thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </Link>

                                <div className="ms-3">
                                    <Link to={`/products/${product._id}`}>
                                        <h6 className="text-truncate" style={{ maxWidth: '150px' }}>{product.title}</h6>
                                    </Link>
                                    <small>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} VNĐ</small>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
