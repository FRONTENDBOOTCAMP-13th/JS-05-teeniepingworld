import '../../styles/findGame.css';
import { playOneRound } from './findGameRound';

async function playGame() {
  const gameContainer = document.querySelector('.game-container');
  for (let round = 1; round <= 5; round++) {
    const getAllSets = gameContainer?.querySelectorAll('.set');
    getAllSets?.forEach((item) => {
      item.remove();
    });

    for (let i = 0; i < 3; i++) {
      const newDiv = document.createElement('div');
      const newImg = document.createElement('img');
      newDiv.setAttribute('class', 'set');
      newDiv.setAttribute('id', `set-${i}`);
      newImg.setAttribute('src', '/src/assets/findGame/ruruPingCubeOpen.PNG');
      newImg.setAttribute('alt', '티니핑 큐브');
      newImg.setAttribute('class', 'teenieping-cube');

      newDiv.appendChild(newImg);
      gameContainer?.appendChild(newDiv);
    }
    const result = await playOneRound(round);
    console.log('***', result);
    if (`${result}` === 'false') {
      console.log('게임 종료 다시 1라운드로');
      round = 0;
    }
  }

  // TODO 결과보기?: 결과창으로
}

playGame();
