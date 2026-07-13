# Sweet Angels — E-commerce Frontend

React + Vite + Tailwind + Firebase storefront for Sweet Angels baby clothing,
with an admin dashboard and secure server-side WhatsApp order notifications.

## ⚠️ Before you do anything else: rotate your WhatsApp token

A live WhatsApp Cloud API access token was shared in plain text during this
build. Treat it as compromised:

1. Go to **Meta Business Suite → System Users** (or **developers.facebook.com** → your app → WhatsApp → API Setup).
2. Revoke the old token and generate a new permanent token.
3. Use the *new* token as `WHATSAPP_TOKEN` below — never commit it to GitHub, never put it in a `VITE_`-prefixed variable.

## How the WhatsApp piece is wired (and why)

The browser never talks to Meta directly. It calls `/api/notify-whatsapp`
(a Vercel serverless function), which holds the token in a **server-only**
environment variable and forwards the message. This means the token is never
downloaded to a shopper's browser, unlike a `VITE_WHATSAPP_TOKEN` would be.

## 1. Firebase setup

Your project (`sweet-angels-app`) is already created. You still need to:

1. **Authentication** → Sign-in method → confirm **Google** is enabled (you said it is) and also enable **Email/Password** (for the admin login at `/admin/login`).
2. Under Authentication → Users, manually add a user with:
   - Email: `sweetangels679@gmail.com`
   - Password: (set a real password here — the one you shared should be rotated since it was pasted in plain text)
3. **Firestore Database** → create it (production mode) → then deploy `firestore.rules` (included in this repo) via the Firebase Console's Rules tab, or `firebase deploy --only firestore:rules` if you use the CLI.
4. Firestore will auto-create these collections the first time you use the app: `products`, `videos`, `orders`.

Note: this project does **not** use Firebase Storage, so you don't need the
paid Blaze plan. Product image uploads go through Cloudinary instead (free,
no credit card) — see the next section.

## Image uploads — Cloudinary (free, no Blaze plan needed)

Firebase Storage now requires the Blaze (pay-as-you-go) plan even to enable
it, so this project uses Cloudinary's free tier for the "upload from device"
feature instead. Pasting an image URL directly still works with no setup.

1. Create a free account at [cloudinary.com](https://cloudinary.com) — no credit card required.
2. On your Dashboard, copy your **Cloud name**.
3. Go to **Settings → Upload → Upload presets → Add upload preset**.
4. Set **Signing Mode** to **Unsigned**, save, and copy the preset name.
5. Add `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to your `.env` and to Vercel's environment variables, then redeploy.

## 2. Environment variables

Copy `.env.example` to `.env` for local dev. **Never commit `.env`** (it's already in `.gitignore`).

| Variable | Where it's used | Safe in browser? |
|---|---|---|
| `VITE_FIREBASE_*` | Firebase client SDK | Yes — protected by Firestore/Storage rules, not secrecy |
| `VITE_ADMIN_EMAILS` | Gates the `/admin` route in the UI | Yes |
| `WHATSAPP_TOKEN` | `/api/notify-whatsapp.js` only | **No — server only** |
| `WHATSAPP_PHONE_NUMBER_ID` | `/api/notify-whatsapp.js` only | Server only |
| `WHATSAPP_ADMIN_NUMBER` | `/api/notify-whatsapp.js` only | Server only |

In **Vercel** (Project → Settings → Environment Variables), add every row from
`.env.example` with real values. The three `WHATSAPP_*` ones must **not**
have a `VITE_` prefix — that prefix is what makes Vite ship a value to the
browser.

## 3. Run locally

```bash
npm install
npm run dev
```

Note: `npm run dev` alone won't run the `/api` serverless function. To test
the WhatsApp notify locally, use the Vercel CLI instead:

```bash
npm install -g vercel
vercel dev
```

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Sweet Angels storefront"
git branch -M main
git remote add origin https://github.com/sweetangels679/webapp.git
git push -u origin main
```

(If `webapp` already has the old single-file site, either push to a new repo
or a new branch first so you can compare before overwriting.)

## 5. Deploy on Vercel

1. Import the GitHub repo into Vercel.
2. Framework preset: **Vite**.
3. Add all environment variables from the table above.
4. Deploy. Your `/api/notify-whatsapp` function deploys automatically — no extra config needed beyond `vercel.json` (included).

## 6. Seed your first product

Once deployed, sign in at `/admin/login` with your admin email/password and
use **Products → Add Product** to add your first item — upload an image from
your device or paste an image URL, set price/sizes/stock, and save. It
appears live on `/shop` and the homepage instantly (Firestore real-time sync).

## Project structure

```
src/
  components/    Navbar, Footer, CartDrawer, ProductCard
  pages/         Home, Shop, ProductDetail, Videos, Checklist, Contact, UserPanel, Checkout
  admin/         AdminLogin, AdminDashboard, OrdersPanel, ProductsPanel, ProductForm, VideosPanel
  context/       AuthContext (Firebase Auth), CartContext (cart state + localStorage)
  lib/           firebase.js (init), useProducts.js (Firestore hooks), notify.js (WhatsApp client helper), uploadImage.js (Cloudinary upload)
api/
  notify-whatsapp.js   Serverless function — the only place the WhatsApp token is used
firestore.rules         Firestore security rules
```

## Notes on data model

**products** collection fields: `name, price, mrp, category, ageGroup, sizes[], stock, description, images[], createdAt`

**videos** collection fields: `url, title, createdAt`

**orders** collection fields: `items[], total, shipping{fullName, phone, address, city, state, pincode}, paymentMethod, userEmail, status, createdAt`
