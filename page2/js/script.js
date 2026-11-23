/* =========================================================
   AURELLE ESTATES — JAVASCRIPT
   Purpose: Adds navigation, property discovery and form interactions.
   ========================================================= */

/* 01. SAMPLE PROPERTY DATA
   Each object represents one demo listing used by the search and cards.
   These are fictional examples for this portfolio project. */
const properties = [
    {
        id: "01",
        name: "The Banyan House",
        location: "Adyar",
        area: "adyar",
        type: "villa",
        typeLabel: "Private villa",
        bedrooms: 4,
        bathrooms: 4,
        size: "4,200 sq.ft.",
        price: "₹8.4 Cr",
        tag: "PRIVATE COLLECTION",
        image: "images/garden-residence.jpg",
        alt: "Modern garden residence with warm timber screens"
    },
    {
        id: "02",
        name: "Coastline Residence",
        location: "East Coast Road",
        area: "ecr",
        type: "villa",
        typeLabel: "Coastal villa",
        bedrooms: 5,
        bathrooms: 5,
        size: "5,100 sq.ft.",
        price: "₹12.6 Cr",
        tag: "COASTAL LIVING",
        image: "images/coastal-villa.jpg",
        alt: "Light-filled coastal villa with a garden and swimming pool"
    },
    {
        id: "03",
        name: "The Verandah",
        location: "Nungambakkam",
        area: "nungambakkam",
        type: "apartment",
        typeLabel: "Luxury apartment",
        bedrooms: 3,
        bathrooms: 3,
        size: "2,450 sq.ft.",
        price: "₹4.8 Cr",
        tag: "CITY ADDRESS",
        image: "images/chennai-apartment.jpg",
        alt: "Contemporary apartment building with a clean modern facade"
    },
    {
        id: "04",
        name: "The Solstice Penthouse",
        location: "OMR",
        area: "omr",
        type: "penthouse",
        typeLabel: "Penthouse",
        bedrooms: 4,
        bathrooms: 4,
        size: "3,800 sq.ft.",
        price: "₹7.2 Cr",
        tag: "LIMITED RESIDENCE",
        image: "images/chennai-living.jpg",
        alt: "Spacious contemporary living room with natural light and timber finishes"
    }
];

/* 02. DOM ELEMENT SELECTION
   Store references to HTML elements so functions can update them. */
const propertyGrid = document.getElementById("property-grid");
const searchForm = document.getElementById("property-search");
const locationFilter = document.getElementById("location-filter");
const typeFilter = document.getElementById("type-filter");
const bedFilter = document.getElementById("bed-filter");
const searchFeedback = document.getElementById("search-feedback");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const siteHeader = document.querySelector(".site-header");
const heroSection = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroPanels = Array.from(document.querySelectorAll("[data-hero-panel]"));
const heroDots = Array.from(document.querySelectorAll("[data-hero-slide]"));
const heroCounter = document.getElementById("hero-counter");
const heroToggle = document.querySelector("[data-hero-toggle]");
const pageProgressBar = document.getElementById("page-progress-bar");
const heroBlueprint = document.querySelector(".hero-blueprint");

/* 03. PROPERTY CARD RENDERING
   Converts one property object into HTML, then displays all matching cards. */
function createPropertyCard(property) {
    return `
        <article class="property-card reveal">
            <div class="property-image-wrap">
                <img class="property-image"
                     src="${property.image}"
                     alt="${property.alt}"
                     loading="lazy">
                <span class="property-tag">${property.tag}</span>
                <span class="property-number">${property.id}</span>
            </div>
            <div class="property-info">
                <div>
                    <h3>${property.name}</h3>
                    <p class="property-location">${property.location} · ${property.typeLabel}</p>
                </div>
                <p class="property-price">${property.price}</p>
                <div class="property-meta">
                    <span>${property.bedrooms} bedrooms</span>
                    <span>${property.bathrooms} bathrooms</span>
                    <span>${property.size}</span>
                </div>
            </div>
        </article>
    `;
}

