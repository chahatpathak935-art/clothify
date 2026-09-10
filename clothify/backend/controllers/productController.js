const Product = require("../models/Product");

// @desc  Get products with filters (category, gender, size, color, price range, search, sort, pagination)
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (size) query["variants.size"] = size;
    if (color) query["variants.color"] = color;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product by slug or id
// @route GET /api/products/:idOrSlug
const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const product = isObjectId
      ? await Product.findById(idOrSlug)
      : await Product.findOne({ slug: idOrSlug });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc  Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
};

// @desc  Add a review to a product
// @route POST /api/products/:id/reviews
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
