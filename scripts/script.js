const title = document.querySelector('.title');
const cardsDOM = document.querySelectorAll('.card');
const dealerCards = document.querySelector('.dealer-cards').childNodes;
const dc = document.querySelectorAll('.dc');
const dcContainer = document.querySelector('.dealer-cards');
const playerCards = document.querySelector('.player-cards').childNodes;
const pc = document.querySelectorAll('.pc');
const pcContainer = document.querySelector('.player-cards');
const dealerCount = document.querySelector('.dealer-counter');
const playerCount = document.querySelector('.player-counter');
const dealerTag = 'Dealer';
const playerTag = 'Player';
const hit = document.querySelector('.hit');
const stay = document.querySelector('.stay');
const again = document.querySelector('.again');
const dc2 = document.querySelector('.hidden');
const double = document.querySelector('.double');

const dealerCash = document.querySelector('.dealer-cash');
const playerCash = document.querySelector('.player-cash');
const pool = document.querySelector('.bet-count');
const betSome = document.querySelector('.bet-some');
const betMax = document.querySelector('.bet-max');
const chipSm = document.querySelector('.small');
const chipMed = document.querySelector('.med');
const chipLarge = document.querySelector('.large');
const placeBetDOM = document.querySelector('.place-bet');
const clearBet = document.querySelector('.clear-bet');

let dealerHand = Array.from(dc);
let playerHand = Array.from(pc);
let cardsDOMarr = Array.from(cardsDOM);
let ace = 11;
let called = false;

function createDeck() {
    cards = [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, ace,
        2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, ace,
        2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, ace,
        2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, ace
    ]
    // shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
        
    }
    
    return cards;

}

function newHand() {

    cardsDOMarr.forEach(card => {
        card.style.backgroundColor = 'white';
    })

    let dCounter = 0, pCounter = 0;

    betSome.value = '';
    title.textContent = 'Blackjack';
    dc2.style.backgroundColor = 'black';
    document.removeEventListener('keypress', init);

    addEL();
    createDeck();

    dealerHand.forEach(cur => {

        cur.textContent = cards.shift();
        dCounter += parseInt(cur.textContent);

    })

    playerHand.forEach(cur => {
        cur.textContent = cards.shift();
        pCounter += parseInt(cur.textContent);
    })

    // check for dealer BJ before draw
    if (dCounter === 21 && pCounter !== 21) {

        dealerCount.textContent = parseInt(dealerCount.textContent) + parseInt(dc2.textContent);
        dc2.style.backgroundColor = 'white';

        dealerCount.textContent = 'Blackjack!';
        title.textContent = `Dealer Wins!`
        clear();

    } else {

        dealerCount.textContent = dCounter - parseInt(dc2.textContent);

    }

    playerCount.textContent = pCounter;

    if (pCounter === 21) {

        playerCount.textContent = 'Blackjack!';

        dealerTurn();

    } else if (parseInt(playerCash.textContent) > parseInt(pool.textContent)) {
        double.addEventListener('click', doubleDown);
    }

}

function drawCard() {

    removeBetEL();

    let newPlayerCard = document.createElement('div');

    newPlayerCard.className = 'pc card new';
    newPlayerCard.textContent = cards.shift();
    pcContainer.appendChild(newPlayerCard);
    playerCount.textContent = parseInt(playerCount.textContent) + parseInt(newPlayerCard.textContent);

    if (parseInt(playerCount.textContent) > 21) {

        dealerCount.textContent = parseInt(dealerCount.textContent) + parseInt(dc2.textContent);
        playerCount.textContent = 'Bust!';
        title.textContent = `Dealer Wins!`
        clear();

    } else if (parseInt(playerCount.textContent) === 21) {

        dealerTurn();
        removeEL();

    }

}

function dealerTurn() {

    dealerCount.textContent = parseInt(dealerCount.textContent) + parseInt(dc2.textContent);
    dc2.style.backgroundColor = 'white';
    removeEL();

    if (playerCount.textContent === 'Bust!') {

        title.textContent = 'Dealer Wins!';
        clear();

    } else {

        let draw = setInterval(() => {

            if (parseInt(dealerCount.textContent) < 17) {
                // draw new dealer card
                let newDealerCard = document.createElement('div');
                newDealerCard.className = 'dc card new';
                newDealerCard.textContent = cards.shift();
                dcContainer.appendChild(newDealerCard);
                dealerCount.textContent = parseInt(dealerCount.textContent) + parseInt(newDealerCard.textContent);
    
            } else {
    
                clearInterval(draw);
    
                if (parseInt(dealerCount.textContent) > 21) {
    
                    dealerCount.textContent = 'Bust!';
                    title.textContent = `Player Wins!`
                    clear();
            
                } else if (parseInt(dealerCount.textContent) > parseInt(playerCount.textContent)) {
    
                    title.textContent = 'Dealer Wins!';
                    clear();
    
                } else if (parseInt(playerCount.textContent) > parseInt(dealerCount.textContent)) {
    
                    title.textContent = 'Player Wins!';
                    clear();
    
                } else if (parseInt(dealerCount.textContent) === parseInt(playerCount.textContent)) {
    
                    title.textContent = 'Push';
                    clear();
    
                } else if (playerCount.textContent === 'Blackjack!' && parseInt(dealerCount.textContent) < 21) {
    
                    title.textContent = 'Player Wins!';
                    clear();
    
                } else if (playerCount.textContent === 'Blackjack!' && parseInt(dealerCount.textContent) === 21) {
    
                    title.textContent = 'Push';
                    clear();
    
                }
            }
        }, 1500)

    }

}

