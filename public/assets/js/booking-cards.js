/*!
 * Booking cards micro-interactions.
 * Loaded by pelanggan/dashboard view (deferred). All motion respects
 * prefers-reduced-motion.
 */
(function () {
  "use strict";

  var prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Entrance reveal (staggered) ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var i = parseInt(el.getAttribute("data-idx") || "0", 10);
          el.style.transitionDelay = i * 70 + "ms";
          el.classList.add("is-visible");
          // Trigger price count-up for visible card
          animatePrice(el);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".booking-card").forEach(function (c) { io.observe(c); });
  } else {
    // Fallback: just show
    document.querySelectorAll(".booking-card").forEach(function (c) { c.classList.add("is-visible"); });
  }

  // ---------- Magnetic track links ----------
  if (!prefersReduce) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (x * 0.18) + "px, " + (y * 0.30) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  // ---------- Price count-up (optional, gated by reduced motion) ----------
  function animatePrice(card) {
    if (prefersReduce) return;
    var el = card.querySelector(".booking-price");
    if (!el) return;
    var raw = parseInt(el.getAttribute("data-price") || "0", 10);
    if (!isFinite(raw) || raw <= 0) return;

    // Set the "Rp" prefix as a static child so we only animate the number
    var text = el.textContent.trim(); // "Rp 2.000.000"
    var prefix = text.replace(/[\d.\s]+$/, "").trim(); // "Rp"
    el.textContent = prefix + " 0";
    var start = performance.now();
    var dur = 800;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      // ease expo
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      var cur = Math.round(raw * eased);
      el.textContent = prefix + " " + cur.toLocaleString("id-ID");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
