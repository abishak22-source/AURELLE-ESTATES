// =====================================
// AURELLE ESTATES — MAIN JAVASCRIPT FILE
// Purpose: Adds all interactive behaviour to the page:
// mobile menu, header on scroll, "Enquire" shortcuts,
// enquiry form checks, mobile action bar and scroll animations.
//
// Connected to index.html through:
// <script src="js/script.js" defer></script>
// "defer" guarantees the HTML is fully loaded before this file runs,
// so every element we select below already exists.
// =====================================


// =====================================
// 01. DOM ELEMENT SELECTION
// Purpose: Selects HTML elements
// that JavaScript needs to interact with.
//
// The DOM (Document Object Model) is the browser's live copy of
// our HTML. We find each element once, store it in a constant,
// and reuse it, instead of searching the page again and again.
// "const" means the variable will always point to the same element.
// =====================================

// --- Header & navigation ---
// getElementById() finds the ONE element whose id matches
const siteHeader = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
// querySelectorAll() finds EVERY element matching a CSS selector
// (here: every link inside the main navigation)
const navLinks = mainNav.querySelectorAll("a");

// --- Enquiry form ---
const enquiryCard = document.getElementById("enquiry");
const enquiryForm = document.getElementById("enquiry-form");
const nameInput = document.getElementById("full-name");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const locationSelect = document.getElementById("location");
const typeSelect = document.getElementById("property-type");
const successPanel = document.getElementById("enquiry-success");
const successMessage = document.getElementById("success-message");
const newEnquiryButton = document.getElementById("new-enquiry-button");

// --- Every "Enquire" / "Book a site visit" button on the page ---
const enquireTriggers = document.querySelectorAll(".enquire-trigger");

// --- Mobile action bar & footer ---
const mobileBar = document.getElementById("mobile-bar");
const currentYearElement = document.getElementById("current-year");


// =====================================
// 02. MOBILE NAVIGATION
// Purpose: Opens and closes the mobile menu.
//
// On small screens CSS hides the menu. JavaScript adds or
// removes the class "is-open", and CSS shows or hides the
// menu based on that class. JavaScript changes the STATE,
// CSS decides how that state LOOKS.
// =====================================

// A function is a reusable block of code. This one receives
// "isOpen" (true or false) and updates everything to match,
// so the menu, header and button can never get out of step.
function setMenuState(isOpen) {
    // classList.toggle(name, condition): adds the class when the
    // condition is true, removes it when the condition is false
    mainNav.classList.toggle("is-open", isOpen);
    siteHeader.classList.toggle("is-menu-open", isOpen);

    // Keep the accessibility attributes in step with what is on screen.
    // String(true) turns the boolean into the text "true".
    navToggle.setAttribute("aria-expanded", String(isOpen));

    // Ternary operator: condition ? valueIfTrue : valueIfFalse
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

// Event listener: "when the menu button is clicked, run this function"
navToggle.addEventListener("click", function () {
    // Read the current state from the button itself
    const isCurrentlyOpen = navToggle.getAttribute("aria-expanded") === "true";

    // "!" flips a boolean: open becomes closed, closed becomes open
    setMenuState(!isCurrentlyOpen);
});

// forEach() loops through every navigation link.
// After a visitor taps a link, the menu closes so they can see the section.
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        setMenuState(false);
    });
});

// Keyboard support: pressing Escape closes an open menu
document.addEventListener("keydown", function (event) {
    // "&&" means BOTH conditions must be true
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
        setMenuState(false);
        // Return keyboard focus to the button that opened the menu
        navToggle.focus();
    }
});

// matchMedia() checks a CSS media query from JavaScript.
// If the window is widened to desktop size while the menu is open,
// we close it so the header does not stay in its "menu open" colours.
const desktopQuery = window.matchMedia("(min-width: 901px)");

desktopQuery.addEventListener("change", function (event) {
    // event.matches is true when the screen is now 901px or wider
    if (event.matches) {
        setMenuState(false);
    }
});


// =====================================
// 03. HEADER ON SCROLL
// Purpose: Gives the header a solid ivory background
// once the visitor scrolls away from the top.
// =====================================

function updateHeaderOnScroll() {
    // window.scrollY = how many pixels the page has been scrolled down
    const hasScrolled = window.scrollY > 24;
    siteHeader.classList.toggle("is-scrolled", hasScrolled);
}

// The "scroll" event fires many times while scrolling.
// { passive: true } tells the browser we will never block scrolling,
// which keeps scrolling smooth.
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

// "load" fires once everything (including images) has finished loading.
// If the page was opened with a link such as index.html#projects, the browser
// jumps down at that moment, so we check the header style again.
window.addEventListener("load", updateHeaderOnScroll);


// =====================================
// 04. ENQUIRY SHORTCUTS
// Purpose: Every button with the class "enquire-trigger"
// scrolls to the enquiry form. Project buttons also
// pre-select the matching location and property type.
// =====================================

// Shows the form fields and hides the thank-you panel
function showFormView() {
    enquiryForm.hidden = false;
    successPanel.hidden = true;
}

