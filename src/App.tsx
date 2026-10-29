import { useMemo, useState } from "react";
import { Search, ShoppingBag, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";

type Product = { id: number; name: string; category: string; price: number; emoji: string; description: string };
type CartItem = { product: Product; quantity: number };
const products: Product[] = [
  { id: 1, name: "Studio Headphones", category: "Electronics", price: 3499, emoji: "🎧", description: "Comfort-focused wireless listening." },
  { id: 2, name: "Everyday Backpack", category: "Accessories", price: 1899, emoji: "🎒", description: "A tidy carry for daily essentials." },
  { id: 3, name: "Desk Lamp", category: "Home", price: 1299, emoji: "💡", description: "Warm light for focused work." },
  { id: 4, name: "Ceramic Mug", category: "Home", price: 499, emoji: "☕", description: "A simple companion for a coffee break." },
  { id: 5, name: "Fitness Bottle", category: "Accessories", price: 699, emoji: "🥤", description: "Reusable bottle for everyday hydration." },
  { id: 6, name: "Compact Keyboard", category: "Electronics", price: 2499, emoji: "⌨️", description: "A compact layout for your desk." }
];
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const visible = useMemo(() => products.filter(p => (category === "All" || p.category === category) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  function add(product: Product) {
    setSuccess(false);
    setCart(old => old.some(i => i.product.id === product.id) ? old.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { product, quantity: 1 }]);
  }
  function change(id: number, delta: number) {
    setCart(old => old.map(i => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!cart.length) next.cart = "Add at least one product before checkout.";
    setErrors(next);
    if (Object.keys(next).length === 0) { setSuccess(true); setCheckout(false); setCart([]); setCartOpen(false); }
  }
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">A</span><span>arrow<span style={{color:"#657ce0"}}>market</span><small className="muted" style={{display:"block",fontSize:".7rem",fontWeight:500}}>A storefront demo</small></span></div>
      <button className="btn" onClick={() => setCartOpen(v => !v)} aria-expanded={cartOpen}><ShoppingBag size={18}/> Cart ({count})</button></header>
    <section style={{marginBottom:28}}><p className="eyebrow">Thoughtful everyday goods</p><h1 className="page-title">Find your next favorite.</h1><p className="lead">Explore a curated demo catalog. Search, filter, add products to your bag, and try the checkout flow.</p></section>
    {success && <p className="success" role="status"><CheckCircle2 size={18} style={{verticalAlign:"middle",marginRight:8}}/>Demo order submitted successfully. No payment was taken.</p>}
    <div className="toolbar" style={{marginBottom:20}}>
      <label style={{position:"relative",flex:2}}><span style={{position:"absolute",left:12,top:12,color:"#68748a"}}><Search size={17}/></span><input className="search-input" aria-label="Search products" placeholder="Search products..." value={query} onChange={e => setQuery(e.target.value)} style={{paddingLeft:38}}/></label>
      <label><span className="eyebrow" style={{display:"block",marginBottom:5}}>Category</span><select className="search-input" aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
    </div>
    <div className="grid grid-3">
      {visible.map(p => <article className="panel product-card" key={p.id}><div style={{background:"#f4f6fb",borderRadius:15,padding:22,textAlign:"center"}}><span className="product-emoji" aria-hidden="true">{p.emoji}</span></div><div><span className="pill">{p.category}</span><h2 style={{margin:"10px 0 5px"}}>{p.name}</h2><p className="muted" style={{margin:"0 0 12px",lineHeight:1.5}}>{p.description}</p><div className="price">{money(p.price)}</div></div><button className="btn" onClick={() => add(p)}><Plus size={17}/> Add to bag</button></article>)}
    </div>
    {visible.length === 0 && <div className="empty" role="status"><h3>No products found</h3>Try another search term or category.</div>}
    {cartOpen && <section className="panel" style={{marginTop:22}} aria-label="Shopping cart"><div className="section-head"><h2 style={{margin:0}}>Your bag</h2><button className="btn secondary" onClick={() => setCartOpen(false)}>Close</button></div>
      {cart.length === 0 ? <div className="empty">Your bag is empty. Add a product to get started.</div> : <><div className="grid">{cart.map(i => <div key={i.product.id} style={{display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #edf0f5",padding:"10px 0"}}><span className="product-emoji" aria-hidden="true">{i.product.emoji}</span><div style={{flex:1}}><strong>{i.product.name}</strong><div className="muted">{money(i.product.price)} each</div></div><button className="btn secondary" aria-label={`Decrease ${i.product.name}`} onClick={() => change(i.product.id,-1)}><Minus size={15}/></button><span aria-label="Quantity">{i.quantity}</span><button className="btn secondary" aria-label={`Increase ${i.product.name}`} onClick={() => change(i.product.id,1)}><Plus size={15}/></button><button className="btn danger" aria-label={`Remove ${i.product.name}`} onClick={() => setCart(old => old.filter(x => x.product.id !== i.product.id))}><Trash2 size={15}/></button></div>)}</div><div style={{display:"flex",justifyContent:"space-between",margin:"18px 0",fontWeight:800}}><span>Demo subtotal</span><span>{money(total)}</span></div><p className="muted" style={{fontSize:".8rem"}}>Demo only. Shipping, taxes and payment processing are not implemented.</p><button className="btn" onClick={() => {setCheckout(true);setCartOpen(false);setErrors({});}}>Continue to checkout</button></>}
      {errors.cart && <p className="error">{errors.cart}</p>}
    </section>}
    {checkout && <section className="panel" style={{marginTop:22,maxWidth:650}}><h2>Checkout details</h2><p className="muted">This demo validates contact details but does not take payment.</p><form onSubmit={submit} noValidate><div className="field"><label htmlFor="customer-name">Full name</label><input id="customer-name" value={name} onChange={e=>setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name?"name-error":undefined}/>{errors.name&&<p className="error" id="name-error">{errors.name}</p>}</div><div className="field"><label htmlFor="customer-email">Email address</label><input id="customer-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email?"email-error":undefined}/>{errors.email&&<p className="error" id="email-error">{errors.email}</p>}</div><div className="toolbar"><button className="btn" type="submit">Place demo order · {money(total)}</button><button className="btn secondary" type="button" onClick={()=>setCheckout(false)}>Cancel</button></div></form></section>}
    <footer>Arrowstack Frontend Development Internship · E-commerce demo · No real transactions</footer>
  </div>;
}
