const gameboard = document.querySelector("#gameboard");
const player = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;

let playerGo = 'black';
player.textContent = 'black';

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook,

]

function createBoard() {
    startPieces.forEach((pieces, i) => {
        const square =  document.createElement('div');
        square.classList.add('square');
        square.innerHTML = pieces
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i);
        // square.classList.add('green');
        const row = Math.floor( (63 - i) / 8 ) + 1;
        if ( row % 2 === 0 ) {
            square.classList.add( i % 2 === 0 ? "brown" : "green")
        } else {
            square.classList.add(i % 2 === 0 ? "green" : "brown")
        }

        if ( i <= 15) {
            square.firstChild.firstChild.classList.add('black')
        }

        if(i >= 48) {
            square.firstChild.firstChild.classList.add('white')
        }
        gameboard.append(square);
    })
}

createBoard();


const allSquares = document.querySelectorAll(".square");


allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId;
let draggedElement;

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault();
    // console.log(e.target)
}

function dragDrop(e) {
    e.stopPropagation();
    // console.log('player Go', playerGo)
    // console.log('e.target', e.target)
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)

    if (correctGo) {

        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove()
            changePlayer()
            return
        }

        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "you cannot go here!";
            setTimeout(() => 
                infoDisplay.textContent = "", 2000)
            return
        }

        if (valid) {
            e.target.append(draggedElement)
            changePlayer()
            return
        }
    }

    // e.target.append(draggedElement)

    changePlayer()
}



function checkIfValid(target) {
    // console.log(target)
    const targetId = Number(target.getAttribute('square-id') || target.parentNode.getAttribute('square-id'))


    const startId = Number(startPositionId)
    const piece = draggedElement.id;
    console.log('targetId', targetId)
    console.log('startid', startId)
    console.log('piece', piece)

    switch(piece) {
        case 'pawn':
            const starterRow =  [8, 9, 10, 11, 12, 13, 14, 15]
            if(
                starterRow.includes(startId) && startId + width * 2 === targetId || startId + width === targetId || startId + width - 1 === targetId && document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild || startId + width + 1 === targetId && document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild
              ) {
                return true
              }
              break;
    }
}



function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = "white"
        player.textContent = 'white'
    } else {
        revertIds()
        playerGo = 'black'
        player.textContent = 'black'
    }
}


function reverseIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', (width * width -1) - i)

    })
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', i)

    })
}