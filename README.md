# Portfolio de Caner Alpyürük

Portfolio qui regroupe mes deux formations : la licence, un BUT Gestion administrative et commerciale des organisations (GACO), parcours Management commercial et marketing omnicanal (MCMO), suivi à l’IUT de Reims-Châlons-Charleville puis à l’IUT Nord Franche-Comté, et le Master Entrepreneuriat et management de projets de l’Université de Haute-Alsace, en cours.

Version en ligne : https://alpyurukcaner-lang.github.io/Portfolio/

## Organisation du site

Le site est statique : chaque page est un fichier `index.html` dans son propre dossier, ce qui donne des adresses lisibles qui se rechargent et se partagent.

Le menu compte quatre rubriques, dans l’ordre où un recruteur les cherche : Accueil, Parcours, Compétences, Projets, plus un bouton Contact à droite. Il n’y a aucun sous-menu : chaque rubrique ouvre une page d’entrée, qui renvoie vers ses pages de détail, et le fil d’Ariane permet de remonter.

- `index.html` : l’accueil, façon profil : la photo en fond, la présentation, cinq stories à la une (Licence, Master, Projets, Alternance, Outils), puis une grille avec Licence GACO et Master EMP épinglés devant les projets. Les autres pages sont sur fond clair.
- `parcours/` : les expériences, les formations, la façon de travailler et la chronologie. Chaque expérience a sa page dans `experiences/` (l’alternance et les deux stages), avec ses missions, ses interlocuteurs et les compétences travaillées.
- `competences/` : les compétences des deux diplômes, la licence puis le master. Les cinq compétences de la licence (BUT GACO, parcours MCMO) ont chacune leur page, avec les expériences et les projets associés, plus une page par niveau (`niveau-1/`, `niveau-2/`, `niveau-3/`) avec les apprentissages critiques, les traces et le bilan du niveau ; `competences/referentiel/` réunit les 64 apprentissages, avec une recherche. `competences/master-emp/` présente le Master Entrepreneuriat et management de projets, parcours Management de projets : ses huit blocs (fiche nationale RNCP42354) et les missions de l’année. `licence/` donne la vue d’ensemble de la licence : trois années et projets phares.
- `projets/` : la galerie, avec ses filtres, et huit études de cas, chacune reliée à son expérience et à ses compétences.
- `contact/` : un formulaire qui prépare le message dans la messagerie du visiteur, et le lien vers le profil LinkedIn. L’adresse e-mail n’est écrite en clair nulle part dans le code des pages : le script la reconstitue à l’ouverture.
- `404.html`, `sitemap.xml`, `robots.txt`.

Les anciennes adresses `a-propos/` et `experiences/` renvoient vers `parcours/`, et celles de la page unique (`#ac-31-06`, `#bc5`, `#annee2`…) vers la page correspondante.

## Ressources

- `assets/site.css` et `assets/site.js` : la feuille de style et le script communs à toutes les pages.
- `assets/scenes.js` : les scènes 3D (Three.js, licence MIT), chargées seulement sur les pages qui en ont une, quand l’appareil le permet. Avec le mouvement réduit, l’économie de données ou un petit processeur, une image fixe (`assets/posters/`) les remplace.
- `assets/land.json` : les points du globe, d’après Natural Earth (domaine public).
- `fonts/` : la police Hanken Grotesk, sous licence SIL Open Font License.
- `apercu.png` : l’image affichée quand un lien est partagé.

Les documents (`docs/`) et les captures (`traces/`) sont anonymisés : les noms des camarades, de la tutrice, des enseignants et des salariés sont masqués ou remplacés par leur rôle, et les coordonnées personnelles sont retirées.
