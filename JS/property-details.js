/* Loads a single home's full record and fills the dedicated details page. */
(function () {
    const slug = new URLSearchParams(window.location.search).get("slug");
    const content = document.querySelector("[data-property-content]");
    const missing = document.querySelector("[data-property-missing]");
    const status = document.querySelector("[data-property-status]");
    const siteRoot = document.body.getAttribute("data-root") || "";
    const apiBase = (window.SITE_CONFIG && window.SITE_CONFIG.apiBaseUrl) || window.location.origin;

    function showMissing() {
        content.hidden = true;
        missing.hidden = false;
    }

    function setText(selector, value) {
        const element = document.querySelector(selector);
        element.textContent = value || "Details available on request";
    }

    function renderProperty(property, fromBackend) {
        if (!property) {
            showMissing();
            return;
        }

        const name = property.name || "Chennai residence";
        document.title = name + " | ABI Estates";
        document.querySelector("#property-name").textContent = name;
        setText("[data-property-kicker]", (property.typeLabel || "HOME") + " · " + (property.location || "CHENNAI"));
        setText("[data-property-location]", property.location + " · Chennai");
        setText("[data-property-price]", property.price);
        setText("[data-property-description]", property.description || property.imageText);
        setText("[data-property-type]", property.typeLabel);
        setText("[data-property-bedrooms]", property.bedrooms + " bedrooms");
        setText("[data-property-bathrooms]", property.bathrooms + " bathrooms");
        setText("[data-property-size]", property.size);
        setText("[data-property-area]", property.location);
        setText("[data-property-tag]", property.tag);
        setText("[data-property-image-caption]", property.imageText);

        const image = document.querySelector("[data-property-image]");
        image.src = fromBackend ? siteRoot + "IMAGES/" + property.image : property.image;
        image.alt = property.imageText || name;

        const highlights = document.querySelector("[data-property-highlights]");
        highlights.replaceChildren();
        (Array.isArray(property.highlights) ? property.highlights : []).forEach(function (highlight) {
            const item = document.createElement("li");
            item.textContent = highlight;
            highlights.appendChild(item);
        });

        document.querySelector("[data-property-enquiry]").href =
            siteRoot + "PAGES/contact/?property=" + encodeURIComponent(name) + "#enquiry";
        content.hidden = false;
        missing.hidden = true;
        if (!fromBackend && status) {
            status.textContent = "Showing sample catalog details. Start the backend to load this home from the API.";
        }
    }

    if (!slug) {
        showMissing();
        return;
    }

    fetch(apiBase.replace(/\/$/, "") + "/api/properties/" + encodeURIComponent(slug))
        .then(function (response) {
            if (!response.ok) throw new Error("This home is unavailable.");
            return response.json();
        })
        .then(function (result) {
            if (!result.ok || !result.property) throw new Error("This home is unavailable.");
            renderProperty(result.property, true);
        })
        .catch(function () {
            const sample = (window.propertyListings || []).find(function (property) {
                return property.slug === slug;
            });
            renderProperty(sample, false);
        });
})();
