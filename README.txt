KAVRIQON TECHNOLOGIES — V6 SIGNATURE STUDIO
============================================

This version builds on V5 and keeps the existing brand identity, supplied

DESIGN UPDATES
--------------
- More cinematic dark-navy hero and contact section with bronze light accents.
- More distinctive typography and stronger editorial hierarchy.
- Refined service-card hover treatment and process interactions.
- Redesigned enquiry panel with a top accent, improved field styling,
  focus states, and a live completion indicator.
- Subtle scroll-reveal motion with reduced-motion accessibility support.
- Responsive form layout for smaller screens.

DEPLOYMENT
----------
Upload the contents of this ZIP as a new deployment to the existing Cloudflare
Worker project "kavriqon-technologies". No DNS or custom-domain changes are
required. The live site remains unchanged until deployment.

ENQUIRY FORM
------------
The form sends name, email, optional phone, selected service and message to
Then submit a second test to verify delivery. Check Spam if needed.

visitor information. The form does not store leads in a database.

SEO
---
Canonical URL and sitemap remain https://kavriqontechnologies.com/.
Google indexing and ranking are not guaranteed and may take time.


ENQUIRY FORM


V9 SECURE ENQUIRY FORM UPDATE
- The enquiry form now submits JSON to the Kavriqon Cloudflare Worker:
  https://kavriqon-enquiries.dawarqay.workers.dev/submit
- The recipient email and Resend API key remain server-side as Cloudflare Worker secrets.
- Deploy this ZIP to the existing Kavriqon website Worker (the one serving kavriqontechnologies.com), not to kavriqon-enquiries.