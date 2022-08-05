const DisplayControl = (() => {
    const playBtn = document.getElementById("play-btn");
    const PVPSection = document.getElementById("PVP-section");
    const AISection = document.getElementById("AI-section");
    const arrows = document.querySelectorAll(".arrow");
    const grid = document.querySelectorAll(".grid-boxes");
    const inputNames = document.querySelectorAll(`[name="name"]`);
    const playTypeSelection = document.getElementById("play-type-selection");
    let gameTypeSelected = document.querySelector(".selected").textContent;
    const pvp = document.querySelector("#PVP");
    const ai = document.querySelector("#AI");
    const winColor = "rgba(255, 0, 149, 0.493)";
    const defaultColor = "rgba(0, 174, 255, 0.486)";
    let activated = false;
    let playerX;
    let playerO;
    let input1 = "";
    let input2 = "";
    let statusDisplay = document.getElementById("status-display");
    let enterNameMsg = "Enter name";

    document.getElementById("playerX-name").value = "";
    document.getElementById("playerO-name").value = "";

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
        input1 = document.getElementById("playerX-name").value;
        input2 = document.getElementById("playerO-name").value;
        console.log(input1, input2);

        if (!checkStringIsNotEmpty(input1)) {
            togglePlayBtn(false);
            activated = false;
            document.getElementById("playerX-alert").textContent = enterNameMsg;
        } else {
            document.getElementById("playerX-alert").textContent = "";
        }
        if (!checkStringIsNotEmpty(input2)) {
            togglePlayBtn(false);
            activated = false;
            document.getElementById("playerO-alert").textContent = enterNameMsg;
        } else {
            document.getElementById("playerO-alert").textContent = "";
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
                playerX = Player(input1, 'X');
                playerO = Player(input2, 'O');

            } else {
                playerX = Player("You", 'X');
                playerO = Player('AI', 'O');
            }
            toggleNewGame();
        }
    }


    function toggleNewGame() {
        if (checkBtnIsPlay(playBtn.textContent)) {
            grid.forEach(box => {
                box.style.color = defaultColor;
            });

            GameBoard.activateBoard(grid);
            GameBoard.getGameType(gameTypeSelected);
            statusDisplay.textContent = playerX.playerTurn;
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
                statusDisplay.textContent = playerX.playerTurn;
                GameBoard.getCurrentPlayer(playerO);
            } else {
                statusDisplay.textContent = playerO.playerTurn;
                GameBoard.getCurrentPlayer(playerX);
            }
        } else if (counter === 0) {
            GameBoard.getCurrentPlayer(playerX);
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

    const highlightWin = (a, b, c) => {
        document.getElementById(`box-${a}`).style.color = winColor;
        document.getElementById(`box-${b}`).style.color = winColor;
        document.getElementById(`box-${c}`).style.color = winColor;

    }

    return { displayWhosTurn, displayWinner, highlightWin };
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

    function playGame(e) {
        if (gameType === "AI") {
            document.querySelectorAll(".grid-boxes").forEach(box => {
                box.removeEventListener("click", playGame, true);
            });
        }

        makePlayerMove(e);

        if (count >= 5) {
            checkForWin(currentPlayer);
        }

        if (gameType === "AI" && !gameOver) {
            makeAIMove();
            setTimeout(function() {
                document.querySelectorAll(".grid-boxes").forEach(box => {
                    if (box.textContent === "") {
                        console.log("box text", box.textContent, box);
                        box.addEventListener("click", playGame, true);
                    }
                });
            }, 500);
        }
    }

    function makePlayerMove(e) {
        targetIndex = e.target.id.split("-").pop();

        e.target.removeEventListener("click", playGame, true);
        console.log(board[targetIndex]);
        if (board[targetIndex] === "") {
            count++;
            DisplayControl.displayWhosTurn(count);
            console.log(currentPlayer);
            board[targetIndex] = currentPlayer.symbol;
            document.getElementById(`box-${targetIndex}`).textContent = currentPlayer.symbol;
            console.log(currentPlayer.name);
        }
    }

    function makeAIMove() {
        count++;
        AIMove = getRandomAIMove();
        document.getElementById(`box-${AIMove}`).removeEventListener("click", playGame, true);

        setTimeout(function() {

            DisplayControl.displayWhosTurn(count);
            board[AIMove] = currentPlayer.symbol;
            document.getElementById(`box-${AIMove}`).textContent = currentPlayer.symbol;
            console.log(currentPlayer.name);
            if (count >= 5) {
                checkForWin(currentPlayer);
            }
        }, 500);

    }


    function getRandomAIMove() {
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

    function getIntelligentAIMove() {

    }

    const activateBoard = (grid) => {
        gameOver = false;
        grid.forEach(box => {
            box.addEventListener("click", playGame, true);;
        });
        // grid.addEventListener("click", playGame, true);
        console.log("board activated!");
    }

    const deactivateBoard = (grid) => {
        gameOver = true;
        grid.forEach(box => {
            box.removeEventListener("click", playGame, true);;
        });
        // grid.removeEventListener("click", playGame, true);
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
                        DisplayControl.highlightWin(i, i + 1, i + 2);
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
                        DisplayControl.highlightWin(i, i + 3, i + 6);
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
                    DisplayControl.highlightWin(0, 4, 8);
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
                    DisplayControl.highlightWin(2, 4, 6);
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