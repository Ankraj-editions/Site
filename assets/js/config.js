/* ============================================================
   RÉGLAGES DU SITE — c'est le seul fichier à modifier.
   Laisser '' (vide) tant qu'un lien n'existe pas encore :
   le site affiche alors « bientôt disponible » au lieu de casser.
   ============================================================ */
window.AK = {
  // MODE DU SITE
  //   false = avant la sortie : tous les boutons d'achat deviennent « Me prévenir de la sortie »
  //           (formulaire d'inscription), le panier est masqué.
  //   true  = vente ouverte : boutons d'achat, panier et liens ci-dessous actifs.
  venteOuverte: false,

  // Lien de paiement Stripe de l'édition premium (ex. 'https://buy.stripe.com/xxxx')
  stripePremium: "",
  // Page Amazon de l'édition standard (ex. 'https://www.amazon.fr/dp/XXXXXXXXXX')
  amazonStandard: "",
  // PRIX
  //   afficherPrix: false = aucun prix visible sur le site (phase « me prévenir »).
  //   afficherPrix: true  = les prix ci-dessous s'affichent partout (précommande, vente).
  // Le vrai prix payé est celui réglé dans Stripe / Amazon.
  afficherPrix: false,
  prixPremium: "29,90 €",
  prixStandard: "12,90 €",
  // Contact
  email: "contact@ankrajeditions.com",
  instagram: "https://www.instagram.com/ankraj.editions",
  whatsapp: "", // ex. 'https://wa.me/336XXXXXXXX'
  // Formulaires : 'netlify' = Netlify Forms (rien d'autre à créer une fois le site sur Netlify).
  // On peut aussi mettre l'adresse d'un service externe (ex. 'https://formspree.io/f/abcdwxyz').
  formContact: "netlify",
  formNewsletter: "netlify",
};