/* This function updates the property grid using the selected property list. */
function renderProperties(propertyList) {
    if (propertyList.length === 0) {
        propertyGrid.innerHTML = `
            <p class="property-empty">
                No residences match those choices. Try adjusting your search.
            </p>
        `;
        return;
    }

    propertyGrid.innerHTML = propertyList.map(createPropertyCard).join("");

    // Newly created cards also receive the scroll reveal behavior.
    enablePropertyCardMotion();
    observeRevealElements();
}

/* Gives desktop pointers a small, restrained 3D response on residence cards. */
function enablePropertyCardMotion() {
    const canTilt = window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTilt) return;

    propertyGrid.querySelectorAll(".property-card").forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            card.style.setProperty("--card-tilt-x", `${(-y * 3.5).toFixed(2)}deg`);
            card.style.setProperty("--card-tilt-y", `${(x * 4.5).toFixed(2)}deg`);
            card.style.setProperty("--card-glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
            card.style.setProperty("--card-glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
        });
        card.addEventListener("pointerleave", function () {
            card.style.setProperty("--card-tilt-x", "0deg");
            card.style.setProperty("--card-tilt-y", "0deg");
        });
    });
}

/* 04. PROPERTY SEARCH & FILTERING
   Reads the form values and filters the original array using filter(). */
searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the browser from refreshing the page.

    const selectedLocation = locationFilter.value;
    const selectedType = typeFilter.value;
    const minimumBedrooms = bedFilter.value;

    const filteredProperties = properties.filter(function (property) {
        const locationMatches =
            selectedLocation === "all" || property.area === selectedLocation;

        const typeMatches =
            selectedType === "all" || property.type === selectedType;

        const bedroomMatches =
            minimumBedrooms === "all" || property.bedrooms >= Number(minimumBedrooms);

        // A property is included only when all three conditions match.
        return locationMatches && typeMatches && bedroomMatches;
    });

    renderProperties(filteredProperties);
    searchFeedback.textContent =
        `Showing ${filteredProperties.length} of ${properties.length} selected residences.`;
});

/* 05. MOBILE NAVIGATION
   Toggles the menu open/closed and updates the accessibility state. */
menuToggle.addEventListener("click", function () {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("open", !isOpen);
});

// Close the mobile menu after a visitor selects a navigation link.
primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    });
});

/* 06. STICKY HEADER
   Adds a class after scrolling so CSS can change the header appearance. */
