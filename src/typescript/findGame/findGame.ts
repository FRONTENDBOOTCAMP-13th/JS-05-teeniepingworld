import '../../styles/findGame.css';
import { play } from './findGameRound';
import {
  initSettings,
  initTutorialDialog,
  saveGameAttempt,
  showGameScreen,
} from './findGameMainUI';
import { goToMainPage, openCubeAll, setStartRound } from './findGameDevTools';
import {
  setContinueButtonDisabled,
  setSfx,
  showGameConclusion,
} from './findGameUtils';

const goToHomeBtn = document.querySelector<HTMLButtonElement>('.go-to-home');
const continueStartBtn =
  document.querySelector<HTMLButtonElement>('.continue-game-btn');
const gameStartBtn =
  document.querySelector<HTMLButtonElement>('.game-start-btn');

let startRound = 1;
setContinueButtonDisabled();

initSettings();
initTutorialDialog();

// 개발자 기능
goToMainPage();
setStartRound();
openCubeAll();

goToHomeBtn?.addEventListener('click', () => {
  location.href = './main.html';
});

// 게임 시작 (처음부터)
gameStartBtn?.addEventListener('click', () => {
  setSfx('2');

  // 개발자 기능(시작 라운드 설정하기)
  const setStartRound =
    document.querySelector<HTMLInputElement>('#set-start-round');
  if (setStartRound?.value) startRound = Number(setStartRound?.value);

  localStorage.setItem('history', JSON.stringify(1));
  localStorage.setItem('attemptCount', '0');

  playGame(startRound);
});

// 게임 시작 (이어서)
continueStartBtn?.addEventListener('click', () => {
  const history = localStorage.getItem('history');

  if (history) startRound = JSON.parse(history);
  playGame(startRound);
});

/**
 * 1라운드부터 10라운드까지 게임을 순차적으로 진행하며,
 * 실패 시 1라운드부터 다시 시작합니다.
 */
async function playGame(startRound: number) {
  showGameScreen();
  saveGameAttempt();

  for (let round = startRound; round <= 10; round++) {
    // 라운드 실행 - 성공/실패 결과 반환
    const result = await play(round);
    console.log(result, round + 'round test');

    if (result === 0) {
      console.log('if문 안');
      let resultRound = Number(localStorage.getItem('history'));
      showGameConclusion(--resultRound);

      break;
    }
  }
}
