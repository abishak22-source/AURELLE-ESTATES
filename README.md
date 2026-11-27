# ABI Estates — Chennai Homes

This is a static, multi-page real-estate website built with HTML, CSS and plain JavaScript. It does not use a front-end framework or a build step.

## Learn the project

Start with [`docs/PROJECT-WALKTHROUGH.md`](docs/PROJECT-WALKTHROUGH.md) for the folder map, page-by-page tour, HTML/CSS/JavaScript flow, responsive image sizing, and enquiry form connections. Then copy the study prompt from [`docs/LEARNING-PROMPT.md`](docs/LEARNING-PROMPT.md) into ChatGPT to work through the code as a beginner.

## Folder map

```text
RLS Landing page/
├── index.html              Home page and its sections
├── PAGES/                  One folder and index.html for each inner page, including property details
├── CSS/                    Site styles, split by responsibility
├── JS/                     Shared scripts, page scripts and sample home data
├── IMAGES/                 WebP photos in several width variants, icons/ and SVG drawings
├── backend/                Node.js API for property search and enquiries
└── docs/                   Project guide and the ChatGPT study prompt
```

The existing `PAGES`, `CSS`, `JS`, and `IMAGES` names are kept because the HTML, CSS and JavaScript already refer to those paths. `docs/` is the learning area; read it before changing paths or moving source files.

## Run it locally

Open the project folder in VS Code and use the Live Server extension to serve `index.html`. In a second terminal, start the API with `cd backend`, `npm install`, and `node server.js`. The Find a Home page calls `http://localhost:5000/api/properties`; update `apiBaseUrl` in `JS/site-config.js` when the API is deployed elsewhere.

## Where to edit common things

- Page text and section order: `index.html` or the matching `PAGES/<page>/index.html`.
- Colours, fonts, rounded corners, shadows and shared spacing: `CSS/variables.css`.
- The premium look (cards, glass panels, icons, footer): `CSS/premium.css`, loaded last.
- Home/property sample content: `JS/properties-data.js`.
- Menu, footer and business contact details: `JS/site-config.js`.
- Search results, property detail pages and the backend API share entries from `JS/properties-data.js`.
- Shared interactions: `JS/core.js`; home-only interactions: `JS/home.js`.
- Responsive layout: `CSS/responsive.css`.
- Contact-form flow: `JS/enquiry.js` and the `data-enquiry-form` forms.

## Important data distinction

The nine displayed residences are sample listings in `JS/properties-data.js`. The Node API imports that shared catalog and filters results by area, home type, and minimum bedrooms; these are not database-backed live listings. Enquiry submissions are also handled by the backend and use Supabase and email when those credentials are configured. See the walkthrough for details.
