# GiftOra 

An online flower bouquet ordering website, originally built as one of my first web development projects and later rebuilt as a full-stack application to apply new skills and add real-world features.

---

## Project Evolution

### Original Version (2024) — `legacy-vanilla-version/`
Built at the start of my CS degree using plain HTML, CSS, and vanilla JavaScript.
- Shop page with flower bouquet listings
- Filter by colour, sort by price
- Cart and delivery/checkout flow
- No backend — all state managed manually across separate HTML pages

### Rebuilt Version (2025–2026) — `client/` + `server/`
Rebuilt from scratch as a full-stack application after recognising the limitations of the original approach (scattered state, no persistence, no real user accounts or payments).

**Frontend:** React, React Router, Context API  
**Backend:** Node.js, Express  
**Database:** MongoDB Atlas (Mongoose)  
**Payments:** Stripe (test mode hosted checkout)  
**Auth:** JWT + bcryptjs

---

## New Features in the Rebuild

- **React component architecture** — reusable FlowerCard, GiftCard, Navbar components
- **Shared cart state** via React Context API across all pages
- **Gift items page** — users can add teddy bears, chocolate boxes, keytags, and table ornaments alongside their bouquet, all in one shared cart
- **Real backend API** — Express REST API serving product and order data from MongoDB
- **User accounts** — signup, login, logout with JWT authentication; guest checkout also supported
- **Order persistence** — every order is saved to MongoDB with full delivery details
- **Two payment methods** — Stripe hosted checkout (card) or cash on delivery
- **Delivery details** — date picker, time slot selection (Anytime / Morning / Afternoon / Evening), special instructions field

---

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev
```
Requires a `.env` file in `server/` 


### Frontend
```bash
cd client
npm install
npm start
```
Requires a `.env` file in `client/`

### Seed the database
```bash
cd server
node seed/seedProducts.js
```

---
