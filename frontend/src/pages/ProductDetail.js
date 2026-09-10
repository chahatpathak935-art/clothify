import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data);
      setSelectedColor(data.variants[0]?.color || "");
    });
  }, [slug]);

  if (!product) {
    return <div className="max-w-content mx-auto px-6 py-24 text-center text-mute">Loading…</div>;
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
  const activeVariant = sizesForColor.find((v) => v.size === selectedSize);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    if (!activeVariant) {
      setStatus({ type: "error", message: "Please select a size" });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, activeVariant._id, quantity);
      setStatus({ type: "success", message: "Added to your bag" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Couldn't add to cart",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-[3/4] bg-stone overflow-hidden mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`w-20 aspect-[3/4] overflow-hidden border ${
                  activeImage === i ? "border-ink" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="max-w-md">
          <p className="text-xs text-mute mb-2 capitalize">{product.category}</p>
          <h1 className="font-display text-3xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg">${product.price}</span>
            {onSale && (
              <span className="text-sm text-mute line-through">${product.compareAtPrice}</span>
            )}
            {product.numReviews > 0 && (
              <span className="text-xs text-mute">
                · {product.rating.toFixed(1)}★ ({product.numReviews})
              </span>
            )}
          </div>

          <p className="text-sm text-ink/70 leading-relaxed mb-8">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <p className="text-xs tracking-wide text-mute mb-3">
              Color — <span className="text-ink">{selectedColor}</span>
            </p>
            <div className="flex gap-2">
              {colors.map((c) => {
                const v = product.variants.find((x) => x.color === c);
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setSelectedSize("");
                    }}
                    title={c}
                    className={`w-9 h-9 rounded-full border-2 ${
                      selectedColor === c ? "border-ink" : "border-transparent"
                    }`}
                    style={{ backgroundColor: v?.colorHex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="text-xs tracking-wide text-mute mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((v) => (
                <button
                  key={v._id}
                  disabled={v.stock === 0}
                  onClick={() => setSelectedSize(v.size)}
                  className={`min-w-[44px] h-11 px-3 text-sm border ${
                    selectedSize === v.size
                      ? "border-ink bg-ink text-paper"
                      : v.stock === 0
                      ? "border-line text-mute/50 line-through cursor-not-allowed"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {activeVariant && activeVariant.stock <= 5 && activeVariant.stock > 0 && (
              <p className="text-xs text-rust mt-2">Only {activeVariant.stock} left</p>
            )}
          </div>

          {/* Quantity + CTA */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-11 text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || sizesForColor.every((v) => v.stock === 0)}
              className="btn-primary flex-1"
            >
              {adding ? "Adding…" : "Add to bag"}
            </button>
          </div>

          {status.message && (
            <p className={`text-sm ${status.type === "error" ? "text-rust" : "text-olive"}`}>
              {status.message}
            </p>
          )}

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="mt-12 pt-8 border-t border-line">
              <p className="font-display text-lg mb-4">Reviews</p>
              <div className="space-y-5">
                {product.reviews.map((r, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{r.name}</span>
                      <span className="text-xs text-mute">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-sm text-ink/70">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
