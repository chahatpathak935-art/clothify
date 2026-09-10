import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_COLORS = {
  pending: "text-mute",
  processing: "text-olive",
  shipped: "text-olive",
  delivered: "text-olive-dark",
  cancelled: "text-rust",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-content mx-auto px-6 py-24 text-center text-mute">Loading…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-content mx-auto px-6 py-24 text-center">
        <p className="font-display text-3xl mb-4">No orders yet</p>
        <Link to="/shop" className="btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-10">My Orders</h1>
      <div className="divide-y divide-line">
        {orders.map((o) => (
          <div key={o._id} className="py-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm">Order #{o._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-mute mt-1">
                {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className={`text-sm capitalize ${STATUS_COLORS[o.status] || ""}`}>
                {o.status}
              </span>
              <span className="text-sm">${o.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
