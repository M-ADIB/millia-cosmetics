// Millia Cosmetics - White Label Configurator Logic

const CONFIG_PRICING = {
  categories: {
    serum: { name: 'Facial Serum', basePrice: 6.50 },
    cream: { name: 'Moisturizer / Cream', basePrice: 5.50 },
    cleanser: { name: 'Facial Cleanser', basePrice: 4.00 },
    lipstick: { name: 'Velvet Lipstick', basePrice: 4.50 },
    perfume: { name: 'Eau de Parfum', basePrice: 15.00 },
    scrub: { name: 'Body Scrub', basePrice: 5.00 }
  },
  formulations: {
    standard: { name: 'Standard Botanical', priceMult: 1.0 },
    organic: { name: '100% Organic & Vegan', priceMult: 1.25 },
    clinical: { name: 'Clinical Active (Retinol/Vitamin C)', priceMult: 1.4 }
  },
  packaging: {
    standard: { name: 'Standard Tube / Plastic Jar', priceAdd: 0.0 },
    glass: { name: 'Luxury Amber Glass + Dropper', priceAdd: 2.20 },
    bamboo: { name: 'Eco-Friendly Bamboo Wrap', priceAdd: 3.50 },
    matte: { name: 'Minimalist Soft-Touch Matte Bottle', priceAdd: 1.80 }
  }
};

export function calculateQuote({
  category = 'serum',
  formulation = 'standard',
  packaging = 'standard',
  quantity = 1000
}) {
  const catData = CONFIG_PRICING.categories[category] || CONFIG_PRICING.categories.serum;
  const formData = CONFIG_PRICING.formulations[formulation] || CONFIG_PRICING.formulations.standard;
  const packData = CONFIG_PRICING.packaging[packaging] || CONFIG_PRICING.packaging.standard;

  // Cost per unit calculation
  let costPerUnit = (catData.basePrice * formData.priceMult) + packData.priceAdd;

  // Quantity volume discounts
  let discountMult = 1.0;
  if (quantity >= 50000) {
    discountMult = 0.70; // 30% discount
  } else if (quantity >= 10000) {
    discountMult = 0.80; // 20% discount
  } else if (quantity >= 5000) {
    discountMult = 0.88; // 12% discount
  } else if (quantity >= 2500) {
    discountMult = 0.94; // 6% discount
  }

  costPerUnit = costPerUnit * discountMult;

  // Round values
  const roundedCostPerUnit = parseFloat(costPerUnit.toFixed(2));
  const totalCost = parseFloat((roundedCostPerUnit * quantity).toFixed(2));

  return {
    categoryName: catData.name,
    formulationName: formData.name,
    packagingName: packData.name,
    costPerUnit: roundedCostPerUnit,
    totalCost,
    quantity,
    moqReached: quantity >= 1000,
    moq: 1000
  };
}
