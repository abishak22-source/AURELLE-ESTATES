# Project walkthrough — ABI Estates

This guide follows the code that is in this folder. It is written so you can read one layer at a time and trace how a page turns into a working website.

## 1. What kind of project is this?

It is a static multi-page front end:

- **HTML** gives each page its content and structure.
- **CSS** controls layout, colours, text, image crops, animation and responsive sizes.
- **JavaScript** adds navigation, filtering, carousels, reveals, counters and form submission.
- **WebP images** are local files in `IMAGES/`.
- There is no React/Vue or build step for the website itself. A small Node.js server in `backend/` receives the enquiry forms.
- The home listings are sample data in JavaScript. The enquiry form sends its data to the backend, which saves it in Supabase and sends the emails.
- Fonts come from Google Fonts: **Libre Baskerville** for headings and **Manrope** for menus, labels, buttons and paragraphs.

## 2. Folder map and what each part owns

```text
RLS Landing page/
├── index.html                  Home page (the only root HTML file)
├── PAGES/
│   ├── about/index.html        About the agency and its values
│   ├── search/index.html       Filter homes and browse neighbourhoods
│   ├── properties/index.html   Full residence collection and home styles
│   ├── property/index.html     Individual residence details
│   ├── approach/index.html     The service process and principles
│   ├── journal/index.html      Editorial/blog cards
│   ├── contact/index.html     Contact details, enquiry form and location
│   └── credits/index.html      Photo credits
├── CSS/
│   ├── variables.css           Shared colour, font, width and type tokens
│   ├── base.css                Reset, shared controls and basic components
│   ├── header-hero.css         Header, navigation and home hero
│   ├── home-sections.css       Home page sections and common card styling
│   ├── animations.css          @keyframes definitions (the animation recipes)
│   ├── responsive.css          Tablet/phone overrides and reduced motion
│   ├── inner-pages.css         Layouts and components used by PAGES/
│   ├── refinements.css         Later visual adjustments and overrides
│   ├── effects.css             Visual effects, reveals and section numbers
│   ├── typography.css          Text styling (fonts, weights, line spacing)
│   └── premium.css             Premium design layer, loaded LAST (cards, glass panels, icons, footer)
├── JS/
│   ├── site-config.js          Menu and business contact settings
│   ├── properties-data.js      Nine sample residences, used by the cards
│   ├── core.js                 Shared interactions and card HTML builder
│   ├── home.js                 Home-only slider, search and collection logic
│   ├── inner-pages.js          Inner-page property grid and filter
│   └── enquiry.js              Sends the enquiry forms to the backend
├── IMAGES/                     WebP photos; 800/1200/1600 suffixes are widths
│   ├── icons/                  Line icons (bed, bath, area, pin, ...) used by CSS/premium.css
│   ├── plan-residence.svg      Floor plan drawing (decoration behind photos)
│   ├── skyline-chennai.svg     Chennai skyline drawing (contact section + footers)
│   └── sketch-*.svg            Small hand-drawn sketches beside headings
├── backend/                    Node.js server: saves enquiries in Supabase, sends emails
│   ├── server.js               The /api/enquiry route
│   ├── package.json            The server's libraries (express, supabase-js, nodemailer, ...)
│   └── .env                    Secret keys (never share or upload this file)
└── docs/
    ├── PROJECT-WALKTHROUGH.md  This guide
    └── LEARNING-PROMPT.md      Copy/paste ChatGPT tutor prompt
```

The folders are already split by role. They are intentionally not renamed: every HTML document and some CSS/JavaScript refer to these exact paths. The `docs/` folder adds the learning material without making those links fragile.

## 3. How a page loads

Each HTML file has the same broad shape:

1. `<head>` sets language, character encoding, mobile viewport, title and description.
2. `<link rel="stylesheet">` loads the CSS files in a deliberate order. Later files can override earlier rules.
3. `<script defer>` loads JavaScript after HTML parsing. `defer` lets the browser read the page before running the script.
4. `<body data-page="..." data-root="...">` tells shared JavaScript which page is open and how far up the folder tree the site root is.
5. `<header>` contains the brand and navigation, `<main>` contains page content, and `<footer>` closes the page.

