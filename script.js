const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const grid = document.querySelectorAll(".grid-boxes");

    const playerMove = (e) => { console.log(e.target) };

    const startGame = () => grid.forEach(box => {
        box.addEventListener("click", playerMove);
    });
    const endGame = () => grid.forEach(box => {
        box.removeEventListener("click", playerMove);
    });



    const printBoard = () => board.forEach((box, index) => {
        document.getElementById(`box-${index}`).textContent = box;
    });

    return { startGame, endGame, printBoard };
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const displayControl = (() => {
    const playBtn = document.getElementById("play-btn");
    const PVPSection = document.getElementById("PVP-section");
    const AISection = document.getElementById("AI-section");
    const arrows = document.querySelectorAll(".arrow");

    const inputNames = document.querySelectorAll(`[name="name"]`);
    let gameTypeSelected = document.querySelector(".selected").textContent;
    let player1;
    let player2;
    let input1 = "";
    let input2 = "";

    let enterNameMsg = "Enter name";
    document.getElementById("player1-name").value = "";
    document.getElementById("player2-name").value = "";

    playBtn.addEventListener("click", () => {

        if (gameTypeSelected === "PVP") {
            if (checkInput(input1) && checkInput(input2)) {
                player1 = Player(input1, 'X');
                player2 = Player(input2, 'O');
                if (document.getElementById("play-btn").textContent === "Play") {
                    document.getElementById("play-btn").textContent = "Replay";
                    document.getElementById("player-selection").classList.add("hide");
                } else if (document.getElementById("play-btn").textContent === "Replay") {
                    document.getElementById("play-btn").textContent = "Play";
                    document.getElementById("player-selection").classList.remove("hide");
                }
            }
        } else if (gameTypeSelected === "AI") {
            player1 = Player("You", 'X');
            player2 = Player('AI', 'O');

            if (document.getElementById("play-btn").textContent === "Play") {
                document.getElementById("play-btn").textContent = "Replay";
                document.getElementById("player-selection").classList.add("hide");
            } else if (document.getElementById("play-btn").textContent === "Replay") {
                document.getElementById("play-btn").textContent = "Play";
                document.getElementById("player-selection").classList.remove("hide");
            }

        }
        if (document.getElementById("play-btn").textContent === "Replay") {
            gameBoard.startGame();
        } else {
            gameBoard.endGame();
        }

    });

    inputNames.forEach(inputBox => {
        inputBox.addEventListener("keyup", () => {
            input1 = document.getElementById("player1-name").value;
            input2 = document.getElementById("player2-name").value;

            if (!checkInput(input1)) {
                document.getElementById("player1-alert").textContent = enterNameMsg;
            } else {
                document.getElementById("player1-alert").textContent = "";
            }
            if (!checkInput(input2)) {
                document.getElementById("player2-alert").textContent = enterNameMsg;
            } else {
                document.getElementById("player2-alert").textContent = "";
            }
            if (checkInput(input1) && checkInput(input2)) {
                playBtn.classList.add("play-btn-activated");
            } else {
                playBtn.classList.remove("play-btn-activated");
            }
        });
    });

    arrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            //PVP selected
            if (PVPSection.classList.value === "collapse") {
                if (checkInput(input1) && checkInput(input2)) {
                    playBtn.classList.add("play-btn-activated");
                } else {
                    playBtn.classList.remove("play-btn-activated");
                }
                PVPSection.classList.remove("collapse");
                AISection.classList.add("collapse");
                document.querySelector("#PVP").classList.add("selected");
                document.querySelector("#AI").classList.remove("selected");

            }
            //AI selected 
            else if (PVPSection.classList.value === "") {
                PVPSection.classList.add("collapse");
                AISection.classList.remove("collapse");
                document.querySelector("#AI").classList.add("selected");
                document.querySelector("#PVP").classList.remove("selected");
                playBtn.classList.add("play-btn-activated");
            }
            gameTypeSelected = document.querySelector(".selected").textContent;
        });
    });

    function checkInput(str) {
        if (str.trim() !== "") {
            return true;
        }
        return false;
    }

    return { player1, player2 };
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const pvpGamePlay = (() => {


    return {};
})();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const aiGamePlay = (() => {



    const printGameType = (gameType) =>
        console.log(gameType);

    return {};
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Player = (name, symbol) => {
    const playerWin = `${name} won!`;
    const playerTurn = `${name}'s turn`;
    return { name, symbol, playerWin, playerTurn };
}