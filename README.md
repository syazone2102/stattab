# StatLab PWA — Android Installation Guide

## What's included
```
statlab-pwa/
├── index.html        ← The full app (worksheet, graphs, session window)
├── manifest.json     ← PWA manifest (icon, name, display mode)
├── sw.js             ← Service worker (offline caching)
└── icons/            ← All icon sizes (72px → 512px)
```

---

## How to deploy (3 options)

### Option A — GitHub Pages (FREE, easiest)
1. Create a free account at github.com
2. Create a new repository (e.g. `statlab`)
3. Upload ALL files keeping the folder structure
4. Go to Settings → Pages → Source: `main` branch → `/root`
5. Your URL will be: `https://yourusername.github.io/statlab`
6. Open that URL on your Android phone in Chrome → tap ⋮ → **"Add to Home screen"**

### Option B — Netlify (FREE, drag & drop)
1. Go to netlify.com → sign up free
2. Drag the entire `statlab-pwa` folder onto the Netlify dashboard
3. You get a URL like `https://abc123.netlify.app`
4. Open on Android Chrome → install from browser

### Option C — Any web host
Upload all files to any HTTPS-enabled host (Vercel, Firebase Hosting, your own server).
**HTTPS is required** for PWAs and service workers.

---

## Install on Android (Chrome)
1. Open the deployed URL in **Chrome on Android**
2. A blue **"Install StatLab"** banner appears at the bottom — tap **Install**
3. OR tap Chrome menu (⋮) → **"Add to Home screen"**
4. StatLab icon appears on your home screen like a native app
5. Works **fully offline** after first load

## Install on Android (Samsung Internet / Firefox)
- Samsung Internet: tap ⋮ → "Add page to" → "Home screen"
- Firefox: tap ⋮ → "Install"

---

## Features available offline
- ✅ Full worksheet with 30-row quality dataset
- ✅ All statistical analyses (Descriptive, ANOVA, Regression, Capability)
- ✅ All graphs (Histogram, Scatter, Boxplot, Control Chart, Capability)
- ✅ Session window output
- ✅ Menus, dialogs, toolbar

---

## Local testing (before deploying)
```bash
# Python 3
cd statlab-pwa
python3 -m http.server 8080
# Open http://localhost:8080 in Chrome
```
Note: Service worker only activates on HTTPS or localhost.

---

## Troubleshooting
- **Install banner not showing?** Make sure you're using HTTPS and Chrome/Edge on Android
- **Offline not working?** Visit the page once on WiFi to let the service worker cache files
- **Icon looks blurry?** The 512px icon is used — check it uploaded correctly

---
StatLab v4.2.1 | PWA Build
