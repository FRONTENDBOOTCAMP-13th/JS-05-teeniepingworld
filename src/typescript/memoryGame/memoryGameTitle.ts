'use strict';
/*

todo
첫 화면 작업

* 난이도 버튼 클릭하면 난이도 값 저장하기 (일단 보통 8짝 기준으로 개발 진행)
* 게임 시작하기 버튼 누르면 memoryGameStart.html로 이동하기
* 

*/

// 변수 지정
const easyBtn = document.querySelector('#easy');
const commonBtn = document.querySelector('#common');
const hardBtn = document.querySelector('#hard');

const homeBtn = document.querySelector('#home');
const startBtn = document.querySelector('#start');

const levelBtns = document.querySelectorAll('.level-btn');

let level: string = '8'; // 기본 난이도는 8로 설정

//임시 인터페이스 선언

// 난이도 버튼 이벤트 설정
if (easyBtn) {
  easyBtn.addEventListener('click', function () {
    level = '6';
    console.log('이지 버튼', level);
  });
}

if (commonBtn) {
  commonBtn.addEventListener('click', function () {
    level = '8';
    console.log('보통 버튼', level);
  });
}

if (hardBtn) {
  hardBtn.addEventListener('click', function () {
    level = '12';
    console.log('하드 버튼', level);
  });
}

if (levelBtns) {
  levelBtns.forEach((button) => {
    button.addEventListener('click', function () {
      levelBtns.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

//홈, 게임 시작 버튼 이벤트
if (homeBtn) {
  homeBtn.addEventListener('click', function () {
    console.log('홈으로 이동합니다.');
    window.location.href = '../../index.html';
  });
}

// 게임 페이지로 이동하는 이벤트 적용
if (startBtn) {
  startBtn.addEventListener('click', function () {
    console.log('게임을 시작합니다.');
    sessionStorage.setItem('level', level);
    window.location.href = '../pages/memoryGameStart.html';
  });
}
