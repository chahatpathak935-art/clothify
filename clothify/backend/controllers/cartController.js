const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc  Get current user's cart
// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// @desc  Add item to cart
// @route POST /api/cart/items
const addItem = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock for this size/color" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.variantId.toString() === variantId
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        variantId,
        size: variant.size,
        color: variant.color,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc  Update item quantity
// @route PUT /api/cart/items/:variantId
const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.variantId.toString() === req.params.variantId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.variantId.toString() !== req.params.variantId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc  Remove item from cart
// @route DELETE /api/cart/items/:variantId
const removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.variantId.toString() !== req.params.variantId);
    await cart.save();

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
