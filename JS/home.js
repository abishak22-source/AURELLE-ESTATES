/* =====================================================================
   ABI ESTATES - HOME PAGE JAVASCRIPT (home.js)

   Only used by the home page (index.html). Loaded after core.js.
      1. HERO SLIDESHOW      - background photos, headlines, buttons, dots
      2. SEARCH + COLLECTION - filters and the sliding row of home cards
      3. MOUSE EFFECTS       - hero light and card tilt (mouse screens only)
      4. PAGE START          - numbers row, first cards, slideshow autoplay

   Shared parts (menu, header, scroll reveal, property card) are in core.js.
   The enquiry forms are sent by enquiry.js. The homes come from
   properties-data.js.

   HOW THE HTML, CSS AND JAVASCRIPT WORK TOGETHER
   - JavaScript finds an HTML element, usually by its id:
         document.getElementById("hero-next")
   - Then it adds or removes a CSS class:
         element.classList.add("active")
   - The CSS file decides what that class looks like.
   ===================================================================== */

const prefersLessMotion = window.ABI.prefersLessMotion;   // set in core.js
const properties = window.propertyListings;               // from properties-data.js


/* =====================================================================
   1. HERO SLIDESHOW
   Controls the background photos, matching headline panels and slide buttons.
   ===================================================================== */
const slides = document.querySelectorAll(".hero-slide");
const slideTexts = document.querySelectorAll(".hero-panel");
const slideDots = document.querySelectorAll(".hero-dots button");
const slideCounter = document.getElementById("slide-counter");
const previousButton = document.getElementById("hero-prev");
const nextButton = document.getElementById("hero-next");
const pauseButton = document.getElementById("hero-pause");

const slideDelay = 6800;      // time between slides in milliseconds (6800 = 6.8 seconds). Change it to make the slider faster or slower.
let currentSlide = 0;         // number of the slide showing now (starts at 0)
let isPaused = false;         // true when the visitor has pressed pause
let slideTimer;               // stores the autoplay timer so we can stop it

// Show the slide with the given number
function showSlide(number) {
    // Go round in a circle: after the last slide comes the first one again
    if (number >= slides.length) {
        number = 0;
    }
    if (number < 0) {
        number = slides.length - 1;
    }
    currentSlide = number;

    // Remove "active" from every slide, text and dot...
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slideTexts[i].classList.remove("active");
        slideDots[i].classList.remove("active");
    }

    // ...then add "active" to the ones we want to show
    slides[currentSlide].classList.add("active");
    slideTexts[currentSlide].classList.add("active");
    slideDots[currentSlide].classList.add("active");

    // Update the counter, e.g. "02 / 04"
    // ("0" + number works because we have fewer than 10 slides)
    slideCounter.textContent = "0" + (currentSlide + 1) + " / 0" + slides.length;
}

// Start changing slides automatically
function startAutoplay() {
    stopAutoplay(); // make sure only one timer runs at a time
    slideTimer = setInterval(function () {
        showSlide(currentSlide + 1);
    }, slideDelay);
}

// Stop changing slides automatically
function stopAutoplay() {
    clearInterval(slideTimer);
}

// Used by the buttons and dots: show a slide, then restart the timer
// (so the new slide stays on screen for the full time)
function goToSlide(number) {
    showSlide(number);
    if (!isPaused) {
        startAutoplay();
    }
}

// Change the pause button to show the right symbol
function updatePauseButton() {
    if (isPaused) {
        pauseButton.textContent = "►";
        pauseButton.setAttribute("aria-label", "Play slideshow");
    } else {
        pauseButton.textContent = "❚❚";
        pauseButton.setAttribute("aria-label", "Pause slideshow");
    }
}

// Previous / next buttons
previousButton.addEventListener("click", function () {
    goToSlide(currentSlide - 1);
});

nextButton.addEventListener("click", function () {
    goToSlide(currentSlide + 1);
});

// Dots: dot 0 shows slide 0, dot 1 shows slide 1, and so on
slideDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
        goToSlide(index);
    });
});

// Pause / play button
pauseButton.addEventListener("click", function () {
    isPaused = !isPaused; // "!" flips true to false and false to true

    if (isPaused) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
    updatePauseButton();
});


/* =====================================================================
   2. SEARCH + COLLECTION
   "A more thoughtful search" filters the homes; "02 / The collection" shows
   them as a sliding row: 3 cards at a time on desktop, 2 on tablets, 1 on phones.
   To add or change homes, edit properties-data.js (not this file).
   ===================================================================== */
