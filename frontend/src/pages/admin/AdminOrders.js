import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    api
      .get("/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Orders</h1>
        <nav className="flex gap-6 text-sm">
          <Link to="/admin" className="text-ink/60 hover:text-ink">
            Overview
          </Link>
          <Link to="/admin/products" className="text-ink/60 hover:text-ink">
            Products
          </Link>
          <Link to="/admin/orders" className="text-ink">
            Orders
          </Link>
        </nav>
      </div>

      {loading ? (
        <p className="text-sm text-mute">Loading…</p>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {orders.map((o) => (
            <div key={o._id} className="py-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-mute mt-1">
                  {o.user?.name} · {o.user?.email} ·{" "}
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">${o.totalPrice.toFixed(2)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="text-sm border border-line px-3 py-2 bg-paper capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
