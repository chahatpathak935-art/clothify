import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-6 py-24 text-center">
        <p className="font-display text-3xl mb-4">Your bag is empty</p>
        <p className="text-sm text-mute mb-8">Find something you'll want to wear for years.</p>
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-10">Your Bag</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-12">
        <div className="divide-y divide-line">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-5 py-6">
              <Link
                to={`/product/${item.product.slug}`}
                className="w-24 aspect-[3/4] bg-stone overflow-hidden shrink-0"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="text-sm">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-mute mt-1">
                      {item.size} · {item.color}
                    </p>
                  </div>
                  <p className="text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-8 h-9 text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-8 h-9 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-xs text-mute underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-line p-6 h-fit">
          <p className="font-display text-lg mb-5">Order Summary</p>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink/70">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-mute mb-5">Shipping and tax calculated at checkout</p>
          <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
