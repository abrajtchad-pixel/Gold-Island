# 🏝️ Gold Island

> Live gold market data — real-time XAU/USD, XAU/EUR, and XAU/XAF price charts.

Built with **Next.js 15 (App Router)** + **Tailwind CSS** + **lightweight-charts**.  
Data from [metals.dev](https://metals.dev) free tier, refreshed every **60 seconds**.

---

## Features

- 📊 Line charts per pair (built with `lightweight-charts`)  
- 💛 XAU/USD, 🔵 XAU/EUR, 🟢 XAU/XAF (computed from USD/XAF rate)  
- ⏱️ Auto-refresh every 60 s with a live countdown  
- 🌑 Dark gold-themed UI  
- 🔑 Single env var: `METALS_DEV_API_KEY`  
- 🚀 One-click deploy on Vercel  

---

## Quick start

### 1 · Get a free API key

Sign up at [metals.dev](https://metals.dev) and create an API key.

### 2 · Clone and run locally

```bash
git clone https://github.com/abrajtchad-pixel/Gold-Island.git
cd Gold-Island
npm install
cp .env.local.example .env.local
# Edit .env.local → paste your METALS_DEV_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3 · Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fabrajtchad-pixel%2FGold-Island&env=METALS_DEV_API_KEY&envDescription=Free%20API%20key%20from%20metals.dev&envLink=https%3A%2F%2Fmetals.dev)

Or follow the step-by-step guide (including phone instructions) in [MOBILE-SETUP.md](./MOBILE-SETUP.md).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `METALS_DEV_API_KEY` | ✅ Yes | Free API key from [metals.dev](https://metals.dev) |

---

## Project structure

```
app/
  layout.tsx          Root layout
  page.tsx            Main dashboard page
  globals.css         Tailwind base styles
  api/quotes/
    route.ts          Server-side API proxy → metals.dev
components/
  PriceCard.tsx       Current price display with change indicator
  PriceChart.tsx      lightweight-charts line chart (client-only)
MOBILE-SETUP.md       Phone + Vercel deployment guide
```

---

## License

MIT
