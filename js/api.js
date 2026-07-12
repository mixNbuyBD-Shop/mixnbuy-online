/* ============================================
   MixNBuy BD
   Google Sheet API
============================================ */

const API_URL =
"https://script.google.com/macros/s/AKfycbyr83DXdsLVhcbQuhOJKeJjbia9aXGmM6_AqA-fNmphMRZHy2-BCD6VM7nKhe_9vtaX/exec";

let productCache = [];

/* Fetch Products */

export async function fetchProducts() {

    try {

        const response = await fetch(API_URL + "?t=" + Date.now(), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Network Error");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid API Response");
        }

        productCache = data
            .filter(item =>
                String(item.Status).toLowerCase() === "active"
            )
            .map(item => ({
                ...item,
                "Image URL":
                    item["Image URL"] || "images/no-image.png"
            }));

        return productCache;

    } catch (err) {

        console.error(err);

        productCache = [];

        return [];

    }

}

/* Get All */

export function getProducts() {
    return productCache;
}

/* Get One */

export function getProductById(id) {

    return productCache.find(p =>
        String(p.ID) === String(id)
    );

}

/* Search */

export function searchProducts(keyword) {

    keyword = keyword.toLowerCase();

    return productCache.filter(item =>

        (item["Product Name"] || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (item.Category || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (item.Description || "")
            .toLowerCase()
            .includes(keyword)

    );

}

/* Category */

export function filterCategory(category) {

    if (category === "All") return productCache;

    return productCache.filter(item =>
        item.Category === category
    );

}

/* Latest */

export function latestProducts(limit = 6) {

    return [...productCache]
        .reverse()
        .slice(0, limit);

}

/* Auto Refresh */

setInterval(async () => {

    await fetchProducts();

    document.dispatchEvent(
        new CustomEvent("productsUpdated")
    );

}, 3000000);
