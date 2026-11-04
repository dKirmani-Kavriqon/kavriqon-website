document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Mobile menu ---------- */
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/* ---------- Header state + scroll progress ---------- */
const header = document.querySelector(".site-header");
const bar = document.querySelector(".progress");
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (header) header.classList.toggle("scrolled", scrollY > 8);
    ticking = false;
  });
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* ---------- Headline: word-by-word reveal ---------- */
document.querySelectorAll(".headline .w").forEach((w, i) => w.style.setProperty("--wi", i));
requestAnimationFrame(() => document.querySelector(".headline")?.classList.add("in"));

/* ---------- Count-up ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion || !target) { el.textContent = target; return; }
  const start = performance.now(), dur = 1200;
  const step = (t) => {
    const k = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  el.textContent = 0;
  requestAnimationFrame(step);
}

/* ---------- Entrance reveals ---------- */
const revealables = document.querySelectorAll("[data-anim], .process li");
const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    if (e.target.classList.contains("hero-stage")) startChat();
    io.unobserve(e.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
revealables.forEach((el) => io ? io.observe(el) : el.classList.add("in"));
if (!io) startChat();

/* ---------- Hero: chat that plays out ---------- */
const script = [
  ["in", "Hi! Can I book a check-up for Saturday morning?"],
  ["out", "Of course. Dr. Mir has 10:30 and 11:15 free. Which works for you?"],
  ["in", "10:30 please"],
  ["out", "Booked ✓ You'll get a reminder on Friday evening."]
];
let chatStarted = false;
function startChat() {
  if (chatStarted) return;
  chatStarted = true;
  const box = document.getElementById("hero-chat");
  if (!box) return;
  if (reduceMotion) {
    script.forEach(([who, text]) => box.append(bubble(who, text)));
    return;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    while (true) {
      box.innerHTML = "";
      await wait(700);
      for (const [who, text] of script) {
        if (who === "out") {
          const t = document.createElement("div");
          t.className = "msg msg-out typing";
          t.innerHTML = "<i></i><i></i><i></i>";
          box.append(t);
          await wait(1100);
          t.replaceWith(bubble(who, text));
        } else {
          box.append(bubble(who, text));
        }
        await wait(1300);
      }
      await wait(4000);
    }
  })();
}
function bubble(who, text) {
  const b = document.createElement("div");
  b.className = `msg msg-${who}`;
  b.textContent = text;
  return b;
}

/* ---------- Hero: gentle pointer parallax ---------- */
const stage = document.querySelector(".hero-stage");
if (stage && finePointer && !reduceMotion) {
  const layers = stage.querySelectorAll("[data-depth]");
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach((l) => {
      const d = Number(l.dataset.depth);
      l.style.setProperty("--tx", `${(x * 18 * d).toFixed(1)}px`);
      l.style.setProperty("--ty", `${(y * 14 * d).toFixed(1)}px`);
    });
  });
  stage.addEventListener("pointerleave", () => layers.forEach((l) => { l.style.setProperty("--tx", "0px"); l.style.setProperty("--ty", "0px"); }));
}

/* ---------- Card spotlight follows the pointer ---------- */
if (finePointer) {
  document.querySelectorAll(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Support flow: scroll story ---------- */
const flowSteps = document.querySelectorAll(".flow-steps li");
const events = document.querySelectorAll(".flow-visual .event");
const rail = document.querySelector(".device-body");
function setFlow(n) {
  flowSteps.forEach((s, i) => s.classList.toggle("active", i === n));
  events.forEach((ev, i) => {
    ev.classList.toggle("reached", i <= n);
    ev.classList.toggle("current", i === n);
  });
  if (rail) rail.style.setProperty("--flow", (n / (events.length - 1)).toFixed(3));
}
if (flowSteps.length) {
  setFlow(0);
  if ("IntersectionObserver" in window) {
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setFlow(Number(e.target.dataset.step)); });
    }, { rootMargin: matchMedia("(max-width: 760px)").matches ? "-64% 0px -26% 0px" : "-45% 0px -45% 0px" });
    flowSteps.forEach((s) => fio.observe(s));
  }
}

