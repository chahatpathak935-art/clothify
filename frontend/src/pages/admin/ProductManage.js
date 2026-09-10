import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  category: "tops",
  gender: "unisex",
  price: "",
  compareAtPrice: "",
  images: "",
  isFeatured: false,
  variants: [{ size: "M", color: "Black", colorHex: "#111111", stock: 10 }],
};

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    api.get("/products", { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      gender: p.gender,
      price: p.price,
      compareAtPrice: p.compareAtPrice || "",
      images: p.images.join(", "),
      isFeatured: p.isFeatured,
      variants: p.variants.map((v) => ({
        size: v.size,
        color: v.color,
        colorHex: v.colorHex,
        stock: v.stock,
      })),
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const updateVariant = (i, field, value) => {
    const next = [...form.variants];
    next[i] = { ...next[i], [field]: value };
    setForm({ ...form, variants: next });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { size: "M", color: "Black", colorHex: "#111111", stock: 0 }],
    });
  };

  const removeVariant = (i) => {
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        variants: form.variants.map((v) => ({ ...v, stock: Number(v.stock) })),
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Products</h1>
        <nav className="flex gap-6 text-sm">
          <Link to="/admin" className="text-ink/60 hover:text-ink">
            Overview
          </Link>
          <Link to="/admin/products" className="text-ink">
            Products
          </Link>
          <Link to="/admin/orders" className="text-ink/60 hover:text-ink">
            Orders
          </Link>
        </nav>
      </div>

      <button onClick={openNew} className="btn-primary mb-8">
        + Add product
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-line p-6 mb-10 space-y-4">
          <p className="font-display text-lg">{editingId ? "Edit product" : "New product"}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Name"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Slug (auto-generated if blank)"
              className="input-field"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>

          <textarea
            required
            placeholder="Description"
            rows={3}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid md:grid-cols-4 gap-4">
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["outerwear", "tops", "bottoms", "dresses", "footwear", "accessories"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              {["men", "women", "unisex"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              placeholder="Price"
              className="input-field"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Compare-at price"
              className="input-field"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            />
          </div>

          <input
            required
            placeholder="Image URLs, comma-separated"
            className="input-field"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            Featured on homepage
          </label>

          <div>
            <p className="text-xs tracking-wide text-mute mb-3">Variants (size / color / stock)</p>
            <div className="space-y-2">
              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                  <input
                    placeholder="Size"
                    className="input-field"
                    value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                  />
                  <input
                    placeholder="Color name"
                    className="input-field"
                    value={v.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                  />
                  <input
                    type="color"
                    className="h-11 w-full border border-line"
                    value={v.colorHex}
                    onChange={(e) => updateVariant(i, "colorHex", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    className="input-field"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-xs text-rust"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="text-xs underline mt-3">
              + Add variant
            </button>
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save product"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-line border-t border-b border-line">
        {products.map((p) => (
          <div key={p._id} className="py-4 flex items-center gap-4">
            <img src={p.images[0]} alt="" className="w-12 h-16 object-cover bg-stone" />
            <div className="flex-1">
              <p className="text-sm">{p.name}</p>
              <p className="text-xs text-mute">
                ${p.price} · {p.variants.reduce((s, v) => s + v.stock, 0)} in stock
              </p>
            </div>
            <button onClick={() => openEdit(p)} className="text-xs underline">
              Edit
            </button>
            <button onClick={() => handleDelete(p._id)} className="text-xs text-rust underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
