/* Intro de la page d'accueil (une fois par visite) : le soleil se lève, le logo s'écrit,
   la signature de la maison apparaît, puis le rideau remonte. Un clic ou « Passer » l'arrête. */
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
    '<div class="akx-stage"><span class="akx-sun"></span>' +
    '<div class="akx-logo"><img alt="" width="900" height="517"></div>' +
    '<p class="akx-tag">Maison d’édition afro-caribéenne</p></div>' +
    '<button class="akx-skip" type="button">Passer</button>';
  host.querySelector(".akx-skip").addEventListener("click", function (e) {
    e.stopPropagation();
    finish();
  });
  host.addEventListener("click", finish);
  var img = host.querySelector(".akx-logo img");
  function start() {
    if (started || ended) return;
    started = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        host.classList.add("is-go");
      });
    });
    setTimeout(function () {
      host.classList.add("is-out");
    }, 2000);
    setTimeout(finish, 2600);
  }
  img.onload = start;
  img.onerror = finish;
  img.src = src;
  if (img.complete && img.naturalWidth) start();
  /* sécurité : si le logo tarde, on n'attend pas */
  setTimeout(function () {
    if (!started) finish();
  }, 1500);
  setTimeout(finish, 4500);
})();