const propertyGrid = document.getElementById("property-grid");
const collectionPrevious = document.getElementById("collection-prev");
const collectionNext = document.getElementById("collection-next");
const collectionCount = document.getElementById("collection-count");
const collectionControls = document.querySelector(".collection-controls");
const searchForm = document.getElementById("property-search");
const locationFilter = document.getElementById("location-filter");
const typeFilter = document.getElementById("type-filter");
const bedroomFilter = document.getElementById("bedroom-filter");
const searchMessage = document.getElementById("search-message");
const resetSearchButton = document.getElementById("reset-search");

const collectionDelay = 4800;     // time between automatic card moves (4800 = 4.8 seconds)
let currentCollectionPage = 0;    // which group of cards is showing (starts at 0)
let collectionAutoplayTimer;      // stores the autoplay timer so we can stop it

// Turn a number into two digits: 3 -> "03"
function twoDigits(number) {
    return String(number).padStart(2, "0");
}

// Show a list of homes in the collection
function showProperties(propertyList) {
    currentCollectionPage = 0;

    // Nothing matches: show a friendly message instead of cards
    // (edit the text below to change the message)
    if (propertyList.length === 0) {
        propertyGrid.innerHTML = '<p class="property-empty">No residences match those choices. Try adjusting your search.</p>';
        updateCollectionControls(0);
        startCollectionAutoplay();
        return; // stop here
    }

    // Build the HTML for every card (createPropertyCard is in core.js)
    let cardsHTML = "";
    propertyList.forEach(function (property) {
        cardsHTML += window.ABI.createPropertyCard(property, false);
    });
    propertyGrid.innerHTML = '<div class="property-track">' + cardsHTML + "</div>";

    // The new cards need the scroll fade-in and the hover tilt
    const newCards = propertyGrid.querySelectorAll(".property-card");
    newCards.forEach(function (card) {
        window.ABI.watchReveal(card); // fade-in on scroll (core.js)
        addCardTilt(card);            // hover tilt (part 3 below)
    });
    updateCollectionControls(newCards.length);
    startCollectionAutoplay();
}

// How many cards fit next to each other. Change the widths to match responsive.css.
function collectionCardsPerPage() {
    if (window.innerWidth <= 640) {
        return 1;
    }
    if (window.innerWidth <= 1100) {
        return 2;
    }
    return 3;
}

// Slide the row to the current group and update the arrows and "01 - 03 / 09"
function updateCollectionControls(total) {
    const cardsPerPage = collectionCardsPerPage();
    const pageCount = Math.max(1, Math.ceil(total / cardsPerPage));
    currentCollectionPage = Math.min(currentCollectionPage, pageCount - 1);

    const track = propertyGrid.querySelector(".property-track");
    if (track) {
        const cards = track.querySelectorAll(".property-card");
        const firstCard = cards[currentCollectionPage * cardsPerPage];
        if (firstCard) {
            track.style.transform = "translateX(-" + firstCard.offsetLeft + "px)";
        } else {
            track.style.transform = "translateX(0)";
        }
    }

    // The arrows only work when there is more than one group of cards
    const hasOneGroup = total < 2 || pageCount < 2;
    collectionPrevious.disabled = hasOneGroup;
    collectionNext.disabled = hasOneGroup;

    if (total === 0) {
        collectionCount.textContent = "00 / 00";
        return;
    }

    const firstNumber = currentCollectionPage * cardsPerPage + 1;
    const lastNumber = Math.min(firstNumber + cardsPerPage - 1, total);

    // One card showing (phones, or the last card on its own): "04 / 09".
    // Several cards showing: "01 - 03 / 09".
    if (firstNumber === lastNumber) {
        collectionCount.textContent = twoDigits(firstNumber) + " / " + twoDigits(total);
    } else {
        collectionCount.textContent = twoDigits(firstNumber) + " - " + twoDigits(lastNumber) + " / " + twoDigits(total);
    }
}

// Move one group forward (step = 1) or back (step = -1), going round in a circle
function showAdjacentProperty(step) {
    const cards = propertyGrid.querySelectorAll(".property-card");
    if (cards.length < 2) {
        return;
    }
    const pageCount = Math.ceil(cards.length / collectionCardsPerPage());
    currentCollectionPage = (currentCollectionPage + step + pageCount) % pageCount;
    updateCollectionControls(cards.length);
}

function stopCollectionAutoplay() {
    window.clearInterval(collectionAutoplayTimer);
}

