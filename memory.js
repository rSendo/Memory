const imgList = ["cat1", "cat1", "cat2", "cat2", "cat3", "cat3", "cat4", "cat4", "cat5", "cat5", "cat6", "cat6"];

let cardDivs = document.querySelectorAll(".card");
cardDivs = [...cardDivs];

const startTime = new Date().getTime();

let currentClickedCard = null; //która karta została aktualnie kliknięta
let currentRoundCards = []; //tablica dla dwóch kart
let roundsCount = 0; //Informacja o wyniku - ile par udało się odgadnąć
let matchCardsCount = 0;

//losowanie klasy do każdego diva
cardDivs.forEach(cardDiv => {

    const position = Math.floor(Math.random() * imgList.length); //pozycja z tablicy przechowującej kolory

    cardDiv.classList.add(imgList[position]); //dodanie klasy do danego div-a

    imgList.splice(position, 1); //usunięcie wylosowanego elementu, krótsza tablica przy kolejnym losowaniu
});

//Po 2 sekundach dodanie klasy hidden - ukrycie i dodanie nasłuchiwania na klik
setTimeout(function () {
    cardDivs.forEach(card => {
        card.classList.add("hidden");
        card.addEventListener("click", clickCard)
    })
}, 2000);

function clickCard() {
    currentClickedCard = this;

    const isClickedSameCard = currentClickedCard === currentRoundCards[0];

    if (isClickedSameCard) {
        return;
    }

    currentClickedCard.classList.remove("hidden"); //ukrycie różowego kotka i pokazanie karty

    if (currentRoundCards.length === 0) {
        console.log("Wybrana piersza karta z pary");
        currentRoundCards[0] = currentClickedCard; //przypisanie do pozycji numer 1 wybranej karty
        return;
    }

    console.log("Wybrana druga karta z pary");

    cardDivs.forEach(card => card.removeEventListener("click", clickCard)); //na chwilę zdejmujemy możliwość kliknięcie

    currentRoundCards[1] = currentClickedCard; //ustawienie drugiego kliknięcia w tablicy w indeksie 1

    setTimeout(checkPair, 500); //Pół sekundy od odsłoniecia - decyzja czy dobrze czy źle
}

function processValidPair() {
    console.log("Poprawna para");

    ++matchCardsCount;
    document.getElementById('maches').innerText = matchCardsCount.toString();

    currentRoundCards.forEach(card => card.classList.add("off"));
    cardDivs = cardDivs.filter(card => !card.classList.contains("off"));

    checkEndOfGame();
}

function processInvalidPair() {
    console.log("Błędna para");
    currentRoundCards.forEach(card => card.classList.add("hidden"));
}

function checkPair() {
    ++roundsCount;
    document.getElementById('turns').innerText = roundsCount.toString();

    const isValidPair = currentRoundCards[0].className === currentRoundCards[1].className;

    if (isValidPair) {
        processValidPair();
    } else {
        processInvalidPair();
    }

    nextRound();
}

function nextRound() {
    currentClickedCard = null;
    currentRoundCards = [];
    cardDivs.forEach(cardDiv => cardDiv.addEventListener("click", clickCard)) //przywrócenie nasłuchiwania
}

function checkEndOfGame() {
    if (cardDivs.length !== 0) {
        return;
    }

    const endTime = new Date().getTime();
    const gameTime = ((endTime - startTime) / 1000).toFixed(2);

    document.getElementById('board').innerHTML = '<br><h1>You win!<br>Done in: ' + roundsCount
        + ' turns</h1><br><p>your time: ' + gameTime + ' seconds</p><br><button class="again" onclick="window.location.reload()">Try again</button>';
}

