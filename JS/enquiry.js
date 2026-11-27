
/* ==========================================
   ABI ESTATES - ENQUIRY FORM
   Backend + Supabase + Gmail SMTP
========================================== */

// Backend API URL
const ENQUIRY_ENDPOINT = "http://localhost:5000/api/enquiry";

// Find all enquiry forms
const enquiryForms = document.querySelectorAll("[data-enquiry-form]");

// Read form field values
function readEnquiryField(form, name) {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
}

// Show form status message
function showEnquiryMessage(form, message, state) {
    const line = form.querySelector("[data-form-message]");

    if (!line) return;

    line.textContent = message;
    line.setAttribute("data-state", state);
}

// Enable or disable submit button
function setEnquirySending(form, isSending) {
    const button = form.querySelector('[type="submit"]');

    form.classList.toggle("is-sending", isSending);

    if (button) {
        button.disabled = isSending;
    }
}

// Send enquiry to Node.js backend
async function sendEnquiry(enquiry) {
    const response = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(enquiry)
    });

    const result = await response.json();

    if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Enquiry submission failed.");
    }

    return result;
}

// Handle all enquiry forms
enquiryForms.forEach(function (form) {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (form.classList.contains("is-sending")) return;

        const name = readEnquiryField(form, "name");
        const email = readEnquiryField(form, "email");
        const countryCode = readEnquiryField(form, "country_code");
        const phone = readEnquiryField(form, "phone");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !emailPattern.test(email)) {
            showEnquiryMessage(
                form,
                "Enter your name and a valid email address.",
                "error"
            );
            return;
        }

        const enquiry = {
            name: name,
            email: email,
            phone: phone ? countryCode + " " + phone : "",
            interest: readEnquiryField(form, "interest"),
            message: readEnquiryField(form, "message")
        };

        showEnquiryMessage(
            form,
            "Submitting your enquiry...",
            "working"
        );

        setEnquirySending(form, true);

        try {
            const result = await sendEnquiry(enquiry);

            if (result.emailSent) {
                showEnquiryMessage(
                    form,
                    "Thank you! Your enquiry was submitted successfully. Confirmation email sent.",
                    "success"
                );
            } else {
                showEnquiryMessage(
                    form,
                    "Your enquiry was saved, but email sending failed. We will contact you soon.",
                    "success"
                );
            }

            form.reset();

        } catch (error) {
            console.error("Enquiry Error:", error);

            showEnquiryMessage(
                form,
                "Sorry, we could not submit your enquiry. Please try again.",
                "error"
            );

        } finally {
            setEnquirySending(form, false);
        }
    });
});

// Automatically fill message when property is selected from URL
const askedProperty = new URLSearchParams(
    window.location.search
).get("property");

if (askedProperty) {
    enquiryForms.forEach(function (form) {
        const messageBox = form.querySelector('[name="message"]');

        if (messageBox && messageBox.value === "") {
            messageBox.value =
                "I would like to know more about " +
                askedProperty.slice(0, 120) + ".";
        }
    });
}
