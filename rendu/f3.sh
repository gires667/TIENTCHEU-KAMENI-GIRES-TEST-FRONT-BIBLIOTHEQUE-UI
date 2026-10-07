#!/bin/bash
# À lancer depuis le dossier rendu/ :   bash copier_captures_F3.sh
# Copie (sans rien supprimer) tes captures F3 sous des noms simples, sans espace ni accent.
# Le "?" dans les modèles remplace un espace OU un "_", le "*" remplace n'importe quoi :
# ça marche donc quel que soit le nom exact de tes fichiers.

cd "preuves/Captures d'ecran" || { echo "Dossier introuvable : lance le script depuis rendu/"; exit 1; }

copie() {
  local nouveau="$1"
  local trouves=( $2 )
  if [ ${#trouves[@]} -eq 1 ] && [ -f "${trouves[0]}" ]; then
    cp "${trouves[0]}" "$nouveau" && echo "OK        $nouveau   <-   ${trouves[0]}"
  else
    echo "PROBLEME  $nouveau : ${#trouves[@]} fichier(s) trouve(s) pour le modele $2"
  fi
}

copie "F3-liste-360.png"           "360*px.png"
copie "F3-liste-1280.png"          "1280*px.png"
copie "F3-filtre-A.png"            "groupe*.png"
copie "F3-detail-ecran-large.png"  "onclick*infos*.png"
copie "F3-detail-focus-fermer.png" "fermer*.png"
copie "F3-contraste.png"           "Capture?d*cran?2026-10-07?102904.png"

echo
echo "Reste à faire à la main : mettre F3-vide.png (fichier fourni) dans ce dossier."
ls -1 F3-*.png