document.documentElement.classList.add("js");

// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

// Header border on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Enquiry form: same Worker endpoint and payload as the previous site
const ENDPOINT = "https://kavriqon-enquiries.dawarqay.workers.dev/submit";
const form = document.getElementById("enquiry-form");
const statusEl = document.getElementById("form-status");
if (form && statusEl) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const honeypot = form.querySelector('[name="_honey"]');
    if (honeypot && honeypot.value) return;
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector(".submit-text");
    const service = form.querySelector('input[name="service"]:checked');
    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: service ? service.value : "",
      message: form.elements.message.value.trim(),
      website: honeypot ? honeypot.value.trim() : ""
    };

    button.disabled = true;
    label.textContent = "Sending…";
    statusEl.className = "form-status";
    statusEl.textContent = "";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok && result.success === true) {
        form.reset();
        statusEl.className = "form-status ok";
        statusEl.textContent = "Thank you. Your enquiry is with our team, and a real person will reply soon.";
      } else {
        throw new Error(result.message || "Not sent");
      }
    } catch (err) {
      statusEl.className = "form-status error";
      statusEl.textContent = "We couldn't send that just now. Please try again in a moment, or reach us on LinkedIn.";
    } finally {
      button.disabled = false;
      label.textContent = "Send enquiry";
    }
  });
}
