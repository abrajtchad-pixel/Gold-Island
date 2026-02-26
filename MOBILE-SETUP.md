# Mobile Setup Guide — Gold Island

This guide explains how to create the first commit/branch on GitHub using your phone (mobile browser or GitHub app) and how to deploy Gold Island to Vercel with the `METALS_DEV_API_KEY` environment variable.

---

## 1. Create the first commit on GitHub (mobile browser)

You need to do this once to initialise the `main` branch in an empty repository.

### Using the GitHub website (mobile browser — Chrome / Safari)

1. Open your repository in a browser:  
   `https://github.com/abrajtchad-pixel/Gold-Island`

2. Tap **Add file** → **Create new file**.

3. In the **Name your file…** box type:  
   ```
   README.md
   ```

4. In the large text area below type:  
   ```
   # Gold Island
   Live gold market data — XAU/USD · XAU/EUR · XAU/XAF
   ```

5. Scroll down to **Commit new file**.
   - Leave the message as-is or type something like `Initial commit`.
   - Make sure **Commit directly to the `main` branch** is selected.

6. Tap **Commit new file**.

✅ Your repository now has a `main` branch with an initial commit.

### Using the GitHub mobile app (iOS / Android)

1. Open the **GitHub** app and navigate to your repository.
2. Tap the **+** (plus) icon or the **Code** tab → **Add file**.
3. Create a new file called `README.md` with the content above.
4. Commit to `main` and save.

---

## 2. Get a free metals.dev API key

1. Go to [https://metals.dev](https://metals.dev) in your browser.
2. Tap **Sign Up** and create a free account.
3. In the dashboard find **API Keys** and tap **Create key**.
4. Copy the key — it looks like a long string of letters and numbers.

Keep this key safe. You will paste it into Vercel in the next step.

---

## 3. Deploy to Vercel (mobile browser)

### Step 1 — Sign up / log in to Vercel

1. Open [https://vercel.com](https://vercel.com) in your browser.
2. Tap **Sign Up** (or **Log In**) → **Continue with GitHub**.
3. Approve Vercel's access to your GitHub account if prompted.

### Step 2 — Import your GitHub repository

1. On the Vercel dashboard tap **Add New…** → **Project**.
2. Find **Gold-Island** in the list and tap **Import**.
3. Under **Framework Preset** Vercel should auto-detect **Next.js** — leave it as-is.

### Step 3 — Add the environment variable

Before deploying, scroll down to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `METALS_DEV_API_KEY` | *(paste your metals.dev key here)* |

Tap **Add** to save the variable.

### Step 4 — Deploy

Tap **Deploy**. Vercel will build and deploy the site automatically.

When it finishes you'll see a URL like:
```
https://gold-island-xxxx.vercel.app
```

Tap that link to see your live Gold Island site! 🏝️

---

## 4. Update the API key later

If you need to change the API key after deploying:

1. Go to your Vercel dashboard → your **Gold-Island** project.
2. Tap **Settings** → **Environment Variables**.
3. Find `METALS_DEV_API_KEY`, tap the **…** menu → **Edit**.
4. Paste the new value and save.
5. Go to **Deployments** and trigger a **Redeploy** so the new key takes effect.

---

## 5. Local development (on a computer)

```bash
# 1. Clone the repo
git clone https://github.com/abrajtchad-pixel/Gold-Island.git
cd Gold-Island

# 2. Install dependencies
npm install

# 3. Create your local env file
cp .env.local.example .env.local
# Edit .env.local and paste your METALS_DEV_API_KEY

# 4. Start the dev server
npm run dev
# Open http://localhost:3000
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "METALS_DEV_API_KEY environment variable is not set" | Add the key in Vercel → Environment Variables (or in `.env.local` locally) |
| Prices not updating | Check that your metals.dev API key is valid and has not hit its free-tier limit |
| Chart is empty | Prices are collected during the session; the chart fills up after the first few 60-second refreshes |
| Vercel build fails | Check the build logs in Vercel dashboard → Deployments → click the failing deploy |
