import '../../styles/findGame.css';
import { playOneRound } from './findGameRound';

const gameStartBtn = document.querySelector('.game-start-btn');
gameStartBtn?.addEventListener('click', playGame);

/**
 * 1라운드부터 10라운드까지 게임을 순차적으로 진행하며,
 * 실패 시 1라운드부터 다시 시작합니다.
 */
async function playGame() {
  const gameContainer = document.querySelector('.game-container');

  for (let round = 1; round <= 10; round++) {
    // 게임 화면 세팅
    const getAllSets = gameContainer?.querySelectorAll('div');
    getAllSets?.forEach((item) => {
      item.remove();
    });

    // 라운드 실행 - 성공/실패 결과 반환
    const result = await playOneRound(round);

    // 실패 시 다시 1라운드로
    if (`${result}` === 'false') {
      console.log('게임 종료 다시 1라운드로');
      round = 0;
    }
  }

  // TODO 결과보기?: 결과창으로
}
