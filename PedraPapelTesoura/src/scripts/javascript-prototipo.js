const state = {
  audio: {
      backgroundAudio: false,
  },
  score: {
      playerScore: 0,
      computerScore: 0,
      scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
      avatar: document.getElementById("card-image"),
      name: document.getElementById("card-name"),
      type: document.getElementById("card-type"),
  },
  playerSides: {
      player1: "player-cards",
      player1Box: document.querySelector("#player-cards"),
      player2: "computer-cards",
      player2Box: document.querySelector("#computer-cards"),
  },
  fieldCards: {
      player: document.getElementById("player-field-card"),
      computer: document.getElementById("computer-field-card"),
  },
  actions: {
      button: document.getElementById("next-duel"),
  },
  }
  
  const pathImages = "./src/assets/icons/"
  
  const cardData = [
  {
      id: 0,
      name: "Papel",
      type: "Papel",
      img: `${pathImages}carta-papel-azul.png`,
      winOf: [1, 3],
      loseOf: [2, 4],
  },
  {
      id: 1,
      name: "Pedra",
      type: "Pedra",
      img: `${pathImages}carta-pedra-azul.png`,
      winOf: [2, 4],
      loseOf: [0, 3],
  },
  {
      id: 2,
      name: "Tesoura",
      type: "Tesoura",
      img: `${pathImages}carta-tesoura-azul.png`,
      winOf: [0, 4],
      loseOf: [1, 3],
  },
  {
      id: 3,
      name: "Spock",
      type: "Spock",
      img: `${pathImages}carta-spock-azul.png`,
      winOf: [2, 1],
      loseOf: [4, 0],
  },
  {
      id: 4,
      name: "Lagarto",
      type: "Lagarto",
      img: `${pathImages}carta-lagarto-azul.png`,
      winOf: [3, 0],
      loseOf: [1, 2],
  
  },
  ]
  
  const init = () => {
  removeAllCardsImages()
  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"
  
  drawCards(3, state.playerSides.player1)
  drawCards(3, state.playerSides.player2)
  }
  
  const drawCards = (cardsNumber, fieldSide, acc = 0) => {
  if (acc >= cardsNumber){
      return []
  }
  const randomCard =  getRandomCard();
  const cardImage =  createCardImage(randomCard, fieldSide)
  document.getElementById(fieldSide).appendChild(cardImage)
  return  drawCards(cardsNumber, fieldSide, acc + 1 )
  }
  
  const createCardImage = (card, fieldSide) => {
  const cardImage = document.createElement("img");
  
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "./src/assets/icons/ufs-carta-back.png")
  cardImage.setAttribute("data-id", card.id)
  cardImage.classList.add("card");
  
  if (fieldSide === state.playerSides.player1) {
      cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
      })
  
      cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(card.id)
      })
  }
  
  return cardImage;
  }
  
  const setCardsField = async(cardId) => {
  await removeAllCardsImages()
  const computerCard = await getRandomCard()
  const playerCard = cardData[cardId]
  
  state.fieldCards.player.style.display = "block"
  state.fieldCards.computer.style.display = "block"
  
  state.fieldCards.player.src = playerCard.img
  state.fieldCards.computer.src = computerCard.img
  
  const duelResult = await checkDuelResult(playerCard, computerCard)
  
  await updateScore()
  await drawButton(duelResult)
  }
  
  const resetDuel = () => {
  state.cardSprites.name.innerText = "Selecione"
  state.cardSprites.type.innerText = "uma carta"
  state.cardSprites.avatar.src = ""
  
  state.cardSprites.avatar.src = ""
  state.actions.button.style.display = "none"
  
  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"
  
  
  init()
  }
  
  const updateScore = () => {
  state.score.scoreBox.innerText = `Vitorias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`
  }
  
  const drawButton = (result) => {
  state.actions.button.innerText = result.toUpperCase()
  state.actions.button.style.display = "block"
  }
  
  const  checkDuelResult = (playerCard, computerCard) => {
  let duelResult = "EMPATE"
  
  if (playerCard.winOf.includes(computerCard.id)) {
      duelResult = "GANHOU"
      state.score.playerScore++
  }
  
  if (playerCard.loseOf.includes(computerCard.id)) {
      duelResult = "PERDEU"
      state.score.computerScore++
  }
  
  playAudio(duelResult)
  return duelResult
  }
  
  
  const removeAllCardsImages = () => {
  const player1Box = state.playerSides.player1Box
  const player2Box = state.playerSides.player2Box
  
  const imgElementsPlayer1 = [...player1Box.querySelectorAll("img")]
  const imgElementsPlayer2 = [...player2Box.querySelectorAll("img")]
  
  imgElementsPlayer1.map((img) => img.remove())
  imgElementsPlayer2.map((img) => img.remove())
  }
  
  
  const drawSelectedCard = (cardId) => {
  const selectedCard = cardData[cardId]
  
  state.cardSprites.avatar.src = selectedCard.img
  state.cardSprites.name.innerText = selectedCard.name
  state.cardSprites.type.innerText = `Atributo: ${selectedCard.type}`
  }
  
  const getRandomCard = () => {
   const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex]
  }
  
  const playAudio = (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
  }
  
  init()

  function botao() {
    init()
}