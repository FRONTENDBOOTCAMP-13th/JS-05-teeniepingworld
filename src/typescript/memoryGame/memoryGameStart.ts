/*

todo
게임시작 화면 
* 저장된 난이도에 따라 카드 수 결정
* 카드 랜덤 섞엇 배치
* 게임 시작 시 타이머 작동
* 카드 매칭 로직 처리
* 남은 시간, 점수, 매칭 수 업데이트
* 게임 종료 (시간 초과 or 전부 매칭 검사)
* 

플로우
1. 난이도 읽기
2. 카드 쌍 생성 ex["1","1", "2","2"...]
3. 카드 배열 섞기
4. 카드 DOM 동적 생성
5. 카드 클릭 이벤트 연결
6. 매칭 성공/실패 처리
7. 남은 시간 타이머 작동
8. 남은 시간 0되면 게임오버
9. 모두 찾으면 게임 클리어

상태관리 변수 

difficulty : number -> 어려움 정도
timer : number -> 타이머 (난이도에 따른 시간?)
timeleft -> 남은 시간
cards : [] -> 카드 담을 배열
flippedCards : []
matchedPairs : number = 0 -> 짝 검사
socore : number -> 점수


구현순서
1. 난이도 저장하고 이동하기 완성
2. 난이도에 맞게 카드 동적 생성 (일단 8쌍이 넘어오는 걸로 하드코딩해서 생성)
3. 카드 클릭 이벤트 - 뒤집기 / 매칭 체크
4. 타이머 작동 + 시간 종료 처리
5. 점수 계산 + UI 업데이트
6. 게임 종료 배너 띄우기
7. 다시 시작/ 난이도 재설정 버튼에 따른 동작 연결
8. 애니메이션(뒤집기, 매칭 성공 효과) 적용

수요일 목표
난이도 선택 + 화면 이동
- 난이도 선택 저장(해당 난이도 버튼 누르면)
- 시작버튼 누르면 페이지 이동
- sessionStorage 사용 해서 데이터 임시 저장

카드 생성 + 셔플 기능 완성
-카드 데이터 만들기(DOM?), 셔플 함수, 카드 동적 생성


목요일 목표
매칭 체크 (성공 알림 추가, 조건 추가(같은 카드 선택 x))
타이머/점수

카드 클릭/매칭 로직 완성
- 카드 클릭 -> 뒤집기 -> 매칭 검사
- 타이머 + 점수 + 게임 종료 처리

금요일 목표


*/

/*
오늘의 목표

* 저장된 난이도 읽어오기
* 카드 쌍 개수 설정하기
* 카드 동적 생성하기 (DOM으로 카드 생성하고 grid 배치?) 
*/
'use strict';
console.log('선택된 난이도', sessionStorage.getItem('level'));

const cardCount = Number(sessionStorage.getItem('level')) || 8; //생성할 카드 개수
console.log(cardCount);

//맞춰야하는 전체 개수
const totalCount = document.querySelector('#totalCount');
console.log(totalCount?.textContent);
if (totalCount) {
  totalCount.textContent = sessionStorage.getItem('level') || '8';
}

const findCount = document.querySelector('#findCount');
let teeniepingChance: number = 0;

//카드 타입
type cardData = {
  id: number;
  value: string;
  src: string;
};

//티니핑 이미지 접근 경로가 담긴 배열
const pingSrc: string[] = [
  '../assets/memorygame_img/aingPing.webp',
  '../assets/memorygame_img/ajaPing.webp',
  '../assets/memorygame_img/baebaePing.webp',
  '../assets/memorygame_img/baroPing.webp',
  '../assets/memorygame_img/bugguPing.webp',
  '../assets/memorygame_img/chachaPing.webp',
  '../assets/memorygame_img/dockdockPing.webp',
  '../assets/memorygame_img/haePing.webp',
  '../assets/memorygame_img/haunaPing.webp',
  '../assets/memorygame_img/heartsPing.webp',
  '../assets/memorygame_img/kikiPing.webp',
  '../assets/memorygame_img/kojaPing.webp',
  '../assets/memorygame_img/moyaPing.webp',
  '../assets/memorygame_img/mugouPing.webp',
  '../assets/memorygame_img/raraPing.webp',
  '../assets/memorygame_img/siruPing.webp',
];

//게임 시작 텍스트 경로 배열
const bgmSrc: string[] = [
  '/src/assets/memorygame_bgm/startText.wav',
  '/src/assets/memorygame_bgm/startText2.wav',
  '/src/assets/memorygame_bgm/startText3.wav',
  '/src/assets/memorygame_bgm/startText4.wav',
];

console.log(pingSrc);

