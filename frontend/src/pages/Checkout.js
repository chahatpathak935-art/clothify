import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

function ShippingForm({ address, setAddress, onContinue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-display text-lg mb-2">Shipping address</p>
      <input
        required
        placeholder="Full name"
        className="input-field"
        value={address.fullName}
        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
      />
      <input
        required
        placeholder="Address line 1"
        className="input-field"
        value={address.line1}
        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
      />
      <input
        placeholder="Address line 2 (optional)"
        className="input-field"
        value={address.line2}
        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          placeholder="City"
          className="input-field"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          required
          placeholder="State / Province"
          className="input-field"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          placeholder="Postal code"
          className="input-field"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        />
        <input
          required
          placeholder="Country"
          className="input-field"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
      </div>
      <input
        required
        placeholder="Phone"
        className="input-field"
        value={address.phone}
        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
      />
      <button type="submit" className="btn-primary w-full mt-2">
        Continue to payment
      </button>
    </form>
  );
}

function PaymentForm({ address, totals, onPlaced }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await api.post("/orders", {
        shippingAddress: address,
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          updateTime: new Date().toISOString(),
        },
        ...totals,
      });
      await clearCart();
      onPlaced(order);
    } catch (err) {
      setError(err.response?.data?.message || "Could not finalize order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="font-display text-lg mb-2">Payment</p>
      <PaymentElement />
      {error && <p className="text-sm text-rust">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full">
        {loading ? "Processing…" : `Pay $${totals.totalPrice?.toFixed(2)}`}
      </button>
      <p className="text-xs text-mute">
        Test mode — use card 4242 4242 4242 4242, any future date/CVC.
      </p>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal } = useCart();
  const [step, setStep] = useState("shipping"); // shipping | payment
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [totals, setTotals] = useState({});
  const [error, setError] = useState("");

  const items = cart.items || [];

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items, navigate]);

  const goToPayment = async () => {
    try {
      const { data } = await api.post("/orders/create-payment-intent");
      setClientSecret(data.clientSecret);
      setTotals({
        itemsPrice: data.itemsPrice,
        taxPrice: data.taxPrice,
        shippingPrice: data.shippingPrice,
        totalPrice: data.totalPrice,
      });
      setStep("payment");
    } catch (err) {
      setError(err.response?.data?.message || "Could not start checkout. Is Stripe configured?");
    }
  };

  const handlePlaced = (order) => {
    navigate(`/order-success/${order._id}`);
  };

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-10">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-12">
        <div>
          {error && <p className="text-sm text-rust mb-4">{error}</p>}

          {step === "shipping" && (
            <ShippingForm address={address} setAddress={setAddress} onContinue={goToPayment} />
          )}

          {step === "payment" && clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm address={address} totals={totals} onPlaced={handlePlaced} />
            </Elements>
          )}

          {step === "payment" && !stripePromise && (
            <p className="text-sm text-rust">
              Stripe publishable key is missing. Add REACT_APP_STRIPE_PUBLISHABLE_KEY to
              frontend/.env
            </p>
          )}
        </div>

        <div className="border border-line p-6 h-fit">
          <p className="font-display text-lg mb-5">Order Summary</p>
          <div className="space-y-3 mb-5 max-h-64 overflow-auto">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.product.name} × {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/70">Subtotal</span>
              <span>${(totals.itemsPrice ?? subtotal).toFixed(2)}</span>
            </div>
            {totals.shippingPrice !== undefined && (
              <div className="flex justify-between">
                <span className="text-ink/70">Shipping</span>
                <span>{totals.shippingPrice === 0 ? "Free" : `$${totals.shippingPrice}`}</span>
              </div>
            )}
            {totals.taxPrice !== undefined && (
              <div className="flex justify-between">
                <span className="text-ink/70">Tax</span>
                <span>${totals.taxPrice}</span>
              </div>
            )}
            {totals.totalPrice !== undefined && (
              <div className="flex justify-between font-medium pt-2 border-t border-line mt-2">
                <span>Total</span>
                <span>${totals.totalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
