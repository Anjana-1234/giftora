// Stock helpers shared by the order routes and the admin routes.
//
// Every stock change is a "compare-and-swap": read the saved stock, work out the
// new number, and write it ONLY if the saved value is still exactly what we read.
// If another customer changed it in between, we read again and retry. So two people
// buying the last item at the same moment can never both succeed.
//
// These helpers also cope with messy data: a stock number that was never saved,
// or one that was saved as text ("60") instead of a number, still works.

const mongoose = require('mongoose');
const Product = require('../models/Product');

// Shown in the terminal at startup so you can see this version is the one running
console.log('📦 Stock management v3 loaded');

// The shop treats a product with no saved stock number as 100 (the schema default)
const DEFAULT_STOCK = 100;

// Turn whatever is saved in the database into a real number
function toStockNumber(raw) {
  if (raw === undefined || raw === null || raw === '') return DEFAULT_STOCK;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0; // unreadable value -> treat as out of stock
}

function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id));
}

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

// Add (positive delta) or take (negative delta) stock for ONE product.
// Returns { ok: true, available } or { ok: false, reason, name, available }.
async function changeStock(productId, delta) {
  const id = toObjectId(productId);

  // FAST PATH (the normal case): the saved stock is a real number.
  // One single MongoDB update that checks "enough left?" and subtracts in the same
  // step. MongoDB guarantees this is atomic, so the last item can only be sold once.
  const fast =
    delta < 0
      ? await Product.collection.updateOne(
          { _id: id, availableQuantity: { $gte: -delta } },
          { $inc: { availableQuantity: delta } }
        )
      : await Product.collection.updateOne(
          { _id: id, availableQuantity: { $type: 'number' } },
          { $inc: { availableQuantity: delta } }
        );

  if (fast.matchedCount === 1) {
    return { ok: true };
  }

  // CAREFUL PATH: the stock is missing, saved as text, or genuinely not enough.
  for (let attempt = 0; attempt < 10; attempt++) {
    const doc = await Product.collection.findOne(
      { _id: id },
      { projection: { name: 1, availableQuantity: 1 } }
    );

    if (!doc) {
      return { ok: false, reason: 'missing', name: null, available: 0 };
    }

    const saved = doc.availableQuantity;
    const current = toStockNumber(saved);
    const next = current + delta;

    if (next < 0) {
      return { ok: false, reason: 'short', name: doc.name, available: current };
    }

    // Only write if the saved value is still exactly what we just read
    const filter =
      saved === undefined || saved === null
        ? { _id: doc._id, availableQuantity: null } // matches "missing" and null
        : { _id: doc._id, availableQuantity: saved };

    const result = await Product.collection.updateOne(filter, {
      $set: { availableQuantity: next },
    });

    if (result.matchedCount === 1) {
      return { ok: true, name: doc.name, available: next };
    }
    // Someone else changed it between our read and our write: read again and retry
  }

  return { ok: false, reason: 'busy', name: null, available: 0 };
}

// Read-only check: which items can NOT be fulfilled right now?
// Returns a list of { product, name, requested, available } (empty list = all good).
// Returns null if the items are invalid.
async function findStockProblems(items) {
  const wanted = normaliseItems(items);
  if (!wanted) return null;

  const docs = await Product.collection
    .find(
      { _id: { $in: wanted.map((w) => toObjectId(w.product)) } },
      { projection: { name: 1, availableQuantity: 1 } }
    )
    .toArray();
  const byId = new Map(docs.map((d) => [String(d._id), d]));

  const problems = [];
  for (const { product, quantity } of wanted) {
    const found = byId.get(product);
    const available = found ? toStockNumber(found.availableQuantity) : 0;

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
// Returns { ok: true, taken } or { ok: false, problems } or { ok: false, invalid: true }.
async function reserveStock(items) {
  const wanted = normaliseItems(items);
  if (!wanted) return { ok: false, invalid: true };

  const taken = [];

  for (const { product, quantity } of wanted) {
    const result = await changeStock(product, -quantity);

    if (!result.ok) {
      // Visible in the backend terminal, so a failure is never a mystery
      console.log(
        `[stock] could not take ${quantity} of "${result.name || product}": reason=${result.reason}, available=${result.available}`
      );

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
    const result = await changeStock(product, quantity);
    if (!result.ok) {
      console.log(`[stock] could not put back ${quantity} of ${product}: reason=${result.reason}`);
    }
  }
}

// Current name, price and stock for a list of product ids.
// Used by the cart to refresh what it saved in the browser (prices and stock change).
// Ids that do not exist simply do not appear in the result.
// Returns null if `ids` is not a list.
async function getProductSnapshots(ids) {
  if (!Array.isArray(ids)) return null;

  // Keep it small and safe: valid ids only, no repeats, at most 100
  const unique = [...new Set(ids.map(String))]
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .slice(0, 100);

  if (unique.length === 0) return [];

  const docs = await Product.collection
    .find(
      { _id: { $in: unique.map(toObjectId) } },
      { projection: { name: 1, price: 1, availableQuantity: 1 } }
    )
    .toArray();

  return docs.map((d) => ({
    _id: String(d._id),
    name: d.name,
    price: Number(d.price),
    availableQuantity: toStockNumber(d.availableQuantity),
  }));
}

module.exports = { findStockProblems, reserveStock, releaseStock, getProductSnapshots };
