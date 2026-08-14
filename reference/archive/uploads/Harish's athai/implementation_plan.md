# Implementation Plan - WhatsApp Enquiry Rerouting and Backend Notification

This plan outlines the approach to integrate WhatsApp rerouting and a backend notification ping via Meta's WhatsApp Business Cloud API (without external BSPs) for the Dream Drifters web application.

---

## User Review Required

> [!IMPORTANT]
> **Meta API Credentials & Setup:**
> To ping the business owner's WhatsApp from the backend, the client must set up a Meta Developer App and configure WhatsApp Business Platform. The following credentials will be required in production (stored securely as environment variables):
> - `META_ACCESS_TOKEN` (a permanent System User token is highly recommended).
> - `META_PHONE_NUMBER_ID` (associated with the sending business phone number).
> - `BUSINESS_OWNER_PHONE_NUMBER` (recipient phone number: `+91 93633 12124`).
> - A registered and approved WhatsApp Message Template (e.g. `dream_drifters_enquiry`) if sending messages outside the 24-hour customer window.

> [!NOTE]
> **No External BSPs:**
> Per your instructions, we will not use Twilio, Gupshup, or other third-party Business Solution Providers. We will communicate directly with Meta's Graph API endpoints.

---

## Decisions Made

> [!NOTE]
> **Hosting & Deployment Strategy:**
> We will deploy the website to **Vercel** as a serverless application. Vercel is free, secure, and perfectly suited for this project.
> - The single HTML file will be relocated to the root as `index.html` for Vercel to serve automatically.
> - The backend notifier will be built as a Vercel Serverless Function under `api/enquiry.js`.
> - Local testing will be done using Vercel Dev.

---

## Proposed Changes

### Frontend Component

#### [NEW] [index.html](file:///c:/Users/Nikil%20Krishnan/Downloads/Harish's%20athai/index.html)
*(Relocated and renamed from `gistfile1.txt` to be served as Vercel's default homepage)*

#### [DELETE] [gistfile1.txt](file:///c:/Users/Nikil%20Krishnan/Downloads/Harish's%20athai/901a1d8f15c7be773764e9396b9cdf0e-aa36adfb1f1aabf97c9432b17d09f8bd9aa9959f/gistfile1.txt)

We will modify the enquiry form submission flow to:
1. **Prevent default form submission** (or trigger it asynchronously).
2. **Display a custom, premium success dialog modal** announcing that the enquiry has been received and they are being connected to WhatsApp.
3. **Trigger the backend API request** asynchronously to notify the business owner's WhatsApp via the Meta Cloud API.
4. **Reroute the user** to the business WhatsApp number `+91 93633 12124` using the standard click-to-chat URL:
   `https://wa.me/919363312124?text=EncodedMessage`
   with a pre-filled structured text containing all the form fields (Name, Mobile, Email, Package, Message).

##### Modal UI addition (CSS & HTML):
A glassmorphism-styled dialog box matching the existing theme:
```css
/* Glassmorphism Dialog Box */
.whatsapp-modal {
  display: none;
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(3, 48, 80, 0.7);
  backdrop-filter: blur(8px);
  align-items: center;
  justify-content: center;
}
.whatsapp-modal-content {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}
.whatsapp-modal.show {
  display: flex;
}
.whatsapp-modal.show .whatsapp-modal-content {
  transform: scale(1);
}
.wa-icon-large {
  font-size: 3.5rem;
  color: #25D366;
  margin-bottom: 1rem;
}
.wa-btn-proceed {
  background: #25D366;
  color: white;
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.wa-btn-proceed:hover {
  background: #20ba59;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(37,211,102,0.3);
}
```

##### Modal HTML Structure:
```html
<div id="waSuccessModal" class="whatsapp-modal">
  <div class="whatsapp-modal-content">
    <div class="wa-icon-large">💬</div>
    <h3 style="color:var(--navy); font-size:1.5rem; margin-bottom:0.5rem;">Enquiry Received!</h3>
    <p style="color:var(--gray); font-size:0.95rem; line-height:1.5; margin-bottom:1.5rem;">
      Thank you for choosing Dream Drifters. We are redirecting you to WhatsApp to instantly share your travel preferences with our team.
    </p>
    <button id="waProceedBtn" class="wa-btn-proceed">
      <span>Proceed to WhatsApp</span>
    </button>
  </div>
</div>
```

---

### Backend Component

We will create a serverless function at the root of the project to serve as the backend. Vercel automatically routes requests to `/api/enquiry` to this file.

#### [NEW] [enquiry.js](file:///c:/Users/Nikil%20Krishnan/Downloads/Harish's%20athai/api/enquiry.js)

A Node.js serverless function handler to receive the enquiry details from the frontend form and forward it securely to the Meta WhatsApp API.

##### Key logic for Meta Cloud API integration:
```javascript
// api/enquiry.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, mobile, email, package: selectedPackage, message } = req.body;

  // Format message text for the business owner
  const textMessage = `New Enquiry Received!\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nPackage: ${selectedPackage}\nMessage: ${message || 'N/A'}`;

  try {
    const metaResponse = await fetch(`https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: process.env.BUSINESS_OWNER_PHONE_NUMBER, // e.g. +91 93633 12124
        type: "text",
        text: {
          preview_url: false,
          body: textMessage
        }
      })
    });

    const result = await metaResponse.json();
    if (!metaResponse.ok) {
      console.error('Meta API Error:', result);
      return res.status(500).json({ error: 'Failed to send WhatsApp notification', details: result });
    }

    return res.status(200).json({ success: true, messageId: result.messages[0].id });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

#### [NEW] [vercel.json](file:///c:/Users/Nikil%20Krishnan/Downloads/Harish's%20athai/vercel.json)

An optional configuration file to specify backend routes if needed, and to ensure clean routing.

```json
{
  "rewrites": [
    {
      "source": "/api/enquiry",
      "destination": "/api/enquiry.js"
    }
  ]
}
```

---

## Verification Plan

### Manual Verification
1. Open the updated web page.
2. Fill out all the form fields in the "Send Us an Enquiry" form.
3. Click "Send Enquiry".
4. Verify that:
   - A beautiful modal dialog box opens explaining that the enquiry is complete.
   - The user is redirected to a WhatsApp tab containing the pre-filled enquiry text addressed to `+91 93633 12124`.
5. Run the local backend using Vercel Dev (`npx vercel dev`). Send a mock request and verify it executes the call to the Meta WhatsApp Graph API successfully.
