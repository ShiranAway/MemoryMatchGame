

const photoSets = {
    'harry-potter': 'https://hp-api.herokuapp.com/api/characters',
    'dogs': 'https://dog.ceo/api/breeds/image/random/8',
    'flags': 'https://restcountries.com/v3.1/all'
};

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

async function startGame(set) {
    let images;

    if (set === 'random') {
        const randomSet = ['harry-potter', 'dogs', 'flags'][Math.floor(Math.random() * 3)];
        images = await fetchImages(randomSet);
    } else {
        images = await fetchImages(set);
    }

    shuffle(images);

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    images.forEach(src => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = src;

        const img = document.createElement('img');
        img.src = src;
        card.appendChild(img);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

async function fetchImages(set) {
    let response;
    if (set === 'harry-potter') {
        response = await fetch(photoSets[set]);
        const data = await response.json();
        return data.slice(0, 4).flatMap(character => [character.image, character.image]);
    } else if (set === 'dogs') {
        response = await fetch(photoSets[set]);
        const data = await response.json();
        return data.message.slice(0, 4).flatMap(image => [image, image]);
    } else if (set === 'flags') {
        response = await fetch(photoSets[set]);
        const data = await response.json();
        const countries = data.slice(0, 4);
        return countries.flatMap(country => [country.flags.png, country.flags.png]);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        disableCards();
        return;
    }

    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

document.getElementById('play-button').addEventListener('click', function () {
    const visibleDiv = document.getElementById('visible-div');
    const hiddenDiv = document.getElementById('hidden-div');

    visibleDiv.classList.add('hidden');
    hiddenDiv.classList.remove('hidden');
});

// // document.getElementById('return-button').addEventListener('click', function () {
// //     location.reload(); 

// });
document.getElementById('restart-button').addEventListener('click', function () {
    location.reload(); });

// function showExplanation() {
//     document.getElementById('explanation').style.display = 'block';
// }


function toggleExplanation() {
    var language = document.getElementById('languageSelect').value;
    var explanationText = {
        english: `Each player in his turn will click on two empty cubes to reveal a pair of matching images. If the picture is not the same as the previous one, the game will start over 
        And the turn will pass to the next player. The winner is the one with the highest number of matching pictures.`,
        hebrew: `כל שחקן בתורו ילחץ על שתי קוביות ריקות כדי לחשוף זוג תמונות תואמות. במידה והתמונה לא זהה לקודמתה, המשחק יתחיל מחדש 
        והתור יעבור לשחקן הבא. המנצח הוא זה שמחזיק במספר התמונות התואמות, הגבוה ביותר.`
    };
    var explanationElement = document.getElementById('explanation');
    if (explanationElement.style.display === 'block') {
        explanationElement.style.display = 'none';
    } else {
        explanationElement.innerText = explanationText[language];
        explanationElement.style.display = 'block';
    }

    
}


