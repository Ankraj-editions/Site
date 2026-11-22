/* ANKRAJ ÉDITIONS — animations de la page d'accueil (index.html uniquement) */

/* ---------- Apparitions, livre qui tourne, pages, cartes horizontales ---------- */
(function () {
  function init(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* apparitions */
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".akh-rv").forEach(function (el) {
      io.observe(el);
    });
    /* manifeste : découpe en mots */
    var man = root.querySelector("[data-words]"),
      words = [];
    if (man) {
      var txt = man.textContent.trim().split(/\s+/);
      man.innerHTML = "";
      txt.forEach(function (w, i) {
        var s = document.createElement("span");
        s.className = "w";
        s.textContent = w;
        man.appendChild(s);
        if (i < txt.length - 1) man.appendChild(document.createTextNode(" "));
        words.push(s);
      });
    }
    /* défilement : parallaxe, manifeste, soleil du soir */
    var par = root.querySelectorAll("[data-par]"),
      endSun = root.querySelector(".akh-end__sun"),
      endSec = root.querySelector(".akh-end"),
      ticking = false;
    function onScroll() {
      var y = window.scrollY,
        vh = window.innerHeight;
      if (man) {
        var r = man.getBoundingClientRect(),
          p = (vh * 0.82 - r.top) / (r.height + vh * 0.35);
        p = Math.max(0, Math.min(1, p));
        var n = Math.round(p * words.length);
        for (var i = 0; i < words.length; i++)
          words[i].classList.toggle("on", reduce || i < n);
      }
      if (endSun && endSec && !reduce) {
        var e = endSec.getBoundingClientRect(),
          q = Math.max(0, Math.min(1, (vh - e.top) / (e.height + vh)));
        endSun.style.setProperty("--sy", (1 - q) * 90 + "px");
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", onScroll);
    onScroll();
    /* scènes épinglées : récit du livre, valeurs, cultures */
    function prog(el) {
      var r = el.getBoundingClientRect(),
        vh = window.innerHeight;
      return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
    }
    function sm(a, b, v) {
      var t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }
    var story = root.querySelector("[data-story]"),
      cov = root.querySelector("[data-cov]"),
      pgs = root.querySelectorAll("[data-pg]"),
      mainPg = root.querySelector("[data-main]"),
      caps = root.querySelectorAll("[data-cap]"),
      bar = root.querySelector("[data-bar]");
    var hz = root.querySelector("[data-hz]"),
      track = root.querySelector("[data-track]");
    var leaves = root.querySelectorAll("[data-leaf]"),
      stage = root.querySelector("[data-stage]"),
      land = root.querySelector("[data-land]"),
      shint = root.querySelector("[data-scrollhint]");
    if (stage) {
      stage.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
      stage.addEventListener("dragstart", function (e) {
        e.preventDefault();
      });
    }
    var sTick = false;
    function scenes() {
      sTick = false;
      if (reduce) return;
      var vh = window.innerHeight,
        vw = window.innerWidth;
      if (story) {
        var p = prog(story);
        if (bar) bar.style.transform = "scaleX(" + p + ")";
        var ci = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.8 ? 2 : 3;
        caps.forEach(function (c, i) {
          c.classList.toggle("is-on", i === ci);
          c.classList.toggle("is-past", i < ci);
        });
        var a = sm(0.04, 0.2, p),
          fan = sm(0.22, 0.32, p) * (1 - sm(0.34, 0.4, p)),
          open = sm(0.38, 0.5, p);
        var mob = vw < 990,
          spread = mob ? 0.36 : 0.64;
        if (stage) {
          var sc = 1 - (mob ? 0.3 : 0.28) * open;
          stage.style.transform =
            "translate3d(" + open * 50 * sc + "%,0,0) scale(" + sc + ")";
        }
        if (cov) {
          var ca = -16 * (1 - a) - 164 * open;
          cov.style.transform =
            "perspective(2000px) rotateY(" +
            ca +
            "deg) rotateX(" +
            4 * (1 - a) +
            "deg)";
          cov.style.zIndex = ca < -90 ? 5 : 60;
        }
        pgs.forEach(function (el, i) {
          var n = pgs.length,
            o = i - (n - 1) / 2;
          el.style.transform =
            "translate3d(" +
            o * spread * 100 * fan +
            "%," +
            Math.abs(o) * 6 * fan +
            "%,0) rotate(" +
            o * 7 * fan +
            "deg)";
          el.style.opacity = (
            sm(0.2, 0.26, p) *
            (1 - sm(0.36, 0.42, p))
          ).toFixed(3);
        });
        var deck = Array.prototype.slice.call(leaves);
        if (mainPg) deck.push(mainPg);
        var N = deck.length,
          fd = 0.1,
          gap = N > 1 ? (0.32 - fd) / (N - 1) : 0;
        deck.forEach(function (el, i) {
          var f = Math.max(0, Math.min(1, (p - 0.5 - i * gap) / fd)),
            e = 1 - Math.pow(1 - f, 3),
            last = i === N - 1,
            sd = i % 2 ? 1 : -1;
          var r0 = sd * (14 + i * 3),
            r1 = last ? 0 : sd * (1.2 + i * 0.4);
          el.style.transform =
            "translate3d(" +
            (1 - e) * (mob ? 110 : 150) +
            "%," +
            (1 - e) * sd * -35 +
            "%,0) rotate(" +
            (r0 + (r1 - r0) * e) +
            "deg)";
          el.style.zIndex = 10 + i;
          el.style.opacity = f > 0 && open > 0.6 ? 1 : 0;
        });
        if (land) {
          land.style.opacity = (1 - sm(0.08, 0.22, p)).toFixed(3);
          par.forEach(function (el) {
            el.style.transform =
              "translate3d(0," +
              p * vh * 1.2 * parseFloat(el.dataset.par) +
              "px,0)";
          });
        }
        if (shint) shint.style.opacity = (1 - sm(0, 0.04, p)).toFixed(3);
      }
      if (hz && track) {
        var hp2 = prog(hz),
          dist = Math.max(0, track.scrollWidth - vw);
        track.style.transform = "translate3d(" + -hp2 * dist + "px,0,0)";
      }
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!sTick) {
          sTick = true;
          requestAnimationFrame(scenes);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", scenes);
    scenes();
    /* compteurs */
    var cio = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target,
            to = +el.dataset.count,
            t0 = null;
          if (reduce) {
            el.textContent = to;
            return;
          }
          function step(t) {
            if (!t0) t0 = t;
            var k = Math.min(1, (t - t0) / 1400);
            k = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(to * k);
            if (k < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    root.querySelectorAll("[data-count]").forEach(function (el) {
      cio.observe(el);
    });
  }
  function boot() {
    document.querySelectorAll(".akh").forEach(init);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("shopify:section:load", boot);
})();

/* ---------- Coloriage, bulles « Bonjour », soleil qui devient lune ---------- */
/* Ankraj — coloriage net, bonjour en toutes les langues, soleil qui devient lune */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function sm(a, b, v) {
    var t = Math.max(0, Math.min(1, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  function prog(el) {
    var r = el.getBoundingClientRect(),
      vh = window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
  }
  function hex(h) {
    return [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];
  }
  var GREEN = ["#4FAF68", "#79C287", "#3A9A5A", "#9CCB5A"],
    FLOWER = ["#F08FB0", "#F07A4A", "#F4B63C", "#E0558A", "#F59E5B", "#B98AE0"],
    BLUE = ["#3DB7DD", "#77CDEA"],
    BIRD = ["#5A4A3F", "#8A5A3B", "#A39C95", "#6E6862", "#7A5238"];
  function pick(a, i) {
    return a[i % a.length];
  }

  /* Analyse du dessin : chaque zone blanche fermée devient une région qu'on peut remplir */
  function analyse(img, maxW, dil) {
    var w = Math.min(maxW, img.naturalWidth || maxW),
      h = Math.round(
        ((img.naturalHeight || maxW * 1.42) * w) / (img.naturalWidth || maxW),
      );
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var x = c.getContext("2d");
    x.fillStyle = "#fff";
    x.fillRect(0, 0, w, h);
    x.drawImage(img, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h),
      p = d.data,
      n = w * h,
      lum = new Uint8Array(n),
      lab = new Int32Array(n),
      st = new Int32Array(n),
      R = [null],
      id = 0,
      TH = 165;
    for (var i = 0; i < n; i++)
      lum[i] = (p[i * 4] * 0.3 + p[i * 4 + 1] * 0.59 + p[i * 4 + 2] * 0.11) | 0;
    var blk = lum;
    if (dil) {
      /* referme les petits trous des traits pour que chaque zone reste fermée */
      blk = new Uint8Array(n);
      for (var q0 = 0; q0 < n; q0++) blk[q0] = lum[q0];
      for (var it = 0; it < dil; it++) {
        var nx = new Uint8Array(n);
        for (var q1 = 0; q1 < n; q1++) {
          var v = blk[q1];
          if (v >= TH) {
            var x1q = q1 % w;
            if (
              (x1q > 0 && blk[q1 - 1] < TH) ||
              (x1q < w - 1 && blk[q1 + 1] < TH) ||
              (q1 >= w && blk[q1 - w] < TH) ||
              (q1 < n - w && blk[q1 + w] < TH)
            )
              v = 0;
          }
          nx[q1] = v;
        }
        blk = nx;
      }
    }
    for (var s = 0; s < n; s++) {
      if (lab[s] || blk[s] < TH) continue;
      id++;
      var top = 0;
      st[top++] = s;
      lab[s] = id;
      var area = 0,
        sx = 0,
        sy = 0,
        x0 = w,
        x1 = 0,
        y0 = h,
        y1 = 0,
        edge = false;
      while (top) {
        var q = st[--top],
          qx = q % w,
          qy = (q / w) | 0;
        area++;
        sx += qx;
        sy += qy;
        if (qx < x0) x0 = qx;
        if (qx > x1) x1 = qx;
        if (qy < y0) y0 = qy;
        if (qy > y1) y1 = qy;
        if (!qx || !qy || qx == w - 1 || qy == h - 1) edge = true;
        var nb;
        if (qx > 0) {
          nb = q - 1;
          if (!lab[nb] && blk[nb] >= TH) {
            lab[nb] = id;
            st[top++] = nb;
          }
        }
        if (qx < w - 1) {
          nb = q + 1;
          if (!lab[nb] && blk[nb] >= TH) {
            lab[nb] = id;
            st[top++] = nb;
          }
        }
        if (qy > 0) {
          nb = q - w;
          if (!lab[nb] && blk[nb] >= TH) {
            lab[nb] = id;
            st[top++] = nb;
          }
        }
        if (qy < h - 1) {
          nb = q + w;
          if (!lab[nb] && blk[nb] >= TH) {
            lab[nb] = id;
            st[top++] = nb;
          }
        }
      }
      R.push({
        id: id,
        area: area,
        cx: sx / area / w,
        cy: sy / area / h,
        bw: (x1 - x0 + 1) / w,
        bh: (y1 - y0 + 1) / h,
        fill: area / ((x1 - x0 + 1) * (y1 - y0 + 1)),
        edge: edge,
      });
    }
    /* les pixels de trait prennent la région voisine, pour des bords nets sans halo blanc */
    var near = new Int32Array(n);
    for (var k = 0; k < n; k++) {
      if (lab[k]) {
        near[k] = lab[k];
        continue;
      }
      var kx = k % w,
        ky = (k / w) | 0,
        f = 0;
      for (var r2 = 1; r2 <= 2 + (dil || 0) && !f; r2++) {
        if (kx >= r2 && lab[k - r2]) f = lab[k - r2];
        else if (kx < w - r2 && lab[k + r2]) f = lab[k + r2];
        else if (ky >= r2 && lab[k - r2 * w]) f = lab[k - r2 * w];
        else if (ky < h - r2 && lab[k + r2 * w]) f = lab[k + r2 * w];
      }
      near[k] = f;
    }
    var bg = null;
    for (var j = 1; j < R.length; j++) {
      var rr = R[j];
      if (!rr.edge && (!bg || rr.area > bg.area)) bg = rr;
    }
    return {
      w: w,
      h: h,
      lum: lum,
      near: near,
      lab: lab,
      R: R,
      bg: bg ? bg.id : 0,
      base: p,
      min: Math.max(18, n * 0.00004),
    };
  }
  /* Couleurs « comme un enfant soigneux » : herbe verte en bas, feuilles vertes, fleurs vives, oiseau bleu, soleil jaune */
  function autoColors(A, mode, paint) {
    var C = {},
      R = A.R,
      kid = mode === "kid";
    for (var i = 1; i < R.length; i++) {
      var r = R[i];
      if (r.edge || r.area < A.min) continue;
      if (r.id === A.bg) {
        C[i] = "sky";
        continue;
      }
      var el = Math.max(r.bw / r.bh, r.bh / r.bw),
        leafy = el > 2.3 || r.fill < 0.42;
      if (r.cy < 0.17 && r.cx > 0.55 && r.bw < 0.12 && r.bh < 0.1)
        C[i] = "#F6C343";
      else if (r.cy > 0.85) C[i] = pick(GREEN, i);
      else if (!kid && r.cx > 0.48 && r.cy > 0.12 && r.cy < 0.44 && r.bw < 0.4)
        C[i] = pick(BIRD, i);
      else if (kid && r.cy < 0.36 && r.cx > 0.58) C[i] = "#FFFFFF";
      else if (leafy) C[i] = pick(GREEN, i);
      else C[i] = pick(FLOWER, i);
    }
    if (paint) {
      var nn = A.w * A.h;
      (paint.b || []).forEach(function (b) {
        for (var k = 1; k < R.length; k++) {
          var r = R[k];
          if (
            r.cx >= b[0] &&
            r.cx <= b[2] &&
            r.cy >= b[1] &&
            r.cy <= b[3] &&
            r.area <= b[5] * nn &&
            r.id !== A.bg
          )
            C[k] = b[4];
        }
      });
      (paint.p || []).forEach(function (q) {
        var g = A.lab[Math.floor(q[1] * A.h) * A.w + Math.floor(q[0] * A.w)];
        if (g && g !== A.bg) C[g] = q[2];
      });
    }
    return C;
  }
  function render(A, C, ctx, img) {
    var out = ctx.createImageData(A.w, A.h),
      o = out.data,
      p = A.base,
      n = A.w * A.h,
      cache = {};
    for (var i = 0; i < n; i++) {
      var g = A.near[i],
        col = g ? C[g] : null,
        cr = 255,
        cg = 255,
        cb = 255;
      if (col === "sky") {
        var t = ((i / A.w) | 0) / A.h;
        cr = 221 + (255 - 221) * t;
        cg = 240 + (246 - 240) * t;
        cb = 248 + (226 - 248) * t;
      } else if (col) {
        var v = cache[col] || (cache[col] = hex(col));
        cr = v[0];
        cg = v[1];
        cb = v[2];
      }
      o[i * 4] = (p[i * 4] * cr) / 255;
      o[i * 4 + 1] = (p[i * 4 + 1] * cg) / 255;
      o[i * 4 + 2] = (p[i * 4 + 2] * cb) / 255;
      o[i * 4 + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }
  function whenLoaded(img, fn) {
    if (!img) return;
    if (img.complete && img.naturalWidth) fn();
    else img.addEventListener("load", fn, { once: true });
  }

  function init(root) {
    if (root.dataset.ready2) return;
    root.dataset.ready2 = "1";
    var vh = function () {
      return window.innerHeight;
    };

    /* ---- 1. le colibri se colorie net, au crayon ---- */
    var story = root.querySelector("[data-story]"),
      main = root.querySelector("[data-main]"),
      cv = root.querySelector("[data-colored]"),
      cray = root.querySelector("[data-crayon]");
    var mainImg = main && main.querySelector("img"),
      storyReady = false;
    if (cv && mainImg) {
      mainImg.loading = "eager";
      whenLoaded(mainImg, function () {
        try {
          var pt = null;
          try {
            pt = JSON.parse(mainImg.getAttribute("data-paint") || "null");
          } catch (e) {}
          var A = analyse(mainImg, 760, 2);
          cv.width = A.w;
          cv.height = A.h;
          render(
            A,
            autoColors(A, mainImg.getAttribute("data-mode"), pt),
            cv.getContext("2d"),
          );
          storyReady = true;
          tick();
        } catch (e) {
          root.classList.add("akh-nocolor");
        }
      });
    }

    /* ---- 2. bonjour dans toutes les langues ---- */
    var hello = root.querySelector("[data-hello]"),
      bubs = root.querySelectorAll(".akh-bub");
    if (hello) {
      var hio = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              hello.classList.add("is-in");
              hio.disconnect();
            }
          });
        },
        { threshold: 0.25 },
      );
      hio.observe(hello);
      bubs.forEach(function (b) {
        b.addEventListener("click", function () {
          b.classList.remove("pop");
          void b.offsetWidth;
          b.classList.add("pop");
          b.classList.add("said");
        });
      });
      if (!reduce && window.matchMedia("(hover:hover)").matches) {
        hello.addEventListener("pointermove", function (e) {
          var r = hello.getBoundingClientRect();
          hello.style.setProperty(
            "--mx",
            ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
          );
          hello.style.setProperty(
            "--my",
            ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
          );
        });
      }
    }

    /* ---- 3. coloriage au toucher ---- */
    var fcv = root.querySelector("[data-fill]"),
      paper = root.querySelector("[data-paper]"),
      hint = root.querySelector("[data-hint]");
    var fimg = paper && paper.querySelector("img"),
      FA = null,
      FC = {},
      auto = {},
      color = "#2E9E5B";
    root.querySelectorAll(".akh-palette button").forEach(function (b) {
      b.addEventListener("click", function () {
        color = b.dataset.c;
        root.querySelectorAll(".akh-palette button").forEach(function (o) {
          o.setAttribute("aria-checked", String(o === b));
        });
      });
    });
    function redraw() {
      if (FA) render(FA, FC, fcv.getContext("2d"));
    }
    function regionAt(e) {
      var r = fcv.getBoundingClientRect(),
        x = Math.floor(((e.clientX - r.left) / r.width) * FA.w),
        y = Math.floor(((e.clientY - r.top) / r.height) * FA.h);
      if (x < 0 || y < 0 || x >= FA.w || y >= FA.h) return 0;
      return FA.near[y * FA.w + x];
    }
    function ripple(e, c) {
      var r = paper.getBoundingClientRect(),
        s = document.createElement("span");
      s.className = "akh-ripple";
      s.style.left = e.clientX - r.left + "px";
      s.style.top = e.clientY - r.top + "px";
      s.style.background = c;
      paper.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 700);
    }
    if (fcv && fimg) {
      fimg.loading = "eager";
      whenLoaded(fimg, function () {
        try {
          FA = analyse(fimg, 900);
          fcv.width = FA.w;
          fcv.height = FA.h;
          auto = autoColors(FA);
          FC = {};
          redraw();
          paper.classList.add("is-ready");
        } catch (e) {}
      });
      fcv.addEventListener("click", function (e) {
        if (!FA) return;
        var g = regionAt(e);
        if (!g || FA.R[g].edge) return;
        FC[g] = g === FA.bg && color === "#F2E8D5" ? "sky" : color;
        redraw();
        ripple(e, color);
        if (hint) hint.classList.add("off");
      });
      var magic = root.querySelector("[data-magic]"),
        reset = root.querySelector("[data-reset]"),
        running = false;
      function colorAll() {
        if (!FA || running) return;
        running = true;
        if (hint) hint.classList.add("off");
        var ids = Object.keys(auto)
            .filter(function (k) {
              return !FC[k];
            })
            .sort(function (a, b) {
              return FA.R[b].cy - FA.R[a].cy;
            }),
          i = 0;
        (function step() {
          var n = Math.max(1, Math.ceil(ids.length / 28));
          for (var k = 0; k < n && i < ids.length; k++, i++)
            FC[ids[i]] = auto[ids[i]];
          redraw();
          if (i < ids.length) setTimeout(step, reduce ? 0 : 45);
          else running = false;
        })();
      }
      if (magic) magic.addEventListener("click", colorAll);
      if (reset)
        reset.addEventListener("click", function () {
          FC = {};
          redraw();
        });
      /* petite démonstration : trois zones se remplissent quand on arrive */
      var dio = new IntersectionObserver(
        function (es) {
          if (!es[0].isIntersecting || !FA || reduce) return;
          dio.disconnect();
          var big = Object.keys(auto)
            .filter(function (k) {
              return k != FA.bg;
            })
            .sort(function (a, b) {
              return FA.R[b].area - FA.R[a].area;
            })
            .slice(0, 3);
          big.forEach(function (k, j) {
            setTimeout(
              function () {
                if (!FC[k]) {
                  FC[k] = auto[k];
                  redraw();
                }
              },
              600 + j * 450,
            );
          });
        },
        { threshold: 0.55 },
      );
      whenLoaded(fimg, function () {
        setTimeout(function () {
          dio.observe(paper);
        }, 50);
      });
    }

    /* ---- 4. le bouton soleil qui devient lune ---- */
    var orb = root.querySelector("[data-orb]");
    var rays = orb && orb.querySelector("[data-rays]"),
      disc = orb && orb.querySelector("[data-disc]"),
      shade = orb && orb.querySelector("[data-shade]"),
      stars = orb && orb.querySelector("[data-stars]");
    var SUN = hex("#F4B63C"),
      SET = hex("#E8833A"),
      MOON = hex("#F2E8D5");
    function mix(a, b, t) {
      return (
        "rgb(" +
        Math.round(a[0] + (b[0] - a[0]) * t) +
        "," +
        Math.round(a[1] + (b[1] - a[1]) * t) +
        "," +
        Math.round(a[2] + (b[2] - a[2]) * t) +
        ")"
      );
    }

    var ticking = false;
    function tick() {
      ticking = false;
      var h = vh();
      if (story && cv && storyReady && !reduce) {
        var p = prog(story),
          k = sm(0.84, 0.98, p),
          edge = 100 - k * 135;
        cv.style.clipPath =
          "polygon(0% 100%, 0% " +
          (edge + 18) +
          "%, 100% " +
          edge +
          "%, 100% 100%)";
        if (cray) {
          var on = k > 0.01 && k < 0.99;
          cray.style.opacity = on ? 1 : 0;
          var cx = 50 + Math.sin(k * 38) * 40,
            cy = edge + 18 * (1 - cx / 100);
          cray.style.left = cx + "%";
          cray.style.top = Math.max(0, Math.min(100, cy)) + "%";
        }
      }
      if (hello && !reduce) {
        var r = hello.getBoundingClientRect(),
          q = (h - r.top) / (r.height + h);
        hello.style.setProperty("--sy", (q - 0.5).toFixed(3));
      }
      if (orb) {
        var doc = document.documentElement,
          rr = root.getBoundingClientRect(),
          m = Math.max(0, Math.min(1, -rr.top / Math.max(1, rr.height - h)));
        var dusk = sm(0.35, 0.7, m),
          night = sm(0.62, 0.92, m);
        if (rays) {
          rays.style.opacity = (1 - sm(0.5, 0.75, m)).toFixed(3);
          rays.style.transform = "rotate(" + m * 240 + "deg)";
        }
        if (disc)
          disc.setAttribute(
            "fill",
            night > 0 ? mix(SET, MOON, night) : mix(SUN, SET, dusk),
          );
        if (shade) shade.setAttribute("cx", (46 - 17 * night).toFixed(2));
        if (stars) stars.setAttribute("opacity", sm(0.8, 0.97, m).toFixed(3));
        orb.classList.toggle("is-night", night > 0.5);
        orb.classList.toggle("is-shown", rr.top < -h * 0.6);
      }
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", tick);
    tick();
  }
  function boot() {
    document.querySelectorAll(".akh").forEach(init);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("shopify:section:load", boot);
})();

/* ---------- Titres ligne par ligne et effets de défilement ---------- */
(function () {
  function init(root) {
    if (root.dataset.fx) return;
    root.dataset.fx = "1";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* titres : une ligne après l'autre */
    var up = [];
    root.querySelectorAll(".akh-h2:not(.akh-h2--giant)").forEach(function (h) {
      if (h.closest("[data-story]")) return;
      var parts = h.innerHTML.split(/<br\s*\/?>/i);
      h.innerHTML = parts
        .map(function (t) {
          return '<span class="akh-ln"><span>' + t + "</span></span>";
        })
        .join("");
      up.push(h);
    });
    /* images : dévoilement */
    /* (l'observateur regarde le parent : un élément masqué par clip-path n'est jamais « visible ») */
    var groups = [];
    root.querySelectorAll(".akh-bento__grid").forEach(function (g) {
      var kids = g.querySelectorAll(".akh-tile--photo");
      kids.forEach(function (el, i) {
        el.classList.add("akh-clip");
        el.style.transitionDelay = Math.min(i, 6) * 0.09 + "s";
      });
      groups.push([g, kids]);
    });
    if (reduce) {
      up.forEach(function (el) {
        el.classList.add("is-up");
      });
      groups.forEach(function (x) {
        x[1].forEach(function (k) {
          k.classList.add("is-up");
        });
      });
    } else {
      var io = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            var t = e.target;
            if (t.__kids)
              t.__kids.forEach(function (k) {
                k.classList.add("is-up");
              });
            else t.classList.add("is-up");
            io.unobserve(t);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      up.forEach(function (el) {
        io.observe(el);
      });
      groups.forEach(function (x) {
        x[0].__kids = x[1];
        io.observe(x[0]);
      });
    }
  }
  function boot() {
    document.querySelectorAll(".akh").forEach(init);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("shopify:section:load", boot);
})();

/* ---------- Invitation à faire défiler et carte « Ajouter au panier » ---------- */
/* Inviter à faire défiler : le livre rebondit au début, puis un rappel apparaît après 3 s sans défilement */
(function () {
  var de = document.documentElement,
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var story = document.querySelector("[data-story]");
  if (!story) return;
  var pill = document.createElement("button");
  pill.type = "button";
  pill.className = "akn-pill";
  pill.setAttribute("aria-label", "Faire défiler pour découvrir la suite");
  pill.innerHTML =
    '<span class="akn-pill__mouse" aria-hidden="true"></span><span><b>Faites défiler</b><small>pour ouvrir le livre</small></span><span class="akn-pill__chev" aria-hidden="true"><i></i><i></i></span>';
  document.body.appendChild(pill);
  var idleT = null,
    hopT = null,
    lastY = window.scrollY,
    scrolled = false;
  function hop() {
    if (reduce) return;
    de.classList.remove("akn-hop");
    void de.offsetWidth;
    de.classList.add("akn-hop");
    clearTimeout(hopT);
    hopT = setTimeout(function () {
      de.classList.remove("akn-hop");
    }, 1700);
  }
  function blocked() {
    return (
      de.classList.contains("akh-intro-on") ||
      document.body.classList.contains("menu-open") ||
      document.querySelector("dialog[open]")
    );
  }
  function nearEnd() {
    return (
      window.scrollY + window.innerHeight >
      document.documentElement.scrollHeight - window.innerHeight * 1.2
    );
  }
  function label() {
    /* le message change selon l'endroit */
    var r = story.getBoundingClientRect(),
      inStory = r.top <= 1 && r.bottom > window.innerHeight * 0.5;
    pill.querySelector("small").textContent =
      window.scrollY < 40
        ? "pour ouvrir le livre"
        : inStory
          ? "pour tourner les pages"
          : "pour découvrir la suite";
  }
  var shownOnce = false;
  function show() {
    if (shownOnce) return;
    if (blocked() || nearEnd()) {
      arm();
      return;
    }
    shownOnce = true;
    label();
    pill.classList.add("is-on");
    if (story.getBoundingClientRect().bottom > 0) hop();
  }
  function hide() {
    pill.classList.remove("is-on");
  }
  function arm() {
    if (shownOnce) return;
    clearTimeout(idleT);
    idleT = setTimeout(show, 4000);
  }
  window.addEventListener(
    "scroll",
    function () {
      if (Math.abs(window.scrollY - lastY) > 4) {
        lastY = window.scrollY;
        scrolled = true;
        hide();
      }
    },
    { passive: true },
  );
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
    window.addEventListener(
      ev,
      function (e) {
        if (e.target.closest && e.target.closest(".akn-pill")) return;
        arm();
      },
      { passive: true },
    );
  });
  pill.addEventListener("click", function () {
    hide();
    window.scrollBy({
      top: Math.round(window.innerHeight * 0.85),
      behavior: reduce ? "auto" : "smooth",
    });
  });
  /* au début : le livre rebondit deux fois pour attirer l'œil, puis toutes les 5 s tant qu'on n'a pas défilé */
  function start() {
    if (de.classList.contains("akh-intro-on")) {
      setTimeout(start, 400);
      return;
    }
    setTimeout(hop, 900);
    setTimeout(function () {
      /* sur ordinateur, on montre tout de suite qu'il faut défiler ; sur téléphone, c'est instinctif */
      if (
        window.scrollY < 40 &&
        window.matchMedia("(min-width: 990px)").matches
      )
        show();
      else arm();
    }, 1400);
  }
  start();
})();

/* Pendant le coloriage : petite carte « Acheter / Je l'offre » après 3 zones coloriées (ou « Colorier pour moi »), une fois par visite */
(function () {
  var card = document.querySelector("[data-akc]"),
    page =
      document.querySelector("[data-paper]") ||
      document.querySelector(".akh-play__page");
  if (!card || !page) return;
  page.appendChild(card);
  var fcv = document.querySelector("[data-fill]"),
    magic = document.querySelector("[data-magic]"),
    n = 0,
    shown = false;
  try {
    shown = !!sessionStorage.getItem("akc");
  } catch (e) {}
  function pop() {
    if (shown) return;
    shown = true;
    try {
      sessionStorage.setItem("akc", "1");
    } catch (e) {}
    card.classList.add("is-on");
    document.documentElement.classList.add("akc-on");
  }
  if (fcv)
    fcv.addEventListener("click", function () {
      n++;
      if (n === 3) setTimeout(pop, 800);
    });
  if (magic)
    magic.addEventListener("click", function () {
      setTimeout(pop, 2000);
    });
  card.querySelector(".akc__x").addEventListener("click", function () {
    card.classList.remove("is-on");
    document.documentElement.classList.remove("akc-on");
  });
})();