// Move the cards automatically (not for visitors who prefer less motion)
function startCollectionAutoplay() {
    stopCollectionAutoplay();
    const cardCount = propertyGrid.querySelectorAll(".property-card").length;
    const pageCount = Math.ceil(cardCount / collectionCardsPerPage());
    if (prefersLessMotion || pageCount < 2) {
        return;
    }
    collectionAutoplayTimer = window.setInterval(function () {
        showAdjacentProperty(1);
    }, collectionDelay);
}

// Arrow buttons
collectionPrevious.addEventListener("click", function () {
    showAdjacentProperty(-1);
});
collectionNext.addEventListener("click", function () {
    showAdjacentProperty(1);
});

// Pause while the mouse is over the cards or the arrows have keyboard focus
propertyGrid.addEventListener("mouseenter", stopCollectionAutoplay);
propertyGrid.addEventListener("mouseleave", startCollectionAutoplay);
collectionControls.addEventListener("focusin", stopCollectionAutoplay);
collectionControls.addEventListener("focusout", startCollectionAutoplay);

// When the window changes size, the number of cards per group may change
window.addEventListener("resize", function () {
    updateCollectionControls(propertyGrid.querySelectorAll(".property-card").length);
});

// Open the dedicated Find a Home page and carry the selected filters across.
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const filters = new URLSearchParams();
    if (locationFilter.value !== "all") filters.set("area", locationFilter.value);
    if (typeFilter.value !== "all") filters.set("type", typeFilter.value);
    if (bedroomFilter.value !== "all") filters.set("bedrooms", bedroomFilter.value);

    const query = filters.toString();
    window.location.href = "PAGES/search/" + (query ? "?" + query : "");
});

// Clear every filter and bring the full collection back
resetSearchButton.addEventListener("click", function () {
    searchForm.reset();
    showProperties(properties);
    searchMessage.textContent = "Showing all " + properties.length + " homes.";
});


/* =====================================================================
   3. MOUSE EFFECTS
   Only on screens with a mouse, and not for visitors who prefer less motion.
   ===================================================================== */
const hasMouse = window.matchMedia("(pointer: fine)").matches;
const useMouseEffects = hasMouse && !prefersLessMotion;
const hero = document.getElementById("hero");

// a) Soft light in the hero that follows the mouse
if (useMouseEffects) {
    hero.addEventListener("mousemove", function (event) {
        const box = hero.getBoundingClientRect();
        // mouse position measured from the top-left corner of the hero
        hero.style.setProperty("--spot-x", (event.clientX - box.left) + "px");
        hero.style.setProperty("--spot-y", (event.clientY - box.top) + "px");
    });

    // When the mouse leaves, move the light back to its starting place
    hero.addEventListener("mouseleave", function () {
        hero.style.setProperty("--spot-x", "72%");
        hero.style.setProperty("--spot-y", "40%");
    });
}

// b) Property cards tilt slightly towards the mouse
function addCardTilt(card) {
    if (!useMouseEffects) {
        return; // do nothing on touch screens
    }

    card.addEventListener("mousemove", function (event) {
        const box = card.getBoundingClientRect();
        // x and y go from -0.5 (left/top edge) to 0.5 (right/bottom edge)
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;

        // Change 3.5 and 4.5 to make the tilt stronger (bigger) or softer (smaller)
        card.style.setProperty("--tilt-x", (-y * 3.5) + "deg");
        card.style.setProperty("--tilt-y", (x * 4.5) + "deg");
    });

    card.addEventListener("mouseleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
    });
}


/* =====================================================================
   4. PAGE START
   ===================================================================== */

// Numbers under "Not simply a property": counted from the listings, so they stay
// correct when homes are added. core.js then counts them up on screen.
const usedAreas = [];
const usedTypes = [];
properties.forEach(function (property) {
    if (!usedAreas.includes(property.area)) {
        usedAreas.push(property.area);
    }
    if (!usedTypes.includes(property.type)) {
        usedTypes.push(property.type);
    }
});
const statValues = { homes: properties.length, areas: usedAreas.length, types: usedTypes.length };
document.querySelectorAll("[data-stat]").forEach(function (element) {
    element.setAttribute("data-count", statValues[element.getAttribute("data-stat")]);
});

// Show all homes
showProperties(properties);
searchMessage.textContent = "Showing all " + properties.length + " homes.";

// Start the slider (or keep it paused if the visitor prefers less motion)
if (prefersLessMotion) {
    isPaused = true;
    updatePauseButton();
} else {
    startAutoplay();
}
