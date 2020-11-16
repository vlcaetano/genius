const buttonElements = document.querySelectorAll('.genius-button')
const controlElement = document.querySelector('.control .background')
const controlStatusElement = document.querySelector('.control p')
const container = document.querySelector('.container')

const scoreElement = document.querySelector('.score')
const highScoreElement = document.querySelector('.high-score')

class QueueNode {
  constructor(btnElement, next) {
    this.btnElement = btnElement
    this.next = next
  }
}

let aux = null

let roundAnswers = null
let lastAnswer = null
let answersLenght = 0

let playerAnswers = null
let lastPlayerAnswer = null

let difficulty = 1
let intervalDecrease = 0
let score = 0
let highScore = 0
let waitingPlayerAnswer = false
let canStartRound = true

const getRandomValueAtArray = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const toggleButtonsCursorStyle = () => {
  for (let element of buttonElements) {
    element.style.cursor = element.style.cursor === 'pointer' ? '' : 'pointer'
  }
}

const displaySequence = (roundAns) => {
  setTimeout(() => {
    roundAns.btnElement.classList.add('active')

    setTimeout(() => {
      roundAns.btnElement.classList.remove('active')
      roundAns = roundAns.next

      if (roundAns) {
        displaySequence(roundAns)
      } else {
        waitingPlayerAnswer = true

        controlElement.style.backgroundColor = 'lightblue'
        controlStatusElement.innerHTML = 'REPRODUZA'

        toggleButtonsCursorStyle()
      }
    }, 750 - intervalDecrease)
  }, 750 - intervalDecrease)
}

const callRound = () => {
  controlElement.style.cursor = 'auto'
  controlElement.style.backgroundColor = 'yellow'
  controlStatusElement.innerHTML = 'OBSERVE'

  const loopLimit = difficulty - answersLenght
  
  for (let i = 0; i < loopLimit; i++) {
    if (roundAnswers == null) {
      roundAnswers = new QueueNode(getRandomValueAtArray(buttonElements), null)
      lastAnswer = roundAnswers
    } else {
      lastAnswer.next = new QueueNode(getRandomValueAtArray(buttonElements), null)
      lastAnswer = lastAnswer.next
    }
    answersLenght++
  }
  aux = roundAnswers
  displaySequence(roundAnswers)
}

const revampDifficulty = (toIncrease) => {
  if (toIncrease) {
    difficulty++
    intervalDecrease = (intervalDecrease < 400) ? intervalDecrease + 50 : intervalDecrease
  } else {
    difficulty = 1
    intervalDecrease = 0
    
  }
}

const processClick = (element) => {
  if (!waitingPlayerAnswer) {
    return
  }

  element.classList.add('active')

  setTimeout(() => {
    element.classList.remove('active')
  }, 500)

  if (playerAnswers == null) {
    playerAnswers = new QueueNode(element, null)
    lastPlayerAnswer = playerAnswers
  } else {
    lastPlayerAnswer.next = new QueueNode(element, null)
    lastPlayerAnswer = lastPlayerAnswer.next
  }

  if (element !== aux.btnElement || aux.next == null) {
    processAnswers()
  } else {
    aux = aux.next
  }
  
}

const processAnswers = () => {
  aux = roundAnswers
  waitingPlayerAnswer = false

  toggleButtonsCursorStyle()

  let allCorrect = true

  while(aux != null && playerAnswers != null) {
    if (aux.btnElement === playerAnswers.btnElement) {
      aux = aux.next
      playerAnswers = playerAnswers.next
    } else {
      allCorrect = false
      break
    }
  }

  if (allCorrect) {
    controlElement.style.cursor = 'pointer'
    controlElement.style.backgroundColor = 'green'

    controlStatusElement.innerHTML = 'ACERTOU'

    setTimeout(() => {
      callRound()
    }, 1500)
  } else {
    controlElement.style.cursor = 'pointer'
    controlElement.style.backgroundColor = 'red'

    controlStatusElement.innerHTML = 'RECOMEÇAR'

    highScore = (score > highScore) ? score : highScore

    canStartRound = true

    roundAnswers = null
    lastAnswer = null
    answersLenght = 0
  }

  score = (allCorrect) ? difficulty : score
  score = (allCorrect) ? score : 0

  playerAnswers = null
  lastPlayerAnswer = null
  updateScore()
  revampDifficulty(allCorrect)
}

const updateScore = () => {
  scoreElement.innerHTML = score
  highScoreElement.innerHTML = highScore
}

for (let element of buttonElements) {
  element.onclick = () => {
    processClick(element)
  }

  element.onmouseenter = () => {
    if (waitingPlayerAnswer) {
      element.classList.add('hover')
    }
  }

  element.onmouseleave = () => {
    element.classList.remove('hover')
  }
}

controlElement.onclick = () => {
  if (canStartRound) {
    callRound()
    controlElement.classList.remove('hover')
    canStartRound = false
  }
}

controlElement.onmouseenter = () => {
  if(canStartRound === true) {
    controlElement.classList.add('hover')
  }
}

controlElement.onmouseleave = () => {
  controlElement.classList.remove('hover')
}