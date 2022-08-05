const DisplayControl = (() => {
    const playBtn = document.getElementById("play-btn");
    const PVPSection = document.getElementById("PVP-section");
    const AISection = document.getElementById("AI-section");
    const arrows = document.querySelectorAll(".arrow");
    const grid = document.getElementById("grid-container");
    const inputNames = document.querySelectorAll(`[name="name"]`);
    const playTypeSelection = document.getElementById("play-type-selection");
    let gameTypeSelected = document.querySelector(".selected").textContent;
    const pvp = document.querySelector("#PVP");
    const ai = document.querySelector("#AI");
    let activated = false;
    let player1;
    let player2;
    let input1 = "";
    let input2 = "";
    let statusDisplay = document.getElementById("status-display");
    let enterNameMsg = "Enter name";
    document.getElementById("player1-name").value = "";
    document.getElementById("player2-name").value = "";

    //ARROW EVENT Section: -----------------------------------------------------
    arrows.forEach(arrow => {
        arrow.addEventListener("click", toggleGameType);
    });

    function toggleGameType() {

        //PVP selected
        if (!checkGameTypeIsPVP()) {
            toggleClass(ai, pvp, "selected");
            toggleClass(PVPSection, AISection, "collapse");
            if (!checkStringIsNotEmpty(input1) || !checkStringIsNotEmpty(input2)) {
                activated = false;
                togglePlayBtn(false);
            }
        }
        //AI selected 
        if (checkGameTypeIsPVP()) {
            toggleClass(pvp, ai, "selected");
            toggleClass(AISection, PVPSection, "collapse");
            activated = true;
            togglePlayBtn(true);

        }
        gameTypeSelected = document.querySelector(".selected").textContent;
        console.log("GameType in eventlistener", gameTypeSelected);
    }

    function toggleClass(removeClass, addClass, className) {
        removeClass.classList.remove(className);
        addClass.classList.add(className);
    }

    function checkGameTypeIsPVP() {
        if (gameTypeSelected === "PVP") {
            return true;
        }
        if (gameTypeSelected === "AI") {
            return false;
        }
    }

    function togglePlayBtn(bool) {
        if (bool) {
            playBtn.classList.add("play-btn-activated");
        } else {
            playBtn.classList.remove("play-btn-activated");
        }
    }

    function checkStringIsNotEmpty(str) {
        if (str.trim() !== "") {
            return true;
        }

        return false;
    }

    inputNames.forEach(inputBox => {
        inputBox.addEventListener("keyup", validateInput);
    });

    function validateInput() {
        input1 = document.getElementById("player1-name").value;
        input2 = document.getElementById("player2-name").value;
        console.log(input1, input2);

        if (!checkStringIsNotEmpty(input1)) {
            togglePlayBtn(false);
            activated = false;
            document.getElementById("player1-alert").textContent = enterNameMsg;
        } else {
            document.getElementById("player1-alert").textContent = "";
        }
        if (!checkStringIsNotEmpty(input2)) {
            togglePlayBtn(false);
            activated = false;
            document.getElementById("player2-alert").textContent = enterNameMsg;
        } else {
            document.getElementById("player2-alert").textContent = "";
        }
        if (checkStringIsNotEmpty(input1) && checkStringIsNotEmpty(input2)) {
            togglePlayBtn(true);
            activated = true;
        }
    }

    //Play Event Section: ---------------------------------------------------
    playBtn.addEventListener("click", playBtnHandler);


    function playBtnHandler() {
        if (activated) {
            if (checkGameTypeIsPVP()) {
                player1 = Player(input1, 'X');
                player2 = Player(input2, 'O');

            } else {
                player1 = Player("You", 'X');
                player2 = Player('AI', 'O');
            }
            toggleNewGame();
        }
    }


    function toggleNewGame() {
        if (checkBtnIsPlay(playBtn.textContent)) {
            GameBoard.activateBoard(grid);
            GameBoard.getGameType(gameTypeSelected);
            statusDisplay.textContent = player1.playerTurn;
            playBtn.textContent = "Replay";
            playTypeSelection.classList.add("hide");
        } else {
            GameBoard.clearBoard();
            GameBoard.deactivateBoard(grid);
            statusDisplay.textContent = "";
            playBtn.textContent = "Play";
            playTypeSelection.classList.remove("hide");
        }
    }

    function checkBtnIsPlay(buttonText) {
        if (buttonText === "Play") {
            return true;
        }
        if (buttonText === "Replay") {
            return false;
        }
    }

    const displayWhosTurn = (counter) => {

        if (counter > 0) {
            if (counter % 2 === 0) {
                statusDisplay.textContent = player1.playerTurn;
                GameBoard.getCurrentPlayer(player2);
            } else {
                statusDisplay.textContent = player2.playerTurn;
                GameBoard.getCurrentPlayer(player1);
            }
        } else if (counter === 0) {
            GameBoard.getCurrentPlayer(player1);
        }

    }

    const displayWinner = (winner) => {
        if (winner === undefined) {
            statusDisplay.textContent = "It's a tie!";
        } else {
            statusDisplay.textContent = winner.playerWin;
        }
        GameBoard.deactivateBoard(grid);
    }

    return { displayWhosTurn, displayWinner };
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Player = (name, symbol) => {
    const playerWin = `${name} won!`;
    let playerTurn;
    if (name === "You") {
        playerTurn = `Your turn`;
    } else {
        playerTurn = `${name}'s turn`;
    }
    return { name, symbol, playerWin, playerTurn };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let targetIndex;
    let count = 0;
    let currentPlayer;
    let gameType;
    let AIMove;
    let gameOver = false;

    function playerMoveTracker(e) {


        targetIndex = e.target.id.split("-").pop();
        // if (count === 0) {
        //     DisplayControl.displayWhosTurn(0);
        // }

        if (board[targetIndex] === "") {
            count++;
            DisplayControl.displayWhosTurn(count);
            console.log(currentPlayer);
            board[targetIndex] = currentPlayer.symbol;
            document.getElementById(`box-${targetIndex}`).textContent = currentPlayer.symbol;
            console.log(currentPlayer.name);
        }

        if (count >= 5) {
            checkForWin(currentPlayer);
        }

        if (gameType === "AI" && !gameOver) {
            count++;
            AIMove = getAIMove();
            setTimeout(function() {
                DisplayControl.displayWhosTurn(count);
                board[AIMove] = currentPlayer.symbol;
                document.getElementById(`box-${AIMove}`).textContent = currentPlayer.symbol;
                console.log(currentPlayer.name);
                if (count >= 5) {
                    checkForWin(currentPlayer);
                }
            }, 400);
        }


    }


    function getAIMove() {
        let availableSpotsArr = [];
        let randomNum;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                availableSpotsArr.push(i);
            }
        }
        randomNum = Math.floor(Math.random() * (availableSpotsArr.length));
        return availableSpotsArr[randomNum];
    }

    const activateBoard = (grid) => {
        gameOver = false;
        grid.addEventListener("click", playerMoveTracker, true);
        console.log("board activated!");
    }

    const deactivateBoard = (grid) => {
        gameOver = true;
        grid.removeEventListener("click", playerMoveTracker, true);
        console.log("board deactivated");
        count = 0;

    }

    function checkForWin(currentPlayer) {

        for (let i = 0; i < board.length; i += 3) {
            console.log(i);
            if (board[i] === currentPlayer.symbol) {
                if (board[i + 1] === currentPlayer.symbol) {
                    if (board[i + 2] === currentPlayer.symbol) {
                        console.log("win row");

                        DisplayControl.displayWinner(currentPlayer);
                        gameOver = true;
                    }
                }
            }
        }

        for (let i = 0; i <= 2; i++) {
            console.log(i);
            if (board[i] === currentPlayer.symbol) {
                if (board[i + 3] === currentPlayer.symbol) {
                    if (board[i + 6] === currentPlayer.symbol) {
                        console.log("win col");

                        DisplayControl.displayWinner(currentPlayer);
                        gameOver = true;
                    }
                }
            }
        }

        for (let i = 0; i < board.length; i += 4) {
            console.log(i);
            if (board[i] === currentPlayer.symbol) {
                if (i === (board.length - 1)) {
                    console.log("Win diag left to right");

                    DisplayControl.displayWinner(currentPlayer);
                    gameOver = true;
                }
            } else {
                break;
            }
        }

        for (let i = 2; i <= 6; i += 2) {
            console.log(i);
            if (board[i] === currentPlayer.symbol) {
                if (i === 6) {
                    console.log("Win diag right to left");

                    DisplayControl.displayWinner(currentPlayer);
                    gameOver = true;
                }
            } else {
                break;
            }
        }

        if (count === 9) {

            DisplayControl.displayWinner(undefined);
            gameOver = true;
        }
    }

    const getCurrentPlayer = (player) => {
        currentPlayer = player;
    }

    const getGameType = (game) => {
        gameType = game;
    }

    const clearBoard = () => {
        board.forEach((box, index) => {
            board[index] = "";
            box = "";
            document.getElementById(`box-${index}`).textContent = box;
            gameOver = false;
        });
    }

    return { activateBoard, deactivateBoard, getCurrentPlayer, getGameType, clearBoard };
})();