/* ---------- Enquiry: three-step flow ---------- */
const ENDPOINT = "https://kavriqon-enquiries.dawarqay.workers.dev/submit";
const form = document.getElementById("enquiry-form");
if (form) {
  const steps = [...form.querySelectorAll(".step")];
  const marks = [...form.querySelectorAll(".stepper li")];
  const fill = document.getElementById("step-fill");
  const back = document.getElementById("step-back");
  const next = document.getElementById("step-next");
  const send = document.getElementById("step-send");
  const statusEl = document.getElementById("form-status");
  const msg = form.elements.message;
  const count = document.getElementById("msg-count");
  let current = 0;

  msg.addEventListener("input", () => { count.textContent = msg.value.trim().length; });

  function show(i, dir = 1) {
    steps.forEach((s, k) => {
      const on = k === i;
      s.hidden = !on;
      s.classList.toggle("active", on && dir > 0);
      s.classList.toggle("back", on && dir < 0);
    });
    marks.forEach((m, k) => {
      m.classList.toggle("active", k === i);
      m.classList.toggle("done", k < i);
      if (k === i) m.setAttribute("aria-current", "step"); else m.removeAttribute("aria-current");
    });
    if (fill) fill.style.width = `${Math.min(100, ((i + 1) / 3) * 100)}%`;
    back.hidden = i === 0 || i > 2;
    next.hidden = i >= 2;
    send.hidden = i !== 2;
    current = i;
    statusEl.textContent = "";
    statusEl.className = "form-status";
  }

  function validStep(i) {
    const fields = [...steps[i].querySelectorAll("input, textarea")];
    for (const f of fields) {
      f.removeAttribute("aria-invalid");
      if (!f.checkValidity()) {
        if (f.type !== "radio") f.setAttribute("aria-invalid", "true");
        statusEl.className = "form-status error";
        statusEl.textContent = i === 0 ? "Choose one option to continue." :
          i === 1 ? "Tell us a little more, at least 10 characters." :
          f.name === "email" ? "Please enter a valid email address." : "Please fill in your name and email.";
        (f.type === "radio" ? steps[i].querySelector("input") : f).focus();
        return false;
      }
    }
    return true;
  }

  const firstField = (i) => steps[i].querySelector("textarea, input:not([type=radio])");

  next.addEventListener("click", () => {
    if (!validStep(current)) return;
    show(current + 1, 1);
    firstField(current)?.focus({ preventScroll: true });
  });
  back.addEventListener("click", () => show(current - 1, -1));

  // Choosing an option moves you straight on
  form.querySelectorAll('input[name="service"]').forEach((r) => r.addEventListener("change", () => {
    setTimeout(() => { if (current === 0) { show(1, 1); firstField(1)?.focus({ preventScroll: true }); } }, reduceMotion ? 0 : 280);
  }));

  // Enter in a text input = Continue, not submit, on steps 1–2
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < 2) { e.preventDefault(); next.click(); }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const honeypot = form.querySelector('[name="_honey"]');
    if (honeypot && honeypot.value) return;
    if (!validStep(2)) return;

    const service = form.querySelector('input[name="service"]:checked');
    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: service ? service.value : "",
      message: msg.value.trim(),
      website: honeypot ? honeypot.value.trim() : ""
    };

    const label = send.querySelector(".submit-text");
    send.disabled = true; back.disabled = true;
    label.textContent = "Sending…";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!(res.ok && result.success === true)) throw new Error(result.message || "Not sent");
      form.reset();
      form.classList.add("sent");
      show(3, 1);
      steps[3].focus();
    } catch (err) {
      statusEl.className = "form-status error";
      statusEl.textContent = "We couldn't send that just now. Please try again in a moment, or reach us on LinkedIn.";
    } finally {
      send.disabled = false; back.disabled = false;
      label.textContent = "Send enquiry";
    }
  });

  show(0);
}
