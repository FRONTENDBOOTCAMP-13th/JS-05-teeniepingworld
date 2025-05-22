'use strict';

const typeTestBtn = document.querySelector('.pink');
const memoryBtn = document.querySelector('.blue');
const findBtn = document.querySelector('.green');
const worldcupBtn = document.querySelector('.yellow');

const bgm = document.getElementById('bgm') as HTMLAudioElement; //타이틀 bgm
const mp3Button = document.querySelector('.mp3-button') as HTMLButtonElement;
const mp3Img = document.querySelector('.mp3-img') as HTMLImageElement;

// 상태 추적 변수
let isPlaying = true;

mp3Button.addEventListener('click', () => {
  if (!bgm) return;

  if (isPlaying) {
    bgm.pause();
    mp3Img.src = '/typeTest_img/mp3off.png';
  } else {
    bgm.play();
    bgm.volume = 0.2;
    mp3Img.src = '/typeTest_img/mp3on.png';
  }

  isPlaying = !isPlaying;
});

if (typeTestBtn) {
  typeTestBtn.addEventListener('click', function () {
    window.location.href = './typeTest.html';
  });
}

if (memoryBtn) {
  memoryBtn.addEventListener('click', function () {
    window.location.href = './memoryGame.html';
  });
}

if (findBtn) {
  findBtn.addEventListener('click', function () {
    window.location.href = './findGame.html';
  });
}

if (worldcupBtn) {
  worldcupBtn.addEventListener('click', function () {
    window.location.href = './worldcupGame.html';
  });
}

const closeBtn = document.getElementById('popup-close');
const popupOverlay = document.getElementById('popup-overlay');
const checkbox = document.getElementById('dont-show-today') as HTMLInputElement;

const today = () => new Date().toISOString().slice(0, 10);

const dismissedToday = () => {
  const storeDate = localStorage.getItem('DismissedDate');
  return storeDate === today();
};

if (!dismissedToday()) {
  if (popupOverlay) {
    popupOverlay.style.display = 'flex';
  }
} else {
  // 팝업이 오늘 뜨지 않도록 설정된 경우 → 자동 재생 시도
  bgm
    .play()
    .then(() => {
      bgm.volume = 0.2;
      isPlaying = true;
      mp3Img.src = '/typeTest_img/mp3on.png';
    })
    .catch(() => {
      // 자동재생 차단됨 → 음악은 꺼지고 버튼 이미지도 끈 상태로 설정
      isPlaying = false;
      mp3Img.src = '/typeTest_img/mp3off.png';
    });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    console.log('hello');
    if (checkbox.checked) {
      localStorage.setItem('DismissedDate', today());
    }

    if (popupOverlay) {
      popupOverlay.style.display = 'none';
    }
    bgm.play();
    bgm.volume = 0.2;
  });
}
