// Millia Cosmetics - Curated Product Catalog
// Dynamically generates 100 premium cosmetics products with rich metadata

const CATEGORIES = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Body Care'];

const IMAGES = {
  Skincare: [
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=600&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80'
  ],
  Makeup: [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80',
    'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&q=80',
    'https://images.unsplash.com/photo-1590156546746-c58d042cf891?w=600&q=80',
    'https://images.unsplash.com/photo-1631730359575-38e4755d772b?w=600&q=80'
  ],
  Haircare: [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80',
    'https://images.unsplash.com/photo-1527799863830-53a84e65fbe3?w=600&q=80',
    'https://images.unsplash.com/photo-1605497746444-ac9dbd39f675?w=600&q=80',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80'
  ],
  Fragrance: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
    'https://images.unsplash.com/photo-1588405748373-122b2321bc31?w=600&q=80'
  ],
  'Body Care': [
    'https://images.unsplash.com/photo-1556228578-527ae14754a7?w=600&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&q=80',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    'https://images.unsplash.com/photo-1616683693774-3221e25e83ad?w=600&q=80'
  ]
};

const WORDS = {
  Skincare: {
    prefix: ['Luminous', 'Oasis', 'Satin', 'Hydra', 'Advanced', 'Pure', 'Royal', 'Zen', 'Botanical', 'Velvet'],
    noun: ['Serum', 'Cleanser', 'Moisturizer', 'Essence', 'Toner', 'Elixir', 'Face Oil', 'Mask', 'Cream', 'Balm'],
    feature: ['Hydrating', 'Brightening', 'Anti-Aging', 'Calming', 'Smoothing', 'Plumping', 'Repairing', 'Firming']
  },
  Makeup: {
    prefix: ['Silk', 'Lumiere', 'Matte', 'Duo', 'Glow', 'Infinity', 'Divine', 'Chic', 'Retro', 'Velour'],
    noun: ['Lipstick', 'Foundation', 'Highlighter', 'Blush', 'Mascara', 'Concealer', 'Eyeshadow', 'Lip Gloss', 'Setting Powder', 'Bronzer'],
    feature: ['Long-wear', 'Ultra-blendable', 'Satin-finish', 'Waterproof', 'Airbrushed', 'Dewy-glow', 'High-definition']
  },
  Haircare: {
    prefix: ['Keratin', 'Argan', 'Volume', 'Nourish', 'Scalp', 'Silky', 'Thermal', 'Crown', 'Frizz-free', 'Glossy'],
    noun: ['Shampoo', 'Conditioner', 'Hair Mask', 'Treatment Oil', 'Serum', 'Leave-in Balm', 'Detangler', 'Styling Cream'],
    feature: ['Restorative', 'Deep-conditioning', 'Color-protect', 'Strengthening', 'Volumizing', 'Moisture-rich']
  },
  Fragrance: {
    prefix: ['Oud', 'Amber', 'Desert', 'Royal', 'Mystic', 'Soliel', 'Velvet', 'Midnight', 'Ethereal', 'Saffron'],
    noun: ['Eau de Parfum', 'Perfume Oil', 'Mist', 'Cologne', 'Elixir de Parfum', 'Essence'],
    feature: ['Sensual', 'Opulent', 'Exotic', 'Timeless', 'Woody', 'Floral', 'Fresh', 'Warm & Spicy']
  },
  'Body Care': {
    prefix: ['Shea', 'Coconut', 'Citrus', 'Sea Salt', 'Eucalyptus', 'Velvet', 'Nourishing', 'Herbal', 'Exfoliating'],
    noun: ['Body Scrub', 'Lotion', 'Body Butter', 'Wash', 'Oil', 'Hand Cream', 'Deodorant Balm', 'Bath Soak'],
    feature: ['Smoothing', 'Softening', 'Invigorating', 'Moisturizing', 'Detoxifying', 'Relaxing']
  }
};

const INGREDIENTS = [
  'Hyaluronic Acid', 'Vitamin C', 'Niacinamide', 'Retinol', 'Salicylic Acid',
  'Ceramides', 'Centella Asiatica', 'Squalane', 'Rosehip Oil', 'Argan Oil',
  'Shea Butter', 'Aloe Vera', 'Green Tea Extract', 'Jojoba Oil', 'Peptides',
  'Collagen', 'Glycerin', 'Panthenol', 'Tea Tree Oil', 'Chamomile Extract'
];

