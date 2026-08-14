# Shared UI Components

The current production baseline is a single vanilla HTML document with no component library. Repeated visual patterns are implemented with CSS classes in `reference/archive/uploads/Harish's athai/index.html`.

## Package card

- Source: `reference/archive/uploads/Harish's athai/index.html`
- Description: Repeated destination package card with inclusions, price and itinerary action.

```html
<div class="pkg-card">
  <div class="pkg-top">
    <div class="pkg-flag">🏝️</div>
    <h3>Maldives Paradise</h3>
    <p>5 Days / 4 Nights</p>
    <span class="pkg-badge">Best Seller</span>
  </div>
  <div class="pkg-body">
    <ul class="pkg-features">
      <li>5-star overwater resort stay</li>
      <li>Water sports &amp; snorkeling</li>
      <li>Sunset dolphin cruise</li>
      <li>Full spa treatments</li>
      <li>All meals included</li>
    </ul>
    <div class="pkg-price">₹95,000 <span>/ person</span></div>
    <button class="btn-pkg" onclick="openModal('maldives')">View Full Itinerary</button>
  </div>
</div>
```

## Enquiry fields

- Source: `reference/archive/uploads/Harish's athai/index.html`
- Description: Native HTML form fields and package selector used for the current lead form.

```html
<form id="bookingForm" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
  <div class="form-group">
    <label>Full Name *</label>
    <input type="text" name="name" placeholder="Your full name" required>
  </div>
  <div class="form-group">
    <label>Mobile Number *</label>
    <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" required>
  </div>
  <div class="form-group">
    <label>Email Address *</label>
    <input type="email" name="email" placeholder="your@email.com" required>
  </div>
  <button type="submit" class="btn-send" id="submitBtn">Send Enquiry</button>
</form>
```

No reusable React/Vue/Svelte primitives exist yet.

