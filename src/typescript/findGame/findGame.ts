import '../../styles/findGame.css';
import { playOneRound } from './findGameRound';
import {
  initSettings,
  initTutorialDialog,
  saveGameAttempt,
  showGameScreen,
} from './findGameMainUI';
import { goToMainPage, openCubeAll, setStartRound } from './findGameDevTools';
import { setContinueButtonDisabled } from './findGameUtils';

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

// 게임 시작 (처음부터)
gameStartBtn?.addEventListener('click', () => {
  // 개발자 기능(시작 라운드 설정하기)
  const setStartRound =
    document.querySelector<HTMLInputElement>('#set-start-round');
  if (setStartRound?.value) startRound = Number(setStartRound?.value);

  localStorage.setItem('history', JSON.stringify(0));
  localStorage.setItem('attemptCount', '0');

  playGame(startRound);
});

// 게임 시작 (이어서)
const history = localStorage.getItem('history');
continueStartBtn?.addEventListener('click', () => {
  if (history) startRound = JSON.parse(history);

  playGame(startRound);
});

/**
 * 1라운드부터 10라운드까지 게임을 순차적으로 진행하며,
 * 실패 시 1라운드부터 다시 시작합니다.
 */
async function playGame(startRound: number) {
  const gameContainer =
    document.querySelector<HTMLDivElement>('.game-container');

  showGameScreen();
  saveGameAttempt();

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
}
