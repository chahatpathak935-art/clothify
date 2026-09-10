import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Admin Dashboard</h1>
        <nav className="flex gap-6 text-sm">
          <Link to="/admin" className="text-ink">
            Overview
          </Link>
          <Link to="/admin/products" className="text-ink/60 hover:text-ink">
            Products
          </Link>
          <Link to="/admin/orders" className="text-ink/60 hover:text-ink">
            Orders
          </Link>
        </nav>
      </div>

      {!stats ? (
        <p className="text-mute text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
              { label: "Orders", value: stats.totalOrders },
              { label: "Products", value: stats.totalProducts },
              { label: "Customers", value: stats.totalUsers },
            ].map((s) => (
              <div key={s.label} className="border border-line p-6">
                <p className="text-xs text-mute mb-2">{s.label}</p>
                <p className="font-display text-3xl">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="font-display text-lg mb-4">Low stock alerts</p>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-sm text-mute">All products are well stocked.</p>
            ) : (
              <div className="divide-y divide-line border-t border-b border-line">
                {stats.lowStockProducts.map((p) => (
                  <div key={p._id} className="py-3 flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-rust">
                      {p.variants
                        .filter((v) => v.stock < 5)
                        .map((v) => `${v.size}/${v.color}: ${v.stock}`)
                        .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