// Shows the thank-you panel and hides the form fields
function showSuccessView() {
    enquiryForm.hidden = true;
    successPanel.hidden = false;

    // Move keyboard focus to the panel so screen readers read it straight away
    successPanel.focus();
}

// "let" (not const) because this value changes every time the function runs.
// It remembers the timer so a second quick click can cancel the first one.
let highlightTimer = null;

// Scrolls to the form and, if given, pre-selects a location and type.
// "location" and "type" are the option values, for example "kilpauk" and "3bhk".
function openEnquiryForm(location, type) {
    showFormView();

    // dataset values are "undefined" when the button has no such attribute,
    // and "if (location)" is only true when a real value was given
    if (location) {
        locationSelect.value = location;
        clearFieldError(locationSelect);
    }

    if (type) {
        typeSelect.value = type;
        clearFieldError(typeSelect);
    }

    // scrollIntoView() scrolls the page until the card is visible.
    // CSS (scroll-behavior: smooth) makes it glide, and scroll-margin-top
    // stops it just below the fixed header.
    enquiryCard.scrollIntoView();

    // Put the cursor in the first field. preventScroll stops the
    // browser from interrupting the smooth scroll above.
    nameInput.focus({ preventScroll: true });

    // Briefly outline the card so the visitor sees where to look
    enquiryCard.classList.add("is-highlighted");

    // clearTimeout() cancels an earlier timer that has not finished yet
    clearTimeout(highlightTimer);

    // setTimeout(function, milliseconds) runs the function once, later.
    // 1600 milliseconds = 1.6 seconds.
    highlightTimer = setTimeout(function () {
        enquiryCard.classList.remove("is-highlighted");
    }, 1600);
}

enquireTriggers.forEach(function (button) {
    button.addEventListener("click", function () {
        // data-location="kilpauk" → button.dataset.location
        // data-type="3bhk"        → button.dataset.type
        openEnquiryForm(button.dataset.location, button.dataset.type);

        // If the click came from inside the open mobile menu, close it
        setMenuState(false);
    });
});


// =====================================
// 05. MOBILE NUMBER HELPER
// Purpose: Keeps only digits in the mobile field while
// the visitor types or pastes a number.
// =====================================

mobileInput.addEventListener("input", function () {
    // replace(/\D/g, "") removes every character that is NOT a digit,
    // so "98765-43210" becomes "9876543210"
    let digits = mobileInput.value.replace(/\D/g, "");

    // If someone pastes "+91 98765 43210", the digits start with the
    // country code 91. The +91 is already shown in front of the field,
    // so we remove it. slice(2) drops the first two characters.
    if (digits.length > 10 && digits.startsWith("91")) {
        digits = digits.slice(2);
    }

    // A leading 0 (as in "098765 43210") is also not needed
    if (digits.length > 10 && digits.startsWith("0")) {
        digits = digits.slice(1);
    }

    // Keep at most 10 digits. slice(0, 10) = characters 0 to 9.
    mobileInput.value = digits.slice(0, 10);
});


// =====================================
// 06. FORM VALIDATION
// Purpose: Checks enquiry form data before submission.
//
// "Validation" means checking that the visitor's answers make
// sense (for example, that the email looks like an email)
// before we accept the form.
// =====================================

// Regular expressions (text patterns):
// email  → some characters, then @, then some characters, a dot, then at least 2 more
// mobile → Indian mobile numbers: exactly 10 digits, starting with 6, 7, 8 or 9
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mobilePattern = /^[6-9]\d{9}$/;

// The fields we check, in the order they appear on screen (an array)
const fieldsToValidate = [nameInput, mobileInput, emailInput, locationSelect, typeSelect];

// Returns an error message for a field, or "" (empty text) if it is fine
function getErrorMessage(field) {
    // trim() removes spaces at the start and end of the text
    const value = field.value.trim();

    if (field === nameInput) {
        if (value === "") {
            return "Please enter your full name.";
        }
        if (value.length < 2) {
            return "Your name should be at least 2 characters long.";
        }
        // /\d/ looks for any digit; test() returns true if one is found
        if (/\d/.test(value)) {
            return "Please use letters only in your name.";
        }
    }

    if (field === mobileInput) {
        if (value === "") {
            return "Please enter your mobile number.";
        }
        // "!" means NOT: the error shows when the pattern does NOT match
        if (!mobilePattern.test(value)) {
            return "Please enter a valid 10-digit Indian mobile number.";
        }
    }

    if (field === emailInput) {
        if (value === "") {
            return "Please enter your email address.";
        }
        if (!emailPattern.test(value)) {
            return "Please enter a valid email address, for example name@example.com.";
        }
    }

    // A drop-down still showing "Select" has the empty value ""
    if (field === locationSelect && value === "") {
        return "Please choose a location.";
    }

    if (field === typeSelect && value === "") {
        return "Please choose a property type.";
    }

    // No problems found
    return "";
}

// Shows an error message under a field and marks it as invalid
function showFieldError(field, message) {
    // Every field's error <p> has the id "<field id>-error"
    const errorElement = document.getElementById(`${field.id}-error`);

    // closest() walks up from the field to the nearest parent with this class
    field.closest(".form-group").classList.add("is-invalid");

    // aria-invalid tells screen readers that this field has a problem
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
}

