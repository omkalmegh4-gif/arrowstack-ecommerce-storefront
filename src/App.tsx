import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  description: string;
  color: string;
  label: string;
};
type CartItem = { product: Product; quantity: number };
type CheckoutErrors = { name?: string; email?: string; cart?: string };

const products: Product[] = [
  { id: 1, name: "Studio Headphones", category: "Technology", price: 3499, emoji: "🎧", description: "Rich, balanced sound. Your space, your soundtrack.", color: "#e9e3da", label: "BESTSELLER" },
  { id: 2, name: "Everyday Backpack", category: "Accessories", price: 1899, emoji: "🎒", description: "A considered carry-all for everywhere you go.", color: "#dce4da", label: "EVERYDAY PICK" },
  { id: 3, name: "Sculpted Table Lamp", category: "Home", price: 1299, emoji: "💡", description: "A softer kind of light for slower evenings.", color: "#e8d8c8", label: "DESIGN FAVORITE" },
  { id: 4, name: "Morning Ritual Mug", category: "Home", price: 499, emoji: "☕", description: "Good mornings start with the little things.", color: "#e5ded2", label: "SMALL JOY" },
  { id: 5, name: "Daily Water Bottle", category: "Accessories", price: 699, emoji: "🥤", description: "Thoughtfully made to go the extra mile.", color: "#dce4e9", label: "ON THE GO" },
  { id: 6, name: "Compact Keyboard", category: "Technology", price: 2499, emoji: "⌨️", description: "A little more focus in a beautifully small form.", color: "#e5e1eb", label: "STAFF PICK" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        (category === "All" ||
          product.category === category ||
          (category === "Favorites" && favorites.includes(product.id))) &&
        `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery),
    );
  }, [category, favorites, query]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function add(product: Product) {
    setSuccess(false);
    setCart((current) =>
      current.some((item) => item.product.id === product.id)
        ? current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { product, quantity: 1 }],
    );
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) =>
      current
        .map((item) => (item.product.id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id],
    );
  }

  function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: CheckoutErrors = {};
    if (name.trim().length < 2) nextErrors.name = "Enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!cart.length) nextErrors.cart = "Add at least one product before checkout.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSuccess(true);
      setCheckout(false);
      setCart([]);
      setCartOpen(false);
    }
  }

  return (
    <div className="storefront">
      <div className="announcement">
        <Sparkles size={14} aria-hidden="true" />
        <span>A little something good: thoughtful things for everyday life.</span>
      </div>

      <header className="shop-header">
        <a className="shop-brand" href="#home" aria-label="arrow market home" onClick={() => { setCategory("All"); setQuery(""); }}>
          <span className="shop-brand-mark">a.</span>
          <span className="shop-brand-name">arrow<span>market</span></span>
        </a>
        <nav className="shop-nav" aria-label="Shop">
          <a className={`shop-nav-link${category === "All" ? " active" : ""}`} href="#shop" aria-current={category === "All" ? "page" : undefined} onClick={() => setCategory("All")}>Shop all</a>
          <a className={`shop-nav-link${category === "Home" ? " active" : ""}`} href="#shop" aria-current={category === "Home" ? "page" : undefined} onClick={() => setCategory("Home")}>Home</a>
          <a className={`shop-nav-link${category === "Accessories" ? " active" : ""}`} href="#shop" aria-current={category === "Accessories" ? "page" : undefined} onClick={() => setCategory("Accessories")}>Accessories</a>
          <a className={`shop-nav-link${category === "Technology" ? " active" : ""}`} href="#shop" aria-current={category === "Technology" ? "page" : undefined} onClick={() => setCategory("Technology")}>Technology</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button favorite-link" type="button" aria-label={`Favorites (${favorites.length})`} onClick={() => setCategory(category === "Favorites" ? "All" : "Favorites")} aria-pressed={category === "Favorites"}>
            <Heart size={19} aria-hidden="true" />
            <span className="favorite-count">{favorites.length}</span>
          </button>
          <button className="cart-button" type="button" onClick={() => { setCartOpen((open) => !open); setCheckout(false); }} aria-label={`Shopping cart, ${count} ${count === 1 ? "item" : "items"}`} aria-expanded={cartOpen} aria-controls="shopping-cart">
            <ShoppingBag size={17} aria-hidden="true" />
            <span>Bag</span>
            <span className="cart-count" aria-label={`${count} items in bag`}>{count}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="hero-kicker-line" /> A MORE THOUGHTFUL EVERYDAY</span>
            <h1 id="hero-heading">Find joy in<br />the <em>everyday.</em></h1>
            <p>Considered pieces for the spaces you love and the life you live. Nothing extra — just really good things.</p>
            <a className="hero-cta" href="#shop">Discover the collection <ArrowDown size={16} aria-hidden="true" /></a>
            <div className="hero-notes"><span>01 — Thoughtfully picked</span><span>02 — Made for real life</span></div>
          </div>
          <div className="hero-art" aria-label="A curated collection of everyday objects">
            <span className="hero-art-note">THE EVERYDAY<br />COLLECTION — N° 01</span>
            <span className="hero-orbit hero-orbit-one" />
            <span className="hero-orbit hero-orbit-two" />
            <span className="hero-art-product hero-art-lamp" aria-hidden="true">💡</span>
            <span className="hero-art-product hero-art-mug" aria-hidden="true">☕</span>
            <span className="hero-art-product hero-art-headphones" aria-hidden="true">🎧</span>
            <span className="hero-art-label">The small things.<br /><strong>A bigger feeling.</strong></span>
            <span className="hero-art-index">AM / 2026</span>
          </div>
        </section>

        <div className="trust-bar" aria-label="Shopping information">
          <span><Truck size={17} aria-hidden="true" /> Free shipping over ₹2,000</span>
          <span><ShieldCheck size={17} aria-hidden="true" /> Thoughtfully made, always</span>
          <span><CheckCircle2 size={17} aria-hidden="true" /> Easy 7-day returns</span>
        </div>

        {success && (
          <p className="order-success" role="status">
            <CheckCircle2 size={19} aria-hidden="true" />
            <span><strong>Order received.</strong> Thanks, {name.trim()} — this was a demo order. No payment was taken.</span>
          </p>
        )}

        <section className="collection" id="shop" aria-labelledby="collection-heading">
          <div className="collection-heading">
            <div>
              <span className="section-kicker">THE GOOD STUFF, ALL IN ONE PLACE</span>
              <h2 id="collection-heading">The collection<span className="collection-period">.</span></h2>
            </div>
            <p>Small details. Better days.<br />Meet your new everyday favorites.</p>
          </div>

          <div className="collection-toolbar">
            <div className="category-tabs" role="group" aria-label="Product category">
              {categories.map((item) => (
                <button
                  type="button"
                  className={`category-tab${category === item ? " selected" : ""}`}
                  key={item}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
              {favorites.length > 0 && (
                <button type="button" className={`category-tab${category === "Favorites" ? " selected" : ""}`} aria-pressed={category === "Favorites"} onClick={() => setCategory(category === "Favorites" ? "All" : "Favorites")}>
                  <Heart size={14} aria-hidden="true" /> Favorites
                </button>
              )}
            </div>
            <label className="shop-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search products</span>
              <input aria-label="Search products" placeholder="Find something..." value={query} onChange={(event) => setQuery(event.target.value)} />
              {query && <button className="search-clear" type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={15} aria-hidden="true" /></button>}
            </label>
          </div>

          <div className="product-grid">
            {visible.map((product, index) => {
              const isFavorite = favorites.includes(product.id);
              const inBag = cart.find((item) => item.product.id === product.id)?.quantity ?? 0;
              return (
                <article className="product-card" key={product.id}>
                  <div className={`product-art product-art-${product.id}`} style={{ backgroundColor: product.color }}>
                    <span className="product-badge">{product.label}</span>
                    <span className="product-emoji" aria-hidden="true">{product.emoji}</span>
                    <button className={`favorite-button${isFavorite ? " is-favorite" : ""}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${isFavorite ? "from" : "to"} favorites`} aria-pressed={isFavorite}>
                      <Heart size={17} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
                    </button>
                    <span className="product-index">0{index + 1} / 0{products.length}</span>
                  </div>
                  <div className="product-details">
                    <div className="product-copy">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="product-buy-row">
                      <span className="product-price">{money(product.price)}</span>
                      <button className={`add-button${inBag > 0 ? " added-to-bag" : ""}`} type="button" onClick={() => add(product)} aria-label={`Add to bag: ${product.name}`}>
                        <span>{inBag > 0 ? "Add another" : "Add to bag"}</span>
                        {inBag > 0 ? <span className="added-count"><Check size={13} aria-hidden="true" /> {inBag}</span> : <Plus size={16} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {visible.length === 0 && (
            <div className="collection-empty" role="status">
              <Search size={22} aria-hidden="true" />
              <h3>{category === "Favorites" ? "No favorites just yet." : "Nothing found just yet."}</h3>
              <p>{category === "Favorites" ? "Tap the heart on something you love to save it here." : "Try another search or browse a different category."}</p>
              <button className="reset-filter" type="button" onClick={() => { setQuery(""); setCategory("All"); }}>View everything <ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          )}
        </section>

        {cartOpen && !checkout && (
          <section className="cart-panel" id="shopping-cart" aria-label="Shopping cart">
            <div className="cart-panel-heading">
              <div><span className="section-kicker">THE GOOD THINGS</span><h2>Your bag <span>({count})</span></h2></div>
              <button className="icon-button close-cart" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={19} aria-hidden="true" /></button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty"><ShoppingBag size={25} aria-hidden="true" /><p>Your bag is taking a little break.</p><span>Find something that makes your day.</span></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <div className="cart-item-art" style={{ backgroundColor: item.product.color }}><span aria-hidden="true">{item.product.emoji}</span></div>
                      <div className="cart-item-info">
                        <strong>{item.product.name}</strong>
                        <span>{money(item.product.price)}</span>
                        <div className="quantity-control">
                          <button type="button" aria-label={`Decrease ${item.product.name}`} onClick={() => changeQuantity(item.product.id, -1)}><Minus size={13} aria-hidden="true" /></button>
                          <span aria-label="Quantity">{item.quantity}</span>
                          <button type="button" aria-label={`Increase ${item.product.name}`} onClick={() => changeQuantity(item.product.id, 1)}><Plus size={13} aria-hidden="true" /></button>
                        </div>
                      </div>
                      <div className="cart-item-end">
                        <strong>{money(item.product.price * item.quantity)}</strong>
                        <button className="remove-item" type="button" aria-label={`Remove ${item.product.name}`} onClick={() => setCart((current) => current.filter((entry) => entry.product.id !== item.product.id))}><Trash2 size={15} aria-hidden="true" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="subtotal-row"><span>Subtotal</span><strong>{money(total)}</strong></div>
                  <p>Shipping and any applicable taxes are calculated at checkout.</p>
                  <button className="checkout-button" type="button" onClick={() => { setCheckout(true); setCartOpen(false); setErrors({}); }}>
                    Continue to checkout <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <span className="demo-caption"><ShieldCheck size={13} aria-hidden="true" /> Secure demo · no payment collected</span>
                </div>
              </>
            )}
          </section>
        )}

        {checkout && (
          <section className="checkout-panel" aria-labelledby="checkout-heading">
            <div className="checkout-intro">
              <span className="section-kicker">ALMOST YOURS</span>
              <h2 id="checkout-heading">The final little details.</h2>
              <p>We only need your contact details for this demo. No payment information is collected.</p>
            </div>
            <form onSubmit={submitCheckout} noValidate>
              <label className="checkout-field" htmlFor="customer-name">
                <span>Full name</span>
                <input id="customer-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Your name" />
                {errors.name && <span className="checkout-error" id="name-error">{errors.name}</span>}
              </label>
              <label className="checkout-field" htmlFor="customer-email">
                <span>Email address</span>
                <input id="customer-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} placeholder="you@example.com" />
                {errors.email && <span className="checkout-error" id="email-error">{errors.email}</span>}
              </label>
              {errors.cart && <p className="checkout-error" role="alert">{errors.cart}</p>}
              <div className="checkout-summary"><span>{count} {count === 1 ? "item" : "items"} · demo total</span><strong>{money(total)}</strong></div>
              <div className="checkout-actions">
                <button className="checkout-button" type="submit">Place demo order <ArrowRight size={17} aria-hidden="true" /></button>
                <button className="back-button" type="button" onClick={() => { setCheckout(false); setCartOpen(true); }}>Back to your bag</button>
              </div>
              <span className="demo-caption"><ShieldCheck size={13} aria-hidden="true" /> Demo only — no real payment or order will be made.</span>
            </form>
          </section>
        )}

        <section className="closing-note" aria-label="Our promise">
          <span className="closing-note-mark" aria-hidden="true">a.</span>
          <p>Less, but lovely.<br /><em>That’s our kind of everyday.</em></p>
          <span className="closing-note-signoff">GOOD THINGS, SINCE ALWAYS.</span>
        </section>
      </main>

      <footer className="shop-footer">
        <span>arrow<span className="footer-accent">market</span> <span className="footer-muted">· A storefront demo for everyday good things.</span></span>
        <a href="#home">Back to the top <ArrowRight size={13} aria-hidden="true" /></a>
        <span className="footer-disclaimer">Demo only. No real purchases or payments.</span>
      </footer>
    </div>
  );
}

export default App;
