const Stripe = require("stripe");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

const SHIPPING_FLAT_RATE = 8;
const TAX_RATE = 0.08;

// @desc  Create a Stripe PaymentIntent for the current cart
// @route POST /api/orders/create-payment-intent
const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        message: "Stripe is not configured on the server. Add STRIPE_SECRET_KEY to backend/.env",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const itemsPrice = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : SHIPPING_FLAT_RATE;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // cents
      currency: "usd",
      metadata: { userId: req.user._id.toString() },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Place an order after successful payment, decrement stock, clear cart
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentResult, itemsPrice, taxPrice, shippingPrice, totalPrice } =
      req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images[0],
      size: i.size,
      color: i.color,
      price: i.product.price,
      quantity: i.quantity,
    }));

    // Decrement stock per variant, guard against overselling
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      const variant = product.variants.id(item.variantId);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name} (${item.size}/${item.color})`,
        });
      }
      variant.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: !!paymentResult?.id,
      paidAt: paymentResult?.id ? Date.now() : undefined,
      status: "processing",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged-in user's orders
// @route GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc  Get single order (owner or admin)
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc  Get all orders (admin)
// @route GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
