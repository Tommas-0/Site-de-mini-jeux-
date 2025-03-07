// Sélectionner toutes les cases du jeu
let boxes = document.querySelectorAll(".box");

// Initialiser le tour du joueur
let turn = "X";

// Indiquer si le jeu est terminé
let isGameOver = false;

// Variable pour stocker le choix du joueur (humain ou ordinateur)
let playerChoice = "human"; // Par défaut, le joueur joue contre un vrai joueur

// Écouter les changements de sélection de l'utilisateur et mettre à jour le choix du joueur
document.getElementById("playerChoice").addEventListener("change", function () {
    playerChoice = this.value;
});

// Parcourir toutes les cases et ajouter un événement 'click'
boxes.forEach(e => {
    // Réinitialiser le contenu de chaque case
    e.innerHTML = "";

    // Ajouter un événement 'click' à chaque case
    e.addEventListener("click", () => {
        // Vérifier si le jeu n'est pas terminé et si la case est vide
        if (!isGameOver && e.innerHTML === "") {
            // Remplir la case avec le symbole du joueur actuel
            e.innerHTML = turn;

            // Vérifier s'il y a un gagnant ou un match nul
            cheakWin();
            cheakDraw();

            // Passer au tour suivant
            changeTurn();

            // Si le joueur choisit de jouer contre l'ordinateur et c'est le tour de l'ordinateur
            if (playerChoice === "computer" && turn === "O") {
                // Laisser l'ordinateur jouer
                computerPlay();
            }
        }
    });
});

// Fonction pour changer le tour du joueur
function changeTurn() {
    // Changer le tour du joueur
    turn = (turn === "X") ? "O" : "X";

    // Mettre à jour la position du marqueur de tour
    document.querySelector(".bg").style.left = (turn === "O") ? "85px" : "0";
}

// Fonction pour vérifier s'il y a un gagnant
function cheakWin() {
    // Tableau des conditions de victoire
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Parcourir toutes les conditions de victoire
    for (let i = 0; i < winConditions.length; i++) {
        // Récupérer les symboles dans les cases
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        // Vérifier s'il y a un gagnant
        if (v0 !== "" && v0 === v1 && v0 === v2) {
            // Stocker le joueur gagnant
            let winner = v0;

            // Mettre fin au jeu
            isGameOver = true;

            // Afficher le message de victoire
            document.querySelector("#results").innerHTML = winner + " a gagné";

            // Afficher le bouton "Rejouer"
            document.querySelector("#play-again").style.display = "inline";

            // Mettre en surbrillance les cases gagnantes
            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = (winner === "X") ? "#FF4136" : "#0074D9";
                boxes[winConditions[i][j]].style.color = "#000";
            }
        }
    }
}

// Fonction pour vérifier s'il y a un match nul
function cheakDraw() {
    // Vérifier s'il y a encore des cases vides
    let isDraw = !Array.from(boxes).some(box => box.innerHTML === "");

    // Si toutes les cases sont remplies et aucun joueur n'a gagné
    if (isDraw && !isGameOver) {
        // Mettre fin au jeu
        isGameOver = true;

        // Afficher le message de match nul
        document.querySelector("#results").innerHTML = "Egalité";

        // Afficher le bouton "Rejouer"
        document.querySelector("#play-again").style.display = "inline";

        // Ajouter une classe aux cases pour les rendre vertes en cas d'égalité
        boxes.forEach(box => {
            box.classList.add("draw");
        });
    }
}

// Fonction pour permettre à l'ordinateur de jouer en utilisant l'algorithme Minimax
function computerPlay() {
    // Appel de la fonction minimax pour obtenir le meilleur coup
    let bestMove = minimax([...boxes], turn).index;
    
    // Remplir la case avec le symbole de l'ordinateur
    boxes[bestMove].innerHTML = "O";

    // Vérifier s'il y a un gagnant ou un match nul après que l'ordinateur a joué
    cheakWin();
    cheakDraw();

    // Passer au tour suivant
    changeTurn();
}

// Fonction Minimax
function minimax(board, player) {
    // Tableau pour stocker les indices vides
    let emptyIndices = [];

    // Parcourir le plateau pour trouver les cases vides
    for (let i = 0; i < board.length; i++) {
        if (board[i].innerHTML === "") {
            emptyIndices.push(i);
        }
    }

    // Vérifier les conditions de fin de jeu
    if (cheakWinningMove(board, "X")) {
        return { score: -10 };
    } else if (cheakWinningMove(board, "O")) {
        return { score: 10 };
    } else if (emptyIndices.length === 0) {
        return { score: 0 };
    }

    // Tableau pour stocker les objets avec indice et score
    let moves = [];

    // Parcourir les indices vides et évaluer les coups possibles
    for (let i = 0; i < emptyIndices.length; i++) {
        let move = {};
        move.index = emptyIndices[i];

        // Sauvegarder la position actuelle
        let temp = board[emptyIndices[i]].innerHTML;

        // Faire le coup pour le joueur actuel
        board[emptyIndices[i]].innerHTML = player;

        // Récursivement évaluer le score pour ce coup
        if (player === "O") {
            let result = minimax(board, "X");
            move.score = result.score;
        } else {
            let result = minimax(board, "O");
            move.score = result.score;
        }

        // Annuler le coup
        board[emptyIndices[i]].innerHTML = temp;

        // Sauvegarder le coup dans le tableau
        moves.push(move);
    }

    // Trouver le meilleur coup en fonction du joueur actuel
    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // Retourner le meilleur coup
    return moves[bestMove];
}

// Fonction pour vérifier s'il y a une victoire pour le joueur spécifié
function cheakWinningMove(board, player) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]].innerHTML === player &&
            board[condition[1]].innerHTML === player &&
            board[condition[2]].innerHTML === player) {
            return true;
        }
    }
    return false;
}

// Réinitialiser le jeu lorsqu'on clique sur le bouton "Rejouer"
document.querySelector("#play-again").addEventListener("click", () => {
    // Réinitialiser les variables
    isGameOver = false;
    turn = "X";

    // Réinitialiser l'affichage du marqueur de tour
    document.querySelector(".bg").style.left = "0";

    // Réinitialiser le message de résultat
    document.querySelector("#results").innerHTML = "";

    // Cacher le bouton "Rejouer"
    document.querySelector("#play-again").style.display = "none";

    // Réinitialiser l'apparence des cases
    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
        e.classList.remove("draw"); // Supprimer la classe draw
    });
});
