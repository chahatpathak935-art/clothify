import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products/featured").then(({ data }) => setFeatured(data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-content mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-wide text-mute mb-5">Autumn / Winter Collection</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
            Clothes built to
            <br />
            <span className="italic">outlast</span> the season.
          </h1>
          <p className="text-ink/70 max-w-md mb-8 leading-relaxed">
            Small production runs, natural fibers, and construction that holds up.
            No trend cycles — just pieces you'll still reach for in ten years.
          </p>
          <Link to="/shop" className="btn-primary">
            Shop the collection
          </Link>
        </div>
        <div className="aspect-[4/5] bg-stone overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1000"
            alt="Model wearing a wool overcoat"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Category strip */}
      <section className="max-w-content mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Outerwear", cat: "outerwear", img: "1539533018447-63fcce2678e3" },
          { label: "Knitwear", cat: "tops", img: "1576871337622-98d48d1cf531" },
          { label: "Denim", cat: "bottoms", img: "1541099649105-f69ad21f3246" },
          { label: "Footwear", cat: "footwear", img: "1608256246200-53e635b5b65f" },
        ].map((c) => (
          <Link key={c.cat} to={`/shop?category=${c.cat}`} className="group">
            <div className="aspect-[3/4] bg-stone overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${c.img}?w=600`}
                alt={c.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="mt-3 text-sm">{c.label}</p>
          </Link>
        ))}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-content mx-auto px-6 pb-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl">Featured pieces</h2>
            <Link to="/shop" className="text-sm underline underline-offset-4">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Values band */}
      <section className="bg-stone">
        <div className="max-w-content mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <p className="font-display text-lg mb-2">Natural materials</p>
            <p className="text-ink/70 leading-relaxed">
              Wool, cotton, linen, and leather sourced from mills we've worked with for years.
            </p>
          </div>
          <div>
            <p className="font-display text-lg mb-2">Made in small runs</p>
            <p className="text-ink/70 leading-relaxed">
              We produce in limited quantities to reduce waste and keep quality high.
            </p>
          </div>
          <div>
            <p className="font-display text-lg mb-2">Free returns</p>
            <p className="text-ink/70 leading-relaxed">
              Not the right fit? Send it back within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
