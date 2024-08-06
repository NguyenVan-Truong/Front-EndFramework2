import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { productSchema } from './../../validate/productSchema.js';
export const createProduct = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Log dữ liệu nhận được
        // const output = productSchema.validate(req.body);
        const { title, price, image, description } = req.body;
        const missingFields = [];
        if (!title) missingFields.push("title");
        if (!price) missingFields.push("price");
        if (!image) missingFields.push("image");
        if (!description) missingFields.push("description");

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const newProduct = await Product.create(req.body);    
        console.log("New product created:", newProduct); // Log sản phẩm mới được tạo

        const updateCategory = await Category.findByIdAndUpdate(newProduct.categoryId, {
             $push: { products: newProduct._id }
             }, { new: true });
             if(!updateCategory){
                    return res.status(404).json({ message: "Update category not found" });
             }
        return res.status(201).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getAllProduct = async (req, res) => {
    try {
        const { _page = 1, _limit = 3, _sort = "createdAt", _order = "asc", minPrice, maxPrice, search } = req.query;

        // Tạo đối tượng truy vấn lọc giá
        let priceQuery = {};
        if (minPrice !== undefined) {
            priceQuery.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
            priceQuery.$lte = Number(maxPrice);
        }

        // Tạo đối tượng truy vấn tổng thể, bao gồm cả lọc giá và tìm kiếm
        const query = {};
        if (Object.keys(priceQuery).length > 0) {
            query.price = priceQuery;
        }
        if (search  && search.trim()) {
            // Tìm kiếm với từ khóa không phân biệt chữ hoa chữ thường
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // Tìm kiếm theo tiêu đề
                { description: { $regex: search, $options: 'i' } } // Tìm kiếm theo mô tả
            ];
        }

        // Cấu hình tùy chọn phân trang và sắp xếp
        const options = {
            page: _page,
            limit: _limit,
            sort: { [_sort]: _order === "asc" ? 1 : -1 },
            populate: {
                path: "categoryId",
                select: "name"
            }
        };

        // Lấy danh sách sản phẩm với các điều kiện tìm kiếm
        const newProduct = await Product.paginate(query, options);

        console.log("Products found:", newProduct); // Log danh sách sản phẩm tìm được
        if (search && search.trim() && (!newProduct || newProduct.docs.length === 0)) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
        }
        return res.status(200).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAll = async (req, res) => {

    try {
        const newProduct = await Product.find({} ).populate({path: "categoryId",select: "name"});
        console.log("New product created:", newProduct); // Log sản phẩm mới được tạo
        return res.status(201).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getProductById = async (req, res) => {
    try {
        const newProduct = await Product.findById(req.params.id)
        return res.status(201).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        // const output = productSchema.validate(req.body);
        const newProduct = await Product.findByIdAndUpdate(req.params.id ,req.body, {new: true});

        return res.status(201).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const newProduct = await Product.findByIdAndDelete(req.params.id);

        return res.status(201).json({ data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

