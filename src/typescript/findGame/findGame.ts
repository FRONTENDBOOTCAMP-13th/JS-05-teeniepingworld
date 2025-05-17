import '../../styles/findGame.css';
import { playOneRound } from './findGameRound';

const continueStartBtn =
  document.querySelector<HTMLButtonElement>('.continue-game-btn');
const gameStartBtn =
  document.querySelector<HTMLButtonElement>('.game-start-btn');

let startRound = 1;

// TODO 이전 기록 불러오기 (웹 소켓)
const history = localStorage.getItem('history');
if (!history) {
  if (continueStartBtn) {
    continueStartBtn.style.backgroundColor = '#e0e0e0';
    continueStartBtn.style.color = '#999';
    continueStartBtn.disabled = true;
    continueStartBtn.classList.remove('hovered');
  }
}

// 개발자 기능(시작 라운드 설정하기)
const yellownBtn = document.querySelector('.yellow');
const setStartRound =
  document.querySelector<HTMLInputElement>('#set-start-round');
yellownBtn?.addEventListener('click', () => {
  setStartRound?.classList.toggle('hidden-toggle');
});

// 게임 시작 (처음부터)
gameStartBtn?.addEventListener('click', () => {
  if (setStartRound?.value) startRound = Number(setStartRound?.value);

  playGame(startRound);
});

// 게임 시작 (이어서)
continueStartBtn?.addEventListener('click', () => {
  if (history) startRound = JSON.parse(history);

  playGame(startRound);
});

/**
 * 1라운드부터 10라운드까지 게임을 순차적으로 진행하며,
 * 실패 시 1라운드부터 다시 시작합니다.
 */
async function playGame(startRound: number) {
  const gameRound = document.querySelector('.game-round');
  const gameContainer =
    document.querySelector<HTMLDivElement>('.game-container');
  const gameStartBtnContainer = document.querySelector<HTMLDivElement>(
    '.game-start-btn-container',
  );

  gameRound?.removeAttribute('hidden');
  if (gameContainer) gameContainer.style.display = 'flex';
  if (gameStartBtnContainer) gameStartBtnContainer.style.display = 'none';

  for (let round = startRound; round <= 10; round++) {
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
