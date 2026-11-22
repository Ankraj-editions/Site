(function () {
  var de = document.documentElement,
    host = document.querySelector("[data-intro]");
  if (!host || !de.classList.contains("akh-intro-on")) return;
  var src = host.getAttribute("data-logo"),
    ended = false;
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
    '<div class="akx-bg"></div><div class="akx-stage"><div class="akx-logo"><div class="akx-pieces"></div><img class="akx-shine" alt=""><span class="akx-shadow"></span></div>' +
    '<p class="akx-tag">Livres pour enfants</p></div><button class="akx-skip" type="button">Passer</button>';
  host.querySelector(".akx-skip").addEventListener("click", function (e) {
    e.stopPropagation();
    finish();
  });
  host.addEventListener("click", finish);
  var logo = host.querySelector(".akx-logo"),
    wrap = host.querySelector(".akx-pieces"),
    shine = host.querySelector(".akx-shine");
  var img = new Image(),
    started = false;
  img.crossOrigin = "anonymous";
  /* on retire le fond blanc éventuel du logo pour que seules les lettres volent */
  img.onload = function () {
    var ratio = img.naturalWidth / img.naturalHeight;
    try {
      var w = Math.min(1400, img.naturalWidth),
        h = Math.round(w / ratio),
        cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      var cx = cv.getContext("2d");
      cx.drawImage(img, 0, 0, w, h);
      var d = cx.getImageData(0, 0, w, h),
        a = d.data;
      for (var i = 0; i < a.length; i += 4) {
        var m = Math.min(a[i], a[i + 1], a[i + 2]);
        if (m > 200) {
          var k = Math.max(0, (250 - m) / 50);
          a[i + 3] = Math.min(a[i + 3], Math.round(255 * k));
        }
      }
      cx.putImageData(d, 0, 0);
      cv.toBlob(function (b) {
        if (b) {
          src = URL.createObjectURL(b);
          shine.src = src;
        }
        start(ratio);
      }, "image/png");
    } catch (e) {
      start(ratio);
    }
  };
  img.onerror = function () {
    /* si le CDN refuse le mode CORS, on garde le logo tel quel */
    var i2 = new Image();
    i2.onload = function () {
      start(i2.naturalWidth / i2.naturalHeight);
    };
    i2.onerror = finish;
    i2.src = src;
  };
  img.src = src;
  shine.src = src;
  setTimeout(function () {
    if (!started) finish();
  }, 1500);
  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }
  function start(ratio) {
    if (started || ended) return;
    started = true;
    logo.style.aspectRatio = ratio;
    var mob = window.innerWidth < 750,
      C = mob ? 16 : 26,
      R = mob ? 3 : 4,
      pieces = [];
    for (var r = 0; r < R; r++) {
      for (var c = 0; c < C; c++) {
        var p = document.createElement("i");
        p.style.left = (c / C) * 100 + "%";
        p.style.top = (r / R) * 100 + "%";
        p.style.width = 100 / C + 0.15 + "%";
        p.style.height = 100 / R + 0.15 + "%";
        p.style.backgroundImage = 'url("' + src + '")';
        p.style.backgroundSize = C * 100 + "% " + R * 100 + "%";
        p.style.backgroundPosition =
          (C > 1 ? (c / (C - 1)) * 100 : 0) +
          "% " +
          (R > 1 ? (r / (R - 1)) * 100 : 0) +
          "%";
        var z = rnd(-900, 500);
        p.style.transform =
          "translate3d(" +
          rnd(-60, 60) +
          "vw," +
          rnd(-45, 45) +
          "vh," +
          z +
          "px) rotateX(" +
          rnd(-160, 160) +
          "deg) rotateY(" +
          rnd(-160, 160) +
          "deg) rotateZ(" +
          rnd(-90, 90) +
          "deg)";
        p.style.transitionDelay =
          ((c / C) * 0.3 + rnd(0, 0.1)).toFixed(2) + "s";
        wrap.appendChild(p);
        pieces.push(p);
      }
    }
    host.classList.add("is-ready");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        host.classList.add("is-go");
        pieces.forEach(function (p) {
          p.style.transform = "none";
        });
      });
    });
    setTimeout(function () {
      host.classList.add("is-whole");
    }, 1050);
    setTimeout(function () {
      host.classList.add("is-out");
    }, 1350);
    setTimeout(finish, 1850);
  }
  setTimeout(finish, 3500);
})();