const SHADES = {
  Foundation: ['01 Porcelain', '02 Ivory', '03 Sand', '04 Beige', '05 Honey', '06 Bronze', '07 Chestnut'],
  Lipstick: ['Velvet Nude', 'Desert Rose', 'Crimson Passion', 'Coral Crush', 'Satin Plum', 'Berry Glaze'],
  Blush: ['Peach Glow', 'Rosy Bloom', 'Warm Amber', 'Soft Coral'],
  Highlighter: ['Champagne Dew', 'Rose Gold Spark', 'Bronze Goddess']
};

const SIZES = {
  Serums: ['30 ml', '50 ml'],
  Creams: ['50 ml', '100 ml'],
  Haircare: ['250 ml', '500 ml'],
  Fragrance: ['50 ml', '100 ml'],
  BodyCare: ['200 ml', '400 ml']
};

function generateProducts() {
  const list = [];
  
  // Seed with 12 handcrafted "hero" items to make the top catalog look extremely polished
  const heroes = [
    {
      id: 'prod-1',
      name: 'Oasis Dew Hydrating Serum',
      category: 'Skincare',
      price: 145,
      rating: 4.9,
      reviewsCount: 342,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      description: 'A revolutionary hydrating serum packed with triple hyaluronic acid and desert botanical extracts. Plumps skin instantly and locks in moisture for 24 hours.',
      benefits: ['Intense 24h hydration', 'Plumps fine lines', 'Strengthens skin barrier'],
      ingredients: ['Triple Hyaluronic Acid', 'Desert Cactus Extract', 'Squalane', 'Niacinamide'],
      shades: [],
      sizes: ['30 ml', '50 ml'],
      isBestSeller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 'prod-2',
      name: 'Desert Rose Velvet Lipstick',
      category: 'Makeup',
      price: 89,
      rating: 4.8,
      reviewsCount: 218,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
      description: 'An ultra-comfortable matte lipstick that delivers intense color in a single swipe. Enriched with argan oil to keep lips hydrated and soft.',
      benefits: ['12-hour comfortable wear', 'Velvet matte finish', 'Hydrating formula'],
      ingredients: ['Argan Oil', 'Shea Butter', 'Vitamin E', 'Organic Pigments'],
      shades: SHADES.Lipstick,
      sizes: [],
      isBestSeller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 'prod-3',
      name: 'Lumiere Silk Liquid Foundation',
      category: 'Makeup',
      price: 185,
      rating: 4.7,
      reviewsCount: 154,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
      description: 'A lightweight foundation that blends seamlessly into the skin for a natural, dewy finish. Buildable medium coverage that lasts all day.',
      benefits: ['Breathable dewy finish', 'Medium buildable coverage', 'SPF 15 protection'],
      ingredients: ['Hyaluronic Acid', 'Squalane', 'Titanium Dioxide', 'Vitamin E'],
      shades: SHADES.Foundation,
      sizes: [],
      isBestSeller: false,
      isNew: true,
      inStock: true
    },
    {
      id: 'prod-4',
      name: 'Royal Oud Luxury Eau de Parfum',
      category: 'Fragrance',
      price: 380,
      rating: 5.0,
      reviewsCount: 98,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
      description: 'A rich, hypnotic blend of premium Cambodian Oud, warm amber, and delicate Damask Rose. Captures the opulent essence of Arabian nights.',
      benefits: ['Extremely long-lasting sillage', 'Unisex premium blend', 'Artisanal local formulation'],
      ingredients: ['Cambodian Oud', 'Amber Resin', 'Damask Rose Extract', 'Saffron'],
      shades: [],
      sizes: ['50 ml', '100 ml'],
      isBestSeller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 'prod-5',
      name: 'Argan Gold Restorative Hair Mask',
      category: 'Haircare',
      price: 135,
      rating: 4.9,
      reviewsCount: 187,
      image: 'https://images.unsplash.com/photo-1527799863830-53a84e65fbe3?w=600&q=80',
      description: 'Deeply reconstructs damaged hair, restoring strength, elasticity, and brilliant shine. Perfect for color-treated or heat-damaged locks.',
      benefits: ['Repairs hair structure', 'Tames intense frizz', 'Delivers liquid shine'],
      ingredients: ['Moroccan Argan Oil', 'Hydrolyzed Keratin', 'Panthenol', 'Coconut Oil'],
      shades: [],
      sizes: ['250 ml', '500 ml'],
      isBestSeller: false,
      isNew: false,
      inStock: true
    },
    {
      id: 'prod-6',
      name: 'Sea Salt Exfoliating Body Scrub',
      category: 'Body Care',
      price: 95,
      rating: 4.8,
      reviewsCount: 112,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&q=80',
      description: 'A detoxifying body scrub made with Dead Sea salt and organic citrus essential oils. Gently polishes away dry skin while deeply nourishing.',
      benefits: ['Polishes dry skin', 'Detoxifies skin pores', 'Energizing citrus aroma'],
      ingredients: ['Dead Sea Salt', 'Sweet Almond Oil', 'Orange Peel Oil', 'Grapefruit Extract'],
      shades: [],
      sizes: ['200 ml', '400 ml'],
      isBestSeller: false,
      isNew: true,
      inStock: true
    }
  ];

  list.push(...heroes);

  // Generate 94 more products to make it exactly 100
  let idCounter = 7;
  while (list.length < 100) {
    const category = CATEGORIES[idCounter % CATEGORIES.length];
    const images = IMAGES[category];
    const image = images[idCounter % images.length];
    
    const wordSet = WORDS[category];
    const prefix = wordSet.prefix[Math.floor((idCounter * 7) % wordSet.prefix.length)];
    const feature = wordSet.feature[Math.floor((idCounter * 11) % wordSet.feature.length)];
    const noun = wordSet.noun[Math.floor((idCounter * 13) % wordSet.noun.length)];
    
    // Construct product name
    const name = `${prefix} ${feature} ${noun}`;
    
    // Check if name already exists, if so add a suffix
    const nameExists = list.some(p => p.name === name);
    const finalName = nameExists ? `${name} II` : name;

    // Price scaling
    let price = 50 + ((idCounter * 17) % 300);
    if (category === 'Fragrance') price += 100; // frag premium
    
    const rating = parseFloat((4.0 + ((idCounter * 3) % 11) / 10).toFixed(1));
    const reviewsCount = 5 + ((idCounter * 23) % 250);
    
    // Descriptions
    const description = `Indulge in our premium ${finalName}. Professionally formulated with the highest-grade ingredients to provide a luxurious experience, leaving your ${category === 'Haircare' ? 'hair' : category === 'Skincare' ? 'skin' : 'body'} looking revitalized, healthy, and glowing.`;
    
    // Ingredients
    const selectedIngredients = [
      INGREDIENTS[idCounter % INGREDIENTS.length],
      INGREDIENTS[(idCounter + 2) % INGREDIENTS.length],
      INGREDIENTS[(idCounter + 5) % INGREDIENTS.length]
    ];

    // Shades & Sizes
    let shades = [];
    if (category === 'Makeup') {
      if (noun.includes('Lip')) shades = SHADES.Lipstick;
      else if (noun.includes('Foundation') || noun.includes('Concealer')) shades = SHADES.Foundation;
      else if (noun.includes('Blush')) shades = SHADES.Blush;
      else if (noun.includes('High') || noun.includes('Glow')) shades = SHADES.Highlighter;
    }

    let sizes = [];
    if (category === 'Skincare') {
      sizes = noun.includes('Serum') ? SIZES.Serums : SIZES.Creams;
    } else if (category === 'Haircare') {
      sizes = SIZES.Haircare;
    } else if (category === 'Fragrance') {
      sizes = SIZES.Fragrance;
    } else if (category === 'Body Care') {
      sizes = SIZES.BodyCare;
    }

    list.push({
      id: `prod-${idCounter}`,
      name: finalName,
      category,
      price,
      rating,
      reviewsCount,
      image,
      description,
      benefits: [
        `Specially formulated for premium ${category.toLowerCase()} results`,
        'Enriched with natural botanical extracts',
        'Dermatologically tested and cruelty-free'
      ],
      ingredients: selectedIngredients,
      shades,
      sizes,
      isBestSeller: idCounter % 8 === 0,
      isNew: idCounter % 9 === 0,
      inStock: idCounter % 15 !== 0 // 1 in 15 out of stock
    });

    idCounter++;
  }

  return list;
}

export const allProducts = generateProducts();

// Helper to filter/search/sort catalog
export function getProducts({
  search = '',
  category = '',
  minPrice = 0,
  maxPrice = 1000,
  rating = 0,
  tags = [],
  sortBy = 'featured',
  page = 1,
  pageSize = 12
}) {
  let filtered = [...allProducts];

  // Search
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.ingredients.some(i => i.toLowerCase().includes(q))
    );
  }

  // Category
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Price range
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // Rating
  if (rating > 0) {
    filtered = filtered.filter(p => p.rating >= rating);
  }

  // Tags (Best Seller, New, In Stock)
  if (tags && tags.length > 0) {
    tags.forEach(tag => {
      if (tag === 'bestseller') filtered = filtered.filter(p => p.isBestSeller);
      if (tag === 'new') filtered = filtered.filter(p => p.isNew);
      if (tag === 'instock') filtered = filtered.filter(p => p.inStock);
    });
  }

  // Sort
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    // Treat new arrivals first
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else {
    // Featured / default sorting
    filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    totalPages,
    page,
    pageSize
  };
}
