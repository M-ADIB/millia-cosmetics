import { getProducts, allProducts } from './products.js';
import { calculateQuote } from './configurator.js';
import './style.css';

/* ═══ SHADE COLOR MAPS ═══ */
const SHADE_COLORS = {
  // Foundations
  '01 Porcelain': '#FAF0E6',
  '02 Ivory': '#F5E1D3',
  '03 Sand': '#E6C2A0',
  '04 Beige': '#DDB088',
  '05 Honey': '#C69063',
  '06 Bronze': '#A26F46',
  '07 Chestnut': '#7D4F2A',
  // Lipsticks
  'Velvet Nude': '#C48B71',
  'Desert Rose': '#A55B5C',
  'Crimson Passion': '#B11B1B',
  'Coral Crush': '#E56D60',
  'Satin Plum': '#6B3B48',
  'Berry Glaze': '#872B3F',
  // Blushes
  'Peach Glow': '#FCAE96',
  'Rosy Bloom': '#E58A8A',
  'Warm Amber': '#D38363',
  'Soft Coral': '#EC887B',
  // Highlighters
  'Champagne Dew': '#F3E5AB',
  'Rose Gold Spark': '#B76E79',
  'Bronze Goddess': '#CD7F32'
};

/* ═══ INITIAL APP STATES ═══ */
let cart = JSON.parse(localStorage.getItem('millia_cart')) || [];
let activePromoCode = localStorage.getItem('millia_promo') || '';
let activePaymentMethod = 'card';
let currentTestimonialIndex = 0;

// Filter state for catalog
const filterState = {
  search: '',
  category: 'All',
  minPrice: 0,
  maxPrice: 500,
  tags: [],
  sortBy: 'featured',
  page: 1,
  pageSize: 12
};

// UAE Branches Data
const branches = [
  // Sharjah (4)
  { name: 'Sharjah Flagship Boutique', emirate: 'Sharjah', address: 'Al Qasimia St, Industrial Area 4, Sharjah', hours: '9:00 AM - 10:00 PM', phone: '+971 6 567 1111' },
  { name: 'Sharjah City Centre', emirate: 'Sharjah', address: 'Ground Floor, Al Wahda Road, Sharjah', hours: '10:00 AM - 10:00 PM', phone: '+971 6 533 2222' },
  { name: 'Mega Mall Sharjah', emirate: 'Sharjah', address: 'Level 2, Abu Shagara, Sharjah', hours: '10:00 AM - 10:00 PM', phone: '+971 6 574 3333' },
  { name: 'Al Majaz Waterfront Store', emirate: 'Sharjah', address: 'Al Majaz Waterfront, Corniche St, Sharjah', hours: '10:00 AM - 11:00 PM', phone: '+971 6 556 4444' },
  // Dubai (4)
  { name: 'Dubai Mall Boutique', emirate: 'Dubai', address: 'Ground Floor, Near Fashion Avenue, Dubai Mall', hours: '10:00 AM - 12:00 AM', phone: '+971 4 339 3333' },
  { name: 'Mall of the Emirates Branch', emirate: 'Dubai', address: 'First Level, Near Ski Dubai, Sheikh Zayed Road', hours: '10:00 AM - 11:00 PM', phone: '+971 4 341 5555' },
  { name: 'City Centre Mirdif Boutique', emirate: 'Dubai', address: 'Ground Level, Sheikh Mohammed Bin Zayed Road', hours: '10:00 AM - 10:00 PM', phone: '+971 4 284 6666' },
  { name: 'Dubai Marina Mall Store', emirate: 'Dubai', address: 'Level 1, Dubai Marina Mall, Dubai Marina', hours: '10:00 AM - 11:00 PM', phone: '+971 4 436 7777' },
  // Abu Dhabi (2)
  { name: 'Abu Dhabi Mall Boutique', emirate: 'Abu Dhabi', address: 'First Level, Abu Dhabi Mall, Tourist Club Area', hours: '10:00 AM - 10:00 PM', phone: '+971 2 645 4444' },
  { name: 'Yas Mall Flagship', emirate: 'Abu Dhabi', address: 'Ground Floor, Yas Island, Abu Dhabi', hours: '10:00 AM - 10:00 PM', phone: '+971 2 565 8888' },
  // Other Emirates (3)
  { name: 'Ajman City Centre', emirate: 'Ajman', address: 'Al Jurf, Ajman', hours: '10:00 AM - 10:00 PM', phone: '+971 6 743 5555' },
  { name: 'Fujairah Century Mall', emirate: 'Fujairah', address: 'Al Qasr Road, Fujairah', hours: '10:00 AM - 10:00 PM', phone: '+971 9 223 6666' },
  { name: 'Al Manar Mall Branch', emirate: 'Ras Al Khaimah', address: 'Al Muntasir Road, Ras Al Khaimah', hours: '10:00 AM - 10:00 PM', phone: '+971 7 227 9999' }
];

