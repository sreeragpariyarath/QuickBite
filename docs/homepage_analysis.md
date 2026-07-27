# Homepage Design Redesign — Gap Analysis & Plan

This document analyzes the gap between our current client homepage implementation and the target premium SaaS design, detailing how we will implement the missing features.

---

## 🔍 What We Have vs. What We Lack

### 1. Navigation Header
* **We Have:** Basic logo `QB QuickBite` and a `Login` button on the right.
* **We Lack:** 
  - Location Selector (`📍 Deliver to Koramangala, Bangalore` with interactive dropdown).
  - Search Bar (`🔍 Search for restaurants, cuisines or dishes...`).
  - Cart Icon with dynamic items badge (e.g., `2`).
  - User profile avatar dropdown (if logged in).

### 2. Main Hero Section
* **We Have:** A basic layout header list.
* **We Lack:** 
  - Hero column text: *"Delicious food, delivered fast to your door."*
  - *"What's on your mind?"* category selector grid with clean vector icons: `Burgers`, `Pizza`, `Indian`, `Desserts`, `Beverages`, `More`.
  - Prominent "Order Now" button.

### 3. Benefits Trust Bar & Promo Banners
* **We Have:** Benefit tags used locally in other sub-views.
* **We Lack:**
  - Trust bar: Row of 4 items (`Fast Delivery`, `Top Restaurants`, `Safe & Secure`, `Live Tracking`).
  - Dual Promo Banners (horizontal grid cards):
    - Banner A: *"Flat 50% OFF on your first order. Code: QUICK50"* + salad plate illustration.
    - Banner B: *"Free Delivery on orders above ₹199"* + delivery scooter illustration.

### 4. Restaurant Cards & Lists ("Featured Restaurants" & "Top picks")
* **We Have:** Plain white text boxes showing name and address.
* **We Lack:**
  - **Banner Images:** Top cover food photos.
  - **Delivery Badges:** `20-30 min` top-right image overlays.
  - **Ratings Indicator:** `⭐ 4.6` inline tags.
  - **Cuisine Tags:** `Burgers · American` sub-categories.
  - **Offers Badge:** `50% OFF up to ₹100` footer tags.
  - **Active State Hover:** Smooth shadow lifts and image scale transitions.

### 5. Popular Cuisines (Circular List)
* **We Have:** Nothing.
* **We Lack:** Horizontal scroll of circular cuisines avatar cards: `North Indian`, `South Indian`, `Chinese`, `Italian`, `Biryani`, `Fast Food`, `Healthy`, `Street Food`.

---

## 🛠️ Technical Implementation Plan

To keep the database simple and avoid heavy migrations, we will implement this with a **frontend-driven mapper model**:

### Step 1: Frontend Restaurant Metadata Enrichment
Since our PostgreSQL `Restaurant` schema only stores basic text details (`name`, `description`, `address`, `city`, `imageUrl`), we will write a client utility mapper that dynamically binds stable mock attributes based on the restaurant's `id` or `name`:
* **Assign Cover Photo:** If `imageUrl` is blank, assign a high-quality themed cover food photo based on the cuisine.
* **Assign Metadata:** Calculate ratings (e.g., `4.5`), delivery times (`20-30 min`), and cuisines list based on the keywords in their name/description.
* **Assign Promo Offer:** Attach custom promotions dynamically.

### Step 2: Global Category filtering logic
* When a user clicks **Burgers**, the homepage triggers a local search filter matching "burger", "fast food", or "bun" in the enriched cuisine tags or description.

### Step 3: Implement client-side `CartProvider`
* Build a React context `CartContext` to hold cart items, quantity modifiers, and persist state in `localStorage`. The header cart badge will read directly from this context.