//일단 난이도에 따른 카드를 한쌍씩 생성해 배열로 담아 리턴하는 함수
function gameInit(count: number): cardData[] {
  const cards: cardData[] = [];

  for (let i = 1; i <= count; i++) {
    const value: string = `card-${i}`;
    const src: string = pingSrc[i];
    cards.push({ id: 2 * i - 1, value: value, src: src });
    cards.push({ id: 2 * i, value: value, src: src });
  }

  return cards;
}

let cards: cardData[] = gameInit(cardCount);
console.log(cards);

// 생성된 카드 무작위로 섞는 함수
function cardShuffle(inputCards: cardData[]): cardData[] {
  for (let i = inputCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [inputCards[i], inputCards[j]] = [inputCards[j], inputCards[i]];
  }
  return inputCards;
}

//카드를 무작위로 섞는 동작 실행
cards = cardShuffle(cards);
console.log(cards);

//야호 카드 섞기 성공!!!!!

//DOM으로 카드 생성
const cardContainer = document.querySelector('.card-container');

// if (cardContainer) {
//   cardContainer.addEventListener('click', function () {
//     console.log('확인');
//   });
// }

//난이도에 따라 동적으로 카드를 생성해주는 함수
function cardSetting(data: cardData[]) {
  cardContainer?.classList.remove('grid-4', 'grid-autofit');
  if (cardCount === 6 || cardCount === 8) {
    cardContainer?.classList.add('grid-4');
  } else if (cardCount === 12) {
    cardContainer?.classList.add('grid-autofit');
  }

  for (let i = 0; i < data.length; i++) {
    addCard(data[i]);
  }

  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      // card.classList.toggle('flip'); //나중에 add로 바꿔서 여기서는 돌아가게만!! 설정
    });
  });
}

//DOM 제어로 카드를 동적으로 생성해주는 함수
function addCard(data: cardData) {
  const div = document.createElement('div');
  div.dataset.id = data.id.toString();
  div.dataset.value = data.value;
  div.classList.add('card');

  const innerCard = document.createElement('div');
  innerCard.classList.add('card-inner');

  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');

  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');

  const imgBack = document.createElement('img');
  imgBack.src = '../assets/memorygame_img/backCard.png';

  const imgFront = document.createElement('img');
  imgFront.classList.add('img-front');
  imgFront.src = data.src;

  cardBack.appendChild(imgBack);
  cardFront.appendChild(imgFront);

  innerCard.appendChild(cardBack);
  innerCard.appendChild(cardFront);

  div.appendChild(innerCard);

  cardContainer?.appendChild(div);
}

//난이도에 따라 동적으로 카드를 생성해주는 함수 호출
cardSetting(cards);

/*
 *음... 일단 카드 매칭 함수를 오전에 구현해 보자!!
 
검사용 배열을 만든다.



-> 배열의 length가 2개가 되면 검사를 진행하는데 
이때 data-value가 동일하면 성공 아니면 자동 뒤집기!
클릭을 하면 push를 해야하는데 push 조건을 class에 flip이 없어야 한다...

실패라면 flip을 제거해주고 배열 다시 초기화
성공이라면 flip상태는 유지하고 배열만 초기화..

 */
let count: number = 0; //현재 매칭된 수
let flipCheck: HTMLElement[] = []; //매칭 성공 유무를 확인하기 위해 클릭된 카드를 담을 배열
console.log('flipCheck 확인', flipCheck);
console.log('count 확인', count);

//클릭한 카드가 현재 검사를 할 카드인지 체크하는 함수
function cardClick(card: HTMLElement) {
  if (
    card.classList.contains('flip') ||
    card.classList.contains('turn') ||
    flipCheck.length >= 2
  ) {
    return;
  }

  card.classList.add('flip');
  flipCheck.push(card);

  if (flipCheck.length === 2) {
    console.log('매칭 검사 함수 호출');
    checkMatch();
  }
}

//선택된 카드 2개가 일치하는지 검사하는 함수
function checkMatch() {
  const [firstCard, secondCard] = flipCheck;

  const firstCardValue: string = firstCard.dataset.value || 'fail1';
  const secondCardValue: string = secondCard.dataset.value || 'fail2';

  if (firstCardValue === secondCardValue) {
    console.log('매칭성공!');
    count += 1; //맞은 개수 1개 증가시키기
    firstCard.classList.add('checked');
    secondCard.classList.add('checked');
    flipCheck = []; //다시 검사해야하니 배열 초기화
    correct();
    showMatchingThanks();
    if (findCount) {
      findCount.textContent = count.toString();
    }
  } else {
    console.log('매칭 실패!');
    wrong();
    setTimeout(() => {
      firstCard.classList.remove('flip'); //실패하면 다시 돌아가게끔 class 제거
      secondCard.classList.remove('flip');
      flipCheck = [];
    }, 600);
  }

  if (count === cardCount) {
    clearInterval(timeId);
    openbanner();
  }
  console.log(count, cardCount);
}

