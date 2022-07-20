const DisplayControl = (() => {
    const playBtn = document.getElementById("play-btn");
    const PVPSection = document.getElementById("PVP-section");
    const AISection = document.getElementById("AI-section");
    const arrows = document.querySelectorAll(".arrow");
    const grid = document.querySelectorAll(".grid-boxes");

    playBtn.addEventListener("click", () => {
        GameBoard.startGame();
        GameBoard.printBoard();
    });

    arrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            if (PVPSection.classList.value === "collapse") {
                PVPSection.classList.remove("collapse");
                AISection.classList.add("collapse");
            } else if (PVPSection.classList.value === "") {
                PVPSection.classList.add("collapse");
                AISection.classList.remove("collapse");
            }
            console.log("PVP", PVPSection.classList);
            console.log("AI", AISection.classList);
        });
    });

    grid.forEach(box => {
        box.addEventListener("click", () => {
            console.log(box);
        });
    });

    const announceWinner = console.log("You win!");

    return accounceWinner;
})();

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];


    const startGame = () =>
        console.log("Game started");


    //const board = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

    const printBoard = () => board.forEach((box, index) => {
        document.getElementById(`box-${index}`).textContent = box;
    });

    return { startGame, printBoard };
})();


const GamePlay = (() => {
    const gameTypeSelected = document.getElementById();

    const gameType = () => {

    }
})();


const Player = () => {


}