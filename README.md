# Portfolio de Caner Alpyuruk

Portfolio de compétences du BUT Gestion administrative et commerciale des organisations (GACO), parcours Management commercial et marketing omnicanal (MCMO), commencé à l’IUT de Reims-Châlons-Charleville et poursuivi à l’IUT Nord Franche-Comté.

Version en ligne : https://alpyurukcaner-lang.github.io/Portfolio/

## Organisation du site

Le site est statique : chaque page est un fichier `index.html` dans son propre dossier, ce qui donne des adresses lisibles qui se rechargent et se partagent.

- `index.html` : l’accueil, avec la maquette en volume des 64 apprentissages critiques.
- `a-propos/` : parcours, valeurs de travail et chronologie.
- `competences/` : les cinq domaines de compétence. Chaque domaine a sa page, plus une page par niveau (`niveau-1/`, `niveau-2/`, `niveau-3/`) avec les apprentissages critiques, les traces et le bilan du niveau. `competences/referentiel/` réunit les 64 apprentissages, avec une recherche.
- `experiences/` : l’alternance et les deux stages, chacun sur sa page.
- `projets/` : la galerie, avec ses filtres, et huit études de cas.
- `404.html`, `sitemap.xml`, `robots.txt`.

Les anciennes adresses de la page unique (`#ac-31-06`, `#bc5`, `#annee2`…) redirigent vers la page correspondante.

## Ressources

- `assets/site.css` et `assets/site.js` : la feuille de style et le script communs à toutes les pages.
- `assets/scenes.js` : les scènes 3D (Three.js, licence MIT), chargées seulement sur les pages qui en ont une, quand l’appareil le permet. Avec le mouvement réduit, l’économie de données ou un petit processeur, une image fixe (`assets/posters/`) les remplace.
- `assets/land.json` : les points du globe, d’après Natural Earth (domaine public).
- `fonts/` : la police Hanken Grotesk, sous licence SIL Open Font License.
- `apercu.png` : l’image affichée quand un lien est partagé.

Les documents (`docs/`) et les captures (`traces/`) sont anonymisés : les noms des camarades, de la tutrice, des enseignants et des salariés sont masqués ou remplacés par leur rôle, et les coordonnées personnelles sont retirées.
