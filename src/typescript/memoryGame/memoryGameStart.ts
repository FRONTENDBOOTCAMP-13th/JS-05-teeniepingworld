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

//카드 타입
type cardData = {
  id: number;
  value: string;
};

//일단 난이도에 따른 카드를 한쌍씩 생성해 배열로 담아 리턴하는 함수
function gameInit(count: number): cardData[] {
  const cards: cardData[] = [];

  for (let i = 1; i <= count; i++) {
    const value: string = `card-${i}`;
    cards.push({ id: 2 * i - 1, value: value });
    cards.push({ id: 2 * i, value: value });
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

cards = cardShuffle(cards);
console.log(cards);

//야호 카드 섞기 성공!!!!!

//DOM으로 카드 생성
const cardContainer = document.querySelector('.card-container');

if (cardContainer) {
  cardContainer.addEventListener('click', function () {
    console.log('확인');
  });
}

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
      card.classList.toggle('flip');
    });
  });
}

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
  imgFront.src = '../assets/teenieping_img/hachuPing.png';

  cardBack.appendChild(imgBack);
  cardFront.appendChild(imgFront);

  innerCard.appendChild(cardBack);
  innerCard.appendChild(cardFront);

  div.appendChild(innerCard);

  cardContainer?.appendChild(div);
}

cardSetting(cards);
