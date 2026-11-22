/* Fiche produit « Je Grandis » : feuilleteur des pages, galerie, choix d'édition. */
(function () {
  var root = document.querySelector("[data-akf]");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";
  var stage = root.querySelector("[data-akf-stage]"),
    pages = [].slice.call(root.querySelectorAll("[data-akf-page]")),
    n = pages.length;
  if (!n) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    active = -1,
    idle = true,
    t0 = null;
  stage.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  function layout(f) {
    /* f : index survolé (nombre à virgule), -1 = au repos */
    var w = pages[0].offsetWidth,
      mob = window.innerWidth < 750,
      step = w * (mob ? 0.15 : 0.22),
      tot = step * (n - 1),
      mid = (n - 1) / 2,
      c = f < 0 ? 0 : 1 - Math.abs(f - mid) / (mid || 1),
      gap = w * ((mob ? 0.14 : 0.16) + c * (mob ? 0.16 : 0.26));
    pages.forEach(function (p, i) {
      var d = f < 0 ? 99 : i - f,
        near = Math.max(0, 1 - Math.abs(d)),
        push =
          f < 0
            ? 0
            : d > 0
              ? gap * Math.min(1, d)
              : d < 0
                ? -gap * 0.3 * Math.min(1, -d)
                : 0;
      var x = -tot / 2 - w / 2 + i * step + push,
        z = -i * (mob ? 14 : 22),
        y = -w * 0.7 - near * w * 0.13,
        ry = -34,
        rz = 0;
      p.style.transform =
        "translate3d(" +
        x.toFixed(1) +
        "px," +
        y.toFixed(1) +
        "px," +
        z.toFixed(1) +
        "px) rotateY(" +
        ry.toFixed(1) +
        "deg) rotateZ(" +
        rz.toFixed(2) +
        "deg)";
      p.style.zIndex = String(100 - i);
      p.classList.toggle("is-up", near > 0.5);
    });
  }
  function pick(clientX) {
    var r = stage.getBoundingClientRect(),
      k = (clientX - r.left) / r.width;
    var f = Math.max(0, Math.min(n - 1, ((k - 0.12) / 0.76) * (n - 1)));
    return Math.round(f * 2) / 2;
  }
  function go(x) {
    idle = false;
    var f = pick(x);
    if (f !== active) {
      active = f;
      layout(f);
    }
  }
  stage.addEventListener("pointermove", function (e) {
    go(e.clientX);
  });
  stage.addEventListener("pointerdown", function (e) {
    go(e.clientX);
  });
  stage.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "mouse") {
      active = -1;
      layout(-1);
    }
  });
  stage.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches[0]) go(e.touches[0].clientX);
    },
    { passive: true },
  );
  /* au repos : une petite vague passe sur les pages pour inviter à feuilleter */
  function wave(ts) {
    if (!idle || reduce) return;
    if (!t0) t0 = ts;
    var c = (((ts - t0) / 1400) % (n + 3)) - 1.5;
    layout(c > -1 && c < n ? Math.round(c * 2) / 2 : -1);
    setTimeout(function () {
      requestAnimationFrame(wave);
    }, 260);
  }
  layout(-1);
  var io = new IntersectionObserver(
    function (es) {
      if (es[0].isIntersecting) {
        io.disconnect();
        setTimeout(function () {
          requestAnimationFrame(wave);
        }, 600);
      }
    },
    { threshold: 0.4 },
  );
  io.observe(stage);
  window.addEventListener("resize", function () {
    layout(active);
  });
})();

(function () {
  var g = document.querySelector("[data-gal]");
  if (g) {
    var main = g.querySelector(".gal__main img");
    g.querySelectorAll(".gal__thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        g.querySelectorAll(".gal__thumbs button").forEach(function (x) {
          x.removeAttribute("aria-current");
        });
        b.setAttribute("aria-current", "true");
        main.classList.add("is-swap");
        setTimeout(function () {
          main.src = b.dataset.src;
          main.alt = b.dataset.alt;
          main.classList.remove("is-swap");
        }, 220);
      });
    });
  }
  var ed = document.querySelector("[data-ed]");
  function upd() {
    var v = ed.querySelector("input:checked").value;
    document.querySelectorAll("[data-buy-main]").forEach(function (a) {
      a.hidden =
        (a.getAttribute("data-buy") || a.getAttribute("data-add")) !== v;
    });
  }
  if (ed) {
    ed.addEventListener("change", upd);
    if (location.hash === "#standard") {
      ed.querySelector("input[value=standard]").checked = true;
    }
    upd();
  }
})();