// Testimonials Data
const testimonials = [
  { name: 'Alya Al Maktoum', role: 'Brand Owner, Glow Botanicals', text: "Millia Cosmetics' white-label manufacturing made launching our skincare line effortless. The R&D team developed custom botanical serums that our clients absolutely adore. True UAE industry leaders.", rating: 5 },
  { name: 'Fatima Al Suwaidi', role: 'Retail Customer', text: "I have been shopping at Millia's Sharjah branch since 2005. The Oasis Dew Serum is a miracle for dry skin. The quality is always consistently premium and authentic.", rating: 5 },
  { name: 'Marcus Sterling', role: 'Founder, Sterling Grooming', text: "We partner with Millia for private label hair care. Their GMP certified facility, fast turnaround times, and local Sharjah location made quality control seamless and efficient.", rating: 5 },
  { name: 'Amna K.', role: 'Beauty Blogger', text: "The Desert Rose Lipstick is a stunning formula. Extremely comfortable velvet matte that holds up all day. I love that everything is cruelty-free and locally crafted.", rating: 5 }
];

/* ═══ SPA ROUTER ═══ */
function initRouter() {
  const views = document.querySelectorAll('.spa-view');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleRoute() {
    let hash = window.location.hash || '#home';
    
    // Support sub-elements (like #whitelabel#configurator-section)
    if (hash.includes('#whitelabel')) {
      hash = '#whitelabel';
    }

    let activeViewId = `view-${hash.substring(1)}`;
    let foundView = document.getElementById(activeViewId);

    if (!foundView) {
      activeViewId = 'view-home';
      hash = '#home';
    }

    // Toggle view classes
    views.forEach(view => {
      if (view.id === activeViewId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update navbar active styling
    navLinks.forEach(link => {
      const linkHash = link.getAttribute('href');
      if (linkHash === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to page top on transition
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Custom view initializations
    if (hash === '#shop') {
      renderCatalog();
    } else if (hash === '#whitelabel') {
      updateConfiguratorQuote();
    } else if (hash === '#branches') {
      renderBranches('All');
    } else if (hash === '#home') {
      renderHomeFeatured();
    }
  }

  window.addEventListener('hashchange', handleRoute);
  // Trigger initial route
  handleRoute();
}

/* ═══ NAVBAR & GENERAL LAYOUT ═══ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('header--scrolled', scrolled);
    // Drives the announcement bar collapse + header docking to the top
    document.body.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══ SCROLL REVEAL (progressive enhancement) ═══ */
function initScrollReveal() {
  // Bail safely on older browsers — content stays fully visible
  if (typeof IntersectionObserver === 'undefined') return;

  const selectors = [
    '#view-home .hero__content',
    '#view-home .hero__visual',
    '#view-home .section__header',
    '#view-home .routine__media',
    '#view-home .routine__content',
    '#view-home .wl-callout__content',
    '#view-home .wl-callout__image-wrap',
    '.benefits-banner .benefit-item',
    '.testimonials .section__header',
    '.contact__info',
    '.contact__form'
  ];

  const targets = document.querySelectorAll(selectors.join(','));
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((el, i) => {
    // Hidden state is only applied when JS + observer are active
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.08}s`;
    observer.observe(el);
  });
}

function initBurgerMenu() {
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('headerNav');
  
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close nav on link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

/* ═══ HOME PAGE ═══ */
function renderHomeFeatured() {
  const grid = document.getElementById('homeFeaturedGrid');
  if (!grid) return;

  // Get first 4 bestsellers
  const bestSells = allProducts.filter(p => p.isBestSeller).slice(0, 4);
  
  grid.innerHTML = bestSells.map(product => `
    <div class="product-card">
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-card__tag best-seller">Best Seller</span>
        <button class="product-card__fav" data-id="${product.id}" aria-label="Wishlist">♡</button>
      </div>
      <div class="product-card__info">
        <div>
          <div class="product-card__meta">
            <span class="product-card__category">${product.category}</span>
            <span class="product-card__rating">★ ${product.rating}</span>
          </div>
          <h3 class="product-card__title">${product.name}</h3>
        </div>
        <span class="product-card__price">AED ${product.price.toFixed(2)}</span>
      </div>
      <div class="product-card__actions">
        <button class="product-card__btn-add" data-id="${product.id}">Add to Bag</button>
        <button class="product-card__btn-view" data-id="${product.id}">🔍</button>
      </div>
    </div>
  `).join('');

  attachProductGridListeners(grid);
}

/* ═══ CATALOG RENDERING ═══ */
function renderCatalog() {
  const grid = document.getElementById('catalogProductsGrid');
  if (!grid) return;

  const result = getProducts(filterState);
  
  if (result.items.length === 0) {
    grid.innerHTML = `
      <div class="no-products-state">
        <h3>No Products Found</h3>
        <p>Try clearing some filters or searching for another term.</p>
      </div>
    `;
    document.getElementById('catalogPagination').innerHTML = '';
    document.getElementById('productsCountText').textContent = 'Showing 0 products';
    return;
  }

  // Render product cards
  grid.innerHTML = result.items.map(product => `
    <div class="product-card">
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.isBestSeller ? `<span class="product-card__tag best-seller">Best Seller</span>` : ''}
        ${product.isNew ? `<span class="product-card__tag">New</span>` : ''}
        ${!product.inStock ? `<span class="product-card__tag out-of-stock">Out of Stock</span>` : ''}
        <button class="product-card__fav" data-id="${product.id}" aria-label="Wishlist">♡</button>
      </div>
      <div class="product-card__info">
        <div>
          <div class="product-card__meta">
            <span class="product-card__category">${product.category}</span>
            <span class="product-card__rating">★ ${product.rating}</span>
          </div>
          <h3 class="product-card__title">${product.name}</h3>
        </div>
        <span class="product-card__price">AED ${product.price.toFixed(2)}</span>
      </div>
      <div class="product-card__actions">
        <button class="product-card__btn-add" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Add to Bag' : 'Out of Stock'}
        </button>
        <button class="product-card__btn-view" data-id="${product.id}">🔍</button>
      </div>
    </div>
  `).join('');

  // Update counts
  const startItem = (filterState.page - 1) * filterState.pageSize + 1;
  const endItem = Math.min(filterState.page * filterState.pageSize, result.total);
  document.getElementById('productsCountText').textContent = `Showing ${startItem}–${endItem} of ${result.total} products`;

  // Render Numerical Pagination
  renderPaginationControls(result.totalPages);
  
  // Attach Event Listeners
  attachProductGridListeners(grid);
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById('catalogPagination');
  if (!container) return;

  let html = '';
  
  // Prev button
  html += `<button class="page-btn" id="page-prev" ${filterState.page === 1 ? 'disabled' : ''}>‹</button>`;

  // Numerical pages
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, and pages around current page
    if (i === 1 || i === totalPages || (i >= filterState.page - 1 && i <= filterState.page + 1)) {
      html += `<button class="page-btn ${filterState.page === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === 2 || i === totalPages - 1) {
      html += `<span class="page-dots">...</span>`;
    }
  }

  // Next button
  html += `<button class="page-btn" id="page-next" ${filterState.page === totalPages ? 'disabled' : ''}>›</button>`;

  // Filter out adjacent duplicate dots
  container.innerHTML = html.replace(/<span class="page-dots">\.\.\.<\/span>(\s*<span class="page-dots">\.\.\.<\/span>)+/g, '<span class="page-dots">...</span>');

  // Page click listeners
  container.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'page-prev') {
        filterState.page -= 1;
      } else if (btn.id === 'page-next') {
        filterState.page += 1;
      } else {
        filterState.page = parseInt(btn.getAttribute('data-page'));
      }
      renderCatalog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function attachProductGridListeners(container) {
  // Add to Bag buttons
  container.querySelectorAll('.product-card__btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      addToCart(id);
    });
  });

  // View details/QuickView
  container.querySelectorAll('.product-card__btn-view, .product-card__img-wrap').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('product-card__fav')) return; // skip wishlist heart click
      const id = el.getAttribute('data-id');
      openQuickView(id);
    });
  });

  // Wishlist heart toggle
  container.querySelectorAll('.product-card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });
}

