import { pingData, type TabContainer } from './pingData.ts';
import { pingExpData } from './pingExpData.ts';

// 다시테스트 하기 버튼 누르면 메인 화면으로 돌아가기
const typeTestBtn = document.querySelector('.repeat-btn');
if (typeTestBtn) {
  typeTestBtn.addEventListener('click', function () {
    console.log('첫화면으로 이동합니다');
    window.location.href = './typeTest.html';
  });
}

// TODO결과 공유하기 버튼

// 로컬스토리지에서 사용자의 선택 결과(personality 배열) 불러오기
const result = JSON.parse(localStorage.getItem('resultArray') || '[]');

// 각 성향별(E/N/F/P) 카운트 변수 초기화
let cntE = 0;
let cntN = 0;
let cntF = 0;
let cntP = 0;

// 사용자의 선택 결과를 순회하며 각 성향 카운트
for (let i = 0; i < 12; i++) {
  if (result[i] === 'E') {
    cntE++;
  }
  if (result[i] === 'N') {
    cntN++;
  }
  if (result[i] === 'F') {
    cntF++;
  }
  if (result[i] === 'P') {
    cntP++;
  }
}

// 각 성향별 카운트가 2개 이상이면 해당 알파벳, 아니면 반대 알파벳으로 MBTI 조합 생성
let mainresult = '';
if (cntE > 1) {
  mainresult += 'E';
} else {
  mainresult += 'I';
}

if (cntN > 1) {
  mainresult += 'N';
} else {
  mainresult += 'S';
}

if (cntF > 1) {
  mainresult += 'F';
} else {
  mainresult += 'T';
}

if (cntP > 1) {
  mainresult += 'P';
} else {
  mainresult += 'J';
}

// MBTI 결과에 해당하는 티니핑 정보 찾기
let pingName = '';
let pingImg = '';
let pingChar = '';
let pingTagCon: TabContainer = { tab1: '', tab2: '', tab3: '', tab4: '' };
let likePing = '';
let hatePing = '';
for (let i = 0; i < 16; i++) {
  if (mainresult === pingData[i].mbti) {
    pingName = pingData[i].name;
    pingImg = pingData[i].img;
    pingChar = pingData[i].char;
    pingTagCon = pingData[i].tabContainer;
    likePing = pingData[i].likeName;
    hatePing = pingData[i].hateName;
  }
}
console.log(pingName);
console.log(pingImg);
console.log(result);

//각종 DOM 요소 선택
const myPing = document.querySelector('.result-ping') as HTMLImageElement;
const myMbti = document.querySelector('.tab-mbti');
const myPingName = document.querySelector('.ping-name');
const myPingChar = document.querySelector('.ping-character');
const tabContainer = document.querySelector('.tab-container');
const firstTab = tabContainer!.querySelector('.tab-button');

// 결과 화면에 티니핑 이미지, MBTI, 이름 등 표시
myPing!.src = pingImg;
myMbti!.textContent = mainresult;
myPingName!.textContent = pingName;
myPingChar!.textContent = pingChar;
firstTab!.textContent = pingTagCon.tab1;
firstTab!.nextElementSibling!.textContent = pingTagCon.tab2;
firstTab!.nextElementSibling!.nextElementSibling!.textContent = pingTagCon.tab3;
firstTab!.nextElementSibling!.nextElementSibling!.nextElementSibling!.textContent =
  pingTagCon.tab4;

//나랑 잘 맞는 티니핑, 안 맞는 티니핑
let likeImg = '';
let likeMbti = '';
let hateImg = '';
let hateMbti = '';
for (let i = 0; i < 16; i++) {
  if (likePing === pingData[i].name) {
    likeImg = pingData[i].img;
    likeMbti = pingData[i].mbti;
  }
  if (hatePing === pingData[i].name) {
    hateImg = pingData[i].img;
    hateMbti = pingData[i].mbti;
  }
}
const likePingImg = document.querySelector('.like-img') as HTMLImageElement;
const likePingMbti = document.querySelector('.like-mbti');
const likePingName = document.querySelector('.like-name');
const hatePingImg = document.querySelector('.hate-img') as HTMLImageElement;
const hatePingMbti = document.querySelector('.hate-mbti');
const hatePingName = document.querySelector('.hate-name');

likePingImg!.src = likeImg;
likePingMbti!.textContent = likeMbti;
likePingName!.textContent = likePing;

hatePingImg!.src = hateImg;
hatePingMbti!.textContent = hateMbti;
hatePingName!.textContent = hatePing;

//.sub-container바꾸기
const myPingExp = document.querySelector('.sub-container');
myPingExp!.innerHTML = ''; // 기존에 있는 걸 지워버림
const exp = pingExpData.find((item) => item.mbti === mainresult);
const ol = document.createElement('ol');
myPingExp?.appendChild(ol);

for (let i = 0; i < 5; i++) {
  const li = document.createElement('li');
  const strong = document.createElement('strong');
  const ul = document.createElement('ul');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');

  strong.textContent = exp!.ol[i].title;
  li1.textContent = exp!.ol[i].li1;
  li2.textContent = exp!.ol[i].li2;
  ol.appendChild(li);
  li.appendChild(strong);
  li.appendChild(ul);
  ul.appendChild(li1);
  ul.appendChild(li2);
}

const p = document.createElement('p');
const strong = document.createElement('strong');
const ul = document.createElement('ul');
const li1 = document.createElement('li');
const li2 = document.createElement('li');
const li3 = document.createElement('li');

strong.textContent = exp!.p.title;
li1.textContent = exp!.p.li1;
li2.textContent = exp!.p.li2;
li3.textContent = exp!.p.li3!;

myPingExp?.appendChild(p);
myPingExp?.appendChild(ul);
p.appendChild(strong);
ul.appendChild(li1);
ul.appendChild(li2);
ul.appendChild(li3);