The home page uses paths such as `CSS/base.css` and `IMAGES/...`. A page inside `PAGES/search/` uses `../../CSS/base.css` and `../../IMAGES/...`: `../..` means “go up from `PAGES/search/` to the project root.” `data-root` lets JavaScript build the same links correctly from either location.

### Script order

The common order is important:

1. `site-config.js` defines `window.SITE_CONFIG`.
2. `properties-data.js` defines `window.propertyListings` and prefixes image paths using `data-root`.
3. `core.js` reads those globals and provides `window.ABI` helpers.
4. `home.js` (home only) or `inner-pages.js` (pages in `PAGES/`) uses the shared helpers and data.
5. `enquiry.js` is loaded on the home and contact pages where an enquiry form exists.

Changing this order can cause “undefined” errors because one file may run before the data or helper it depends on.

## 4. How HTML, CSS and JavaScript connect

Think of HTML as labeled pieces, CSS as their appearance, and JavaScript as behavior:

```html
<button id="hero-next" type="button">Next</button>
```

```js
const nextButton = document.getElementById("hero-next");
nextButton.addEventListener("click", showNextSlide);
```

```css
.hero-button { /* shape, colour, spacing */ }
.hero-slide.active { opacity: 1; }
```

The `id` or `data-*` attribute is the connection point. JavaScript listens for a click or form submit, then updates text, inserts markup or toggles a class such as `.active`. CSS sees that class and changes how the element looks. A class by itself does not create behavior; JavaScript has to toggle it when movement or state change is needed.

Useful examples in this project:

- `#hero-next`, `#hero-prev`, `[data-hero-slide]`: home slideshow controls.
- `#property-grid`, `[data-property-grid]`: places where JavaScript inserts home cards.
- `[data-home-filter]`: area/type filter on Find a Home.
- `[data-enquiry-form]`, `[data-form-message]`: form behavior and status message.
- `[data-stat]`, `[data-count]`: values for animated number counters.
- `.reveal` and `.visible`: scroll-based entrance effects.

## 5. Page-by-page tour

### Home — `index.html`

Contains the full landing-page sequence: hero slideshow and quick enquiry form; moving Chennai neighbourhood strip; point-of-view introduction and four stats; home search controls; nine-home carousel; approach statement; three principles; journal previews; contact section and footer. `JS/home.js` handles the home-specific slider, filters and carousel. The cards themselves are built with shared code in `JS/core.js` from `JS/properties-data.js`.

### About — `PAGES/about/index.html`

Explains ABI Estates, its Chennai perspective and service values. Content is mostly static HTML. Shared header/footer, reveal effects and any common card behavior come from `core.js` and the shared CSS.

### Find a Home — `PAGES/search/index.html`

Has area, home-style and minimum-bedroom filters, a generated property list and neighbourhood feature cards. `inner-pages.js` requests results from `GET /api/properties`; selecting a result opens `PAGES/property/`, which requests the full record by slug from `GET /api/properties/:slug`. The current entries are sample listings, not records from a live database.

### Properties — `PAGES/properties/index.html`

Introduces the collection, renders all nine home cards, and groups villas, city homes and penthouses as editorial feature cards. The residence cards are generated from the same shared data array.

### Our Approach — `PAGES/approach/index.html`

Describes the agency's principles and the stages of a home search, with supporting content cards and imagery. This page is mostly static HTML styled by the inner-page layout rules.

### Blogs — `PAGES/journal/index.html`

Displays editorial cards and image/text excerpts. The current articles are static markup; there is no CMS or article database connection in this repository.

### Contact — `PAGES/contact/index.html`

Shows contact information, location/map presentation and the full enquiry form. Its form uses the same `[data-enquiry-form]` and `JS/enquiry.js` flow as the compact home-page form.

### Photo Credits — `PAGES/credits/index.html`

Lists image attributions. It is a static information page.

## 6. How the home cards and filters work

`JS/properties-data.js` contains an array, `window.propertyListings`. Each object has fields such as:

- `name`, `location`, `area`, `type`, `typeLabel`
- `bedrooms`, `bathrooms`, `size`, `price`, `tag`
- `image`, `imageText`

The data file converts each image filename into a full relative path. `core.js` has `createPropertyCard(property, isInnerPage)`, which turns one object into HTML. `home.js` and `inner-pages.js` call that helper and place the returned cards inside the matching grid.

