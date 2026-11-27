
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");
const propertyListings = require("../JS/properties-data.js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Supabase is only needed for enquiries; property search can run without credentials.
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Home route
app.get("/", (req, res) => {
    res.send("Abi Backend Server is Running!");
});

// Property search API. The browser and API use the same catalog in JS/properties-data.js.
app.get("/api/properties", (req, res) => {
    const { area = "", type = "", bedrooms = "" } = req.query;
    const validAreas = new Set(propertyListings.map((property) => property.area));
    const validTypes = new Set(propertyListings.map((property) => property.type));
    const validBedroomFilters = new Set(["3", "4", "5"]);

    if ((area && !validAreas.has(area)) || (type && !validTypes.has(type)) || (bedrooms && !validBedroomFilters.has(bedrooms))) {
        return res.status(400).json({ ok: false, message: "Choose a valid area, home type, and bedroom count." });
    }

    const results = propertyListings.filter((property) =>
        (!area || property.area === area) &&
        (!type || property.type === type) &&
        (!bedrooms || property.bedrooms >= Number(bedrooms))
    );

    return res.json({ ok: true, total: results.length, properties: results });
});

// Full detail record for one residence.
app.get("/api/properties/:slug", (req, res) => {
    const property = propertyListings.find((item) => item.slug === req.params.slug);
    if (!property) {
        return res.status(404).json({ ok: false, message: "We could not find that home." });
    }
    return res.json({ ok: true, property });
});

// Test email route
app.get("/test-email", async (req, res) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: "Abi Landing Page - SMTP Test",
            text: "Gmail SMTP is connected successfully!"
        });

        res.send("Test email sent successfully!");
    } catch (error) {
        console.error("Email Error:", error.message);
        res.status(500).send("Email sending failed.");
    }
});

// Enquiry API
app.post("/api/enquiry", async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({
                ok: false,
                message: "Enquiry storage is not configured on this server."
            });
        }

        const { name, email, phone, interest, message } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({
                ok: false,
                message: "Name and email are required."
            });
        }

        // Step 1: Save enquiry in Supabase
        const { error: dbError } = await supabase
            .from("enquiries")
            .insert([{
                full_name: name,
                email: email,
                phone: phone || "",
                property_interest: interest || "",
                message: message || ""
            }]);

        if (dbError) {
            console.error("Supabase Error:", dbError.message);

            return res.status(500).json({
                ok: false,
                message: "Unable to save enquiry."
            });
        }

        // Step 2: Send emails
        try {
            await Promise.all([
                // Visitor confirmation
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Thank you for contacting Abi Estates",
                    text: `Hello ${name},

Thank you for your enquiry. We have received your request and our team will contact you soon.

Regards,
Abi Estates`
                }),

                // Owner notification
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.OWNER_EMAIL,
                    subject: "New Website Enquiry - Abi Estates",
                    text: `New enquiry received.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Property Interest: ${interest || "Not provided"}
Message: ${message || "Not provided"}`
                })
            ]);

            return res.status(200).json({
                ok: true,
                emailSent: true,
                message: "Enquiry saved and emails sent."
            });

        } catch (emailError) {
            console.error("Email Error:", emailError.message);

            return res.status(200).json({
                ok: true,
                emailSent: false,
                message: "Enquiry saved, but email sending failed."
            });
        }

    } catch (error) {
        console.error("Server Error:", error.message);

        res.status(500).json({
            ok: false,
            message: "Something went wrong."
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