/* ═══ CATALOG FILTER SIDEBAR CONTROLS ═══ */
function initCatalogFilters() {
  // Search input in sidebar
  const searchInput = document.getElementById('sidebarSearch');
  const clearSearch = document.getElementById('sidebarSearchClear');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.search = e.target.value;
      filterState.page = 1;
      clearSearch.style.display = filterState.search ? 'block' : 'none';
      renderCatalog();
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      filterState.search = '';
      filterState.page = 1;
      clearSearch.style.display = 'none';
      renderCatalog();
    });
  }

  // Category selection buttons
  const catOptions = document.querySelectorAll('#categoryFilterOptions .filter-opt');
  catOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      catOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      
      filterState.category = opt.getAttribute('data-category');
      filterState.page = 1;
      renderCatalog();
    });
  });

  // Price Range Slider
  const priceSlider = document.getElementById('priceRange');
  const priceLabel = document.getElementById('priceRangeLabel');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      filterState.maxPrice = parseInt(e.target.value);
      priceLabel.textContent = `Max: AED ${filterState.maxPrice}`;
      filterState.page = 1;
      renderCatalog();
    });
  }

  // Checkboxes (Best seller, New, In stock)
  const statusChecks = document.querySelectorAll('.status-filter-check');
  statusChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      const activeTags = [];
      statusChecks.forEach(c => {
        if (c.checked) activeTags.push(c.value);
      });
      filterState.tags = activeTags;
      filterState.page = 1;
      renderCatalog();
    });
  });

  // Clear All Filters
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        clearSearch.style.display = 'none';
      }
      catOptions.forEach(o => o.classList.remove('active'));
      document.querySelector('#categoryFilterOptions .filter-opt[data-category="All"]').classList.add('active');

      if (priceSlider) {
        priceSlider.value = 500;
        priceLabel.textContent = 'Max: AED 500';
      }

      statusChecks.forEach(c => c.checked = false);

      filterState.search = '';
      filterState.category = 'All';
      filterState.minPrice = 0;
      filterState.maxPrice = 500;
      filterState.tags = [];
      filterState.page = 1;

      renderCatalog();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sortBySelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      filterState.sortBy = e.target.value;
      filterState.page = 1;
      renderCatalog();
    });
  }

  // Mobile drawer controls
  const mobileToggle = document.getElementById('mobileFilterToggle');
  const sidebar = document.getElementById('shopSidebar');
  const sidebarClose = document.getElementById('sidebarClose');

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.add('active');
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }
}

