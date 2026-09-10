require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const products = [
  {
    name: "Wool Overcoat",
    slug: "wool-overcoat",
    description:
      "A tailored double-breasted overcoat cut from heavyweight wool. Structured shoulders, a full canvas front, and a below-the-knee length built for cold mornings.",
    category: "outerwear",
    gender: "unisex",
    price: 328,
    compareAtPrice: 420,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800",
    ],
    variants: [
      { size: "S", color: "Charcoal", colorHex: "#3a3a3a", stock: 8 },
      { size: "M", color: "Charcoal", colorHex: "#3a3a3a", stock: 12 },
      { size: "L", color: "Charcoal", colorHex: "#3a3a3a", stock: 6 },
      { size: "M", color: "Camel", colorHex: "#c19a6b", stock: 10 },
      { size: "L", color: "Camel", colorHex: "#c19a6b", stock: 4 },
    ],
    tags: ["wool", "coat", "winter"],
    isFeatured: true,
  },
  {
    name: "Ribbed Merino Sweater",
    slug: "ribbed-merino-sweater",
    description:
      "Fine-gauge merino wool sweater with a ribbed crewneck and dropped shoulder seam. Soft against the skin, breathable enough to layer.",
    category: "tops",
    gender: "unisex",
    price: 98,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    ],
    variants: [
      { size: "XS", color: "Olive", colorHex: "#6b7156", stock: 5 },
      { size: "S", color: "Olive", colorHex: "#6b7156", stock: 14 },
      { size: "M", color: "Olive", colorHex: "#6b7156", stock: 18 },
      { size: "L", color: "Olive", colorHex: "#6b7156", stock: 9 },
      { size: "M", color: "Ivory", colorHex: "#f2ede1", stock: 11 },
    ],
    tags: ["knitwear", "merino", "layering"],
    isFeatured: true,
  },
  {
    name: "Straight-Leg Selvedge Denim",
    slug: "straight-leg-selvedge-denim",
    description:
      "13oz Japanese selvedge denim in a straight-leg cut with a mid-rise waist. Raw finish that fades and molds to wear over time.",
    category: "bottoms",
    gender: "men",
    price: 168,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
      "https://images.unsplash.com/photo-1602293589930-45821b19a52c?w=800",
    ],
    variants: [
      { size: "30", color: "Indigo", colorHex: "#2c3e6b", stock: 10 },
      { size: "32", color: "Indigo", colorHex: "#2c3e6b", stock: 15 },
      { size: "34", color: "Indigo", colorHex: "#2c3e6b", stock: 12 },
      { size: "36", color: "Indigo", colorHex: "#2c3e6b", stock: 7 },
    ],
    tags: ["denim", "selvedge"],
    isFeatured: true,
  },
  {
    name: "Silk Slip Dress",
    slug: "silk-slip-dress",
    description:
      "Bias-cut slip dress in washed mulberry silk. Adjustable straps, a fluid drape, and a midi length that moves with you.",
    category: "dresses",
    gender: "women",
    price: 214,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
    ],
    variants: [
      { size: "XS", color: "Rust", colorHex: "#a34a3d", stock: 6 },
      { size: "S", color: "Rust", colorHex: "#a34a3d", stock: 9 },
      { size: "M", color: "Rust", colorHex: "#a34a3d", stock: 8 },
      { size: "S", color: "Black", colorHex: "#111111", stock: 10 },
      { size: "M", color: "Black", colorHex: "#111111", stock: 7 },
    ],
    tags: ["silk", "dress", "eveningwear"],
    isFeatured: true,
  },
  {
    name: "Suede Chelsea Boots",
    slug: "suede-chelsea-boots",
    description:
      "Classic Chelsea boots in brushed suede with elastic side panels and a stacked leather heel. Built on a Goodyear-welted sole.",
    category: "footwear",
    gender: "unisex",
    price: 245,
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800",
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800",
    ],
    variants: [
      { size: "40", color: "Stone", colorHex: "#8a8377", stock: 5 },
      { size: "41", color: "Stone", colorHex: "#8a8377", stock: 8 },
      { size: "42", color: "Stone", colorHex: "#8a8377", stock: 10 },
      { size: "43", color: "Stone", colorHex: "#8a8377", stock: 6 },
    ],
    tags: ["boots", "suede", "footwear"],
    isFeatured: false,
  },
  {
    name: "Cotton Poplin Shirt",
    slug: "cotton-poplin-shirt",
    description:
      "Crisp cotton poplin shirt with a classic collar and a relaxed box fit. A everyday staple that works tucked or loose.",
    category: "tops",
    gender: "unisex",
    price: 78,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800",
    ],
    variants: [
      { size: "S", color: "White", colorHex: "#ffffff", stock: 20 },
      { size: "M", color: "White", colorHex: "#ffffff", stock: 25 },
      { size: "L", color: "White", colorHex: "#ffffff", stock: 15 },
      { size: "M", color: "Sky Blue", colorHex: "#a9c4d8", stock: 12 },
    ],
    tags: ["shirt", "cotton", "essentials"],
    isFeatured: false,
  },
  {
    name: "Pleated Wool Trousers",
    slug: "pleated-wool-trousers",
    description:
      "Wide-leg trousers in soft wool flannel with a double front pleat and a tapered ankle break. Fully lined through the seat and thigh.",
    category: "bottoms",
    gender: "women",
    price: 156,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800",
    ],
    variants: [
      { size: "XS", color: "Grey", colorHex: "#6e6a63", stock: 7 },
      { size: "S", color: "Grey", colorHex: "#6e6a63", stock: 11 },
      { size: "M", color: "Grey", colorHex: "#6e6a63", stock: 9 },
      { size: "L", color: "Grey", colorHex: "#6e6a63", stock: 4 },
    ],
    tags: ["trousers", "wool", "tailoring"],
    isFeatured: false,
  },
  {
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description:
      "Compact crossbody in vegetable-tanned leather that darkens beautifully with age. Adjustable strap and a magnetic-flap closure.",
    category: "accessories",
    gender: "unisex",
    price: 132,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
    ],
    variants: [
      { size: "One Size", color: "Cognac", colorHex: "#a0522d", stock: 14 },
      { size: "One Size", color: "Black", colorHex: "#111111", stock: 10 },
    ],
    tags: ["bag", "leather", "accessories"],
    isFeatured: true,
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany();
  await User.deleteMany({ email: "admin@clothify.com" });

  await Product.insertMany(products);

  await User.create({
    name: "Admin",
    email: "admin@clothify.com",
    password: "admin1234",
    role: "admin",
  });

  console.log("Seed complete: 8 products + 1 admin user (admin@clothify.com / admin1234)");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
