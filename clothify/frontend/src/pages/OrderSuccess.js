import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  return (
    <div className="max-w-content mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-wide text-mute mb-4">Order confirmed</p>
      <h1 className="font-display text-4xl mb-4">Thank you.</h1>
      <p className="text-sm text-ink/70 mb-10">
        Your order {order ? `#${order._id.slice(-8).toUpperCase()}` : ""} is on its way to being
        packed. A confirmation has been sent to your email.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/orders" className="btn-secondary">
          View orders
        </Link>
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
