// Feature functionalities to add:
//  1- user can choose bot difficulty
//  2- user can choose vs bot/friend mode
//  3- user can see the result of player1 vs player2/bot


const gridElement = document.getElementById("grid")
const gameStateHolder = document.getElementById("game-state-holder")
const mainPlayerCharacter = "X"
const friendOrBotCharacter = "O"
const boxes = []

let nbEmptyBoxes = 9
let botDifficulty = "easy" // <--- not used yet!
let isVsBotMode = true
let gameEnd = false
let playerTurn = true
let isWaiting = false

document.addEventListener("click", function(e) {
    const elementId = e.target.id
    if(!isWaiting && elementId.startsWith("box")) {
        const boxIndex = elementId[elementId.length - 1]
        handleGameLogic(boxIndex)
    }
    else if(elementId === "reset-btn" && !isWaiting) {
        resetGame()
    }
})

function handleGameLogic(boxIndex) {
    if(!gameEnd && !isWaiting && isPlaceEmpty(boxIndex)) {
        const boxElement = boxes[boxIndex]
        if(playerTurn) {
            boxElement.textContent = mainPlayerCharacter
            boxElement.classList.add("red")
            boxElement.style.animation="colorfadeerr-red 0.5s"
            gameStateHolder.textContent = friendOrBotCharacter+"'s turn"
        }
        else if(!isVsBotMode) {
            boxElement.textContent = friendOrBotCharacter
            boxElement.style.animation="colorfadeerr-white 0.5s"
            gameStateHolder.textContent = mainPlayerCharacter+"'s turn"
        } 
        const lastPlayedCharacter = boxElement.textContent
        isGameFinish(lastPlayedCharacter)

        if(isVsBotMode && !gameEnd && nbEmptyBoxes !== 0) { 
            isWaiting = true
            setTimeout(function() {
                const randomBox = boxes[ getRandomIndex() ]
                randomBox.textContent = friendOrBotCharacter
                randomBox.style.animation="colorfadeerr-white 0.5s"
                gameStateHolder.textContent = mainPlayerCharacter+"'s turn"

                const lastPlayedCharacter = randomBox.textContent
                isGameFinish(lastPlayedCharacter)
                
                isWaiting = false
            }, 1000)
        }
    }
}

function isGameFinish(character) {
    nbEmptyBoxes--
    playerTurn = !playerTurn

    let endMessageHtml = "" 
    if(isWinner(character)) {
        gameEnd = true
        endMessageHtml = character+" wins"
    }
    
    if(!gameEnd && isDraw()) {
        gameEnd = true
        endMessageHtml = "Tie!"
    }

    if(gameEnd) {
        gameStateHolder.textContent = endMessageHtml
    }
}

function getRandomIndex() {
    const randomIndex = Math.floor( Math.random() * 9 ) + 1 // range: [1-9]
    if(isPlaceEmpty(randomIndex))
        return randomIndex
    return getRandomIndex()
}

function isPlaceEmpty(boxIndex) {
    return boxes[boxIndex].textContent === ""
}

function checkWinSet(character, winSet) {
    return winSet.every(index => boxes[index].textContent === character)
}

function playWinAnimation(isPlayerOneWin, winSet) {
    if(isPlayerOneWin)
        winSet.forEach( index => boxes[index].style.animation = "flashing-red 2.5s")
    else
        winSet.forEach( index => boxes[index].style.animation = "flashing-white 2.5s")
}

function isWinner(character) {
    let isWinner = false
    const winCombinationSets = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
        [1, 5, 9], [3, 5, 7]             // diagonals
    ]

    winCombinationSets.forEach( winSet => {
        if (checkWinSet(character, winSet)) {
            isWinner = true
            playWinAnimation(character===mainPlayerCharacter, winSet)
        }
    })

    return isWinner
}

function isDraw() {
    return nbEmptyBoxes === 0
}

function resetGame() {
    boxes.forEach( box => {
        if(box !== 0) { // avoiding the 0-index
            box.textContent=""
            box.classList.remove("red")
        }
    })

    gameEnd = false
    playerTurn = true
    isWaiting = false
    nbEmptyBoxes = 9
    gameStateHolder.textContent = "X's turn"
}

function render() {
    boxes.push(0) // to avoid using index 0

    /*
        The following two for loops can be one loop, but it generate unknown error to me.
        The divs that will be in the boxes array will not be connected properly with
        the page browser where the browser message is "Node cannot be found in the current page."
    */

    for(let i=1; i<=9 ;i++) {
        gridElement.innerHTML += `<div id="box${i}"></div>`
    }
    for(let i=1; i<=9 ;i++) {
        boxes.push(document.getElementById(`box${i}`))
    }
}

render()