/* ═══ CART DRAWER ENGINE ═══ */
function addToCart(productId, quantity = 1, shade = '', size = '') {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  // Selected details fallback
  const selectedShade = shade || (product.shades.length > 0 ? product.shades[0] : '');
  const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : '');

  // Look for match in cart
  const existing = cart.find(item => 
    item.id === productId && 
    item.shade === selectedShade && 
    item.size === selectedSize
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      shade: selectedShade,
      size: selectedSize,
      quantity
    });
  }

  saveCart();
  updateCartDrawer();
  openCartDrawer();
}

function updateCartQty(index, dir) {
  cart[index].quantity += dir;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartDrawer();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartDrawer();
}

function saveCart() {
  localStorage.setItem('millia_cart', JSON.stringify(cart));
}

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('active');
}

function updateCartDrawer() {
  const itemsContainer = document.getElementById('cartDrawerItems');
  const headerCount = document.getElementById('cartCountHeader');
  const badge = document.getElementById('cartBadge');
  
  if (!itemsContainer) return;

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  headerCount.textContent = totalItems;
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';

  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart-state">
        <p>Your shopping bag is empty.</p>
        <a href="#shop" class="btn btn--primary btn--sm mt-4" onclick="document.getElementById('cartDrawer').classList.remove('active')">Shop Collections</a>
      </div>
    `;
    document.getElementById('cartSubtotal').textContent = 'AED 0.00';
    document.getElementById('cartShipping').textContent = 'AED 0.00';
    document.getElementById('cartVAT').textContent = 'AED 0.00';
    document.getElementById('cartTotal').textContent = 'AED 0.00';
    document.getElementById('shippingMeterText').innerHTML = 'Add <strong>AED 200.00</strong> more for FREE shipping in UAE';
    document.getElementById('shippingMeterProgress').style.width = '0%';
    document.getElementById('discountRow').style.display = 'none';
    return;
  }

  // Render items
  itemsContainer.innerHTML = cart.map((item, idx) => {
    let variantText = '';
    if (item.shade && item.size) variantText = `${item.shade} / ${item.size}`;
    else if (item.shade) variantText = item.shade;
    else if (item.size) variantText = item.size;

    return `
      <div class="cart-item">
        <div class="cart-item__img-wrap">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item__info">
          <h4>${item.name}</h4>
          ${variantText ? `<div class="cart-item__variant">${variantText}</div>` : ''}
          <div class="cart-item__actions">
            <div class="qty-selector">
              <button class="qty-btn dec-qty" data-idx="${idx}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-idx="${idx}">+</button>
            </div>
            <span class="cart-item__price">AED ${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="cart-item__remove" data-idx="${idx}" aria-label="Remove item">✕</button>
      </div>
    `;
  }).join('');

  // Event Listeners inside cart list
  itemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', () => updateCartQty(parseInt(btn.getAttribute('data-idx')), -1));
  });
  itemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', () => updateCartQty(parseInt(btn.getAttribute('data-idx')), 1));
  });
  itemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeCartItem(parseInt(btn.getAttribute('data-idx'))));
  });

  // Calculate pricing values
  let discount = 0;
  if (activePromoCode === 'WELCOME10') {
    discount = subtotal * 0.10;
    document.getElementById('cartDiscount').textContent = `-AED ${discount.toFixed(2)}`;
    document.getElementById('discountRow').style.display = 'flex';
  } else {
    document.getElementById('discountRow').style.display = 'none';
  }

  const subAfterDiscount = subtotal - discount;
  const isFreeShipping = subAfterDiscount >= 200;
  const shippingFee = isFreeShipping ? 0 : 20.00;
  const vat = subAfterDiscount * 0.05;
  const grandTotal = subAfterDiscount + shippingFee + vat;

  // Update Free shipping progress bar
  if (isFreeShipping) {
    document.getElementById('shippingMeterText').innerHTML = '🎉 Your order qualifies for <strong>FREE shipping</strong> in UAE!';
    document.getElementById('shippingMeterProgress').style.width = '100%';
  } else {
    const needed = 200 - subAfterDiscount;
    document.getElementById('shippingMeterText').innerHTML = `Add <strong>AED ${needed.toFixed(2)}</strong> more for FREE shipping in UAE`;
    document.getElementById('shippingMeterProgress').style.width = `${(subAfterDiscount / 200) * 100}%`;
  }

  // Update pricing values fields
  document.getElementById('cartSubtotal').textContent = `AED ${subtotal.toFixed(2)}`;
  document.getElementById('cartShipping').textContent = shippingFee === 0 ? 'FREE' : `AED ${shippingFee.toFixed(2)}`;
  document.getElementById('cartVAT').textContent = `AED ${vat.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `AED ${grandTotal.toFixed(2)}`;
}

function initCartListeners() {
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartBackdrop = document.getElementById('cartBackdrop');
  
  if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // Promo Code
  const promoInput = document.getElementById('promoInput');
  const promoApply = document.getElementById('promoApplyBtn');
  
  if (promoInput && activePromoCode) {
    promoInput.value = activePromoCode;
  }

  if (promoApply) {
    promoApply.addEventListener('click', () => {
      const val = promoInput.value.trim().toUpperCase();
      if (val === 'WELCOME10') {
        activePromoCode = 'WELCOME10';
        localStorage.setItem('millia_promo', 'WELCOME10');
        alert('Promo code WELCOME10 applied! 10% discount subtracted.');
      } else if (val === '') {
        activePromoCode = '';
        localStorage.removeItem('millia_promo');
      } else {
        alert('Invalid promo code. Try WELCOME10');
      }
      updateCartDrawer();
    });
  }

  // Checkout trigger
  const chkBtn = document.getElementById('proceedToCheckoutBtn');
  if (chkBtn) {
    chkBtn.addEventListener('click', () => {
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

/* ═══ PRODUCT QUICK VIEW MODAL ═══ */
function openQuickView(productId) {
  const modal = document.getElementById('quickViewModal');
  const layout = document.getElementById('quickViewLayout');
  const product = allProducts.find(p => p.id === productId);

  if (!product || !modal || !layout) return;

  let activeShade = product.shades.length > 0 ? product.shades[0] : '';
  let activeSize = product.sizes.length > 0 ? product.sizes[0] : '';
  let activeQty = 1;

  function renderModalInner() {
    layout.innerHTML = `
      <!-- Left side Images -->
      <div class="qv-images">
        <img src="${product.image}" alt="${product.name}" id="qvMainImage" />
      </div>

      <!-- Right side Details -->
      <div class="qv-info">
        <span class="qv-category">${product.category}</span>
        <h2>${product.name}</h2>
        
        <div class="qv-meta">
          <div class="qv-stars">★★★★★</div>
          <span class="qv-reviews">(${product.reviewsCount} customer reviews)</span>
        </div>

        <div class="qv-price">AED ${product.price.toFixed(2)}</div>
        
        <p class="qv-desc">${product.description}</p>

        <!-- Variants Selection -->
        <div class="qv-variants">
          ${product.shades.length > 0 ? `
            <div class="qv-variant-group">
              <h4>Select Shade: <span id="qvSelectedShadeLabel" style="font-weight:600; color:var(--black);">${activeShade}</span></h4>
              <div class="swatch-list" id="qvShadesList">
                ${product.shades.map(s => `
                  <button class="swatch-btn--color ${s === activeShade ? 'active' : ''}" data-val="${s}" style="background-color: ${SHADE_COLORS[s] || '#ccc'}" data-tooltip="${s}" aria-label="${s}"></button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${product.sizes.length > 0 ? `
            <div class="qv-variant-group">
              <h4>Select Volume: <span id="qvSelectedSizeLabel" style="font-weight:600; color:var(--black);">${activeSize}</span></h4>
              <div class="swatch-list" id="qvSizesList">
                ${product.sizes.map(s => `
                  <button class="swatch-btn--size ${s === activeSize ? 'active' : ''}" data-val="${s}">${s}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Quantity Adjuster & Add To Bag -->
        <div class="qv-actions">
          <div class="qv-qty-wrap">
            <div class="qty-selector">
              <button class="qty-btn" id="qvDecBtn">-</button>
              <span class="qty-val" id="qvQtyVal">${activeQty}</span>
              <button class="qty-btn" id="qvIncBtn">+</button>
            </div>
          </div>
          <button class="btn btn--primary" id="qvAddBtn" style="flex-grow:1" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>

        <!-- Info Tabs -->
        <div class="qv-tabs">
          <div class="tab-headers">
            <button class="tab-header active" data-tab="desc">Benefits</button>
            <button class="tab-header" data-tab="ingredients">Ingredients</button>
          </div>
          
          <div class="tab-panel active" id="tab-desc">
            <ul>
              ${product.benefits.map(b => `<li>✓ ${b}</li>`).join('')}
            </ul>
          </div>
          
          <div class="tab-panel" id="tab-ingredients">
            <p class="ingredients-list">${product.ingredients.join(', ')}</p>
          </div>
        </div>

      </div>
    `;

    // Listeners inside modal content
    const shadesWrap = document.getElementById('qvShadesList');
    if (shadesWrap) {
      shadesWrap.querySelectorAll('.swatch-btn--color').forEach(btn => {
        btn.addEventListener('click', () => {
          activeShade = btn.getAttribute('data-val');
          renderModalInner();
        });
      });
    }

    const sizesWrap = document.getElementById('qvSizesList');
    if (sizesWrap) {
      sizesWrap.querySelectorAll('.swatch-btn--size').forEach(btn => {
        btn.addEventListener('click', () => {
          activeSize = btn.getAttribute('data-val');
          renderModalInner();
        });
      });
    }

    // Tab switcher
    layout.querySelectorAll('.tab-header').forEach(header => {
      header.addEventListener('click', () => {
        layout.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
        layout.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        
        header.classList.add('active');
        const tabId = `tab-${header.getAttribute('data-tab')}`;
        document.getElementById(tabId).classList.add('active');
      });
    });

    // Quantities adjusters
    document.getElementById('qvDecBtn').addEventListener('click', () => {
      if (activeQty > 1) {
        activeQty--;
        document.getElementById('qvQtyVal').textContent = activeQty;
      }
    });

    document.getElementById('qvIncBtn').addEventListener('click', () => {
      activeQty++;
      document.getElementById('qvQtyVal').textContent = activeQty;
    });

    // Add To Bag click
    document.getElementById('qvAddBtn').addEventListener('click', () => {
      addToCart(product.id, activeQty, activeShade, activeSize);
      closeQuickView();
    });
  }

  renderModalInner();
  modal.classList.add('active');
}

function closeQuickView() {
  document.getElementById('quickViewModal').classList.remove('active');
}

function initQuickViewModal() {
  const close = document.getElementById('quickViewClose');
  const backdrop = document.getElementById('quickViewBackdrop');
  if (close) close.addEventListener('click', closeQuickView);
  if (backdrop) backdrop.addEventListener('click', closeQuickView);
}

/* ═══ CHECKOUT FUNNEL COORDINATOR ═══ */
function openCheckoutModal() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  document.getElementById('checkoutModal').classList.add('active');
  resetCheckoutSteps();
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('active');
}

function resetCheckoutSteps() {
  document.getElementById('chkStep1Indicator').className = 'checkout-step active';
  document.getElementById('chkStep2Indicator').className = 'checkout-step';
  document.getElementById('chkStep3Indicator').className = 'checkout-step';

  document.getElementById('checkoutStep1Panel').className = 'checkout-step-panel active';
  document.getElementById('checkoutStep2Panel').className = 'checkout-step-panel';
  document.getElementById('checkoutStep3Panel').className = 'checkout-step-panel';
  
  document.getElementById('checkoutForm').reset();
}

function initCheckoutFunnel() {
  const close = document.getElementById('checkoutClose');
  const backdrop = document.getElementById('checkoutBackdrop');
  if (close) close.addEventListener('click', closeCheckoutModal);
  if (backdrop) backdrop.addEventListener('click', closeCheckoutModal);

  // Step 1 -> Step 2
  const step1Next = document.getElementById('checkoutStep1Next');
  step1Next.addEventListener('click', () => {
    // Validate delivery inputs
    const name = document.getElementById('chkName').value.trim();
    const email = document.getElementById('chkEmail').value.trim();
    const phone = document.getElementById('chkPhone').value.trim();
    const city = document.getElementById('chkCity').value.trim();
    const addr = document.getElementById('chkAddress').value.trim();

    if (!name || !email || !phone || !city || !addr) {
      alert('Please fill out all delivery fields.');
      return;
    }

    // Transition to step 2
    document.getElementById('chkStep1Indicator').className = 'checkout-step';
    document.getElementById('chkStep2Indicator').className = 'checkout-step active';
    document.getElementById('checkoutStep1Panel').className = 'checkout-step-panel';
    document.getElementById('checkoutStep2Panel').className = 'checkout-step-panel active';
  });

  // Step 2 back -> Step 1
  const step2Back = document.getElementById('checkoutStep2Back');
  step2Back.addEventListener('click', () => {
    document.getElementById('chkStep1Indicator').className = 'checkout-step active';
    document.getElementById('chkStep2Indicator').className = 'checkout-step';
    document.getElementById('checkoutStep1Panel').className = 'checkout-step-panel active';
    document.getElementById('checkoutStep2Panel').className = 'checkout-step-panel';
  });

  // Payment Tabs select
  const paymentTabs = document.querySelectorAll('.payment-tab');
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activePaymentMethod = tab.getAttribute('data-method');

      // Hide all options forms
      document.getElementById('cardPaymentDetails').style.display = 'none';
      document.getElementById('applePaymentDetails').style.display = 'none';
      document.getElementById('codPaymentDetails').style.display = 'none';

      // Show selected options form
      if (activePaymentMethod === 'card') {
        document.getElementById('cardPaymentDetails').style.display = 'block';
      } else if (activePaymentMethod === 'apple') {
        document.getElementById('applePaymentDetails').style.display = 'block';
      } else if (activePaymentMethod === 'cod') {
        document.getElementById('codPaymentDetails').style.display = 'block';
      }
    });
  });

  // Complete Order Form submit
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (activePaymentMethod === 'card') {
      const card = document.getElementById('cardNum').value.trim();
      const expiry = document.getElementById('cardExpiry').value.trim();
      const cvv = document.getElementById('cardCVV').value.trim();
      if (!card || !expiry || !cvv) {
        alert('Please fill out card payment fields.');
        return;
      }
    }

    const email = document.getElementById('chkEmail').value;
    const randomOrderNum = `MC-${Math.floor(100000 + Math.random() * 900000)}`;

    // Set success screen texts
    document.getElementById('successOrderNumber').textContent = randomOrderNum;
    document.getElementById('successEmailText').textContent = email;

    // Transition to step 3 (Success)
    document.getElementById('chkStep2Indicator').className = 'checkout-step';
    document.getElementById('chkStep3Indicator').className = 'checkout-step active';
    document.getElementById('checkoutStep2Panel').className = 'checkout-step-panel';
    document.getElementById('checkoutStep3Panel').className = 'checkout-step-panel active';

    // Clear cart database
    cart = [];
    saveCart();
    updateCartDrawer();
  });

  // Success screen close
  document.getElementById('successCloseBtn').addEventListener('click', () => {
    closeCheckoutModal();
    window.location.hash = '#shop';
  });
}

/* ═══ SEARCH OVERLAY / MODAL CONTROLS ═══ */
function initSearchOverlay() {
  const toggle = document.getElementById('searchToggle');
  const overlay = document.getElementById('searchOverlay');
  const close = document.getElementById('searchCloseBtn');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  if (!toggle || !overlay || !close || !input || !results) return;

  toggle.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 100);
  });

  close.addEventListener('click', () => {
    overlay.classList.remove('active');
    input.value = '';
    results.innerHTML = `
      <div class="search-initial-state">
        <p>Type to search skincare, makeup, haircare, fragrances...</p>
      </div>
    `;
  });

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (!q) {
      results.innerHTML = `
        <div class="search-initial-state">
          <p>Type to search skincare, makeup, haircare, fragrances...</p>
        </div>
      `;
      return;
    }

    // Filter results instantly
    const matches = allProducts.filter(p => 
      p.name.toLowerCase().includes(q.toLowerCase()) || 
      p.category.toLowerCase().includes(q.toLowerCase()) ||
      p.ingredients.some(i => i.toLowerCase().includes(q.toLowerCase()))
    );

    if (matches.length === 0) {
      results.innerHTML = `
        <div class="search-initial-state">
          <p>No products found matching "${q}"</p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <div class="search-results-grid">
        ${matches.map(product => `
          <div class="product-card" data-id="${product.id}">
            <div class="product-card__img-wrap">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-card__info" style="padding: 16px;">
              <div>
                <span class="product-card__category" style="font-size:0.65rem;">${product.category}</span>
                <h3 class="product-card__title" style="font-size:1rem; margin-top:4px;">${product.name}</h3>
              </div>
              <span class="product-card__price" style="font-size:0.85rem;">AED ${product.price.toFixed(2)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Click results items to open QuickView
    results.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        overlay.classList.remove('active');
        openQuickView(id);
      });
    });

  });
}

