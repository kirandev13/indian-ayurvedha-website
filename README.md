# Navajeevanam Kalari Vaidyamadam Website

Official website for **Navajeevanam Kalari Vaidyamadam** — an undertaking of the Indian School of Martial Arts (I.S.M.A.), Trivandrum, Kerala. Dedicated to traditional Kalari Chikitsa, Marma healing, non-surgical spine/joint care, and hereditary herbal medicine formulations.

---

## 🌿 Overview & Key Features

- **Heritage & Traditional Identity**: Handcrafted visual design reflecting Kerala's Ayurvedic heritage with Forest Green (`#102419`), Antique Gold (`#C5A059`), and Warm Ivory (`#FAF7F2`).
- **Clinically Responsible**: Fully audited for patient trust and medical credibility — transparent diagnostic assessments without misleading outcome promises.
- **Mobile First & Zero Horizontal Scroll**: Tested across 7 viewports (320px up to 1440px desktop) with 0px horizontal overflow.
- **Accessible & High-Performance**:
  - Accessible drawer navigation and keyboard trap handling.
  - Dynamically calculated FAQ accordion height (`scrollHeight`) with ARIA states (`aria-expanded`, `aria-controls`, `role="region"`).
  - WebP optimized imagery (`founder-sajith.webp`), native `loading="lazy"`, and explicit dimensions to prevent Cumulative Layout Shift (CLS).
  - Open Graph, Twitter cards, and Schema.org structured data (`MedicalClinic`, `MedicalWebPage`, `FAQPage`, etc.).
- **Direct Consultation Integration**: Seamless WhatsApp consultation sync with user-friendly validation and transparent patient instructions.

---

## 📁 Project Structure

```
├── index.html           # Homepage (Hero, Marma treatments, Lineage, FAQ, Booking)
├── about.html           # About Navajeevanam, founder story & clinic philosophy
├── guru.html            # Guru Sri Hanumandas Swamiji & sacred lineage
├── treatments.html      # 6 core Kalari & Marma clinical therapies
├── packages.html        # Multi-day protocol packages (3-Day to 21-Day residential)
├── medicines.html       # Handcrafted in-house herbal pharmacy & classical standards
├── gallery.html         # Photo and video showcases from the clinic
├── faq.html             # Patient guidance, clinical questions & answers
├── contact.html         # Clinic address (Peroorkada), hours, Google Map & booking form
├── robots.txt           # Search engine crawler directives
├── sitemap.xml          # XML sitemap for search indexation
├── css/
│   ├── style.css        # Core styling, design tokens, typography, and focus states
│   └── responsive.css   # Responsive layout rules, breakpoints, and mobile action bar
├── js/
│   └── main.js          # Navigation drawer, modal management, form validation & FAQ accordion
└── assets/              # Optimized images, logos, and icons
```

---

## 🚀 Running Locally

No build tools or external package managers required. Serve with any static web server:

### Using Python:
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Using Node.js (npx):
```bash
npx serve .
```

---

## 📍 Clinic Information

- **Address**: RWRA - 17, Ranni Lane, Peroorkada, Thiruvananthapuram, Kerala — 695005, India
- **Phone / WhatsApp**: +91 9188278888
- **Email**: navajeevanamvaidyamadam@gmail.com
- **Consultation Hours**:
  - Monday – Saturday: 7:00 AM – 7:30 PM
  - Sunday: 7:00 AM – 1:30 PM
