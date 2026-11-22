# Site Ankraj Éditions — comment le modifier

Site statique : du HTML, du CSS et du JavaScript, sans outil à installer, sans base de données, sans abonnement.
Pour modifier : un éditeur de texte (Visual Studio Code, gratuit, est le plus confortable).
Pour voir le résultat : double-cliquer sur `index.html`, il s'ouvre dans le navigateur.

---

## 1. Où se trouve quoi

```
index.html              page d'accueil
je-grandis.html         fiche produit « Je Grandis »
notre-mission.html      page mission
contact.html            contact
cgv.html, mentions-legales.html, confidentialite.html   pages légales
merci.html              page après paiement
404.html                page « introuvable »

assets/js/config.js     ⭐ RÉGLAGES : liens de paiement, prix, e-mail, réseaux, formulaires
assets/css/style.css    style commun à toutes les pages (couleurs et polices au début)
assets/css/accueil.css  style de la page d'accueil uniquement
assets/css/livre.css    style de la fiche produit (je-grandis.html) uniquement
assets/js/site.js       comportements communs (menu, panier, formulaires, FAQ)
assets/js/accueil.js    animations de la page d'accueil
assets/js/intro.js      animation du logo à l'ouverture
assets/js/livre.js      fiche produit : feuilleteur des pages, galerie, choix d'édition

commun/haut.html        bandeau d'annonce + en-tête + menu   (partagé par toutes les pages)
commun/bas.html         pied de page + panier + fenêtres     (partagé par toutes les pages)
outils/maj-commun.py    recopie commun/ dans toutes les pages

img/                    images (logo, couverture, pages du livre)
fonts/                  polices (Inter Display Black pour les titres, Work Sans pour les textes)
og-image.jpg            image affichée quand on partage le lien (1200 × 630)
sitemap.xml, robots.txt pour Google
```

---

## 2. Les modifications courantes

### Liens de paiement, prix, e-mail, Instagram, WhatsApp
Tout est dans **`assets/js/config.js`**, un seul fichier commenté.
- Coller le lien de paiement Stripe dans `stripePremium`, la page Amazon dans `amazonStandard`.
- Les prix affichés partout (`prixPremium`, `prixStandard`) se changent ici. Le vrai prix payé est celui réglé dans Stripe et Amazon : changer les deux.
- Laisser `''` (vide) tant qu'un lien n'existe pas : le site affiche « bientôt disponible » au lieu d'un bouton cassé.

### Changer un texte
Ouvrir la page concernée (ex. `index.html`), chercher la phrase (Ctrl+F / Cmd+F), la remplacer entre les balises, enregistrer.
Ne pas toucher à ce qui est entre `<` et `>`.
Les guillemets et apostrophes typographiques (’ « ») sont conseillés.

### Changer une couleur ou une police
Début de **`assets/css/style.css`**, bloc `:root` :

| Variable        | Rôle                          | Valeur     |
|-----------------|-------------------------------|------------|
| `--fond`        | fond crème                    | `#F2E8D5`  |
| `--fond-alt`    | fond sable                    | `#E8D9BF`  |
| `--papier`      | blanc cassé                   | `#FFFBF3`  |
| `--encre`       | texte principal (brun)        | `#3B2A20`  |
| `--encre-douce` | texte secondaire              | `#6E5A4A`  |
| `--terre`       | liens, accents                | `#8A5230`  |
| `--terre-vive`  | mots en couleur des titres    | `#A0643C`  |
| `--soleil`      | doré                          | `#F4B63C`  |
| `--chocolat`    | fonds foncés                  | `#2A1D16`  |

Changer une valeur ici la change sur tout le site, accueil compris.

### Changer le menu, le bandeau d'annonce ou le pied de page
1. Modifier `commun/haut.html` (menu, bandeau) ou `commun/bas.html` (pied de page).
2. Ouvrir un terminal dans le dossier du site et lancer :
   ```
   python3 outils/maj-commun.py
   ```
   Les 9 pages sont mises à jour d’un coup. Sur Mac, si `python3` n’est pas encore installé, le Mac propose de l’installer à la première utilisation (outils de développement Apple, gratuits).

Sans terminal : faire la même modification dans chaque page, entre les commentaires `HAUT COMMUN` / `FIN HAUT COMMUN` (ou `BAS COMMUN`). L'outil « Rechercher et remplacer dans les fichiers » de VS Code le fait en une fois.

### Remplacer une image
Garder le même nom de fichier dans `img/` et remplacer le fichier.
Conseil : JPG, environ 1200 px de large, moins de 300 Ko.
Pour une nouvelle image, mettre aussi un texte `alt="..."` qui la décrit (accessibilité et Google).

### Les pages du livre montrées sur le site
Les dessins viennent de la maquette Canva « Tome 1 Je Grandis ». Ils sont dans `img/` :
`p6` colibri · `p08` garçon sous les palmiers · `p09` enfants qui courent · `p10` foulard wax ·
`p11` respiration · `p12` danse en madras · `p13` tambour · `p14` fille aux tresses.
`cover.jpg` = couverture premium, `p4.jpg` = couverture standard, `kids.jpg` = 4e de couverture,
`savane.jpg` = haut de la 4e de couverture (sans le titre).