/* ═══ WHITE LABEL CONFIGURATOR CONTROLS ═══ */
function updateConfiguratorQuote() {
  const catEl = document.querySelector('input[name="config-category"]:checked');
  const formEl = document.querySelector('input[name="config-formula"]:checked');
  const packEl = document.querySelector('input[name="config-pack"]:checked');
  const qtyInput = document.getElementById('config-quantity-num');

  if (!catEl || !formEl || !packEl || !qtyInput) return;

  const category = catEl.value;
  const formulation = formEl.value;
  const packaging = packEl.value;
  const quantity = parseInt(qtyInput.value) || 1000;

  const quote = calculateQuote({ category, formulation, packaging, quantity });

  // Update summary fields
  document.getElementById('summary-category').textContent = quote.categoryName;
  document.getElementById('summary-formula').textContent = quote.formulationName;
  document.getElementById('summary-packaging').textContent = quote.packagingName;
  document.getElementById('summary-qty').textContent = `${quote.quantity.toLocaleString()} units`;
  
  document.getElementById('summary-unit-cost').textContent = `AED ${quote.costPerUnit.toFixed(2)}`;
  document.getElementById('summary-total-cost').textContent = `AED ${quote.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function initWhiteLabelConfigurator() {
  const sliders = document.getElementById('config-quantity-slider');
  const inputs = document.getElementById('config-quantity-num');
  
  if (!sliders || !inputs) return;

  // Sync range slider and numeric inputs
  sliders.addEventListener('input', (e) => {
    inputs.value = e.target.value;
    updateConfiguratorQuote();
  });

  inputs.addEventListener('input', (e) => {
    let val = parseInt(e.target.value) || 1000;
    if (val < 1000) val = 1000; // clamp min MOQ
    sliders.value = val;
    updateConfiguratorQuote();
  });

  // Watch radios selections changes
  document.querySelectorAll('input[name="config-category"], input[name="config-formula"], input[name="config-pack"]').forEach(rad => {
    rad.addEventListener('change', updateConfiguratorQuote);
  });

  // Submit Quote Configurator transfers details to contact form
  const submitBtn = document.getElementById('configSubmitBtn');
  submitBtn.addEventListener('click', () => {
    const categoryName = document.getElementById('summary-category').textContent;
    const formulaName = document.getElementById('summary-formula').textContent;
    const packagingName = document.getElementById('summary-packaging').textContent;
    const qty = document.getElementById('summary-qty').textContent;
    const unitPrice = document.getElementById('summary-unit-cost').textContent;
    const totalPrice = document.getElementById('summary-total-cost').textContent;

    const message = `Hello Millia Team,\n\nI configured a product using your online Quote Builder. Here are my requested configurations:\n- Product Category: ${categoryName}\n- Formulation: ${formulaName}\n- Packaging Sourcing: ${packagingName}\n- Total Units: ${qty}\n- Live Unit Cost Estimate: ${unitPrice}\n- Wholesale Total Estimate: ${totalPrice}\n\nPlease review my configuration and contact me regarding manufacturing timelines.`;
    
    // Set form fields values
    const interestSel = document.getElementById('interest');
    if (interestSel) {
      interestSel.value = 'whitelabel';
    }
    
    const msgTextarea = document.getElementById('message');
    if (msgTextarea) {
      msgTextarea.value = message;
    }

    alert('Quote configuration transferred to the Inquiry Form. Please scroll down and fill out your name and contact details!');
    window.location.hash = '#contact-section';
  });
}

/* ═══ BRANCH LOCATOR RENDER ═══ */
function renderBranches(selectedEmirate) {
  const container = document.getElementById('branchesContainer');
  if (!container) return;

  const filtered = selectedEmirate === 'All' 
    ? branches 
    : branches.filter(b => b.emirate === selectedEmirate);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="grid-column: 1/-1; padding: 40px;">
        <p>No retail branches currently established in ${selectedEmirate}.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(b => `
    <div class="branch-card">
      <div class="branch-card__icon">📍</div>
      <h3>${b.name}</h3>
      <p>${b.address}</p>
      <div class="branch-card__details" style="font-size: 0.8rem; color: var(--gray-700); margin-bottom: 12px;">
        <div>📞 <a href="tel:${b.phone.replace(/\s+/g, '')}">${b.phone}</a></div>
      </div>
      <span class="branch-card__hours">${b.hours}</span>
    </div>
  `).join('');
}

function initBranchesFilter() {
  const btns = document.querySelectorAll('.branch-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const emirate = btn.getAttribute('data-emirate');
      renderBranches(emirate);
    });
  });
}

/* ═══ TESTIMONIALS SLIDER ═══ */
function renderTestimonials() {
  const slider = document.getElementById('testimonialsSlider');
  if (!slider) return;

  slider.innerHTML = testimonials.map((t, idx) => `
    <div class="testi-card ${idx === 0 ? 'testi-card--active' : ''}">
      <div class="testi-card__quote">❝</div>
      <p class="testi-card__text">${t.text}</p>
      <div class="testi-card__stars">${'★'.repeat(t.rating)}</div>
      <strong class="testi-card__name">— ${t.name}</strong>
      <span class="testi-card__role" style="font-size:0.7rem; color:var(--gray-500); display:block; margin-top:2px;">${t.role}</span>
    </div>
  `).join('');

  document.getElementById('testiCounter').textContent = `1 / ${testimonials.length}`;
}

function rotateTestimonial(direction) {
  const cards = document.querySelectorAll('.testi-card');
  if (cards.length === 0) return;

  cards[currentTestimonialIndex].classList.remove('testi-card--active');
  currentTestimonialIndex = (currentTestimonialIndex + direction + cards.length) % cards.length;
  cards[currentTestimonialIndex].classList.add('testi-card--active');

  document.getElementById('testiCounter').textContent = `${currentTestimonialIndex + 1} / ${cards.length}`;
}

function initTestimonialsSlider() {
  const prev = document.getElementById('testiPrev');
  const next = document.getElementById('testiNext');

  if (prev && next) {
    prev.addEventListener('click', () => rotateTestimonial(-1));
    next.addEventListener('click', () => rotateTestimonial(1));
  }
}

/* ═══ FORMS SUBMIT ═══ */
function initFormsSubmit() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('contactSubmitBtn');
      submitBtn.textContent = 'Message Submitted ✓';
      submitBtn.style.backgroundColor = '#2d6a4f';
      submitBtn.style.borderColor = '#2d6a4f';

      setTimeout(() => {
        submitBtn.textContent = 'Get Started';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        contactForm.reset();
      }, 3000);
    });
  }

  const newsletter = document.getElementById('newsletterForm');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing to Millia Cosmetics!');
      newsletter.reset();
    });
  }
}

/* ═══ INITIALIZATION ENTRYPOINT ═══ */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initBurgerMenu();
  initRouter();
  initScrollReveal();
  
  // E-commerce & Search features
  initCatalogFilters();
  initCartListeners();
  updateCartDrawer();
  initQuickViewModal();
  initCheckoutFunnel();
  initSearchOverlay();
  
  // Corporate & White-Label features
  initWhiteLabelConfigurator();
  renderBranches('All');
  initBranchesFilter();
  renderTestimonials();
  initTestimonialsSlider();
  initFormsSubmit();
});