function doubleDown() {
    playerCash.textContent = parseInt(playerCash.textContent) - parseInt(pool.textContent);
    pool.textContent = parseInt(pool.textContent) * 2;
    double.removeEventListener('click', doubleDown);
    drawCard();
    dealerTurn();
}

function removeEL() {

    double.removeEventListener('click', doubleDown);
    hit.removeEventListener('click', drawCard);
    stay.removeEventListener('click', dealerTurn);

}

function addEL() {

    hit.addEventListener('click', drawCard);
    stay.addEventListener('click', dealerTurn);

}

function clear() {

    if (title.textContent.match(/dealer/gi)) {
        dealerCash.textContent = parseInt(dealerCash.textContent) + parseInt(pool.textContent);
    } else if (title.textContent.match(/player/gi)) {
        playerCash.textContent = parseInt(playerCash.textContent) + (parseInt(pool.textContent) * 2);
        dealerCash.textContent = parseInt(dealerCash.textContent) - parseInt(pool.textContent);
    } else if (title.textContent.match(/push/gi)) {
        playerCash.textContent = parseInt(playerCash.textContent) + parseInt(pool.textContent);
    }

    
    again.addEventListener('click', init);
    document.addEventListener('keypress', init);
    removeEL();
    again.style.display = 'block';
    dc2.style.backgroundColor = 'white';
    called = false;
    pool.textContent = '0';

}

/********************************Calculate Bets***********************************/

function addSomeBet() {

    if (parseInt(pool.textContent) !== 0) {
        playerCash.textContent = parseInt(playerCash.textContent) + parseInt(pool.textContent);
        pool.textContent = 0;
    }

    pool.textContent = betSome.value;
    playerCash.textContent = playerCash.textContent - pool.textContent;

    called = true;

}

function addMaxBet() {

    if (parseInt(pool.textContent) !== 0) {
        playerCash.textContent = parseInt(playerCash.textContent) + parseInt(pool.textContent);
        pool.textContent = 0;
    }

    called = true;
    pool.textContent = playerCash.textContent;
    playerCash.textContent = '0';

    init();
    
}

function smBet() {

    if (parseInt(playerCash.textContent) < 5) {
        chipSm.removeEventListener('click', smBet);
        pool.textContent = parseInt(pool.textContent) - 5;
        playerCash.textContent = parseInt(playerCash.textContent) + 5;
    }

    pool.textContent = parseInt(pool.textContent) + 5;
    playerCash.textContent = parseInt(playerCash.textContent) - 5;
    placeBetDOM.addEventListener('click', init);
    called = true;

}

function medBet() {

    if (parseInt(playerCash.textContent) < 25) {
        chipMed.removeEventListener('click', medBet);
        pool.textContent = parseInt(pool.textContent) - 25;
        playerCash.textContent = parseInt(playerCash.textContent) + 25;
    }

    pool.textContent = parseInt(pool.textContent) + 25;
    playerCash.textContent = parseInt(playerCash.textContent) - 25;
    placeBetDOM.addEventListener('click', init);
    called = true;

}

function lgBet() {

    if (parseInt(playerCash.textContent) < 100) {
        chipLarge.removeEventListener('click', lgBet);
        pool.textContent = parseInt(pool.textContent) - 100;
        playerCash.textContent = parseInt(playerCash.textContent) + 100;
    }

    pool.textContent = parseInt(pool.textContent) + 100;
    playerCash.textContent = parseInt(playerCash.textContent) - 100;
    placeBetDOM.addEventListener('click', init);
    called = true;

}

function removeBetEL() {

    clearBet.removeEventListener('click', resetBet);
    placeBetDOM.removeEventListener('click', init);
    betMax.removeEventListener('click', addMaxBet);
    chipSm.removeEventListener('click', smBet);
    chipMed.removeEventListener('click', medBet);
    chipLarge.removeEventListener('click', lgBet);

}

function addBetEL() {

    clearBet.addEventListener('click', resetBet);
    placeBetDOM.addEventListener('click', init);
    betMax.addEventListener('click', addMaxBet);
    chipSm.addEventListener('click', smBet);
    chipMed.addEventListener('click', medBet);
    chipLarge.addEventListener('click', lgBet);

}

let a = 'Win!';
let b = 'Lose!';

function win(x) {

    again.addEventListener('click', init);
    document.addEventListener('keypress', init);
    title.textContent = `You ${x}`;
    removeEL();
    again.style.display = 'block';
    dc2.style.backgroundColor = 'black';
    called = false;
    pool.textContent = '0';
    playerCash.textContent = '1000';
    dealerCash.textContent = '10000';

}

function resetBet() {
    
    playerCash.textContent = parseInt(playerCash.textContent) + parseInt(pool.textContent);
    pool.textContent = 0;
    addBetEL();
    
}

function init() {

    if (betSome.value.match(/[0-9]+/gi) && betSome.value <= parseInt(playerCash.textContent)) {

        addSomeBet();

    }

    again.removeEventListener('click', init);
    document.removeEventListener('keypress', init);

    let elements = document.getElementsByClassName('new');

    while (elements.length > 0) {

        elements[0].parentNode.removeChild(elements[0]);

    }

    again.style.display = 'none';
    addBetEL();
    title.textContent = 'Place your bets...';
    playerCount.textContent = '';
    dealerCount.textContent = '';

    cardsDOMarr.forEach(card => {

        card.style.backgroundColor = 'black';

    })

    if (called === true) {

        called = false;
        removeBetEL();
        newHand();

    } else if (parseInt(playerCash.textContent) === 0) {
        win(b);
    } else if (parseInt(dealerCash.textContent) <= 0) {
        win(a);
    }

}

init();