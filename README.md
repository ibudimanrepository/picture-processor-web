# SnapReport

A web-based **QA Testing Report Generator**. Upload screenshots, add titles and descriptions for each step, then generate a PDF testing report — all in the browser, with no backend.

**Live Site:** https://ibudimanrepository.github.io/picture-processor-web/

---

## Table of Contents

1. [Functional Overview](#1-functional-overview)
2. [Technical Details](#2-technical-details)
3. [Deployment Information](#3-deployment-information)
4. [Development Guide](#4-development-guide)

---

## 1. Functional Overview

### 1.1 User Flow

```
Upload Screenshots → Edit Steps → Generate PDF → Download / Share
```

### 1.2 Features

| Feature | Description |
|---|---|
| **Upload Screenshots** | Select one or more image files from your device. Each file is compressed (max 600px width, JPEG quality 0.7) before display. |
| **Reorder Screenshots** | Change screenshot order with ▲ (move up) and ▼ (move down) buttons. |
| **Edit Steps** | Click a screenshot to open the editor modal. Fill in the step title and description (what the tester should verify). |
| **Generate PDF** | The "Process N Steps" button compiles all screenshots into a landscape PDF with a 4-column layout per page. |
| **Download PDF** | Download the PDF file directly to your device. |
| **Share PDF** | Uses the Web Share API to share the PDF via other apps (WhatsApp, Email, etc.). Falls back to download if Web Share API is unavailable. |
| **New Report** | Clears all data and returns to the home screen to start a new report. |

### 1.3 Screen Breakdown

**HomeScreen** — Main page:
- Header: "SnapReport" title + screenshot count
- Empty state: camera emoji + upload button (when no screenshots are added)
- Screenshot list: thumbnail, step number, title, reorder/delete buttons
- Bottom bar: Upload button (secondary) + Process Steps button (primary)
- Loading overlay: spinner during PDF generation

**PreviewScreen** — Result page:
- Green checkmark + "Report Ready" heading
- Share, Download, and New Report buttons
- Back button (returns without resetting)

**StepEditor** — Edit modal:
- Step title input
- Description textarea
- Delete Step button

### 1.4 Privacy

No data is sent to any server:
- Images are read in browser memory via the File API & Canvas API
- Image compression is done via the Canvas API (off-screen)
- PDF is generated client-side via jsPDF
- Download/share happens directly from the browser
- All data is lost when the page is refreshed

---

## 2. Technical Details

### 2.1 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI library |
| **TypeScript** | 6.x | Type safety |
| **Vite** | 8.x | Build tool & dev server |
| **jsPDF** | 4.x | PDF generation |
| **html2canvas** | 1.x | *(installed but not directly imported)* |

### 2.2 File Structure

```
/
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration (base, plugin, outDir)
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # Root TypeScript config
├── tsconfig.app.json             # TS config for src/
├── tsconfig.node.json            # TS config for vite.config.ts
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
│
├── src/
│   ├── main.tsx                  # React entry point (createRoot)
│   ├── App.tsx                   # Root component + screen navigation
│   ├── index.css                 # Global stylesheet (~400 lines)
│   │
│   ├── types/
│   │   └── index.ts              # Type definitions (ScreenshotItem)
│   │
│   ├── hooks/
│   │   └── useScreenshots.ts     # State management hook
│   │
│   ├── utils/
│   │   └── imageUtils.ts         # Image compression utility
│   │
│   ├── services/
│   │   └── pdfGenerator.ts       # PDF generation service (jsPDF)
│   │
│   ├── components/
│   │   ├── ActionButton.tsx      # Reusable button (primary/secondary/danger)
│   │   ├── EmptyState.tsx        # Empty state placeholder UI
│   │   ├── ScreenshotItem.tsx    # Screenshot card component
│   │   └── StepEditor.tsx        # Modal editor for step metadata
│   │
│   └── screens/
│       ├── HomeScreen.tsx        # Main upload & process screen
│       └── PreviewScreen.tsx     # Result screen (share/download)
│
└── docs/                         # Build output (auto-generated, deployed to GitHub Pages)
    ├── index.html
    ├── favicon.svg
    ├── icons.svg
    └── assets/
        ├── index-*.js            # React app bundle
        ├── index-*.css           # Compiled styles
        ├── index.es-*.js         # jsPDF bundle
        ├── html2canvas-*.js      # html2canvas bundle
        └── purify.es-*.js        # DOM Purify (jsPDF dependency)
```

### 2.3 Architecture & Data Flow

```
User → HomeScreen
         ├── Pick files → compressImage() → useScreenshots.addScreenshots()
         ├── Edit step → StepEditor → useScreenshots.updateScreenshot()
         ├── Reorder → useScreenshots.moveUp() / moveDown()
         └── Process → generatePDF() → PreviewScreen
                                          ├── Share → Web Share API
                                          └── Download → <a> download
```

**State Management:** All state is managed in a single custom hook `useScreenshots()` in `App.tsx`, passed as props to screens and components. No global state library (Redux, Zustand, etc.) is used.

**Navigation:** No routing library. A simple `useState<'home' | 'preview'>` in `App.tsx` toggles between screens.

**PDF Layout:**
- Orientation: landscape (letter, 792pt x 612pt)
- 4 columns per page (each card contains step number, title, description, and image)
- Images maintain their original aspect ratio, scaled to fit inside the card
- Each page has a "QA Testing Report" header with the generation date

### 2.4 Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "jspdf": "^4.2.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.x",
    "typescript": "~6.x",
    "vite": "^8.x",
    "eslint": "^10.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript-eslint": "^8.x",
    "@eslint/js": "^9.x",
    "globals": "^16.x"
  }
}
```

### 2.5 Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `tsc -b && vite build` | Production build to `docs/` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Run ESLint |

---

## 3. Deployment Information

### 3.1 Code Locations

| Location | URL / Path |
|---|---|
| **GitHub Repository** | https://github.com/ibudimanrepository/picture-processor-web |
| **GitHub Pages (Live)** | https://ibudimanrepository.github.io/picture-processor-web/ |

### 3.2 Repository Details

| Attribute | Value |
|---|---|
| Repo name | `ibudimanrepository/picture-processor-web` |
| Visibility | Public |
| Default branch | `main` |
| Language | TypeScript |
| Created | May 19, 2026 |

### 3.3 GitHub Pages Configuration

- **Source:** Branch `main`, folder `/docs`
- **Build type:** Legacy (static files)
- **Custom domain:** None
- **HTTPS:** Enabled (forced)

Check deployment status:
```bash
gh api /repos/ibudimanrepository/picture-processor-web/pages/builds/latest
```

### 3.4 Deployment Process

Builds are handled by Vite, output to the `docs/` folder, then committed and pushed to GitHub. GitHub Pages automatically serves files from the `docs/` folder on the `main` branch.

**Manual deployment steps:**

```bash
# 1. Build
npm run build

# 2. Commit the build output
git add docs/
git commit -m "Update build"

# 3. Push to GitHub (Pages auto-deploys)
git push
```

**Important Vite config:**
```ts
export default defineConfig({
  base: '/picture-processor-web/',  // base URL must match the repo name
  build: {
    outDir: 'docs',                  // output folder for GitHub Pages
  },
})
```

The `base` value in `vite.config.ts` must be updated if the repo is renamed or moved.

---

## 4. Development Guide

### 4.1 Local Setup

```bash
git clone https://github.com/ibudimanrepository/picture-processor-web.git
cd picture-processor-web
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### 4.2 Build & Preview

```bash
npm run build     # build to docs/
npm run preview   # preview the build locally
```

### 4.3 Commit Convention

Use descriptive English commit messages, for example:
- `"Add feature: ..."`
- `"Fix bug: ..."`
- `"Update style: ..."`
- `"PDF: horizontal layout with preserved aspect ratio"`

### 4.4 Important Notes

1. **html2canvas** is listed in `package.json` but is not currently imported anywhere. If a future feature requires DOM-to-image capture, the library is ready to use without a reinstall.
2. **No test suite** — manual testing is done via the browser.
3. **No backend** — everything runs client-side. If a backend is needed in the future, the architecture (with the `useScreenshots` hook) can be extended to sync with an API.
4. **Chunk size warning** during builds (jsPDF bundle ~600KB) does not affect functionality. For production, the bundle can be split using dynamic imports if needed.

---

*Documentation updated on May 20, 2026.*
