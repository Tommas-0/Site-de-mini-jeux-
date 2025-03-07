class Pendu {
    // Constructeur de la classe Pendu
    constructor({parentElement, ListeDeMots}) {
        this.parentElement = parentElement;
        this.ListeDeMots = ListeDeMots;
        this.errors = 0;
        this.attempts = 0;
        this.letters_found = 0;
        this.random_word;
        this.hidden_letters_array;
        this.init(); // Appel de la méthode d'initialisation
    }

    // Méthode d'initialisation
    init() {
        // Sélection d'un mot aléatoire de la liste
        this.random_word = this.getRandomWord(this.ListeDeMots);
        console.log(this.random_word);

        // Vérification si un mot aléatoire a été sélectionné
        if (this.random_word) {
            // Création de la section pour afficher le mot à trouver
            const word_section_element = document.createElement('section');
            word_section_element.id = "Mot_a_trouver";

            // Insertion du HTML pour afficher le mot à trouver et les informations du jeu
            word_section_element.innerHTML = `
                <figure>
                    <img src="./img/pendu0.png" alt="Support de pendaison">
                    <figcaption>Nombre de lettres à trouver : ${this.random_word.length}<hr>Lettres trouvées : ${this.letters_found}
                    <hr>Tentatives : ${this.attempts}<hr>Erreurs : ${this.errors} / 11</figcaption>
                </figure>
            `;

            // Création de la section pour les boutons de lettres
            const letters_section_element = document.createElement('section');
            letters_section_element.id = "letters";

            // Génération des boutons de lettres
            this.generateLetterButtons(letters_section_element);

            // Ajout des sections à l'élément parent
            this.parentElement.appendChild(word_section_element);
            this.parentElement.appendChild(letters_section_element);

            // Affichage du mot caché
            this.hidden_letters_array = this.displayHiddenWord();
            console.log(this.hidden_letters_array);
        } else {
            console.error('Erreur : this.random_word est indéfini.');
        }
    }

    // Méthode pour sélectionner un mot aléatoire dans la liste
    getRandomWord(ListeDeMots) {
        if (ListeDeMots && ListeDeMots.mots && ListeDeMots.mots.length > 0) {
            return ListeDeMots.mots[Math.floor(Math.random() * ListeDeMots.mots.length)];
        } else {
            console.error('ListeDeMots est invalide ou vide.');
            return null;
        }
    }
    
    // Méthode pour générer les boutons de lettres
    generateLetterButtons(letters_section_element) {
        const ul_element = document.createElement('ul');

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(letter => {
            const li_element = document.createElement('li');
            li_element.textContent = letter;

            // Écouteur d'événement pour vérifier si la lettre est dans le mot
            li_element.addEventListener('click', (event) => this.checkIfLetterIsInTheWord(event), {once: true});

            ul_element.appendChild(li_element);
        });

        letters_section_element.appendChild(ul_element);
    }

    // Méthode pour afficher le mot caché
    displayHiddenWord() { 
        const hidden_word = this.random_word.slice().replace(/[A-Z]/g, '_');
        const paragraph_element = document.createElement('p');
        paragraph_element.textContent = hidden_word;
        this.parentElement.querySelector('section[id="Mot_a_trouver"]').appendChild(paragraph_element);
        return hidden_word.split('');
    }

    // Méthode pour vérifier si la lettre est dans le mot
    checkIfLetterIsInTheWord(event) {
        this.attempts++;
        const selected_letter = event.target.textContent;
        if (this.random_word.includes(selected_letter)) {
            event.target.classList.add('good');
            this.random_word.split('').forEach((letter, index) => {
                if (letter === selected_letter) {
                    this.letters_found++;
                    this.hidden_letters_array[index] = selected_letter;
                }
            });
            document.body.querySelector('section[id="Mot_a_trouver"] > p').textContent = this.hidden_letters_array.join('');
        } else {
            this.errors++;
            event.target.classList.add('wrong');
            document.body.querySelector('img').src = `./img/pendu${this.errors}.png`;
        }

        document.body.querySelector('figcaption').innerHTML = `Nombre de lettres à trouver : ${this.random_word.length}<hr>Lettres trouvées : ${this.letters_found}
        <hr>Tentatives : ${this.attempts}<hr>Erreurs : ${this.errors} / 11`;

        this.checkIfWinnerOrLooser();
    }

// Méthode pour vérifier si le joueur a gagné ou perdu
checkIfWinnerOrLooser() {
    const word_paragraph = document.body.querySelector('section[id="Mot_a_trouver"] > p');

    if (this.errors >= 11) { // Vérifier si le joueur a atteint le nombre maximum d'erreurs
        this.gameOver(word_paragraph);
        word_paragraph.classList.add('looser');
        word_paragraph.textContent = "Vous avez perdu. Le mot à trouver était : " + this.random_word;
    } else if (this.letters_found === this.random_word.length) { // Vérifier si le joueur a trouvé toutes les lettres
        this.WinOver(word_paragraph);
        word_paragraph.classList.add('winner');
    }
}



    gameOver(word_paragraph) {
        word_paragraph.classList.add('gameover');
        document.body.querySelectorAll('li').forEach(letter => letter.className = 'disabled');
    
        // Afficher un message indiquant que le joueur a perdu
        word_paragraph.textContent = "Vous avez perdu. Le mot à trouver était : " + this.random_word;
    
        // Créer et insérer le bouton "Recharger la page" au milieu du pendu
        const reloadButton = document.createElement('button');
        reloadButton.textContent = "Recharger la page";
        reloadButton.addEventListener('click', () => window.location.reload(false));
    
        const penduSection = document.getElementById('Mot_a_trouver');
        penduSection.appendChild(reloadButton);
    }
    
    WinOver(word_paragraph) {
        word_paragraph.classList.add('gameover');
        document.body.querySelectorAll('li').forEach(letter => letter.className = 'disabled');
       
        word_paragraph.textContent = "Vous avez gagné. Le mot à trouver était : " + this.random_word;
    
        // Créer et insérer le bouton "Recharger la page" au milieu du pendu
        const reloadButton = document.createElement('button');
        reloadButton.textContent = "Recharger la page";
        reloadButton.addEventListener('click', () => window.location.reload(false));
    
        const penduSection = document.getElementById('Mot_a_trouver');
        penduSection.appendChild(reloadButton);
    }
    
    
    
}
    