let lastBlueprintShift = -1;
function updateHeader() {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    pageProgressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollProgress))})`;
    const blueprintShift = Math.min(24, Math.round(window.scrollY * .045));
    if (heroBlueprint && blueprintShift !== lastBlueprintShift) {
        heroBlueprint.style.setProperty("--scroll-shift", `${blueprintShift}px`);
        lastBlueprintShift = blueprintShift;
    }
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* A soft light follows the pointer across the hero on fine-pointer screens. */
if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroSection.addEventListener("pointermove", function (event) {
        const bounds = heroSection.getBoundingClientRect();
        heroSection.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        heroSection.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
    });
    heroSection.addEventListener("pointerleave", function () {
        heroSection.style.setProperty("--spot-x", "72%");
        heroSection.style.setProperty("--spot-y", "40%");
    });
}

/* 06a. HERO BACKGROUND SLIDESHOW
   The controls let visitors browse the local residence images or pause rotation. */
const heroMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeHeroSlide = Math.max(0, heroSlides.findIndex(function (slide) {
    return slide.classList.contains("is-active");
}));
let heroTimer = null;
let heroPaused = false;

function stopHeroTimer() {
    if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
    }
}

function startHeroTimer() {
    stopHeroTimer();
    if (heroPaused || heroMotionQuery.matches || document.hidden || heroSlides.length < 2) return;
    heroTimer = window.setInterval(function () {
        showHeroSlide(activeHeroSlide + 1, false);
    }, 6800);
}

function showHeroSlide(index, restartTimer = true) {
    activeHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeHeroSlide;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
    });

    heroPanels.forEach(function (panel, panelIndex) {
        const isActive = panelIndex === activeHeroSlide;
        panel.classList.toggle("is-active", isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
    });

    heroDots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === activeHeroSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });

    heroImage.setAttribute("aria-label", heroSlides[activeHeroSlide].dataset.description);
    heroCounter.textContent = `${String(activeHeroSlide + 1).padStart(2, "0")} / ${String(heroSlides.length).padStart(2, "0")}`;
    if (restartTimer) startHeroTimer();
}

document.querySelector("[data-hero-prev]").addEventListener("click", function () {
    showHeroSlide(activeHeroSlide - 1);
});
document.querySelector("[data-hero-next]").addEventListener("click", function () {
    showHeroSlide(activeHeroSlide + 1);
});
heroDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
        showHeroSlide(Number(dot.dataset.heroSlide));
    });
});
heroToggle.addEventListener("click", function () {
    heroPaused = !heroPaused;
    heroToggle.classList.toggle("is-paused", heroPaused);
    heroToggle.setAttribute("aria-pressed", String(heroPaused));
    heroToggle.setAttribute("aria-label", heroPaused ? "Resume slideshow" : "Pause slideshow");
    if (heroPaused) stopHeroTimer();
    else startHeroTimer();
});
heroSection.addEventListener("focusin", stopHeroTimer);
heroSection.addEventListener("focusout", function (event) {
    if (!heroSection.contains(event.relatedTarget)) startHeroTimer();
});
document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopHeroTimer();
    else startHeroTimer();
});
heroMotionQuery.addEventListener?.("change", function (event) {
    if (event.matches) stopHeroTimer();
    else startHeroTimer();
});
showHeroSlide(activeHeroSlide, false);
startHeroTimer();

/* 06b. NAVIGATION SECTION INDICATOR
   Highlights the page section currently passing through the viewport center. */
const primaryNavLinks = Array.from(primaryNav.querySelectorAll("a[href^='#']"));
const navSections = primaryNavLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            primaryNavLinks.forEach(function (link) {
                const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("is-current", isCurrent);
                if (isCurrent) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0 });

    navSections.forEach(function (section) { navObserver.observe(section); });
}

/* 07. SCROLL REVEAL ANIMATION
   IntersectionObserver detects when an element enters the visible screen area. */
let revealObserver;

function observeRevealElements() {
    const revealTargets = document.querySelectorAll(
        ".intro-label, .intro-main, .intro-number, .section-heading, .heading-note, .search-panel, .search-feedback, .collection-footer, .property-card, .feature-image, .feature-copy, .principles-intro, .principle-list, .principle, .journal-top, .journal-card, .contact-heading, .contact-email, .enquiry-form, .form-note, .site-footer, .footer-links, .copyright, .back-top"
    );

    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach(function (element) {
            element.classList.add("is-visible");
        });
        return;
    }

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (element) {
        element.classList.add("reveal");
        if (element.matches(".intro-label, .feature-image, .principles-intro, .contact-heading")) {
            element.classList.add("reveal-from-left");
        }
        if (element.matches(".intro-main, .search-panel, .feature-copy, .enquiry-form")) {
            element.classList.add("reveal-from-right");
        }
        if (element.matches(".intro-main, .section-heading, .principles-intro, .journal-top, .contact-heading")) {
            element.classList.add("reveal-stagger");
        }
        if (element.matches(".heading-note, .search-feedback, .intro-number, .contact-email, .form-note, .copyright")) {
            element.classList.add("reveal-from-right");
        }
        revealObserver.observe(element);
    });
}

/* 08. ENQUIRY FORM VALIDATION
   Checks required fields and email format. This demo does not send data to a server. */
const enquiryForm = document.getElementById("enquiry-form");
const formMessage = document.getElementById("form-message");

enquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "") {
        formMessage.textContent = "Please enter your name and email address.";
        return;
    }

    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        return;
    }

    formMessage.textContent =
        `Thank you, ${name}. Your details passed the demo validation. Connect a backend to receive enquiries.`;

    enquiryForm.reset();
});

/* 09. INITIAL PAGE SETUP
   Render the full property collection and activate scroll animations. */
renderProperties(properties);
observeRevealElements();
