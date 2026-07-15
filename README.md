# Nikkah Invitation — React Version

This is a faithful React port of the original HTML/CSS/JS Nikkah invitation website.
**No visual design, colors, or functionality were changed** — only the structure was
converted so it runs as a React app (Vite + React).

## What changed vs. the original
- `index.html` + `style.css` + `script.js` → `src/App.jsx` + `src/style.css` + `src/main.jsx`
- All CSS is copied over **unchanged** (`src/style.css`).
- All JavaScript logic (canvas particle animation, petals, splash screen,
  scroll-reveal, video player, countdown, wishes form, RSVP form) is ported
  **line-for-line** into a `useEffect` inside `App.jsx`, with proper cleanup
  added so it behaves correctly under React (this is standard practice and
  doesn't change any behavior you see on screen).
- The video file is now served from `public/video.mp4` (Vite convention).
- The backend (`server/server.js`) is **completely unchanged** — same
  Express + Nodemailer code, same `/send-wish` and `/send-rsvp` routes.

## Project structure
```
nikkah-react/
├── index.html          Vite entry (fonts + tabler icons links)
├── src/
│   ├── main.jsx         React root
│   ├── App.jsx           All markup + ported script.js logic
│   └── style.css         Original CSS, unchanged
├── public/
│   └── video.mp4         Your story video
└── server/
    ├── server.js         Original Express backend, unchanged
    ├── package.json
    └── .env.example      Copy to .env and add your Gmail credentials
```

## Running the frontend
```bash
npm install
npm run dev        # http://localhost:5173
```
To build for production:
```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build
```

## Running the backend (for the wish/RSVP email features)
```bash
cd server
npm install
cp .env.example .env    # then fill in EMAIL_USER and EMAIL_PASS
npm start                # runs on http://localhost:7000
```
The frontend's "Send Your Wishes" button calls `http://localhost:7000/send-wish`
directly (same as the original site), so make sure the backend is running on
port 7000 while you test that feature.

> Note: the original frontend never actually called `/send-rsvp` on the
> backend — the RSVP form only showed a local success message. That exact
> behavior has been preserved as-is.
