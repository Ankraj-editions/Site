/* Intro de la page d'accueil (une fois par visite) :
   les morceaux du logo Ankraj arrivent de partout en 3D et se regroupent, un reflet de lumière
   passe dessus, la signature de la maison apparaît, puis le rideau remonte (environ 3,5 s).
   Un clic ou « Passer » l'arrête. */
(function () {
  var de = document.documentElement,
    host = document.querySelector("[data-intro]");
  if (!host || !de.classList.contains("akh-intro-on")) return;
  var src = host.getAttribute("data-logo"),
    ended = false,
    started = false;
  function finish() {
    if (ended) return;
    ended = true;
    host.remove();
    de.classList.remove("akh-intro-on");
    de.classList.add("akh-intro-done");
  }
  if (!src) {
    finish();
    return;
  }
  try {
    sessionStorage.setItem("akhIntro", "1");
  } catch (e) {}
  host.innerHTML =
    '<div class="akx-bg"></div><div class="akx-stage"><div class="akx-logo">' +
    '<div class="akx-pieces"></div><img class="akx-whole" alt=""><span class="akx-shine"></span><span class="akx-shadow"></span></div>' +
    '<p class="akx-tag">Maison d’édition afro-caribéenne</p></div>' +
    '<button class="akx-skip" type="button">Passer</button>';
  host.querySelector(".akx-skip").addEventListener("click", function (e) {
    e.stopPropagation();
    finish();
  });
  host.addEventListener("click", finish);
  var logo = host.querySelector(".akx-logo"),
    wrap = host.querySelector(".akx-pieces"),
    whole = host.querySelector(".akx-whole");
  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }
  function start(ratio) {
    if (started || ended) return;
    started = true;
    logo.style.aspectRatio = ratio;
    var abs = 'url("' + new URL(src, location.href).href + '")',
      shine = host.querySelector(".akx-shine");
    shine.style.webkitMaskImage = abs;
    shine.style.maskImage = abs;
    whole.src = src;
    var mob = window.innerWidth < 750,
      C = mob ? 8 : 12,
      R = 3,
      pieces = [];
    for (var r = 0; r < R; r++) {
      for (var c = 0; c < C; c++) {
        var p = document.createElement("i");
        p.style.left = (c / C) * 100 + "%";
        p.style.top = (r / R) * 100 + "%";
        p.style.width = 100 / C + 0.2 + "%";
        p.style.height = 100 / R + 0.2 + "%";
        p.style.backgroundImage = 'url("' + src + '")';
        p.style.backgroundSize = C * 100 + "% " + R * 100 + "%";
        p.style.backgroundPosition =
          (c / (C - 1)) * 100 + "% " + (r / (R - 1)) * 100 + "%";
        p.style.transform =
          "translate3d(" +
          rnd(-55, 55) +
          "vw," +
          rnd(-40, 40) +
          "vh," +
          rnd(-800, 400) +
          "px) rotateX(" +
          rnd(-150, 150) +
          "deg) rotateY(" +
          rnd(-150, 150) +
          "deg) rotateZ(" +
          rnd(-80, 80) +
          "deg)";
        p.style.transitionDelay =
          ((c / C) * 0.45 + rnd(0, 0.12)).toFixed(2) + "s";
        wrap.appendChild(p);
        pieces.push(p);
      }
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        host.classList.add("is-go");
        pieces.forEach(function (p) {
          p.style.transform = "none";
        });
      });
    });
    /* les morceaux ont fini d'arriver vers 1,9 s : le logo net prend le relais, le reflet passe */
    setTimeout(function () {
      host.classList.add("is-whole");
    }, 2000);
    setTimeout(function () {
      host.classList.add("is-out");
    }, 3300);
    setTimeout(finish, 4000);
  }
  var img = new Image();
  img.onload = function () {
    start(img.naturalWidth / img.naturalHeight);
  };
  img.onerror = finish;
  img.src = src;
  /* sécurité : si le logo tarde à charger, on n'attend pas ; et l'intro ne dépasse jamais 5,5 s */
  setTimeout(function () {
    if (!started) finish();
  }, 1500);
  setTimeout(finish, 5500);
})();
