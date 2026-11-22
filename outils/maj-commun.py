#!/usr/bin/env python3
"""Recopie le haut commun (bandeau, en-tête, menu) et le bas commun (pied de page,
panier, fenêtres) dans toutes les pages du site.

Utilisation : modifier commun/haut.html ou commun/bas.html, puis lancer
    python3 outils/maj-commun.py
depuis le dossier du site. Le lien de la page en cours est marqué automatiquement
(aria-current="page"). Python 3 suffit, rien à installer.
"""
import pathlib, re

RACINE = pathlib.Path(__file__).resolve().parent.parent
ZONES = {
    "HAUT": RACINE / "commun" / "haut.html",
    "BAS": RACINE / "commun" / "bas.html",
}

def page_courante(html, nom):
    href = "./" if nom == "index.html" else nom
    # marque uniquement le lien exact de la page (pas les ancres type je-grandis.html#standard)
    return re.sub(r'<a href="%s">' % re.escape(href),
                  '<a href="%s" aria-current="page">' % href, html, count=1)

def main():
    pages = sorted(RACINE.glob("*.html"))
    for page in pages:
        html = page.read_text(encoding="utf-8")
        for zone, fichier in ZONES.items():
            debut = re.search(r"<!-- ===== %s COMMUN :.*?-->\n" % zone, html)
            fin = html.find("<!-- ===== FIN %s COMMUN ===== -->" % zone)
            if not debut or fin < 0:
                print("  ! zone %s introuvable dans %s (ignorée)" % (zone, page.name))
                continue
            bloc = fichier.read_text(encoding="utf-8").strip("\n")
            if zone == "HAUT":
                bloc = page_courante(bloc, page.name)
            html = html[:debut.end()] + bloc + "\n" + html[fin:]
        page.write_text(html, encoding="utf-8")
        print("  ✓", page.name)
    print("Terminé : %d pages mises à jour." % len(pages))

if __name__ == "__main__":
    main()
