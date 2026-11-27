/* =====================================================================
   ABI ESTATES - HOMES LIST (properties-data.js)

   ★ CHANGE THE HOMES HERE. Every home card on the website is built from
   this list: the home page collection, Find a home and Properties.

   To add a home: copy one { ... } block, paste it at the end of the list,
   and change the values. (Remember the comma between blocks!)
   - image: a file name from the IMAGES folder (just the name, no folder)
   - area, type, bedrooms: used by the search forms, so "area" and "type"
     must match the <option value="..."> values in index.html and
     PAGES/search/index.html
   These are sample homes for illustration, not real listings.
   ===================================================================== */
const propertyListings = [
    {
        number: "01",
        slug: "the-banyan-house-adyar",
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
        image: "garden-residence-800.webp",
        imageText: "Modern garden residence with warm timber screens",
        description: "A private Adyar villa presented with a garden setting and warm timber architecture.",
        highlights: ["Private villa", "Garden setting", "Warm timber screens"]
    },
    {
        number: "02",
        slug: "coastline-residence-ecr",
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
        image: "coastal-villa-800.webp",
        imageText: "Light-filled coastal villa with a garden and swimming pool",
        description: "A coastal villa concept with generous natural light, a garden and a swimming pool.",
        highlights: ["Coastal villa", "Garden", "Swimming pool"]
    },
    {
        number: "03",
        slug: "the-verandah-nungambakkam",
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
        image: "chennai-apartment-800.webp",
        imageText: "Contemporary apartment building with a clean modern facade",
        description: "A contemporary Nungambakkam apartment concept with a clean, modern facade.",
        highlights: ["Luxury apartment", "Contemporary facade", "Central Chennai"]
    },
    {
        number: "04",
        slug: "the-solstice-penthouse-omr",
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
        image: "chennai-living-800.webp",
        imageText: "Spacious contemporary living room with natural light and timber finishes",
        description: "A spacious OMR penthouse concept with natural light and timber-finished interiors.",
        highlights: ["Penthouse", "Natural light", "Timber finishes"]
    },
    {
        number: "05",
        slug: "the-shore-house-besant-nagar",
        name: "The Shore House",
        location: "Besant Nagar",
        area: "besant-nagar",
        type: "villa",
        typeLabel: "Garden villa",
        bedrooms: 4,
        bathrooms: 4,
        size: "3,600 sq.ft.",
        price: "₹6.9 Cr",
        tag: "BY THE COAST",
        image: "chennai-home-800.webp",
        imageText: "Contemporary home lit up in the evening beneath a large tree",
        description: "A Besant Nagar garden-home concept set beneath mature shade trees.",
        highlights: ["Garden villa", "Tree-lined setting", "Besant Nagar"]
    },
    {
        number: "06",
        slug: "the-kilpauk-edit",
        name: "The Kilpauk Edit",
        location: "Kilpauk",
        area: "kilpauk",
        type: "apartment",
        typeLabel: "Garden apartment",
        bedrooms: 3,
        bathrooms: 3,
        size: "2,180 sq.ft.",
        price: "₹3.6 Cr",
        tag: "CITY LIVING",
        image: "chennai-eden-park-800.webp",
        imageText: "Landscaped apartment community with residential towers in Chennai",
        description: "A Kilpauk apartment concept in a landscaped residential community.",
        highlights: ["Garden apartment", "Landscaped grounds", "Kilpauk"]
    },
    {
        number: "07",
        slug: "banyan-court-kotturpuram",
        name: "Banyan Court",
        location: "Kotturpuram",
        area: "kotturpuram",
        type: "apartment",
        typeLabel: "Courtyard residence",
        bedrooms: 3,
        bathrooms: 3,
        size: "2,650 sq.ft.",
        price: "₹4.2 Cr",
        tag: "QUIET ADDRESS",
        image: "chennai-hiranandani-parks-800.webp",
        imageText: "Tall apartment towers set among lawns and palm trees in Chennai",
        description: "A Kotturpuram courtyard-home concept surrounded by lawns and palms.",
        highlights: ["Courtyard residence", "Green open space", "Kotturpuram"]
    },
    {
        number: "08",
        slug: "the-alwarpet-residence",
        name: "The Alwarpet Residence",
        location: "Alwarpet",
        area: "alwarpet",
        type: "penthouse",
        typeLabel: "City penthouse",
        bedrooms: 4,
        bathrooms: 4,
        size: "3,250 sq.ft.",
        price: "₹6.1 Cr",
        tag: "RARE FIND",
        image: "chennai-eden-park-night-800.webp",
        imageText: "Apartment towers and their courtyard lit up at night in Chennai",
        description: "An Alwarpet penthouse concept with a city outlook over a landscaped courtyard.",
        highlights: ["City penthouse", "Courtyard outlook", "Alwarpet"]
    },
    {
        number: "09",
        slug: "the-mylapore-house",
        name: "The Mylapore House",
        location: "Mylapore",
        area: "mylapore",
        type: "apartment",
        typeLabel: "Garden apartment",
        bedrooms: 3,
        bathrooms: 3,
        size: "2,300 sq.ft.",
        price: "INR 4.6 Cr",
        tag: "A QUIETER CITY HOME",
        image: "chennai-omr-apartments-800.webp",
        imageText: "Residential towers along the OMR corridor in Chennai",
        description: "A Mylapore apartment concept; the current sample image shows a Chennai residential development.",
        highlights: ["Garden apartment", "Three bedrooms", "Mylapore"]
    }
];


// Add the images folder in front of each image name.
// data-root on <body> is "" on the home page and "../../" on the inner pages.
if (typeof module !== "undefined" && module.exports) {
    // The Node backend imports this same catalog so browser and API searches agree.
    module.exports = propertyListings;
} else {
    const siteRoot = document.body.getAttribute("data-root") || "";
    window.propertyListings = propertyListings;
    window.propertyListings.forEach(function (property) {
        property.image = siteRoot + "IMAGES/" + property.image;
    });
}