const cardList = document.querySelectorAll('.card');
cardList.forEach((card) => {
  card.addEventListener('click', () => cardClick(card as HTMLElement));
});

/*
 1. UI 부분 로직 구현 일단 
 점수랑 찾은 쌍 진행사항 구현하기
 
 점수는 문제당 + 50점 
 틀리면 문제당 - 10점 -> 시간남으면 기회로 할까?

*/

const scoreNode = document.querySelector('#score');
console.log(scoreNode?.textContent);

//매칭 성공시 점수 획득 함수
function correct() {
  let beforeScore: number = Number(scoreNode?.textContent);
  beforeScore += 50;
  if (scoreNode?.textContent) {
    scoreNode.textContent = beforeScore.toString();
  }
}

//매칭 실패시 점수 감점 함수
function wrong() {
  let beforeScore: number = Number(scoreNode?.textContent);
  if (beforeScore >= 10) {
    beforeScore -= 10;
  }
  if (scoreNode?.textContent) {
    scoreNode.textContent = beforeScore.toString();
  }
}

//리셋 함수
/*
배열 초기화
점수 초기화
찾을 쌍 초기화
시간 초기화
모든 카드에 flip 제거 checked 제거
... 그냥 페이지 리로드 방법 사용!! 제일 간단하고 페이지가 초기화되어도 상관이 없음..
*/

const restartBtn = document.querySelector('.restart-btn');
restartBtn?.addEventListener('click', function () {
  restartGame();
});

const levelSelectBtn = document.querySelector('.levelselect-btn');
levelSelectBtn?.addEventListener('click', function () {
  levelSelect();
});

// 게임을 다시 시작하기 위해 페이지를 리로드하는 함수.
function restartGame() {
  window.location.reload();
}

//난이도 선택 페이지로 이동하는 함수
function levelSelect() {
  window.location.href = '../pages/memoryGame.html';
}

/*
  배너 작업
게임 완료 or 시간 초과시 현재 까지 상황 알려주는 모달 창 띄우기 작업
*/
const banner = document.querySelector('.game-over-banner');
const bannerRestartBtn = document.querySelector('#bannerRestartBtn');
const bannerSelectLevelBtn = document.querySelector('#bannerLevelSelectBtn');
const finalScore = document.querySelector('#final-score');
const bannerfoundCount = document.querySelector('#found-count');
const bannerTotalCount = bannerfoundCount?.nextElementSibling;

function openbanner() {
  if (finalScore) {
    finalScore.textContent = scoreNode?.textContent || '스코어 오류';
  }

  if (bannerTotalCount) {
    bannerTotalCount.textContent = sessionStorage.getItem('level') || '8';
  }

  if (bannerfoundCount) {
    let text: string;
    if (count === cardCount) {
      text = '티니핑 친구들을 모두 찾았어요!!';
    } else {
      text = `${cardCount - count}마리의 티니핑 친구들을 아직 못 찾았어요 ㅠㅠ 다시 해줄거죠?`;
    }
    bannerfoundCount.textContent = text;

    if (banner) {
      banner.classList.remove('hidden');
    }
  }
}

bannerRestartBtn?.addEventListener('click', function () {
  restartGame();
});

bannerSelectLevelBtn?.addEventListener('click', function () {
  levelSelect();
});

/*
TODO 전체 돌리기 함수
function cardAllTurn() : void{}

-일단 개발할때 위치 확인으로 사용하기 위함
-처음에 전체 한번 보여주는 용도로 사용할 수 도 있고,
힌트 아이템으로 돌려볼 수 있는 용도로 사용할 수도 있음.\
*/

const turnBtn = document.querySelector('#turn-btn');
if (turnBtn) {
  turnBtn.addEventListener('click', function () {
    if (teeniepingChance < 1) {
      cardAllTurn();
      teeniepingChance += 1;
    }
  });
}

function cardAllTurn(setTime: number = 1500) {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    if (!card.classList.contains('flip')) {
      card.classList.add('turn');

      setTimeout(() => {
        card.classList.remove('turn');
      }, setTime);
    }
  });
}

function gameover() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    if (!card.classList.contains('flip')) {
      card.classList.add('turn');
    }
  });
}

