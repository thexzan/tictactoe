document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("startGame");
    const boardElement = document.getElementById("boardSize");
    const whosPlaying = document.getElementById("whosPlaying");
    const gameElement = document.getElementById("game");

    const xscore = document.getElementById("xscore");
    const oscore = document.getElementById("oscore");

    const xChar = "🍏";
    const xTurnMsg = `👉 ${xChar}'s Turn`;
    const xTurnColor = "#2ecc71";
    const oChar = "🍎";
    const oTurnMsg = `👉 ${oChar}'s Turn`;
    const oTurnColor = "#f1c40f";
    const winColor = "#dff9fb";

    const squareSize = 75; // in px
    const restartMsg = "RESTART 🚀";
    const rematchMsg = "REMATCH ? 😁";
    const drawMsg = "DRAW 🤣";
    const winningMsg = (player) => `🔥 ${player} WIN 🔥`;

    // SET SCORE FROM LOCAL STORAGE
    const xItemKey = `${xChar}-score`;
    xscore.innerHTML = localStorage.getItem(xItemKey) ?
        parseInt(localStorage.getItem(xItemKey)) :
        0;
    const oItemKey = `${oChar}-score`;
    oscore.innerHTML = localStorage.getItem(oItemKey) ?
        parseInt(localStorage.getItem(oItemKey)) :
        0;

    const isEven = (num) => (num % 2 === 0 ? true : false);
    const isOdd = (num) => (num % 2 === 0 ? false : true);

    // START GAME ON ENTER KEY PRESS
    boardElement.addEventListener("keypress", (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            startGame();
        }
    });

	// START GAME ON START BUTTON CLICK
    startBtn.addEventListener("click", () => startGame());

    const startGame = () => {
        let gameOver = false;

        const boardSize = parseInt(boardElement.value);
        const squareCount = boardSize * boardSize;

        startBtn.innerHTML = restartMsg;
        whosPlaying.innerHTML = xTurnMsg;
        whosPlaying.style.color = xTurnColor;

        const addScore = (e) => {
            const element = e[0] === xChar ? xscore : oscore;
            const currentScore = parseInt(element.innerHTML);
            element.innerHTML = currentScore + 1;

            const itemKey = `${e[0]}-score`;
            const totalScore = localStorage.getItem(itemKey) ?
                parseInt(localStorage.getItem(itemKey)) :
                0;
            localStorage.setItem(itemKey, parseInt(totalScore) + 1);
        };

        const winningLine = (array) => {
            if (!array[0]) return false;
            const isWinner = array.every((e) => e === array[0]);
            if (isWinner) {
                gameOver = true;
                winningPlayer = array;
                addScore(winningPlayer);
                startBtn.innerHTML = rematchMsg;
            }
            return isWinner;
        };

        // CREATE BOARD GAME
        let gameBoard = [];
        for (let i = 0; i < squareCount; i++) {
            gameBoard.push(i);
        }

        // CREATE 2D ARRAY OF THE BOARD - for later use
        const array = gameBoard;
        const array2d = [];
        while (array.length > 0) {
            array2d.push(array.splice(0, boardSize));
        }

        // CREATE BOARD AND SQUARE DIV
        gameElement.innerHTML = '<div id="board"></div>';
        const board = document.getElementById("board");
        board.style.height = squareSize * boardSize + "px";
        board.style.width = squareSize * boardSize + "px";
        board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

        for (let i = 0; i < squareCount; i++) {
            board.innerHTML += `<div class="square" id="${+i.toString()}" />`;
        }
        const squares = document.getElementsByClassName("square");

        let boardClicks = 0;
        board.addEventListener("click", () => {
            if (checkWinner()) {
                whosPlaying.style.color = winColor;
                whosPlaying.innerHTML = winningMsg(winningPlayer[0]);
            } else if (isEven(boardClicks)) {
                whosPlaying.style.color = oTurnColor;
                whosPlaying.innerHTML = oTurnMsg;
            } else {
                whosPlaying.style.color = xTurnColor;
                whosPlaying.innerHTML = xTurnMsg;
            }
            boardClicks++;

            // CHECK IF DRAW
            if (
                boardClicks === squareCount &&
                !whosPlaying.innerHTML.includes("WIN")
            ) {
                whosPlaying.innerHTML = drawMsg;
                whosPlaying.style.color = "#e056fd";
                startBtn.innerHTML = rematchMsg;
            }
        });

        // RESET AND STORE SQUARE CLICKS
        let squareClicks = [];
        for (let i = 0; i < squareCount; i++) {
            squareClicks[i] = 0;
        }

        // CHECK WINNER
        const checkWinner = () => {
            if (gameOver) return true;
            // CHECK EVERY ROWS
            for (let row = 0; row < boardSize; row++) {
                // INSERT EACH COLUMN
                const currentRow = [];
                for (let column = 0; column < boardSize; column++) {
                    const value = array2d[row][column];
                    currentRow.push(squares[value].innerHTML);
                }

                // CHECK CURRENT ROW
                if (winningLine(currentRow)) return true;
            }

            // CHECK EVERY COLUMN
            for (let col = 0; col < boardSize; col++) {
                const currentCol = [];
                for (let row = 0; row < boardSize; row++) {
                    const value = array2d[row][col];
                    currentCol.push(squares[value].innerHTML);
                }

                if (winningLine(currentCol)) return true;
            }

            const leftDiagonal = [];
            for (let row = 0; row < boardSize; row++) {
                const value = array2d[row][row];
                leftDiagonal.push(squares[value].innerHTML);
            }

            if (winningLine(leftDiagonal)) return true;

            const rightDiagonal = [];
            let column = boardSize - 1;
            for (let row = 0; row < boardSize; row++) {
                const value = array2d[row][column];
                rightDiagonal.push(squares[value].innerHTML);
                column -= 1;
            }

            if (winningLine(rightDiagonal)) return true;
        };

        // COUNT CLICK ON SQUARES
        const countClicks = function() {
            if (gameOver) return false;
            const divID = this.getAttribute("id");
            squareClicks[divID] += 1;
            if (isEven(boardClicks) && squareClicks[divID] === 1) {
                this.innerHTML = xChar;
                this.style.backgroundColor = xTurnColor;
            } else if (isOdd(boardClicks) && squareClicks[divID] === 1) {
                this.innerHTML = oChar;
                this.style.backgroundColor = oTurnColor;
            } else if (!checkWinner()) {
                boardClicks -= 1;
            }
        };

        // REGISTER CLICK EVENT LISTENER TO EACH SQUARE
        for (var i = 0; i < squareCount; i++) {
            squares[i].addEventListener("click", countClicks);
        }
    };

    // START GAME ON LOAD
    startGame();
});