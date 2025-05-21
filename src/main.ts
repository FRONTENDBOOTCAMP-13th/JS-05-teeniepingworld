'use strict';

const typeTestBtn = document.querySelector('.pink');
const memoryBtn = document.querySelector('.blue');
const findBtn = document.querySelector('.green');
const worldcupBtn = document.querySelector('.yellow');

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

if (dismissedToday()) {
  if (popupOverlay) {
    popupOverlay.style.display = 'none';
  }
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
  });
}
