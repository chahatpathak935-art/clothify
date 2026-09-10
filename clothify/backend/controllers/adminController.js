const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc  Get dashboard summary stats
// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.find({ isPaid: true }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const lowStockProducts = await Product.find({
      "variants.stock": { $lt: 5 },
    }).select("name variants");

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      lowStockProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
