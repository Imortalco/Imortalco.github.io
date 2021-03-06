document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let myHeading = document.querySelector('h1')
    let userBtn = document.querySelector('#change-user')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The blocks
    const lBlock = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zBlock = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tBlock = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oBlock = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iBlock= [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a block
    let random = Math.floor(Math.random()*theBlocks.length)
    let current = theBlocks[random][currentRotation]

    //draw the Tetromino
    function draw() {
        current.forEach(index => {
        squares[currentPosition + index].classList.add('block')
        squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
        squares[currentPosition + index].classList.remove('block')
        squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    //assign functions to keys => keycode.info
    function control(e) {
        if(e.keyCode === 37) {
        moveLeft()
        } else if (e.keyCode === 38) {
        rotate()
        } else if (e.keyCode === 39) {
        moveRight()
        } else if (e.keyCode === 40) {
        moveDown()
        }
    }
    document.addEventListener('keydown', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new block falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theBlocks.length)
        current = theBlocks[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
        }
    }

    //moving the blocks left
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
        }
        draw()
    }

    //moving the blocks right
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
        }
        draw()
    }

    
    ///rotations of block at the edge
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
        if (isAtLeft()){
            currentPosition -= 1
        checkRotatedPosition(P)
        }
        }
    }
    
    //rotate the blocks
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
        }
        current = theBlocks[random][currentRotation]
        checkRotatedPosition()
        draw()
    }
    
    //show up-next block in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    const upcomingBlocks = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lBlock
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zBlock
        [1, displayWidth, displayWidth+1, displayWidth+2], //tBlock
        [0, 1, displayWidth, displayWidth+1], //oBlock
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iBlock
    ]

    //display the shape in the mini-grid
    function displayShape() {
        //remove blocks
        displaySquares.forEach(square => {
        square.classList.remove('block')
        square.style.backgroundColor = ''
        })
        upcomingBlocks[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('block')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //adding functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
        clearInterval(timerId)
        timerId = null
        } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theBlocks.length)
        displayShape()
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('block')
            squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
        }
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
        alert('Congratulations, you have scored ' + score + ' points !')
        }
    }

    //getting player name
    function setUserName() {
        let myName = prompt('Please enter your username.');
        
        if(!myName) {
          setUserName();
        } else {
          localStorage.setItem('name', myName);
          myHeading.textContent = 'Hello, ' + myName;
        }
      }
      
      if(!localStorage.getItem('name')) {
        setUserName();
      } else {
        let storedName = localStorage.getItem('name');
        myHeading.textContent = 'Hello, ' + storedName;
      }

      userBtn.onclick=setUserName
})