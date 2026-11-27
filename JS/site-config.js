/* =====================================================================
   ABI ESTATES - SITE SETTINGS (site-config.js)

   ★ Change company details and menu links HERE. core.js copies them into
   every page (menus, footers, Contact page, map), so nothing else needs
   editing. The same text is also written in the HTML, so pages still
   read correctly while loading or without JavaScript.
   ===================================================================== */

window.SITE_CONFIG = {
    brand: "ABI Estates",
    // Local backend origin. Change this to the deployed API host when publishing.
    apiBaseUrl: "http://localhost:5000",

    // PLACEHOLDERS: replace the phone number and street address with your real details
    email: "hello@abiestates.in",
    phone: "+91 44 0000 0000",
    phoneLink: "+914400000000",            // same number without spaces (tap-to-call)
    addressLines: ["Adyar, Chennai 600020", "Tamil Nadu, India"],
    hours: "Monday – Saturday · 9:00 am – 6:00 pm",
    hoursClosed: "Sunday · Closed",
    mapSearch: "Adyar, Chennai, Tamil Nadu",  // what Google Maps shows on the Contact page

    // Main menu. "path" starts from the website's main folder.
    navigation: [
        { id: "about",      label: "About",        path: "PAGES/about/" },
        { id: "search",     label: "Find a home",  path: "PAGES/search/" },
        { id: "properties", label: "Properties",   path: "PAGES/properties/" },
        { id: "approach",   label: "Our approach", path: "PAGES/approach/" },
        { id: "journal",    label: "Blogs",        path: "PAGES/journal/" },
        { id: "contact",    label: "Contact",      path: "PAGES/contact/" }
    ],

    // The highlighted button at the end of the menu
    menuButton: { label: "Arrange a viewing", path: "PAGES/contact/#enquiry" },

    // Links in the home page footer (ids from the menu above)
    footerLinks: ["properties", "approach", "contact"]
};
