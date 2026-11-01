import { useEffect, useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "Relaxed Linen Shirt",
    category: "Shirts",
    price: 1499,
    color: "Sand",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85",
    description: "A breathable linen-blend shirt made for everyday comfort.",
  },
  {
    id: 2,
    name: "Everyday Cotton Tee",
    category: "T-Shirts",
    price: 899,
    color: "Off White",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
    description: "A soft cotton essential with a relaxed silhouette.",
  },
  {
    id: 3,
    name: "Relaxed Straight Trousers",
    category: "Trousers",
    price: 1799,
    color: "Olive",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85",
    description: "Easy-fit trousers designed for effortless styling.",
  },
  {
    id: 4,
    name: "Classic Overshirt",
    category: "Shirts",
    price: 1899,
    color: "Stone",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    description: "A versatile layering piece for your daily wardrobe.",
  },
  {
    id: 5,
    name: "Minimal Knit Top",
    category: "T-Shirts",
    price: 1299,
    color: "Cream",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85",
    description: "A clean, minimal top with a soft textured finish.",
  },
  {
    id: 6,
    name: "Everyday Tote",
    category: "Accessories",
    price: 699,
    color: "Natural",
    image:
      "https://images.unsplash.com/photo-1590870881571-8eeea1c8c147?auto=format&fit=crop&w=800&q=85",
    description: "A practical carry-all for your everyday essentials.",
  },
  {
    id: 7,
    name: "Relaxed Summer Shirt",
    category: "Shirts",
    price: 1599,
    color: "Blue",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85",
    description: "A lightweight shirt for warm days and relaxed evenings.",
  },
  {
    id: 8,
    name: "Essential Hoodie",
    category: "T-Shirts",
    price: 1999,
    color: "Charcoal",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85",
    description: "A comfortable everyday layer with a timeless fit.",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notice, setNotice] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= 2500 ? 0 : 99;
  const total = subtotal + shipping;

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.color.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 4);
  }, [search]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenu(false);
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to cart`);
  }

  function updateQuantity(productId, change) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.id !== productId));
    setNotice("Product removed from cart");
  }

  function chooseSuggestion(product) {
    setSearch(product.name);
    setCategory("All");
    setShowSuggestions(false);
    navigate("collection");
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    setShowSuggestions(false);
    setCategory("All");
    navigate("collection");
  }

  function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setNotice("Your cart is empty");
      navigate("collection");
      return;
    }

    setOrderPlaced(true);
    setCart([]);
  }

  function ProductCard({ product }) {
    return (
      <article className="product-card">
        <div className="product-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <button
            className="quick-add"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            + Add to cart
          </button>
        </div>
        <div className="product-info">
          <div>
            <p className="product-category">{product.category}</p>
            <h3>{product.name}</h3>
            <p className="product-color">{product.color}</p>
          </div>
          <strong>{money(product.price)}</strong>
        </div>
      </article>
    );
  }

  return (
    <div className="app">
      <div className="announcement">
        Complimentary shipping on orders above ₹2,500
      </div>

      <header className="site-header">
        <button
          className="menu-toggle"
          onClick={() => setMobileMenu((open) => !open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <button className="logo" onClick={() => navigate("home")}>
          ROVAN<span>.</span>
        </button>

        <nav className={`main-nav ${mobileMenu ? "nav-open" : ""}`}>
          <button
            className={page === "home" ? "active" : ""}
            onClick={() => navigate("home")}
          >
            Home
          </button>
          <button
            className={page === "collection" ? "active" : ""}
            onClick={() => navigate("collection")}
          >
            Collection
          </button>
          <button
            className={page === "cart" ? "active" : ""}
            onClick={() => navigate("cart")}
          >
            Cart
          </button>
          <button
            className={page === "checkout" ? "active" : ""}
            onClick={() => navigate("checkout")}
          >
            Checkout
          </button>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={search}
              placeholder="Search products..."
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              aria-label="Search products"
            />
            <button type="submit" aria-label="Submit search">
             ⌕
            </button>

            {showSuggestions && search.trim() && (
              <div className="suggestions">
                {suggestions.length ? (
                  suggestions.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseSuggestion(product)}
                    >
                      <img src={product.image} alt="" />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{money(product.price)}</small>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="no-suggestions">No matching products</p>
                )}
                <button
                  type="button"
                  className="all-results"
                  onClick={() => handleSearchSubmit({ preventDefault() {} })}
                >
                  View all results
                </button>
              </div>
            )}
          </form>

          <button
            className="cart-icon"
            onClick={() => navigate("cart")}
            aria-label="Open cart"
          >
            ♧ <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {notice && <div className="toast">{notice}</div>}

      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">THE EVERYDAY EDIT</p>
              <h1>Wear the everyday, beautifully.</h1>
              <p>
                Thoughtful essentials. Easy silhouettes. Pieces made to move
                with you, every day.
              </p>
              <button className="primary-btn" onClick={() => navigate("collection")}>
                Shop the collection <span>↗</span>
              </button>
              <div className="hero-note">
                <span>01 / 03</span>
                <span>Everyday essentials, thoughtfully made</span>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-153910 쓸
                623?auto=format&fit=crop&w=1400&q=90"
                alt="Minimal everyday fashion"
              />
              <div className="image-label">A softer kind of style</div>
            </div>
          </section>

          <section className="category-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">FIND YOUR EVERYDAY</p>
                <h2>Shop by category</h2>
              </div>
              <button className="text-link" onClick={() => navigate("collection")}>
                Explore all ↗
              </button>
            </div>

            <div className="category-grid">
              {[
                ["Shirts", "01"],
                ["T-Shirts", "02"],
                ["Trousers", "03"],
                ["Accessories", "04"],
              ].map(([name, number]) => (
                <button
                  className="category-tile"
                  key={name}
                  onClick={() => {
                    setCategory(name);
                    setSearch("");
                    navigate("collection");
                  }}
                >
                  <span>{number}</span>
                  <strong>{name}</strong>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </section>

          <section className="featured-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CURATED FOR YOU</p>
                <h2>Everyday favourites</h2>
              </div>
              <button className="text-link" onClick={() => navigate("collection")}>
                View collection ↗
              </button>
            </div>

            <div className="product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="story-banner">
            <div className="story-image">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
                alt="Everyday fashion collection"
                loading="lazy"
              />
            </div>
            <div className="story-copy">
              <p className="eyebrow">LESS, BUT BETTER</p>
              <h2>Made for the moments in between.</h2>
              <p>
                We believe the best wardrobe is the one you reach for again and
                again. Simple pieces, thoughtful details, and comfort that lasts.
              </p>
              <button className="text-link" onClick={() => navigate("collection")}>
                Discover ROVAN ↗
              </button>
            </div>
          </section>

          <Newsletter />
        </main>
      )}

      {page === "collection" && (
        <main className="page-container collection-page">
          <div className="page-intro">
            <p className="eyebrow">THE ROVAN EDIT</p>
            <h1>Our collection</h1>
            <p>Everyday pieces designed to feel good and look effortless.</p>
          </div>

          <div className="collection-toolbar">
            <div className="filter-buttons">
              {["All", "Shirts", "T-Shirts", "Trousers", "Accessories"].map(
                (item) => (
                  <button
                    key={item}
                    className={category === item ? "filter-active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
            <span>{filteredProducts.length} products</span>
          </div>

          <div className="collection-search">
            <label htmlFor="collection-search">Search collection</label>
            <input
              id="collection-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category or colour..."
            />
            {search && (
              <button onClick={() => setSearch("")}>Clear</button>
            )}
          </div>

          {filteredProducts.length ? (
            <div className="product-grid collection-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try another search or category.</p>
              <button
                className="primary-btn"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </main>
      )}

      {page === "cart" && (
        <main className="page-container cart-page">
          <div className="page-intro">
            <p className="eyebrow">YOUR SELECTION</p>
            <h1>Shopping cart</h1>
            <p>{cartCount} items in your bag</p>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-bag">♧</div>
              <h2>Your bag is waiting</h2>
              <p>Discover everyday pieces you'll love wearing.</p>
              <button className="primary-btn" onClick={() => navigate("collection")}>
                Explore collection
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <p className="product-category">{item.category}</p>
                      <h3>{item.name}</h3>
                      <p className="product-color">{item.color}</p>
                      <strong>{money(item.price)}</strong>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </article>
                ))}
                <button className="text-link" onClick={() => navigate("collection")}>
                  ← Continue shopping
                </button>
              </div>

              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                onCheckout={() => navigate("checkout")}
              />
            </div>
          )}
        </main>
      )}

      {page === "checkout" && (
        <main className="page-container checkout-page">
          {orderPlaced ? (
            <div className="order-success">
              <div className="success-mark">✓</div>
              <p className="eyebrow">ORDER CONFIRMED</p>
              <h1>Thank you for your order.</h1>
              <p>
                This is a frontend demo. Your order has been simulated
                successfully.
              </p>
              <button
                className="primary-btn"
                onClick={() => {
                  setOrderPlaced(false);
                  navigate("home");
                }}
              >
                Back to home
              </button>
            </div>
          ) : (
            <>
              <div className="page-intro">
                <p className="eyebrow">ALMOST YOURS</p>
                <h1>Checkout</h1>
                <p>Enter your details to complete your order.</p>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state">
                  <h2>Your cart is empty</h2>
                  <button className="primary-btn" onClick={() => navigate("collection")}>
                    Shop collection
                  </button>
                </div>
              ) : (
                <div className="checkout-layout">
                  <form className="checkout-form" onSubmit={placeOrder}>
                    <h2>Shipping information</h2>
                    <div className="form-row">
                      <label>
                        First name
                        <input name="firstName" required placeholder="First name" />
                      </label>
                      <label>
                        Last name
                        <input name="lastName" required placeholder="Last name" />
                      </label>
                    </div>
                    <label>
                      Email address
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        name="phone"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile number"
                      />
                    </label>
                    <label>
                      Address
                      <input name="address" required placeholder="House / street address" />
                    </label>
                    <div className="form-row">
                      <label>
                        City
                        <input name="city" required placeholder="City" />
                      </label>
                      <label>
                        PIN code
                        <input
                          name="pincode"
                          required
                          pattern="[0-9]{6}"
                          placeholder="6-digit PIN"
                        />
                      </label>
                    </div>
                    <label>
                      Payment method
                      <select name="payment" required defaultValue="cod">
                        <option value="cod">Cash on Delivery</option>
                        <option value="upi">UPI (demo)</option>
                        <option value="card">Credit / Debit Card (demo)</option>
                      </select>
                    </label>
                    <p className="demo-note">
                      Demo checkout only. No real payment is processed.
                    </p>
                    <button className="primary-btn full-btn" type="submit">
                      Place order · {money(total)}
                    </button>
                  </form>

                  <OrderSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                    items={cart}
                  />
                </div>
              )}
            </>
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-brand">
          <button className="logo footer-logo" onClick={() => navigate("home")}>
            ROVAN<span>.</span>
          </button>
          <p>Thoughtful essentials for everyday living.</p>
        </div>
        <div className="footer-links">
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => navigate("collection")}>Collection</button>
          <button onClick={() => navigate("cart")}>Cart</button>
          <button onClick={() => navigate("checkout")}>Checkout</button>
        </div>
        <p className="copyright">© 2026 ROVAN. Demo ecommerce project.</p>
      </footer>
    </div>
  );
}

function OrderSummary({ subtotal, shipping, total, onCheckout, items }) {
  return (
    <aside className="order-summary">
      <h2>Order summary</h2>

      {items?.length > 0 && (
        <div className="summary-products">
          {items.map((item) => (
            <div className="summary-product" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <small>Qty: {item.quantity}</small>
              </div>
              <span>{money(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="summary-line">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className="summary-line">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : money(shipping)}</span>
      </div>
      <div className="summary-line summary-total">
        <strong>Total</strong>
        <strong>{money(total)}</strong>
      </div>

      {onCheckout && (
        <button className="primary-btn full-btn" onClick={onCheckout}>
          Proceed to checkout →
        </button>
      )}

      <p className="summary-note">
        {subtotal >= 2500
          ? "You've unlocked complimentary shipping."
          : `Add ${money(Math.max(0, 2500 - subtotal))} more for free shipping.`}
      </p>
    </aside>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function submitNewsletter(event) {
    event.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="newsletter">
      <p className="eyebrow">A LITTLE NOTE FROM US</p>
      <h2>Good things, occasionally.</h2>
      <p>Get collection updates and thoughtful everyday inspiration.</p>
      {subscribed ? (
        <div className="newsletter-success">Thanks for subscribing!</div>
      ) : (
        <form onSubmit={submitNewsletter}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            aria-label="Your email address"
          />
          <button type="submit">Subscribe ↗</button>
        </form>
      )}
    </section>
  );
}

export default App;