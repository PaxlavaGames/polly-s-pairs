const audio_flip = document.getElementById('audio_flip');
const audio_shuffle = document.getElementById('audio_shuffle');
const audio_victory = document.getElementById('audio_victory');
const audio_failure = document.getElementById('audio_failure');
const audio_game_over = document.getElementById('audio_game_over');

const life_span = document.getElementById('life_hearts')


function createFireworks() {
    const container = document.getElementById('fireworks-container');
    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');

        // Генерируем случайные начальные позиции частиц в пределах всего экрана
        const startX = Math.random() * window.innerWidth;  // Случайная позиция по горизонтали
        const startY = Math.random() * window.innerHeight; // Случайная позиция по вертикали

        firework.style.left = `${startX}px`;
        firework.style.top = `${startY}px`;

        container.appendChild(firework);

        // Убираем элемент после окончания анимации
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }
}




function start_level(all_parrots, parrots_count, min_parrots_count=2, max_parrots_count=9) {

    function showLife(){
        life_span.textContent = lifeCount
    }

    const round_parrots = all_parrots.slice(0, parrots_count);

    const parrots = round_parrots.flatMap(parrot => [parrot, parrot]);

    let winMatchCount = parrots_count
    let matchCount = 0
    let maxLifeCount = parrots_count
    let lifeCount = maxLifeCount

    showLife()

    const flippedCards = new Set();

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    const gameBoard = document.getElementById('gameBoard')
    const gameBoardClass = 'game-board-' + parrots_count
    gameBoard.classList.replace('game-board', gameBoardClass)


    function shuffle(array) {
        audio_shuffle.play()
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(parrots);
        gameBoard.innerHTML = '';
         parrots.forEach((parrot, index) => {
            setTimeout(() => {
                putCard(parrot, gameBoard);
            }, index * 100);  // 300 миллисекунд задержка между картами
        });
    }

    function putCard(parrot, gameBoard) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.parrot = parrot;

        const img = document.createElement('img')
        img.src = 'images/' + parrot
        img.style.display = 'none'
        card.appendChild(img)

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('flip')) return;

        this.classList.add('flip');
        audio_flip.play()

//        if (parrots_count > 4) {
//            audio_flip.play()
//        }
        this.querySelector('img').style.display = 'block';

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.parrot === secondCard.dataset.parrot;

        if (isMatch) {
            disableCards()
            checkWin()
        } else {
            unflipCards()
            changeLife(firstCard)
            changeLife(secondCard)
        }
    }

    function changeLife(someCard) {
        if (flippedCards.has(someCard.dataset.parrot)) {
            audio_failure.play()
            lifeCount -= 1
            showLife()
        }
        if (lifeCount === 0) {
            endGame()
        }
        flippedCards.add(someCard.dataset.parrot)
    }

    function endGame() {
        audio_game_over.play()
        setTimeout(() => {
          gameBoard.classList.replace(gameBoardClass, 'game-board')
          start_level(all_parrots, min_parrots_count, min_parrots_count, max_parrots_count)
        }, 3000);
    }

    function checkWin() {
        matchCount += 1
        if (matchCount === winMatchCount) {
            createFireworks()
            audio_victory.play()
            setTimeout(() => {
              newLevel()
            }, 3000);
        }
    }

    function newLevel() {

        gameBoard.classList.replace(gameBoardClass, 'game-board')

        let new_level_parrot_count = parrots_count + 1
        if (new_level_parrot_count > max_parrots_count) {
            new_level_parrot_count = min_parrots_count
        }
        start_level(all_parrots, new_level_parrot_count, min_parrots_count, max_parrots_count)
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

            firstCard.querySelector('img').style.display = 'none';
            secondCard.querySelector('img').style.display = 'none';

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    //document.getElementById('restartButton').addEventListener('click', createBoard);

    createBoard();
}

const all_parrots = [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png'
]

start_level(all_parrots, 2)