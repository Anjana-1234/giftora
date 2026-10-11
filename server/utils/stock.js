// Stock helpers shared by the order routes and the admin routes.
// All stock changes use single atomic MongoDB updates, so two customers
// buying the last item at the same moment can never both succeed.

const mongoose = require('mongoose');
const Product = require('../models/Product');

// Turn the raw items from a request into a clean list of { product, quantity }.
// Same product listed twice is merged. Returns null if anything is invalid.
function normaliseItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const merged = new Map();

  for (const item of items) {
    const productId = item && item.product ? String(item.product) : null;
    const quantity = Number(item && item.quantity);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) return null;
    if (!Number.isInteger(quantity) || quantity < 1) return null;

    merged.set(productId, (merged.get(productId) || 0) + quantity);
  }

  return [...merged.entries()].map(([product, quantity]) => ({ product, quantity }));
}

// Read-only check: which items can NOT be fulfilled right now?
// Returns a list of { product, name, requested, available } (empty list = all good).
async function findStockProblems(items) {
  const wanted = normaliseItems(items);
  if (!wanted) return null; // invalid input

  const products = await Product.find({ _id: { $in: wanted.map((w) => w.product) } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const problems = [];
  for (const { product, quantity } of wanted) {
    const found = byId.get(product);
    const available = found ? found.availableQuantity : 0;
    if (!found || available < quantity) {
      problems.push({
        product,
        name: found ? found.name : 'An item in your cart',
        requested: quantity,
        available,
      });
    }
  }
  return problems;
}

// Take stock for an order. All-or-nothing: if any item is short,
// everything already taken is put back and the problems are returned.
// Returns { ok: true } or { ok: false, problems } or { ok: false, invalid: true }.
async function reserveStock(items) {
  const wanted = normaliseItems(items);
  if (!wanted) return { ok: false, invalid: true };

  const taken = [];

  for (const { product, quantity } of wanted) {
    // Only decrements if enough stock is left -- check and update in ONE step
    const updated = await Product.findOneAndUpdate(
      { _id: product, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } },
      { new: true }
    );

    if (!updated) {
      // Put back whatever we already took, then report what is short
      await releaseStock(taken);
      const problems = (await findStockProblems(wanted)) || [];
      return { ok: false, problems };
    }

    taken.push({ product, quantity });
  }

  return { ok: true, taken };
}

// Put stock back (order cancelled, or an order failed to save).
async function releaseStock(items) {
  const wanted = normaliseItems(items) || [];
  for (const { product, quantity } of wanted) {
    await Product.updateOne({ _id: product }, { $inc: { availableQuantity: quantity } });
  }
}

module.exports = { findStockProblems, reserveStock, releaseStock };