/*
TODO 제한 시간 만들기

1. 남은 시간 UI 표시 - 1초 단위로 감소
2. 0초가 되면 게임 종료 처리 - openbanner() 함수를 불러오는 함수에 조건 추가
3. 게임 시작시 타이머 시작 startTimer()로 컨트롤
내장 매서드 사용
setInterval(fn,time) time마다 반복하는 매서드이다.
-> 1000ms로 해서 1초마다 시간을 줄이는 동작을 반복하다가 0이되면 게임 종료

clearInterval(timerId) -> 위에서 적용한 반복하는 걸 제거해주는 함수
조건문에서 이 함수를 써야한다. timedId는 종료한 인터벌이 무엇인지 알려주는 값으로
setInterVal()의 리턴 값이다. 
*/

const totalTime: number = 60;

const limitTime = document.querySelector('.limit-time span') as HTMLElement;
limitTime.textContent = totalTime.toString();

// const timeId: number = startTimer(totalTime);
let timeId: number;

const progressBar = document.querySelector('.progress-bar') as HTMLElement;
progressBar.style.width = '100%';
let limitTimePer: number;

//타이머 시작 함수
function startTimer(time: number): number {
  limitTimePer = (time / totalTime) * 100;
  console.log(limitTimePer);
  progressBar.style.width = `${limitTimePer}%`;
  time -= 1;

  const timeId = setInterval(() => {
    console.log(time);

    limitTimePer = (time / totalTime) * 100;
    progressBar.style.width = `${limitTimePer}%`;

    if (time < 0) {
      time += 1;
      progressBar.style.width = '0%';
      clearInterval(timeId);
      gameover();
      openbanner();
    }
    limitTime.textContent = time.toString();
    time -= 1;
  }, 1000);

  return timeId;
}

/*
TODO 카드 매칭 성공시 애니메이션 효과!\
*/

function showMatchingThanks() {
  const bubble = document.getElementById('thanks-bubble') as HTMLElement;
  if (!bubble) return;

  bubble.classList.remove('hidden');
  bubble.classList.add('thanks-bubble');

  // 다시 숨기기 (자동으로 사라지긴 하지만 클래스도 제거해주는 게 깔끔)
  setTimeout(() => {
    bubble.classList.add('hidden');
    bubble.classList.remove('thanks-bubble');
  }, 1000);
}

// 게임 시작전 팝업창
const howPopup = document.getElementById('how-to-play') as HTMLElement;
const startGameBtn = document.getElementById(
  'start-game-btn',
) as HTMLButtonElement;
const startBgm = document.getElementById('start_bgm') as HTMLAudioElement; //스타트 bgm
const bgm = document.getElementById('bgm') as HTMLAudioElement; //타이틀 bgm

startGameBtn.addEventListener('click', () => {
  howPopup.style.display = 'none'; // 안내창 숨기기

  const randomInt = Math.floor(Math.random() * 4);
  const bgm_str = bgmSrc[randomInt];

  startBgm.setAttribute('src', bgm_str);
  startBgm.volume = 0.5;
  startBgm.play();
  bgm.play();
  bgm.volume = 0.01;
  setTimeout(() => {
    bgm.volume = 0.03;
    timeId = startTimer(totalTime);
  }, 4500);
  // 여기에 게임 시작 로직 연결 (타이머, 카드 생성 등)
  //게임을 시작하는 함수를 만들어야하네.........

  cardAllTurn(4200);
});

/*
TODO bgm on/off 버튼 만들기
 */

const bgmBtn = document.querySelector('.bgm-button') as HTMLElement;
const bgmImage = bgmBtn.firstElementChild;
let isMuted: boolean = false;

bgmBtn.addEventListener('click', function () {
  isMuted = !isMuted;
  bgm.muted = isMuted;

  const text_src = isMuted
    ? '/src/assets/memorygame_img/bgm_off.png'
    : '/src/assets/memorygame_img/bgm_on.png';
  bgmImage?.setAttribute('src', text_src);
});

/* TODO
  1. 게임 아이템 넣기 (전체 카드 보기!, 시간추가?) *
  2. bgm on off 모드 추가 *
  3. 게임 설명 그림 넣어서 자세하게 알려주기 (코드 개선) *
  4. 처음 게임 타이틀 페이지 개선 (UI 크기나 캐릭터 애니메이션 추가) 
  5. 사용자 랭킹 시스템 구현!? 
  6. 매칭시 효과음? 넣을지 고민.....
  7. 반응형으로 구현! (모바일 버전)
  8. 난이도가 점점 높아지는 챌린지 모드 추가!
  
  */

const homeBtn = document.querySelector('.home-btn');

if (homeBtn) {
  homeBtn.addEventListener('click', function () {
    console.log('홈으로 이동합니다.');
    window.location.href = '../../index.html';
  });
}
