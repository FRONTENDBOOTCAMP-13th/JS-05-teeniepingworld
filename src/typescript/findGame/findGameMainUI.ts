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
  const sfxBtn = document.querySelector<HTMLButtonElement>('.sfx-btn');
  const sfxToggle = document.querySelector<HTMLSpanElement>('.sfx-toggle');
  const goStartBtn = document.querySelector<HTMLButtonElement>('.go-start-btn');
  const goHomeBtn = document.querySelector<HTMLButtonElement>('.go-home-btn');

  settingsBtn?.addEventListener('click', () => {
    settingsDialog?.showModal();
  });
  settingsCloseBtn?.addEventListener('click', () => {
    settingsDialog?.close();
  });

  const audio = new Audio('/findgame_bgm/findGameBGM.mp3');

  bgmBtn?.addEventListener('click', () => {
    if (bgmToggle?.textContent) {
      if (bgmToggle.textContent === 'OFF') {
        bgmToggle.textContent = 'ON';
        audio.play();
        audio.volume = 0.2;
        console.log(audio.volume);
      } else {
        bgmToggle.textContent = 'OFF';
        audio.pause();
      }
    }
  });

  sfxBtn?.addEventListener('click', () => {
    if (sfxToggle?.textContent) {
      if (sfxToggle.textContent === 'OFF') {
        sfxToggle.textContent = 'ON';
      } else {
        sfxToggle.textContent = 'OFF';
      }
    }
  });

  goStartBtn?.addEventListener('click', () => {
    resetToStartScreen();
    settingsDialog?.close();
  });

  goHomeBtn?.addEventListener('click', () => {
    location.assign('./main.html');
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
  const goToHome = document.querySelector('.go-to-home');
  const gameTitle = document.querySelector<HTMLHeadingElement>('.game-title');

  gameRound?.removeAttribute('hidden');
  if (gameContainer) gameContainer.style.display = 'flex';
  if (gameStartBtnContainer) gameStartBtnContainer.style.display = 'none';

  goToHome?.setAttribute('hidden', '');
  if (gameTitle?.style) {
    gameTitle.style.flex = '3';
    gameTitle.style.textAlign = 'left';
  }
}

export function saveGameAttempt() {
  let attemptCount = Number(localStorage.getItem('attemptCount'));
  localStorage.setItem('attemptCount', JSON.stringify(++attemptCount));
}
