# Extractable Components

The current static document has no source-level components. The following repeated regions are candidates for extraction after the Vite/React implementation, but they cannot be registered as current reusable DraftComponents because they do not exist as standalone component files.

## TopNavigation
- Source: `reference/archive/uploads/Harish's athai/index.html`
- Category: layout
- Description: Sticky brand navigation with anchor links and quote CTA.
- Extractable props: none in current source.
- Hardcoded: logo path, labels, anchors and CSS classes.

## PackageCard
- Source: `reference/archive/uploads/Harish's athai/index.html`
- Category: basic
- Description: Repeated destination package summary and itinerary action.
- Extractable props: destination key, title, duration, badge, features and price.
- Hardcoded: CSS classes and interaction pattern.

## EnquiryForm
- Source: `reference/archive/uploads/Harish's athai/index.html`
- Category: basic
- Description: Contact and package enquiry form.
- Extractable props: package options and submission destination.
- Hardcoded: field labels and CSS classes.

## Footer
- Source: `reference/archive/uploads/Harish's athai/index.html`
- Category: layout
- Description: Copyright-only footer.
- Extractable props: year.
- Hardcoded: company name and legal suffix.

