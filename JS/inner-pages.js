/* =====================================================================
   ABI ESTATES - INNER PAGES JAVASCRIPT (inner-pages.js)
   Shared inner-page behavior: clean URLs, load backend property results,
   and filter homes by location, type, and minimum bedrooms.
   ===================================================================== */
(function () {
    /* ---------- 1. CLEAN PAGE ADDRESS ---------- */
    if (window.location.pathname.length > 1 && window.location.pathname.endsWith("/")) {
        const cleanPath = window.location.pathname.slice(0, -1) + window.location.search + window.location.hash;
        window.history.replaceState(null, "", cleanPath);
    }

    /* ---------- 2. PROPERTY GRID + BACKEND SEARCH ---------- */
    const grid = document.querySelector("[data-property-grid]");
    if (!grid) return;

    const listings = window.propertyListings || [];
    const status = document.querySelector("[data-search-status]");
    const filterForm = document.querySelector("[data-home-filter]");
    const apiBase = (window.SITE_CONFIG && window.SITE_CONFIG.apiBaseUrl) || window.location.origin;
    const siteRoot = document.body.getAttribute("data-root") || "";
    let latestSearchId = 0;
    const incomingFilters = new URLSearchParams(window.location.search);
    const initialFilters = { area: "", type: "", bedrooms: "" };

    if (filterForm) {
        Object.keys(initialFilters).forEach(function (field) {
            const value = incomingFilters.get(field) || "";
            if (Array.from(filterForm.elements[field].options).some(function (option) { return option.value === value; })) {
                filterForm.elements[field].value = value;
            }
            initialFilters[field] = filterForm.elements[field].value;
        });
    }

    function draw(homes, prefixImagePaths) {
        if (homes.length === 0) {
            grid.innerHTML = '<p class="property-empty">No homes match those filters. Try another area or home style.</p>';
            return;
        }
        const html = homes.map(function (home) {
            if (prefixImagePaths) {
                home.image = siteRoot + "IMAGES/" + home.image;
            }
            return window.ABI.createPropertyCard(home, true);
        }).join("");
        grid.innerHTML = html;
        grid.querySelectorAll(".reveal").forEach(window.ABI.watchReveal);
    }

    function showSearchResults() {
        if (!filterForm) return;
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
        grid.querySelectorAll(".page-property-card").forEach(function (card, index) {
            card.classList.remove("search-result-highlight");
            card.style.setProperty("--search-highlight-delay", Math.min(index * 100, 600) + "ms");
            void card.offsetWidth;
            card.classList.add("search-result-highlight");
        });
    }

    function searchHomes(filters, revealResults) {
        const searchId = ++latestSearchId;
        const query = new URLSearchParams(filters);
        return fetch(apiBase.replace(/\/$/, "") + "/api/properties?" + query.toString())
            .then(function (response) {
                if (!response.ok) throw new Error("Property search is unavailable.");
                return response.json();
            })
            .then(function (result) {
                if (!result.ok || !Array.isArray(result.properties)) {
                    throw new Error("The property search returned an invalid response.");
                }
                if (searchId !== latestSearchId) return result;
                draw(result.properties, true);
                if (revealResults) showSearchResults();
                if (status) status.textContent = result.total + (result.total === 1 ? " home found." : " homes found.");
                return result;
            });
    }

    // Show the sample catalog immediately while the backend request loads.
    draw(listings);
    searchHomes(filterForm ? initialFilters : {}, filterForm && Object.values(initialFilters).some(Boolean)).catch(function () {
        if (status) status.textContent = "Showing the sample catalog. Start the backend to search homes.";
    });

    /* ---------- 3. SEARCH FORM ---------- */
    if (!filterForm) return;

    filterForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const button = filterForm.querySelector('button[type="submit"]');
        const originalButtonMarkup = button.innerHTML;
        const filters = {
            area: filterForm.elements.area.value,
            type: filterForm.elements.type.value,
            bedrooms: filterForm.elements.bedrooms.value
        };
        const query = new URLSearchParams();
        Object.keys(filters).forEach(function (field) {
            if (filters[field]) query.set(field, filters[field]);
        });
        window.history.replaceState(null, "", window.location.pathname + (query.toString() ? "?" + query.toString() : ""));

        button.disabled = true;
        button.textContent = "Searching…";
        if (status) status.textContent = "Searching available homes…";

        try {
            await searchHomes(filters, true);
        } catch (error) {
            if (status) status.textContent = "Could not reach the property search. Please start the backend and try again.";
        } finally {
            button.disabled = false;
            button.innerHTML = originalButtonMarkup;
        }
    });
})();