Protection : les pages du livre portent un tampon « Ankraj Éditions · Reproduction interdite » directement dans l'image.
Pour une nouvelle page, la tamponner avant de la mettre dans `img/` (demander à Claude, ou poser `img/tampon.png` par-dessus dans un logiciel d'image).
Seuls les deux dessins à colorier en direct (`img/coloriage/p6.jpg`, `img/coloriage/p08.jpg`) sont sans tampon dans l'image : le tampon y est posé par-dessus en CSS.

Règles : seulement des pages qui sont encore dans le livre, jamais de couverture dans un défilement
de pages, pas la même page deux fois dans une même animation.
- Accueil, récit qui défile : 3 pages en éventail (`data-pg`), 1 feuille tournée (`data-leaf`), la page coloriée (`data-main`).
- Accueil, « Une page, un monde » : 3 pages. Pour en ajouter une, copier un bloc `monde` + une `figure` + un point `<i>`, et changer `--n:3`.
- Fiche produit : 5 vignettes dans la galerie et 6 pages dans le feuilleteur (`data-akf-page`).

### Avant la sortie / vente ouverte
Dans `config.js`, `venteOuverte: false` : tous les boutons d'achat deviennent « Me prévenir de la sortie »
et ouvrent le formulaire d'inscription ; le panier est masqué et le bandeau affiche les messages `data-ann-attente`.
Le jour de la sortie : coller les liens Stripe et Amazon, puis passer à `venteOuverte: true`.

### Afficher ou cacher les prix
Dans `config.js`, `afficherPrix: false` : aucun prix n'apparaît sur le site (phase « me prévenir »).
Pour la précommande : écrire les prix dans `prixPremium` / `prixStandard` (vides pour l'instant), puis passer à `afficherPrix: true`.
Penser aussi à remettre le prix dans les données lues par Google : copier le bloc de `outils/offre-google-jsonld.txt`
dans `je-grandis.html` (en remplaçant PRIX-ICI par le prix, au format 00.00), à la fin du premier bloc `application/ld+json`, juste avant `}</script>`, précédé d'une virgule.

### Ajouter un livre
1. Copier `je-grandis.html` en `nom-du-livre.html` et remplacer les textes et images.
2. Ajouter le lien dans `commun/haut.html` (menu) et `commun/bas.html` (pied), puis lancer `outils/maj-commun.py`.
3. Ajouter l'adresse dans `sitemap.xml`.
4. Pour le paiement, ajouter un lien Stripe dans `config.js` (copier une ligne existante) et le relier au bouton (`data-buy`) : c'est la seule étape où un développeur peut être utile.

### Formulaires (contact, newsletter, « me prévenir »)
Ils passent par **Netlify Forms** (`formContact: 'netlify'`, `formNewsletter: 'netlify'` dans `config.js`) :
les réponses arrivent dans Netlify › Forms. Hors du site en ligne (ouvert depuis l'ordinateur), un message d'aperçu s'affiche à la place de l'envoi.

---

## 3. Avant la mise en ligne
- Compléter les mentions `à compléter` : `mentions-legales.html`, `cgv.html` et la fiche technique de `je-grandis.html` (format, nombre de pages, ISBN).
- Remplir `config.js` (Stripe, Amazon, e-mail, Instagram).
- Hébergement : dépôt GitHub privé `ankraj-editions/site`, relié à **Netlify** (chaque modification envoyée sur GitHub met le site à jour). Relier ensuite le nom de domaine `ankrajeditions.com` sans toucher aux réglages e-mail (MX) chez OVH.
  Ces hébergeurs servent les adresses sans `.html` (ex. `/je-grandis`), comme prévu dans `sitemap.xml`.
- Statistiques sans cookies : coller le petit script de Cloudflare Web Analytics ou Plausible à l'endroit indiqué en bas de chaque page.

---

## 4. Règles pour garder le code propre
- Une couleur = une variable dans `:root`. Ne pas écrire de code couleur en dur ailleurs.
- Style commun → `style.css`, accueil → `accueil.css`, fiche produit → `livre.css`. Pas de nouveau fichier CSS « correctif », pas de `<style>` ni de `<script>` dans les pages.
- Menu et pied de page : toujours via `commun/` + `outils/maj-commun.py`.
- Tester sur téléphone (ou en réduisant la fenêtre du navigateur) après chaque changement.

---

## 5. Versions
- V3 (22/11/2026) : pages alignées sur le Canva (serpent retiré), plus de couverture dans les défilements, moins de pages qui défilent, doré plus présent (bandeau, boutons, soleil), code mort retiré, styles et scripts de la fiche produit sortis dans `livre.css` / `livre.js`.
- V4 (22/11/2026) : « plus de 20 dessins » (standard Amazon : 20 dessins, premium : 25 dessins + pages d'activités), tuile « Des enfants qui leur ressemblent » rendue lisible.
- V5 (22/11/2026) : prix masqués tant que `afficherPrix: false` (aucun prix écrit en dur dans les pages), prix retiré des données Google.
- V6 (22/11/2026) : tampon de protection sur toutes les pages du livre montrées sur le site.
- V7 (22/11/2026) : site plus fluide sur ordinateur (défilement natif, grain plein écran retiré), nouvelle intro légère (soleil + logo qui s'écrit), pastille « Faites défiler » bien visible sur ordinateur, prix retirés des fichiers, mention « Tous droits réservés » (LICENSE.md).
- V8 (22/11/2026) : retour de l'intro où les morceaux du logo se regroupent en 3D avec le reflet de lumière, allégée (36 morceaux au lieu de 104, sans effets coûteux) et rallongée à environ 3,5 s pour que tout se mette en place.
