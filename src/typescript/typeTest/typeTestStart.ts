import { answerBtnData } from './fixData';

// 각종 DOM 요소 선택
const questionRate = document.querySelector('.question-rate'); // 질문 번호 표시 영역
const statistics = document.querySelector('.statistics'); // 진행률(%) 표시 영역
const bar = document.querySelector('.bar') as HTMLElement; // 진행 바(bar) 요소
const sectionText = document.querySelector('.section-text'); // 질문 텍스트 표시 영역
const questionContainer = document.querySelector('.choice-btn'); // 답변 버튼 컨테이너
const firstBtn = questionContainer?.querySelector('.choice-first'); // 첫 번째 선택 버튼
const secondBtn = questionContainer?.querySelector('.choice-second'); // 두 번째 선택 버튼
const paginationContainer = document.querySelector('.pagination-container'); // 페이지네이션(점) 컨테이너

let id = 1; // 현재 질문 번호(1번부터 시작)
const resultArray: string[] = new Array(12); // 각 질문별 선택 결과 저장 배열

// 첫 번째 선택 버튼 클릭 시 동작
firstBtn?.addEventListener('click', () => {
  if (id < 12) {
    // 현재 질문 데이터에서 첫 번째 답변의 성향(personality) 저장
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;

    id++; // 다음 질문으로 이동
    nextpage(); // 다음 질문 표시
  } else {
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));
    // 마지막 질문 이후에는 이동(예: 결과 페이지)
    //결과 페이지
    window.location.href = './typeTestResult.html';
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

    id++; // 다음 질문으로 이동
    nextpage(); // 다음 질문 표시
  } else {
    const select = answerBtnData[id - 1];
    const ansData = select.answerData;
    const person = ansData[0].personality;
    resultArray[id - 1] = person;
    localStorage.setItem('resultArray', JSON.stringify(resultArray));
    // 마지막 질문 이후에는 이동(예: 결과 페이지)
    window.location.href = './typeTestResult.html';
  }
});

// 다음 질문 및 상태 갱신 함수
function nextpage(): void {
  // 질문 번호 및 진행률 표시 갱신
  questionRate!.textContent = `질문 ${id}/12`;
  statistics!.textContent = Math.round((id * 100) / 12).toString() + '%';

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
}

// 이전 버튼 클릭 시 동작
const previousBtn = document.querySelector('.previous-btn');
previousBtn?.addEventListener('click', () => {
  if (id > 1) {
    id--; // 이전 질문으로 이동
    prevpage(); // 이전 질문 표시
  } else {
    // 첫 질문에서 이전 버튼 클릭 시 홈으로 이동
    window.location.href = './typeTest.html';
  }
});

// 이전 질문 및 상태 갱신 함수
function prevpage(): void {
  // 질문 번호 및 진행률 표시 갱신
  questionRate!.textContent = `질문 ${id}/12`;
  statistics!.textContent = Math.round((id * 100) / 12).toString() + '%';

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
