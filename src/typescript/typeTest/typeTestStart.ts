import { answerBtnData } from './fixData';
import { playAudio } from './mainTypeTest';

playAudio(true);

// 각종 DOM 요소 선택
const questionRate = document.querySelector('.question-rate'); // 질문 번호 표시 영역
const bar = document.querySelector('.bar') as HTMLElement; // 진행 바(bar) 요소
const sectionText = document.querySelector('.section-text'); // 질문 텍스트 표시 영역
const questionContainer = document.querySelector('.choice-btn'); // 답변 버튼 컨테이너
const firstBtn = questionContainer?.querySelector('.choice-first'); // 첫 번째 선택 버튼
const secondBtn = questionContainer?.querySelector('.choice-second'); // 두 번째 선택 버튼
const paginationContainer = document.querySelector('.pagination-container'); // 페이지네이션(점) 컨테이너

// const resultArray: string[] = []; // 각 질문별 선택 결과 저장 배열
const resultArray = JSON.parse(localStorage.getItem('resultArray') || '[]');
let id = resultArray.length + 1; // 이어서 시작

nextpage();

// 첫 번째 선택 버튼 클릭 시 동작
firstBtn?.addEventListener('click', () => {
  if (id < 12) {
    // 현재 질문 데이터에서 첫 번째 답변의 성향(personality) 저장
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));
    id++; // 다음 질문으로 이동
    nextpage(); // 다음 질문 표시
  } else {
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));

    // 로컬스토리지에서 사용자의 선택 결과(personality 배열) 불러오기
    const result = JSON.parse(localStorage.getItem('resultArray') || '[]');
    const mbti = getMbti(result);
    localStorage.removeItem('resultArray');
    // 마지막 질문 이후에는 이동(예: 결과 페이지)
    window.location.href = `./typeTestResult.html?mbti=${mbti}`;
  }
});

// 두 번째 선택 버튼 클릭 시 동작
secondBtn?.addEventListener('click', () => {
  if (id < 12) {
    // 현재 질문 데이터에서 두 번째 답변의 성향(personality) 저장
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[1].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));
    id++; // 다음 질문으로 이동
    nextpage(); // 다음 질문 표시
    console.log(id);
  } else {
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));

    // 로컬스토리지에서 사용자의 선택 결과(personality 배열) 불러오기
    const result = JSON.parse(localStorage.getItem('resultArray') || '[]');
    const mbti = getMbti(result);
    localStorage.removeItem('resultArray');
    // 마지막 질문 이후에는 이동(예: 결과 페이지)
    window.location.href = `./typeTestResult.html?mbti=${mbti}`;
  }
});

// 다음 질문 및 상태 갱신 함수
function nextpage(): void {
  // 질문 번호 및 진행률 표시 갱신
  questionRate!.textContent = `질문 ${id}/12`;
  // statistics!.textContent = Math.round((id * 100) / 12).toString() + '%';

  // 현재 질문 및 답변 표시
  const target = answerBtnData[id - 1];
  const question = target.question;
  const ansData = target.answerData;
  const firstAns = ansData[0].answer;
  const secondAns = ansData[1].answer;
  sectionText!.textContent = question;
  firstBtn!.textContent = firstAns;
  secondBtn!.textContent = secondAns;

  // 짝수번째 질문일 때 dot 활성화
  if (id % 2 === 0) {
    const targetDot = paginationContainer?.querySelector('.dot:not(.active)');
    targetDot?.classList.add('active');
  }

  // 진행 바 길이 갱신
  bar!.style.gridColumn = `span ${id}`;

  // 선택 결과 콘솔 출력(디버깅용)
  console.log(resultArray);

  // id가 1일 때 voice 클래스를 가진 오디오 재생
  if (id === 1) {
    const voiceAudio = document.querySelector('.voice') as HTMLAudioElement;
    if (voiceAudio) {
      voiceAudio.volume = 0.2;
      voiceAudio.currentTime = 0; // 오디오 시작 위치 초기화
      voiceAudio.play().catch((error) => {
        console.log('자동 재생이 차단되었습니다:', error);
      });
    }
  }
}

// 이전 버튼 클릭 시 동작
const previousBtn = document.querySelector('.previous-btn');
previousBtn?.addEventListener('click', () => {
  if (id > 1) {
    id--; // 이전 질문으로 이동
    prevpage(); // 이전 질문 표시
  } else {
    // 첫 질문에서 이전 버튼 클릭 시 홈으로 이동
    window.localStorage.clear();
    window.location.href = './typeTest.html';
  }
});

// 이전 질문 및 상태 갱신 함수
function prevpage(): void {
  // 질문 번호 및 진행률 표시 갱신
  questionRate!.textContent = `질문 ${id}/12`;

  // 현재 질문 및 답변 표시
  const target = answerBtnData[id - 1];
  const question = target.question;
  const ansData = target.answerData;
  const firstAns = ansData[0].answer;
  const secondAns = ansData[1].answer;
  sectionText!.textContent = question;
  firstBtn!.textContent = firstAns;
  secondBtn!.textContent = secondAns;

  // 홀수번째 질문일 때 dot 비활성화
  if (id % 2 === 1 && paginationContainer) {
    const targetDots = paginationContainer.getElementsByClassName('active');
    if (targetDots.length > 0) {
      const targetDot = targetDots[targetDots.length - 1] as HTMLElement;
      targetDot.classList.remove('active');
    }
  }

  // 진행 바 길이 갱신
  bar!.style.gridColumn = `span ${id}`;
  // 선택 결과 콘솔 출력(디버깅용)
  console.log(resultArray);
}

function getMbti(result: string[]) {
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
  return mainresult;
}

//처음부터 다시하기
const formatBtn = document.querySelector('.format');
if (formatBtn) {
  formatBtn.addEventListener('click', function () {
    window.localStorage.clear();
    console.log('첫화면으로 이동합니다');
    window.location.href = './typeTest.html';
  });
}

//voice 자동 재생
