import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-stone overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {onSale && (
          <span className="absolute top-3 left-3 bg-rust text-paper text-[11px] px-2 py-1">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm text-ink">{product.name}</h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            {colors.slice(0, 4).map((c) => {
              const v = product.variants.find((x) => x.color === c);
              return (
                <span
                  key={c}
                  title={c}
                  className="w-3 h-3 rounded-full border border-line"
                  style={{ backgroundColor: v?.colorHex }}
                />
              );
            })}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-ink">${product.price}</p>
          {onSale && (
            <p className="text-xs text-mute line-through">${product.compareAtPrice}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
