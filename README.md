# MenuPro — Restaurant Menu Management

A responsive frontend-only restaurant menu management dashboard built with HTML5, CSS3, and vanilla JavaScript. It uses browser `localStorage` instead of a database.

## Features
- Dashboard stats, popular dishes, and ingredient alerts
- Category management (add, edit, delete)
- Menu item CRUD, search, category/status filters, dietary tags, image URLs, and availability
- Customer-facing digital menu with category filtering and search
- Pricing management and discount offers
- Ingredient inventory with stock controls and reorder levels
- Analytics demo charts and dietary breakdown
- CSV exports for menu, inventory, and analytics; JSON export for version history
- Menu snapshots and restore
- Dark mode, responsive mobile sidebar, print/PDF-friendly digital menu

## Run locally
1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a browser. For best results, use VS Code with the Live Server extension.

No npm install or database is required.

## Deploy to GitHub Pages
1. Create a public GitHub repository and upload these files.
2. Open **Settings → Pages**.
3. Select the `main` branch and `/ (root)` folder, then save.
4. Wait for the published URL to appear.

## Notes / limitations
- Data is stored only in the current browser using localStorage. Clearing browser storage removes saved changes.
- Login/profile is a visual demo only; real authentication requires a backend.
- Orders and analytics values are sample/demo data, not connected to real sales.
- The digital menu uses a remote Unsplash background image; an internet connection is needed for that image and Google Fonts.