// Removes the error message and invalid styling from a field
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);

    field.closest(".form-group").classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    errorElement.textContent = "";
}

// Checks one field, shows or clears its error, and returns true if it is valid
function validateField(field) {
    const errorMessage = getErrorMessage(field);

    if (errorMessage === "") {
        clearFieldError(field);
        return true;
    }

    showFieldError(field, errorMessage);
    return false;
}

// Live feedback: once a field shows an error, check it again while the
// visitor corrects it, so the error disappears as soon as it is fixed
fieldsToValidate.forEach(function (field) {
    // Drop-downs fire "change" when a new option is chosen;
    // text fields fire "input" on every keystroke
    const eventName = field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, function () {
        const hasError = field.closest(".form-group").classList.contains("is-invalid");

        if (hasError) {
            validateField(field);
        }
    });
});


// =====================================
// 07. FORM SUBMISSION
// Purpose: Runs all checks when "Submit Enquiry" is pressed,
// then shows a personal thank-you message.
// This concept site does not send the data anywhere.
// =====================================

// Turns "9876543210" into "98765 43210", the way Indian numbers are usually written
function formatMobile(number) {
    return `${number.slice(0, 5)} ${number.slice(5)}`;
}

enquiryForm.addEventListener("submit", function (event) {
    // Forms normally reload the page when submitted.
    // preventDefault() stops that so JavaScript can handle it instead.
    event.preventDefault();

    // "let" because this value may change inside the loop
    let firstInvalidField = null;

    // Check EVERY field so the visitor sees all problems at once
    fieldsToValidate.forEach(function (field) {
        const isValid = validateField(field);

        // Remember only the first field that failed
        if (!isValid && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    // If any field failed, move the cursor there and stop here
    if (firstInvalidField !== null) {
        firstInvalidField.focus();
        return;
    }

    // Every check passed. split(" ")[0] takes the first word of the name.
    const firstName = nameInput.value.trim().split(" ")[0];
    const mobileText = formatMobile(mobileInput.value);

    // selectedIndex = position of the chosen option; .text = what the visitor saw (e.g. "Kilpauk")
    const locationName = locationSelect.options[locationSelect.selectedIndex].text;

    // Choose the end of the sentence depending on the location answer
    const locationPhrase = locationSelect.value === "open"
        ? "and help you choose the right project"
        : `about our homes in ${locationName}`;

    // textContent inserts plain text (never HTML), which keeps the page safe
    successMessage.textContent = `Thank you, ${firstName}. Our sales team will call you on +91 ${mobileText} within one working day ${locationPhrase}.`;

    showSuccessView();

    // Clear the form for the next enquiry
    enquiryForm.reset();
});

// "Send another enquiry" brings the empty form back
newEnquiryButton.addEventListener("click", function () {
    showFormView();
    nameInput.focus();
});


// =====================================
// 08. MOBILE ACTION BAR
// Purpose: Shows the bottom "Call / Enquire" bar on phones
// only while the enquiry form itself is NOT on screen.
// (CSS keeps the bar hidden on screens wider than 900px.)
//
// IntersectionObserver is a built-in browser tool that tells us
// when an element enters or leaves the visible part of the screen.
// =====================================

function setUpMobileBar() {
    // Older browsers without IntersectionObserver simply always show the bar
    if (!("IntersectionObserver" in window)) {
        mobileBar.classList.add("is-visible");
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        // "entries" is a list of watched elements whose visibility changed
        entries.forEach(function (entry) {
            // isIntersecting is true while the form card is on screen.
            // We show the bar when it is NOT, hence the "!".
            mobileBar.classList.toggle("is-visible", !entry.isIntersecting);
        });
    });

    observer.observe(enquiryCard);
}


// =====================================
// 09. SCROLL REVEAL ANIMATION
// Purpose: Fades sections in gently as they scroll into view.
// =====================================

function setUpScrollReveal() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    // Some visitors ask their device to reduce motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Older browsers, or visitors who prefer less motion,
    // simply see everything without the animation
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Each element only needs to animate once
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Start when 15% of the element is visible
        threshold: 0.15
    });

    revealElements.forEach(function (element) {
        // The .reveal class (which hides the element) is added by JavaScript,
        // so if JavaScript fails to load, the content is still visible
        element.classList.add("reveal");
        observer.observe(element);
    });
}


// =====================================
// 10. FOOTER YEAR
// Purpose: Keeps the copyright year up to date automatically.
// =====================================

function updateFooterYear() {
    // new Date() is the current date and time; getFullYear() gives e.g. 2026
    currentYearElement.textContent = new Date().getFullYear();
}


// =====================================
// 11. PAGE INITIALISATION
// Purpose: Runs the set-up functions once when the page loads.
// Functions above only DEFINE what to do; these calls actually DO it.
// =====================================

updateHeaderOnScroll();   // correct header style if the page loads already scrolled
setUpMobileBar();         // start watching the form for the mobile action bar
setUpScrollReveal();      // start watching sections for the fade-in effect
updateFooterYear();       // show the current year in the footer
