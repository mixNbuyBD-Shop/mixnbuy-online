/*==================================================
MixNBuy BD
app.js
Part 1
Import + DOM + Init + Load Products
==================================================*/

import {
    fetchProducts,
    getProducts,
    latestProducts
} from "./api.js";

/*==================================================
DOM Elements
==================================================*/

const productGrid = document.getElementById("productGrid");
const featuredGrid = document.getElementById("featuredProducts");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const modal = document.getElementById("productModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

const orderNowBtn = document.getElementById("orderNowBtn");
const closeModal = document.getElementById("closeModal");

const menuBtn = document.getElementById("menuBtn");
const navbar = document.querySelector(".navbar");

const backToTop = document.getElementById("backToTop");

/*==================================================
Global Variables
==================================================*/

let currentProducts = [];
let selectedProduct = null;

/*==================================================
Initialize
==================================================*/

document.addEventListener("DOMContentLoaded", init);

async function init() {

    console.log("MixNBuy BD Started");

    showLoading();

    try {

        await loadProducts();

        setupEvents();

        console.log("Products Loaded Successfully");

    } catch (error) {

        console.error(error);

        showError();

    }

}

/*==================================================
Load Products
==================================================*/

async function loadProducts() {

    await fetchProducts();

    currentProducts = getProducts();

    console.log(currentProducts);

    renderProducts(currentProducts);

    renderFeaturedProducts();

}

/*==================================================
Loading UI
==================================================*/

function showLoading() {

    if (productGrid) {

        productGrid.innerHTML = `
        <div class="loading-card">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Loading Products...</p>
        </div>
        `;

    }

    if (featuredGrid) {

        featuredGrid.innerHTML = `
        <div class="loading-card">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Loading Products...</p>
        </div>
        `;

    }

}

/*==================================================
Error UI
==================================================*/

function showError() {

    productGrid.innerHTML = `
    <div class="loading-card">

        <i class="fa-solid fa-circle-exclamation"></i>

        <p>Failed to load products.</p>

    </div>
    `;

}

/*==================================================
Featured Products
==================================================*/

function renderFeaturedProducts() {

    const latest = latestProducts(6);

    featuredGrid.innerHTML = "";

    latest.forEach(product => {

        const card = createProductCard(product);

        featuredGrid.appendChild(card);

    });

}

/*==================================================
Functions
(Next Part)
==================================================*/

// createProductCard()
// renderProducts()
// setupEvents()
// searchProducts()
// categoryFilter()
// modal()
// whatsapp()
// backToTop()
/*==================================================
Render Products
==================================================*/

function renderProducts(products) {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (!products || products.length === 0) {

        productGrid.innerHTML = `
            <div class="loading-card">
                <i class="fa-solid fa-box-open"></i>
                <p>No Products Found</p>
            </div>
        `;

        return;
    }

    products.forEach(product => {

        const card = createProductCard(product);

        productGrid.appendChild(card);

    });

}

/*==================================================
Create Product Card
==================================================*/

function createProductCard(product) {

    const card = document.createElement("div");

    card.className = "product-card fade-up";

    const image =
        product["Image URL"] && product["Image URL"].trim() !== ""
            ? product["Image URL"]
            : "images/no-image.png";

    card.innerHTML = `

        <div class="product-image">

            <img
                src="${image}"
                alt="${product["Product Name"]}"
                loading="lazy">

            <span class="product-badge">

                NEW

            </span>

        </div>

        <div class="product-info">

            <div class="product-category">

                ${product.Category}

            </div>

            <h3 class="product-title">

                ${product["Product Name"]}

            </h3>

            <p class="product-description">

                ${product.Description || ""}

            </p>

            <div class="product-price">

                ৳${product.Price}

            </div>

            <button class="order-btn">

                <i class="fa-brands fa-whatsapp"></i>

                Order Now

            </button>

        </div>

    `;

    /* Image Fallback */

    const img = card.querySelector("img");

    img.onerror = () => {

        img.src = "images/no-image.png";

    };

    /* Card Click */

    card.addEventListener("click", () => {

        openProduct(product.ID);

    });

    /* Order Button */

    const orderBtn = card.querySelector(".order-btn");

    orderBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        openProduct(product.ID);

    });

    return card;

}

/*==================================================
Refresh UI
==================================================*/

function refreshProducts() {

    renderProducts(currentProducts);

    renderFeaturedProducts();

}

/*==================================================
Products Updated Event
==================================================*/

document.addEventListener("productsUpdated", () => {

    currentProducts = getProducts();

    refreshProducts();

});
/*==================================================
Setup Events
==================================================*/

function setupEvents() {

    /* Search */

    if (searchInput) {

        searchInput.addEventListener("input", handleSearch);

    }

    /* Category */

    if (categoryFilter) {

        categoryFilter.addEventListener("change", handleCategory);

    }

    /* Close Modal */

    if (closeModal) {

        closeModal.addEventListener("click", closeProductModal);

    }

    /* Outside Click */

    if (modal) {

        modal.addEventListener("click", (e) => {

            if (e.target === modal) {

                closeProductModal();

            }

        });

    }

    /* ESC */

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeProductModal();

        }

    });

}

/*==================================================
Search
==================================================*/

