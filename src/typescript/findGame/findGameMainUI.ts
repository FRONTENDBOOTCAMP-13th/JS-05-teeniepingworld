import { resetToStartScreen } from './findGameUtils';

// settings
export function initSettings() {
  const settingsBtn =
    document.querySelector<HTMLButtonElement>('.settings-btn');
  const settingsDialog =
    document.querySelector<HTMLDialogElement>('.settings-dialog');
  const settingsCloseBtn = document.querySelector<HTMLButtonElement>(
    '.settings-close-btn',
  );
  const bgmBtn = document.querySelector<HTMLButtonElement>('.bgm-btn');
  const bgmToggle = document.querySelector<HTMLSpanElement>('.bgm-toggle');
  // 오디오 태그
  const audio = document.querySelector<HTMLAudioElement>('audio');
  const goStartBtn = document.querySelector<HTMLButtonElement>('.go-start-btn');

  settingsBtn?.addEventListener('click', () => {
    settingsDialog?.showModal();
  });
  settingsCloseBtn?.addEventListener('click', () => {
    settingsDialog?.close();
  });
  bgmBtn?.addEventListener('click', () => {
    if (bgmToggle?.textContent) {
      if (bgmToggle.textContent === 'OFF') {
        bgmToggle.textContent = 'ON';
        audio?.play();
      } else {
        bgmToggle.textContent = 'OFF';
        audio?.pause();
      }
    }
  });
  goStartBtn?.addEventListener('click', () => {
    resetToStartScreen();
    settingsDialog?.close();
  });
}

// 튜토리얼
export function initTutorialDialog() {
  const gameInfoBtn =
    document.querySelector<HTMLButtonElement>('.game-info-btn');
  const tutorialDialog =
    document.querySelector<HTMLDialogElement>('.tutorial-dialog');
  const tutorialCloseBtn = document.querySelector<HTMLButtonElement>(
    '.tutorial-close-btn',
  );
  gameInfoBtn?.addEventListener('click', () => {
    tutorialDialog?.showModal();
    tutorialDialog?.setAttribute('display', 'flex');
  });
  tutorialCloseBtn?.addEventListener('click', () => {
    tutorialDialog?.close();
    tutorialDialog?.removeAttribute('display');
  });
}

export function showGameScreen() {
  const gameRound = document.querySelector('.game-round');
  const gameContainer =
    document.querySelector<HTMLDivElement>('.game-container');
  const gameStartBtnContainer = document.querySelector<HTMLDivElement>(
    '.game-start-btn-container',
  );

  gameRound?.removeAttribute('hidden');
  if (gameContainer) gameContainer.style.display = 'flex';
  if (gameStartBtnContainer) gameStartBtnContainer.style.display = 'none';
}

export function saveGameAttempt() {
  let attemptCount = Number(localStorage.getItem('attemptCount'));
  localStorage.setItem('attemptCount', JSON.stringify(++attemptCount));
}
