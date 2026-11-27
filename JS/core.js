/* =====================================================================
   ABI ESTATES - SHARED JAVASCRIPT (core.js)

   Loaded on every page, after site-config.js and properties-data.js,
   and before the page script (home.js or inner-pages.js).
      1. MENU + FOOTER LINKS from site-config.js
      2. CONTACT DETAILS from site-config.js
      3. PHONE MENU (open / close)
      4. HEADER ON SCROLL + PROGRESS BAR
      5. SCROLL REVEAL
      6. NUMBER COUNTERS
      7. PARALLAX PHOTOS
      8. SMOOTH LINKS TO THE SAME PAGE
      9. HEADLINE WORD REVEAL
     10. PROPERTY CARD (shared by the home page and the inner pages)
     11. CARD SPOTLIGHT (soft light that follows the mouse over cards)

   Other files use:  window.ABI.watchReveal(element)
                     window.ABI.createPropertyCard(property, isInnerPage)
                     window.ABI.prefersLessMotion
   ===================================================================== */
(function () {
    const config = window.SITE_CONFIG;
    const root = document.body.getAttribute("data-root") || "";   // "" on the home page, "../../" in /PAGES
    const currentPage = document.body.getAttribute("data-page") || "home";
    const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ---------- 1. MENU + FOOTER LINKS ---------- */
    const navMenu = document.querySelector(".nav-menu");
    if (navMenu && config) {
        let links = "";
        config.navigation.forEach(function (item) {
            let current = "";
            if (item.id === currentPage) {
                current = ' aria-current="page"';
            }
            links += '<a class="nav-link" data-page="' + item.id + '" href="' + root + item.path + '"' + current + ">" + item.label + "</a>";
        });
        links += '<a class="nav-cta" href="' + root + config.menuButton.path + '">' + config.menuButton.label + " <span>↗</span></a>";
        navMenu.innerHTML = links;
    }

    const footerLinks = document.querySelector(".footer-links");
    if (footerLinks && config) {
        let links = "";
        config.footerLinks.forEach(function (id) {
            config.navigation.forEach(function (item) {
                if (item.id === id) {
                    links += '<a class="nav-link" href="' + root + item.path + '">' + item.label + "</a>";
                }
            });
        });
        footerLinks.innerHTML = links;
    }


    /* ---------- 2. CONTACT DETAILS ----------
       <a data-site="email">, <a data-site="phone">, <span data-site="address">,
       <span data-site="hours">, <iframe data-site="map">, <a data-site="directions"> */
    if (config) {
        document.querySelectorAll('[data-site="email"]').forEach(function (element) {
            element.textContent = config.email;
            element.href = "mailto:" + config.email;
        });
        document.querySelectorAll('[data-site="phone"]').forEach(function (element) {
            element.textContent = config.phone;
            element.href = "tel:" + config.phoneLink;
        });
        document.querySelectorAll('[data-site="address"]').forEach(function (element) {
            element.innerHTML = "";
            config.addressLines.forEach(function (line, index) {
                if (index > 0) {
                    element.appendChild(document.createElement("br"));
                }
                element.appendChild(document.createTextNode(line));
            });
        });
        document.querySelectorAll('[data-site="hours"]').forEach(function (element) {
            element.textContent = config.hours;
        });
        const mapPlace = encodeURIComponent(config.mapSearch);
        document.querySelectorAll('[data-site="map"]').forEach(function (frame) {
            frame.src = "https://www.google.com/maps?q=" + mapPlace + "&z=14&output=embed";
        });
        document.querySelectorAll('[data-site="directions"]').forEach(function (link) {
            link.href = "https://www.google.com/maps/dir/?api=1&destination=" + mapPlace;
        });
    }


    /* ---------- 3. PHONE MENU ---------- */
    const menuButton = document.querySelector(".menu-button");
    function closeMenu() {
        navMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
    }
    if (menuButton && navMenu) {
        menuButton.addEventListener("click", function () {
            if (navMenu.classList.contains("open")) {
                closeMenu();
            } else {
                navMenu.classList.add("open");
                menuButton.setAttribute("aria-expanded", "true");
                menuButton.setAttribute("aria-label", "Close navigation");
            }
        });
        navMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeMenu();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && navMenu.classList.contains("open")) {
                closeMenu();
                menuButton.focus();
            }
        });
    }


    /* ---------- 4. HEADER ON SCROLL + PROGRESS BAR ---------- */
    const header = document.querySelector(".site-header");
    const progressBar = document.querySelector(".progress-bar");
    const parallaxItems = document.querySelectorAll("[data-parallax]");
    let frameRequested = false;

    function onScroll() {
        frameRequested = false;
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            let percent = 0;
            if (scrollable > 0) {
                percent = (window.scrollY / scrollable) * 100;
            }
            progressBar.style.width = percent + "%";
        }
        updateParallax();
    }

    // requestAnimationFrame: update at most once per screen frame (keeps scrolling smooth)
    window.addEventListener("scroll", function () {
        if (!frameRequested) {
            frameRequested = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });


    /* ---------- 5. SCROLL REVEAL ----------
       class="reveal" starts invisible (style in base.css); "visible" fades it in.
       The bottom margin reveals items just before they enter the screen. */
    let revealWatcher = null;
    if ("IntersectionObserver" in window && !prefersLessMotion) {
        revealWatcher = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealWatcher.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01, rootMargin: "0px 0px 120px 0px" });
    }

    function watchReveal(element) {
        if (revealWatcher) {
            revealWatcher.observe(element);
        } else {
            element.classList.add("visible");
        }
    }

    document.querySelectorAll(".reveal, .reveal-stagger").forEach(watchReveal);


    /* ---------- 6. NUMBER COUNTERS ----------
       <span data-count="9">09</span> counts up from 0 when it comes into view */
    function twoDigits(value) {
        if (value < 10) {
            return "0" + value;
        }
        return String(value);
    }

    function countUp(element) {
        const target = Number(element.getAttribute("data-count"));
        const duration = 1600;
        const start = performance.now();
        function step(now) {
            let progress = (now - start) / duration;
            if (progress > 1) {
                progress = 1;
            }
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = twoDigits(Math.round(target * eased));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    const counters = document.querySelectorAll("[data-count]");
    if (counters.length > 0 && "IntersectionObserver" in window && !prefersLessMotion) {
        const counterWatcher = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    counterWatcher.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (element) {
            element.textContent = "00";
            counterWatcher.observe(element);
        });
    }


    /* ---------- 7. PARALLAX PHOTOS ----------
       data-parallax="0.08" on an image inside a frame with overflow: hidden.
       The photo moves a little slower than the page; the CSS makes it
       slightly bigger than its frame so no edge ever shows. */
    function updateParallax() {
        if (prefersLessMotion || parallaxItems.length === 0) {
            return;
        }
        const screenHeight = window.innerHeight;
        parallaxItems.forEach(function (item) {
            const box = item.parentElement.getBoundingClientRect();
            if (box.bottom < 0 || box.top > screenHeight) {
                return; // off screen: skip
            }
            let strength = Number(item.getAttribute("data-parallax"));
            if (!strength) {
                strength = 0.08;
            }
            let move = ((box.top + box.height / 2) - screenHeight / 2) * strength * -1;
            const limit = box.height * 0.06;
            if (move > limit) {
                move = limit;
            }
            if (move < -limit) {
                move = -limit;
            }
            item.style.setProperty("--parallax-y", move.toFixed(1) + "px");
        });
    }


    /* ---------- 8. SMOOTH LINKS TO THE SAME PAGE ----------
       Inner pages use <base>, so "#location" would otherwise reload the page. */
    document.addEventListener("click", function (event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) {
            return;
        }
        const target = document.getElementById(link.getAttribute("href").slice(1));
        if (target) {
            event.preventDefault();
            if (prefersLessMotion) {
                target.scrollIntoView();
            } else {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });


    /* ---------- 9. HEADLINE WORD REVEAL ----------
       Each word of the big headlines is wrapped in <span class="word"><span class="word-inner">.
       effects.css hides the inner span below a mask and slides it up when the headline
       gets "is-revealed" (or, in the hero, when its slide is active).
       Italic words keep their own <em> inside each word, so their colour effect stays. */
    function splitIntoWords(heading) {
        let wordNumber = 0;

        function makeWord(text, styleElement) {
            const outer = document.createElement("span");
            const inner = document.createElement("span");
            outer.className = "word";
            inner.className = "word-inner";
            inner.style.setProperty("--word", wordNumber);
            wordNumber = wordNumber + 1;
            if (styleElement) {
                const styled = styleElement.cloneNode(false); // e.g. an empty <em>
                styled.textContent = text;
                inner.appendChild(styled);
            } else {
                inner.textContent = text;
            }
            outer.appendChild(inner);
            return outer;
        }

        function wordsFrom(text, styleElement) {
            const fragment = document.createDocumentFragment();
            text.split(/(\s+)/).forEach(function (part) {
                if (part === "") {
                    return;
                }
                if (part.trim() === "") {
                    fragment.appendChild(document.createTextNode(" "));
                } else {
                    fragment.appendChild(makeWord(part, styleElement));
                }
            });
            return fragment;
        }

        Array.from(heading.childNodes).forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                heading.replaceChild(wordsFrom(node.textContent, null), node);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR" && node.children.length === 0) {
                heading.replaceChild(wordsFrom(node.textContent, node), node);
            }
        });
    }

    if (!prefersLessMotion) {
        const headlines = document.querySelectorAll(".section-title, .page-hero h1, .hero-panel h1, .hero-panel h2");
        headlines.forEach(splitIntoWords);

        if ("IntersectionObserver" in window) {
            const headlineWatcher = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-revealed");
                        headlineWatcher.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            headlines.forEach(function (headline) {
                headlineWatcher.observe(headline);
            });
        } else {
            headlines.forEach(function (headline) {
                headline.classList.add("is-revealed");
            });
        }
    }


    /* ---------- 10. PROPERTY CARD ----------
       Builds the HTML for one home card from one entry in properties-data.js.
       Used by home.js (isInnerPage = false) and inner-pages.js (isInnerPage = true).
       Clicking the photo opens the Contact page form with the home's name filled in.
       To change what a card shows, edit the HTML below. */
    function createPropertyCard(property, isInnerPage) {
        let cardClass = "property-card reveal";
        let headingClass = "";
        if (isInnerPage) {
            cardClass = "property-card page-property-card";
            headingClass = ' class="page-property-heading"';
        }
        const enquiryLink = root + "PAGES/contact/?property=" + encodeURIComponent(property.name) + "#enquiry";
        const detailLink = root + "PAGES/property/?slug=" + encodeURIComponent(property.slug);
        const fullDetails = isInnerPage ? `
                <details class="property-more-details" open>
                    <summary>View full property details</summary>
                    <p>${property.description || property.imageText || "Contact us for more information about this home."}</p>
                    ${Array.isArray(property.highlights) && property.highlights.length
                        ? `<ul>${property.highlights.map(function (item) { return `<li>${item}</li>`; }).join("")}</ul>`
                        : ""}
                    <a class="property-enquiry-link" href="${enquiryLink}">Ask about this home <span aria-hidden="true">↗</span></a>
                </details>` : "";

        return `
        <article class="${cardClass}">
            <a class="property-image-wrap" href="${detailLink}" aria-label="View details for ${property.name}">
                <img class="property-image" src="${property.image}" alt="${property.imageText}" width="800" height="533" loading="lazy" decoding="async">
                <span class="property-tag">${property.tag}</span>
                <span class="property-number">${property.number}</span>
            </a>
            <div class="property-info">
                <div${headingClass}>
                    <h3><a class="property-title-link" href="${detailLink}">${property.name}</a></h3>
                    <p class="property-location">${property.location} · ${property.typeLabel}</p>
                </div>
                <p class="property-price">${property.price}</p>
                <div class="property-details">
                    <span><span class="icon icon-bed" aria-hidden="true"></span>${property.bedrooms} bedrooms</span>
                    <span><span class="icon icon-bath" aria-hidden="true"></span>${property.bathrooms} bathrooms</span>
                    <span><span class="icon icon-area" aria-hidden="true"></span>${property.size}</span>
                </div>
                ${fullDetails}
            </div>
        </article>`;
    }


    /* ---------- 11. CARD SPOTLIGHT ----------
       A soft gold light follows the mouse over the cards (premium.css, part 13).
       How it works: we save the mouse position inside the card in two CSS
       variables, --spot-x and --spot-y, and the CSS draws a glow at that spot.
       Only on screens with a mouse, and not for visitors who prefer less motion.
       To add the glow to other cards, add their class to cardSelector. */
    const cardSelector = ".property-card, .journal-card, .principle, .page-feature-card, .page-step-grid article, .principle-cards article";
    const hasMouse = window.matchMedia("(pointer: fine)").matches;

    if (hasMouse && !prefersLessMotion) {
        document.addEventListener("pointermove", function (event) {
            const card = event.target.closest(cardSelector);
            if (!card) {
                return; // the mouse is not over a card
            }
            const box = card.getBoundingClientRect();
            card.style.setProperty("--spot-x", (event.clientX - box.left) + "px");
            card.style.setProperty("--spot-y", (event.clientY - box.top) + "px");
        }, { passive: true });
    }


    onScroll();
    window.ABI = {
        watchReveal: watchReveal,
        createPropertyCard: createPropertyCard,
        prefersLessMotion: prefersLessMotion
    };
})();
