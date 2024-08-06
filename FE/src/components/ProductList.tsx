import { useState, useEffect } from 'react';
import instance from '~/apis';
import { TProduct } from '~/interfaces/Product';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';// Đảm bảo đúng tên file
import { Button, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './SiderBar';

const ProductList = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [search, setSearch] = useState('');
    const [noProductsMessage, setNoProductsMessage] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const price = parseInt(value, 10);

        if (checked) {
            setMaxPrice(price);
        } else if (price === maxPrice) {
            setMaxPrice(undefined);
        }
    };

    const handleBuyNow = async (productId: string) => {
        try {
            const quantity = 1; // Số lượng mặc định là 1

            // Lấy thông tin sản phẩm từ API
            const productResponse = await instance.get(`/products/${productId}`);
            const product = productResponse.data.data;

            // Lấy thông tin user từ localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Điều hướng đến trang BillOne với state chứa thông tin sản phẩm và người dùng
            navigate(`/bill/one`, {
                state: {
                    product,
                    quantity,
                    user
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            message.error('Đã xảy ra lỗi khi tạo đơn hàng.');
        }
    };



    const renderPagination = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        return items;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await instance.get('/products', {
                    params: {
                        _page: currentPage,
                        _limit: 9,
                        _sort: 'price',
                        _order: 'asc',
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        search: searchQuery
                    },
                });
                if (searchQuery.trim() && (!data.data.docs || data.data.docs.length === 0)) {
                    setNoProductsMessage('Không có sản phẩm nào');
                } else {
                    setNoProductsMessage('');
                }
                setProducts(data.data.docs);
                setTotalPages(Math.ceil(data.data.total / 9));
                setSearch(searchQuery);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                message.error('Có lỗi xảy ra khi lấy sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, minPrice, maxPrice, location.search]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleAddToCart = async (productId: string) => {
        try {
            await instance.post('/carts', {
                productId,
                quantity: 1,
            });
            message.success('Sản phẩm đã được thêm vào giỏ hàng!');
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            message.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-9 col-md-8">
                    <h3>Danh Sách Sản Phẩm</h3>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div>
                            {noProductsMessage ? (
                                <div className="text-center text-danger">{noProductsMessage}</div>
                            ) : (
                                <div>
                                    <div className="container">
                                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                                            {products.map((product) => (
                                                <div className="col d-flex align-items-stretch" key={product._id}>
                                                    <div className="card shadow-sm h-100 w-100 position-relative">
                                                        <img src={product.image} alt={product.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title text-truncate">{product.title}</h5>
                                                            <p className="card-text text-truncate flex-grow-1">{product.description}</p>
                                                            <small className="text-muted">
                                                                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                            </small>
                                                            <div className="button-overlay position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center">
                                                                <Button size="small" className="mb-2" onClick={() => handleAddToCart(product._id as string)}>Thêm Vào Giỏ</Button>
                                                                <Link to={`/products/${product._id}`}>
                                                                    <Button size="small" className="mb-2">Xem Chi Tiết</Button>
                                                                </Link>
                                                                <Button size="small" onClick={() => handleBuyNow(product._id as string)}>Mua Ngay</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <nav>
                                        <ul className="pagination justify-content-center mt-5">
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                                    <DoubleLeftOutlined />
                                                    <span className="visually-hidden">Previous</span>
                                                </button>
                                            </li>
                                            <li className="page-item disabled">
                                                {renderPagination()}
                                                <span className="page-link">{currentPage}</span>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                                    <DoubleRightOutlined />
                                                    <span className="visually-hidden">Next</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="col-lg-3 col-md-4 p-lg-5">
                    <div className="mb-5 sidebar bg-light rounded shadow position-sticky top-0 d-flex flex-column align-items-center p-3">
                        <h5 className="text-center mb-3">Lọc theo giá</h5>
                        <div className="d-flex flex-wrap justify-content-center">
                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="price1m"
                                    value="2000000"
                                    onChange={handleFilterChange}
                                />
                                <label className="form-check-label" htmlFor="price1m">
                                    Dưới 2 triệu
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="price2m"
                                    value="4000000"
                                    onChange={handleFilterChange}
                                />
                                <label className="form-check-label" htmlFor="price2m">
                                    Dưới 4 triệu
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="price3m"
                                    value="6000000"
                                    onChange={handleFilterChange}
                                />
                                <label className="form-check-label" htmlFor="price3m">
                                    Dưới 6 triệu
                                </label>
                            </div>
                        </div>
                    </div>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default ProductList