`backend/server.js` exposes `GET /api/properties?area=adyar&type=villa&bedrooms=3`. The backend compares area and type exactly and treats bedrooms as a minimum. Empty filters return the complete catalog. `JS/site-config.js` sets the API origin; use the local backend at `http://localhost:5000` during development.

All current prices and properties are sample/illustrative entries, not live property records. The same array is used by the browser and backend, so to add a sample home, copy one object, change its fields and image filename, and make sure the image exists in `IMAGES/`.

## 7. Images, pixel sizes and responsive layout

Image filenames like `chennai-home-800.webp`, `chennai-home-1200.webp`, and `chennai-home-1600.webp` indicate approximate image widths in pixels. They are alternative resolutions of a photo, not different CSS sizes.

In HTML, `src` is the fallback image, while `srcset` lists available resolutions and `sizes` tells the browser how wide the image will appear at different viewport widths. The browser chooses a suitable file for the screen and pixel density. `width` and `height` reserve the image's aspect ratio before it loads, reducing page movement. `loading="lazy"` postpones off-screen images; the first hero photo is preloaded because it appears immediately.

CSS controls the visible box:

- `width: 100%` fills its container.
- `aspect-ratio: 1.4 / 1` sets the box proportion without hard-coding both dimensions.
- `object-fit: cover` fills/crops the box without stretching the photo.
- `object-position` can shift which part of a cropped photo remains visible.
- `max-width` and `min()`/`clamp()` limit sizes as the viewport changes.

For overall sizing, start with `CSS/variables.css`: `--page-gutter` controls horizontal page padding; font and text variables control typography. `CSS/responsive.css` contains `@media` rules. For example, `@media (max-width: 760px)` means the rules inside it apply on phone-sized screens. The desktop styles normally set the base layout; responsive rules override only what needs to change at narrower widths.

## 8. What the enquiry form connects to

Both forms (the hero form on the home page and the Contact page form) have `data-enquiry-form`. `JS/enquiry.js` handles them:

1. It reads the named fields (`name`, `email`, `country_code`, `phone`, `interest`, `message`) and checks the name and email.
2. It sends a `POST` request with the data as JSON to `ENQUIRY_ENDPOINT` (currently `http://localhost:5000/api/enquiry`, the Node server in `backend/`).
3. `backend/server.js` saves the enquiry in the Supabase table `enquiries`, then uses Gmail SMTP (nodemailer) to send a confirmation to the visitor and a notification to the owner.
4. The page shows a success/error message and resets the form after a successful save.

To test the form on your computer, start the server first: open a terminal in `backend/`, run `npm install` once, then `node server.js`. The secret keys live in `backend/.env` on the server only, never in front-end JavaScript. When the site goes live, change `ENQUIRY_ENDPOINT` to the live server address. The static property list does not use Supabase.

## 8b. The premium design layer (CSS/premium.css)

`premium.css` is loaded last, so its rules win over the older files. It is split into numbered parts in page order (0. Icons, 1. Fonts, 2. Buttons, 3. Header ... 14. Inner pages, 15. Responsive, 16. Reduced motion). The values it uses (fonts, extra colours, corner roundness `--radius`, shadows and the gold gradient) are variables at the end of `CSS/variables.css` under "PREMIUM DESIGN SYSTEM".

Icons: write `<span class="icon icon-bed" aria-hidden="true"></span>` in the HTML. The SVG file in `IMAGES/icons/` is used as a mask, so the icon takes the colour of the text around it. Icons only show when the site is opened through a web server such as Live Server, not by double-clicking the HTML file.

## 9. A beginner-friendly way to study

1. Read one page's HTML from top to bottom. Identify header, hero, sections and footer.
2. Follow one class name from HTML into CSS. Example: `.property-card`.
3. Follow one `id` or `data-*` attribute from HTML into JavaScript. Example: `#hero-next`.
4. Trace one property object from `properties-data.js` through `createPropertyCard()` to the page grid.
5. Trace one form field from its `name` attribute into `enquiry.js`, then into `backend/server.js` (the Supabase row and the email text).
6. Change one safe style, such as `--page-gutter`, then view desktop and phone layouts.
7. Only after understanding those flows, try moving or renaming files. Update every relative link when a file moves.

The code comments at the top of the CSS and JavaScript files are the quick map; use this guide for the longer explanation. `docs/LEARNING-PROMPT.md` turns the same map into a guided ChatGPT lesson.
