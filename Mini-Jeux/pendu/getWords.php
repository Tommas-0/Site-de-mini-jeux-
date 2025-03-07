<?php
// Chemin vers le fichier texte contenant la liste de mots
$filePath = 'listedemot.txt';

// Lire le contenu du fichier
$fileContent = file_get_contents($filePath);

// Vérifier si la lecture du fichier a réussi
if ($fileContent === false) {
    // En cas d'échec de lecture
    echo json_encode(['error' => 'Impossible de lire le fichier.']);
    exit();
}

// Diviser le contenu du fichier en un tableau de mots
$words = explode("\n", $fileContent);

// Supprimer les éventuels espaces blancs supplémentaires
$words = array_map('trim', $words);

// Retourner les mots au format JSON
echo json_encode($words);
?>
