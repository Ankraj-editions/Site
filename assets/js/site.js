/* Ankraj Éditions — comportements communs */
(function () {
  var AK = window.AK || {};
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 14. Suivi UTM : on garde la source de la visite pour la transmettre au paiement ---------- */
  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  try {
    var q = new URLSearchParams(location.search),
      got = {};
    UTM_KEYS.forEach(function (k) {
      if (q.get(k)) got[k] = q.get(k);
    });
    if (Object.keys(got).length)
      sessionStorage.setItem("akUtm", JSON.stringify(got));
  } catch (e) {}
  function withUtm(url) {
    try {
      var u = new URL(url),
        s = JSON.parse(sessionStorage.getItem("akUtm") || "{}");
      Object.keys(s).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, s[k]);
      });
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  /* ---------- Mode « avant la sortie » (AK.venteOuverte = false) ----------
     Tous les boutons d'achat ouvrent le formulaire « Me prévenir de la sortie ». */
  var attente = AK.venteOuverte === false;
  if (attente) {
    document.documentElement.classList.add("is-attente");
    var dlgWait = $("#dlg-attente");
    $$("[data-add],[data-buy],[data-checkout]").forEach(function (b) {
      b.textContent = "Me prévenir de la sortie";
      b.removeAttribute("target");
    });
    $$("[data-ann-attente]").forEach(function (a) {
      a.hidden = false;
    });
    var ann0 = $(".ann [data-ann-attente]");
    if (ann0) ann0.classList.add("is-on");
    $$("[data-ann-vente]").forEach(function (a) {
      a.remove();
    });
    document.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest(
          "[data-add],[data-buy],[data-checkout],[data-attente-open]",
        );
        if (!b) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (dlgWait && dlgWait.showModal) {
          dlgWait.showModal();
          var i = $("input[type=email]", dlgWait);
          if (i) i.focus();
        }
      },
      true,
    );
    if (dlgWait)
      dlgWait.addEventListener("click", function (e) {
        if (e.target === dlgWait || e.target.closest("[data-close]"))
          dlgWait.close();
      });
  }

  /* ---------- Liens d'achat ---------- */
  var dlg = $("#dlg-soon");
  $$("[data-buy]").forEach(function (a) {
    var kind = a.getAttribute("data-buy"),
      url = kind === "standard" ? AK.amazonStandard : AK.stripePremium;
    if (url) {
      a.href = withUtm(url);
      if (kind === "standard") {
        a.target = "_blank";
        a.rel = "noopener";
      }
    } else
      a.addEventListener("click", function (e) {
        if (!dlg || !dlg.showModal) return;
        e.preventDefault();
        var t = $("[data-soon-what]", dlg);
        if (t)
          t.textContent =
            kind === "standard"
              ? "L'édition standard arrive très bientôt sur Amazon."
              : "Le paiement en ligne de l'édition premium ouvre très bientôt.";
        dlg.showModal();
      });
  });
  if (dlg) {
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
  }
  /* ---------- Prix : écrits depuis config.js, ou masqués (afficherPrix: false) ---------- */
  if (AK.afficherPrix === false) {
    document.documentElement.classList.add("is-sans-prix");
  } else {
    $$('[data-price="premium"]').forEach(function (el) {
      if (AK.prixPremium) el.textContent = AK.prixPremium;
    });
    $$('[data-price="standard"]').forEach(function (el) {
      if (AK.prixStandard) el.textContent = AK.prixStandard;
    });
  }

  /* ---------- Bandeau d'annonce qui alterne ---------- */
  var ann = $$(".ann a");
  if (ann.length > 1 && !reduce) {
    var ai = 0;
    setInterval(function () {
      var cur = ann[ai];
      cur.classList.remove("is-on");
      cur.classList.add("is-out");
      setTimeout(function () {
        cur.classList.remove("is-out");
      }, 700);
      ai = (ai + 1) % ann.length;
      ann[ai].classList.add("is-on");
    }, 4000);
  }

  /* ---------- 11. En-tête : se cache en descendant, revient en remontant ---------- */
  var hd = $(".hd"),
    lastY = window.scrollY,
    ticking = false,
    top = $(".fab--top");
  function onScroll() {
    var y = window.scrollY;
    if (hd) {
      if (
        y > 140 &&
        y > lastY + 4 &&
        !document.body.classList.contains("menu-open")
      )
        hd.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 140) hd.classList.remove("is-hidden");
    }
    if (top) top.classList.toggle("is-on", y > window.innerHeight * 1.2);
    lastY = y;
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

  /* ---------- 4. Retour en haut ---------- */
  if (top)
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var s = $("#contenu");
      if (s)
        setTimeout(
          function () {
            s.focus({ preventScroll: true });
          },
          reduce ? 0 : 700,
        );
    });

  /* ---------- 5. Menu plein écran ---------- */
  var mbtn = $(".menu-btn"),
    fsm = $(".fsm");
  function setMenu(open) {
    if (!fsm) return;
    fsm.classList.toggle("is-open", open);
    mbtn.setAttribute("aria-expanded", open);
    fsm.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open)
      setTimeout(function () {
        var f = $(".fsm__close");
        if (f) f.focus();
      }, 60);
    else mbtn.focus();
  }
  if (mbtn)
    mbtn.addEventListener("click", function () {
      setMenu(true);
    });
  if (fsm)
    fsm.addEventListener("click", function (e) {
      if (e.target.closest(".fsm__close,nav a")) setMenu(false);
    });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (fsm && fsm.classList.contains("is-open")) setMenu(false);
      var cm = $(".cmenu.is-open");
      if (cm) toggleContact(false);
    }
  });

  /* ---------- Une page, un monde : la couleur suit le dessin ---------- */
  var mondes = $("[data-mondes]");
  if (mondes && !reduce) {
    var items = $$(".monde", mondes),
      figs = $$(".mondes__stage figure", mondes),
      dots = $$(".mondes__dots i", mondes),
      bg = $(".mondes__bg", mondes),
      cur = -1;
    function setM(i) {
      if (i === cur) return;
      cur = i;
      items.forEach(function (el, k) {
        el.classList.toggle("is-on", k === i);
      });
      figs.forEach(function (el, k) {
        el.classList.toggle("is-on", k === i);
        el.classList.toggle("is-past", k < i);
      });
      dots.forEach(function (el, k) {
        el.classList.toggle("is-on", k === i);
      });
      bg.style.backgroundColor = items[i].getAttribute("data-color");
    }
    function onM() {
      var r = mondes.getBoundingClientRect(),
        span = mondes.offsetHeight - window.innerHeight;
      var p = Math.min(0.999, Math.max(0, -r.top / (span || 1)));
      setM(Math.floor(p * items.length));
    }
    window.addEventListener(
      "scroll",
      function () {
        requestAnimationFrame(onM);
      },
      { passive: true },
    );
    onM();
  }

  /* ---------- Barré → remplacé ---------- */
  var rows = $$(".choix__row");
  if (rows.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    rows.forEach(function (r) {
      io.observe(r);
    });
  } else
    rows.forEach(function (r) {
      r.classList.add("is-in");
    });

  /* ---------- 20. Contact flottant ---------- */
  var cbtn = $(".fab--contact"),
    cmenu = $(".cmenu");
  function toggleContact(open) {
    if (!cmenu) return;
    cmenu.classList.toggle("is-open", open);
    cbtn.setAttribute("aria-expanded", open);
  }
  if (cmenu) {
    var mail = $('[data-c="mail"]', cmenu),
      ig = $('[data-c="ig"]', cmenu),
      wa = $('[data-c="wa"]', cmenu);
    if (mail && AK.email) mail.href = "mailto:" + AK.email;
    if (ig) {
      if (AK.instagram) ig.href = AK.instagram;
      else ig.remove();
    }
    if (wa) {
      if (AK.whatsapp) wa.href = AK.whatsapp;
      else wa.remove();
    }
    cbtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleContact(!cmenu.classList.contains("is-open"));
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".cmenu")) toggleContact(false);
    });
  }
  $$("[data-email]").forEach(function (a) {
    if (AK.email) {
      a.href = "mailto:" + AK.email;
      if (!a.textContent.trim()) a.textContent = AK.email;
    }
  });
  $$("[data-ig]").forEach(function (a) {
    if (AK.instagram) a.href = AK.instagram;
    else a.closest("li") ? a.closest("li").remove() : a.remove();
  });

  /* ---------- 19. FAQ : ouverture animée ---------- */
  $$(".qa").forEach(function (d) {
    var sum = $("summary", d),
      body = $(".qa__a", d);
    sum.addEventListener("click", function (e) {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        var h = body.scrollHeight;
        body.animate([{ height: h + "px" }, { height: "0px" }], {
          duration: 300,
          easing: "cubic-bezier(.2,.8,.2,1)",
        }).onfinish = function () {
          d.open = false;
        };
      } else {
        d.open = true;
        var h2 = body.scrollHeight;
        body.animate(
          [
            { height: "0px", opacity: 0 },
            { height: h2 + "px", opacity: 1 },
          ],
          { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      }
    });
  });

  /* ---------- 15/16. Formulaires : validation, envoi, message envoyé / erreur ---------- */
  $$("form[data-form]").forEach(function (f) {
    var kind = f.getAttribute("data-form"),
      endpoint = kind === "newsletter" ? AK.formNewsletter : AK.formContact;
    var ok = $(".notice--ok", f),
      err = $(".notice--err", f),
      info = $(".notice--info", f),
      btn = $("button[type=submit]", f);
    function show(n, msg) {
      [ok, err, info].forEach(function (x) {
        if (x) x.classList.remove("is-on");
      });
      if (n) {
        if (msg) $("span", n).textContent = msg;
        n.classList.add("is-on");
      }
    }
    $$("input,textarea", f).forEach(function (i) {
      i.addEventListener("input", function () {
        if (i.checkValidity()) i.classList.remove("is-bad");
        var fl = i.closest(".field");
        if (fl && i.checkValidity()) {
          fl.classList.remove("is-bad");
          var m = $(".field__err", fl);
          if (m) m.textContent = "";
        }
      });
    });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      show(null);
      var bad = null;
      $$("input,textarea", f).forEach(function (i) {
        if (i.type === "hidden" || i.name === "_gotcha") return;
        var fl = i.closest(".field"),
          m = fl && $(".field__err", fl);
        if (!i.checkValidity()) {
          bad = bad || i;
          if (fl) fl.classList.add("is-bad");
          else i.classList.add("is-bad");
          if (m)
            m.textContent = i.validity.valueMissing
              ? "Ce champ est obligatoire."
              : i.validity.typeMismatch
                ? "Cette adresse e-mail ne semble pas valide."
                : "Vérifiez ce champ.";
        }
      });
      if (bad) {
        show(
          err,
          !bad.closest(".field") && bad.type === "email"
            ? "Indiquez une adresse e-mail valide."
            : "Il manque une information : vérifiez les champs en rouge.",
        );
        bad.focus();
        return;
      }
      var enLigne = /netlify\.app$|ankrajeditions\.(com|fr)$/.test(
        location.hostname,
      );
      if (!endpoint || (endpoint === "netlify" && !enLigne)) {
        show(
          info,
          "Aperçu du site : ce formulaire sera branché à la mise en ligne. Rien n'a été envoyé.",
        );
        return;
      }
      btn.setAttribute("aria-busy", "true");
      var req =
        endpoint === "netlify"
          ? fetch("/", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams(new FormData(f)).toString(),
            })
          : fetch(endpoint, {
              method: "POST",
              body: new FormData(f),
              headers: { Accept: "application/json" },
            });
      req
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          show(
            ok,
            kind === "newsletter"
              ? f.getAttribute("name") === "attente"
                ? "C'est noté ! Vous serez prévenu·e dès la sortie de « Je Grandis »."
                : "C'est noté ! Vous serez prévenu·e dès la sortie du prochain livre."
              : "Merci, votre message est bien envoyé. Nous vous répondons sous 48 h.",
          );
          f.reset();
        })
        .catch(function () {
          show(
            err,
            "Oups, l'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous à " +
              (AK.email || "notre adresse e-mail") +
              ".",
          );
        })
        .then(function () {
          btn.removeAttribute("aria-busy");
        });
    });
  });

  /* ---------- 9. Partager (remplace « copier le lien ») ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var data = { title: document.title, url: location.href.split("#")[0] };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
        return;
      }
      if (navigator.clipboard)
        navigator.clipboard.writeText(data.url).then(function () {
          var t = b.querySelector("span");
          if (t) {
            var o = t.textContent;
            t.textContent = "Lien copié ✓";
            setTimeout(function () {
              t.textContent = o;
            }, 1800);
          }
        });
    });
  });

  /* ---------- Panier (gardé dans ce navigateur) ---------- */
  var cart = $("[data-cart]"),
    KEY = "akCart",
    toast = $("[data-toast]"),
    tt;
  function getQ() {
    try {
      return Math.max(0, parseInt(localStorage.getItem(KEY) || "0", 10) || 0);
    } catch (e) {
      return window.__akq || 0;
    }
  }
  function setQ(q) {
    q = Math.max(0, Math.min(20, q));
    window.__akq = q;
    try {
      localStorage.setItem(KEY, String(q));
    } catch (e) {}
    render();
  }
  function unit() {
    var t = (
      AK.prixPremium ||
      ($('[data-price="premium"]') || {}).textContent ||
      "29,90 €"
    )
      .replace(/[^\d,.]/g, "")
      .replace(",", ".");
    return parseFloat(t) || 29.9;
  }
  function eur(n) {
    return n.toFixed(2).replace(".", ",") + " €";
  }
  function render() {
    var q = getQ();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = q;
      el.hidden = !q;
    });
    $$("[data-cart-open]").forEach(function (b) {
      b.setAttribute(
        "aria-label",
        q
          ? "Ouvrir le panier, " + q + " article" + (q > 1 ? "s" : "")
          : "Ouvrir le panier",
      );
    });
    if (!cart) return;
    $("[data-cart-empty]", cart).hidden = !!q;
    $("[data-cart-full]", cart).hidden = !q;
    $("[data-cart-qty]", cart).textContent = q;
    $("[data-cart-total]", cart).textContent = eur(unit() * q);
    var n = $("[data-cart-qnote]", cart);
    n.hidden = q < 2;
    $("[data-cart-qty2]", cart).textContent = q;
  }
  function openCart(o) {
    if (!cart) return;
    cart.classList.toggle("is-open", o);
    cart.setAttribute("aria-hidden", !o);
    document.documentElement.classList.toggle("cart-on", o);
    if (o) {
      var x = $(".cart__x", cart);
      if (x)
        setTimeout(function () {
          x.focus();
        }, 50);
    }
  }
  function say(m) {
    if (!toast) return;
    toast.textContent = m;
    toast.classList.add("is-on");
    clearTimeout(tt);
    tt = setTimeout(function () {
      toast.classList.remove("is-on");
    }, 2200);
  }
  $$("[data-add]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setQ(getQ() + 1);
      var c = a.closest("[data-akc]");
      if (c) {
        c.classList.remove("is-on");
        document.documentElement.classList.remove("akc-on");
      }
      say("« Je Grandis » ajouté au panier ✓");
      setTimeout(function () {
        openCart(true);
      }, 250);
    });
  });
  $$("[data-cart-open]").forEach(function (b) {
    b.addEventListener("click", function () {
      openCart(true);
    });
  });
  if (cart) {
    cart.addEventListener("click", function (e) {
      if (e.target.closest("[data-cart-close]")) openCart(false);
      var d = e.target.closest("[data-qty]");
      if (d) setQ(getQ() + parseInt(d.getAttribute("data-qty"), 10));
      if (e.target.closest("[data-cart-remove]")) setQ(0);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && cart.classList.contains("is-open"))
        openCart(false);
    });
  }
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) render();
  });
  render();

  /* ---------- Année ---------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
