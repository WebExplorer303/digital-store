# Digital Store

A full-stack e-commerce app for buying and selling digital products — think ebooks, templates, and similar downloadable goods, with a shared dashboard for sellers and store owners to manage what's listed.

**Domain:** [digital-store-chi-teal.vercel.app](https://digital-store-chi-teal.vercel.app)

## What it does

- Browse a catalog of digital products and purchase them (no payment processor wired up yet — this is the product/catalog flow, not a live checkout)
- Leave and read reviews/comments on products
- Sellers and the store owner share a dashboard to upload, edit, and manage listings
- Sign-in required for anything that changes state — adding products, buying, and posting reviews all require authentication; browsing is open to everyone
- Backend operations (admin-level reads/writes, privileged checks) run through Firebase Admin SDK on the server, separate from the client-facing Firebase SDK used for the storefront

## Why I built it

I wanted to build something closer to a real product than a tutorial project — a storefront with a management side for the people listing products, not just a static catalog, plus the social layer (reviews) that makes a store feel real. It was also a good way to get comfortable with the split between client-side and server-side Firebase usage, which is a distinction a lot of tutorials gloss over but matters a lot once you're handling real user accounts and data.

## Tech stack

- **Framework:** Next.js
- **Auth, database & storage:** Firebase (Auth, Firestore, Storage, Analytics) on the client; Firebase Admin SDK on the server for privileged operations
- **Language:** TypeScript
- **Deployment:** Vercel
