export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="max-w-content mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl mb-3">Clothify</p>
          <p className="text-sm text-paper/60 leading-relaxed">
            Considered clothing, made to last. Small runs, honest materials.
          </p>
        </div>
        <div>
          <p className="text-xs text-paper/50 mb-3">Shop</p>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>Outerwear</li>
            <li>Tops</li>
            <li>Bottoms</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div>
          <p className="text-xs text-paper/50 mb-3">Support</p>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>Shipping</li>
            <li>Returns</li>
            <li>Size guide</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="text-xs text-paper/50 mb-3">Company</p>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>About</li>
            <li>Materials</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-6 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} Clothify. All rights reserved.
      </div>
    </footer>
  );
}