function handleSearch() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword === "") {
        renderProducts(currentProducts);
        return;
    }

    const result = currentProducts.filter(product => {

        const name = (product["Product Name"] || "").toLowerCase();
        const category = (product.Category || "").toLowerCase();
        const description = (product.Description || "").toLowerCase();

        return (
            name.includes(keyword) ||
            category.includes(keyword) ||
            description.includes(keyword)
        );

    });

    renderProducts(result);

}
/*==================================================
Category Filter
==================================================*/

function handleCategory() {

    const category = categoryFilter.value;

    if (category === "All") {

        renderProducts(currentProducts);

        return;

    }

    const result = currentProducts.filter(product =>

        product.Category === category

    );

    renderProducts(result);

}

/*==================================================
Open Product
==================================================*/

function openProduct(id) {

    const product = currentProducts.find(item =>

        String(item.ID) === String(id)

    );

    if (!product) return;

    selectedProduct = product;

    modalImage.src =
        product["Image URL"] || "images/no-image.png";

    modalTitle.textContent =
        product["Product Name"];

    modalCategory.textContent =
        product.Category;

    modalPrice.textContent =
        "৳" + product.Price;

    modalDescription.textContent =
        product.Description;

    modal.classList.add("active");
    
// Modal Order Button Event
orderNowBtn.onclick = orderOnWhatsApp;

}

/*==================================================
Close Modal
==================================================*/

function closeProductModal() {

    modal.classList.remove("active");

}
/*==================================================
WhatsApp Order
==================================================*/

function orderOnWhatsApp() {

    console.log("Button Clicked");

    console.log(selectedProduct);

    if (!selectedProduct) return;

    const message = `🛒 MixNBuy BD

Product: ${selectedProduct["Product Name"]}

Price: ৳${selectedProduct.Price}`;

    const url =
        "https://wa.me/8801401637310?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}

/*==================================================
Image Fallback
==================================================*/

function setupImageFallback() {

    document.querySelectorAll(".product-image img").forEach(img => {

        img.onerror = () => {

            img.src = "images/no-image.png";

        };

    });

}

/*==================================================
Auto Refresh
==================================================*/

async function autoRefreshProducts() {

    await fetchProducts();

    currentProducts = getProducts();

    renderProducts(currentProducts);

    renderFeaturedProducts();

    setupImageFallback();

}

/*==================================================
Refresh Every 60 Seconds
==================================================*/

setInterval(() => {

    autoRefreshProducts();

}, 300000);

/*==================================================
Products Updated Event
==================================================*/

document.addEventListener("productsUpdated", () => {

    currentProducts = getProducts();

    renderProducts(currentProducts);

    renderFeaturedProducts();

    setupImageFallback();

});

/*==================================================
Window Load
==================================================*/

window.addEventListener("load", () => {

    setupImageFallback();

});
/*==================================================
Mobile Menu
==================================================*/

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("active");

    });

    document.querySelectorAll(".navbar a").forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("active");

        });

    });

}

/*==================================================
Back To Top Button
==================================================*/

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/*==================================================
Sticky Header Shadow
==================================================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/*==================================================
Fade Up Animation
==================================================*/

function animateCards() {

    const cards = document.querySelectorAll(".product-card");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    cards.forEach(card => {

        observer.observe(card);

    });

}

/*==================================================
Refresh Animation After Render
==================================================*/

const oldRenderProducts = renderProducts;

renderProducts = function(products) {

    oldRenderProducts(products);

    setupImageFallback();

    animateCards();

};

/*==================================================
Smooth Scroll
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});

/*==================================================
Window Resize
==================================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

        navbar?.classList.remove("active");

    }

});

/*==================================================
Page Loaded
==================================================*/

window.addEventListener("load", () => {

    animateCards();

    setupImageFallback();

    console.log("MixNBuy BD Ready");

});
/*==================================================
Part 6
Final Cleanup + Error Handling
==================================================*/

/*==================================================
Safe Image
==================================================*/

function safeImage(url) {

    if (!url || url.trim() === "") {

        return "images/no-image.png";

    }

    return url;

}

/*==================================================
Retry API Load
==================================================*/

async function retryLoad(retry = 3) {

    while (retry > 0) {

        try {

            await fetchProducts();

            currentProducts = getProducts();

            renderProducts(currentProducts);

            renderFeaturedProducts();

            return;

        } catch (err) {

            retry--;

            console.log("Retry...", retry);

        }

    }

    showError();

}

/*==================================================
Online / Offline
==================================================*/

window.addEventListener("offline", () => {

    console.warn("Internet Disconnected");

});

window.addEventListener("online", () => {

    retryLoad();

});

/*==================================================
Refresh UI
==================================================*/

function refreshUI() {

    renderProducts(currentProducts);

    renderFeaturedProducts();

    setupImageFallback();

    animateCards();

}

/*==================================================
Prevent Empty Grid
==================================================*/

if (!productGrid) {

    console.error("#productGrid Not Found");

}

if (!featuredGrid) {

    console.error("#featuredProducts Not Found");

}

/*==================================================
Performance
==================================================*/

window.addEventListener("beforeunload", () => {

    console.log("Leaving MixNBuy BD");

});

/*==================================================
Console Logo
==================================================*/

console.log("%cMixNBuy BD",
"color:#00d084;font-size:22px;font-weight:bold;");

console.log("Google Sheet Auto Sync Ready");

/*==================================================
Finished
==================================================*/
