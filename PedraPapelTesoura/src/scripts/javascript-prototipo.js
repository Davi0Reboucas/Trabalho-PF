//essa função são os anexos para o html (getElementyById), sendo a parte de pontuação, as cartas, os botoes e cada jogador
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

  const pathImages = "./src/assets/icons/" // mostrando em qual parte do arquivo estão os documentos para as imagens das cartas
// neste cardData iremos mostrar todos os fundamentos da carta, desde a sua imagem, seu nome e seu atributo e para quais outras cartas ela vao ganhar ou perder sendo identificado pelo ID
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
  //Essa função ela remove as cartas anteriores, oculta os campos do jogador e do computador em seguida, distribui novas cartas para o jogador e computador.
  const init = () => {
  removeAllCardsImages()
  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  drawCards(3, state.playerSides.player1)
  drawCards(3, state.playerSides.player2)
  }
  //Essa função desenha um número específico de cartas do lado do jogador, ela faz isso chamando-se repetidamente até que o número desejado de cartas tenha sido desenhado e exibido, adicionando cartas uma por uma a sua mão.
  const drawCards = (cardsNumber, fieldSide, acc = 0) => {
  if (acc >= cardsNumber){
      return []
  }
  const randomCard =  getRandomCard();
  const cardImage =  createCardImage(randomCard, fieldSide)
  document.getElementById(fieldSide).appendChild(cardImage)
  return  drawCards(cardsNumber, fieldSide, acc + 1 )
  }
  //A função cria um elemento de imagem para uma carta, define as propriedades e, se a carta for do player, ela permite interatividade deixando que o jogador clique e passe o mouse sobre a carta, verificando qual carta está em sua mão é seus atributos.
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
  //A função e responsável por gerenciar o fluxo do duelo de cartas, entre o jogador e o computador, ela remove as cartas existentes, também obtém novas cartas para ambos, e atualiza a interface para exibir essas cartas, por fim verifica o resultado do duelo e atualiza a pontuação.

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
  //Fusão para redefinir a interface do jogo, fazendo com que atualize os textos, limpe as imagens, oculte botões e campos de cartas, faz com que o jogo comece novamente com a interface toda limpa.

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
  //Essa função monstra quantas vitórias o jogador teve e quantas derrotas o computador sofreu.
  const updateScore = () => {
  state.score.scoreBox.innerText = `Vitorias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`
  }
  //A função congela o resultado e volta para o inicio, quando o resultado for empate
  const drawButton = (result) => {
  state.actions.button.innerText = result.toUpperCase()
  state.actions.button.style.display = "block"
  }
  //Essa função determina o resultado do duelo entre duas cartas, e  atualiza a pontuação do jogador e do computador, retornando o resultado do duelo
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

  //A função faz com que as cartas de sua mão sejam removidas, deixando o espaço que estavam vazios
  const removeAllCardsImages = () => {
  const player1Box = state.playerSides.player1Box
  const player2Box = state.playerSides.player2Box

  const imgElementsPlayer1 = [...player1Box.querySelectorAll("img")]
  const imgElementsPlayer2 = [...player2Box.querySelectorAll("img")]

  imgElementsPlayer1.map((img) => img.remove())
  imgElementsPlayer2.map((img) => img.remove())
  }

  //A função exibe as informações de uma carta que foi selecionada na interface do jogo,assim atualizando a imagem e monstrando o nome e o tipo da carta
  const drawSelectedCard = (cardId) => {
  const selectedCard = cardData[cardId]

  state.cardSprites.avatar.src = selectedCard.img
  state.cardSprites.name.innerText = selectedCard.name
  state.cardSprites.type.innerText = `Atributo: ${selectedCard.type}`
  }
  //Essa função seleciona e retorna uma carta aleatória do array cardData, utilizando o índice gerado aleatoriamente.
  const getRandomCard = () => {
   const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex]
  }
  //A função carrega e reproduz um arquivo de áudio
  const playAudio = (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
  }

  init()
//A função recebe a informação que o botão foi ativado
  function botao() {
    init()
}