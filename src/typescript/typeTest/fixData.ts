interface AnswerData {
  id: number;
  question: string;
  answerData: AnswerOption[];
}
interface AnswerOption {
  answer: string;
  type: string;
  personality: string;
}

/** 질문 답변 데이터 */
export const answerBtnData: AnswerData[] = [
  {
    id: 1,
    question:
      '프로젝트에서 갑자기 리더를 맡아달라는 말을 들었다. 당신의 속마음은?',
    answerData: [
      {
        answer: '왜 하필 나야..? 리더는 부담스러운데...😓',
        type: 'first',
        personality: 'I',
      },
      {
        answer: '오..할 기회가 생겼네? 잘 해보자!😎',
        type: 'second',
        personality: 'E',
      },
    ],
  },
  {
    id: 2,
    question:
      '프로젝트 조원이 갑자기 번개로 회식하자고 연락했다. 당신의 속마음은 무엇인가요?',
    answerData: [
      {
        answer: '헉..나갈 준비도 안 했는데 나가야 하나?😅',
        type: 'first',
        personality: 'J',
      },
      {
        answer: '끝났으니까 나가서 팀원들이랑 수다나 떨어야지😆',
        type: 'second',
        personality: 'P',
      },
    ],
  },
  {
    id: 3,
    question: '노래를 들을 때 더 중요하게 여기는 것은 무엇인가요?',
    answerData: [
      {
        answer: '가사보다는 멜로디지~ 🎶',
        type: 'first',
        personality: 'S',
      },
      {
        answer: '가사를 봐야 더 깊게 빠져드는 거 같아! 📝',
        type: 'second',
        personality: 'N',
      },
    ],
  },
  {
    id: 4,
    question:
      '열심히 준비했던 시험 결과 망쳤다. 그래서 기분 안 좋은 상황인데 누군가 옆에서 "그래도 노력 많이 했잖아 고생했어" 했다면 본인의 기분은?',
    answerData: [
      {
        answer: '그렇지? 다음에 잘하면 되니까..! 🥰',
        type: 'first',
        personality: 'F',
      },
      {
        answer: '고마워 (결과 망했는데; 기분 여전히 안 좋아) 😔',
        type: 'second',
        personality: 'T',
      },
    ],
  },
  {
    id: 5,
    question: '당신의 애정표현 방법은?',
    answerData: [
      {
        answer:
          '왜? 그거 뭐야? 그걸 좋아하는 이유가 있어? 뭐 때문에 우울해? (질문형) 🤓',
        type: 'first',
        personality: 'T',
      },
      {
        answer: '오..귀엽다! 너는 그걸 좋아하는구나!! (리액션) 🫶',
        type: 'second',
        personality: 'F',
      },
    ],
  },
  {
    id: 6,
    question: '사과하면 떠오르는 이미지는 무엇인가요?',
    answerData: [
      {
        answer: '빨간색, 맛있다, 아침에 먹는 사과가 금. 🍎',
        type: 'first',
        personality: 'S',
      },
      {
        answer: '백설 공주(독사과), 스티브 잡스, 맥북 사고 싶다. 💻',
        type: 'second',
        personality: 'N',
      },
    ],
  },
  {
    id: 7,
    question: '약속이 끝나고 아무도 없는 집에 혼자 있을 때, 드는 생각은?',
    answerData: [
      {
        answer: '아싸~! 집에 아무도 없다! 😜',
        type: 'first',
        personality: 'I',
      },
      {
        answer: '하 외로워 ㅠㅠ 통화할 사람 없나? 🥲',
        type: 'second',
        personality: 'E',
      },
    ],
  },
  {
    id: 8,
    question: '친구랑 내일 홍대에 있는 짬뽕 맛집을 가기로 했다. 이때 당신은?',
    answerData: [
      {
        answer: '아침은 가볍게 먹고, 한 10시쯤 나가서 2호선 열차 타야겠다! 🚝',
        type: 'first',
        personality: 'J',
      },
      {
        answer: '거기 짬뽕 맵지 않겠지?? 🥘',
        type: 'second',
        personality: 'P',
      },
    ],
  },
  {
    id: 9,
    question: '꿈에서 미래의 나를 만났다! 당신의 속마음은?',
    answerData: [
      {
        answer: '혹시 이거 안좋은 꿈인가?🤔',
        type: 'first',
        personality: 'S',
      },
      {
        answer: '이건 운명적인 메시지야! 내 인생의 큰 전환점일 수도 있어!🔮',
        type: 'second',
        personality: 'N',
      },
    ],
  },
  {
    id: 10,
    question:
      '연인이 한 회당 200만원 주는 환승연애라는 프로에 출연하게 되었다! 당신의 속마음은?',
    answerData: [
      {
        answer: '그래도 전 애인이랑 나가는 건 아니지...😨',
        type: 'first',
        personality: 'I',
      },
      {
        answer:
          '어차피 헤어진 사이..! 지금부터 예능감 발휘해서 돈 벌자~ 나랑 반띵해야 해!🔥📸',
        type: 'second',
        personality: 'E',
      },
    ],
  },
  {
    id: 11,
    question: '비행기가 3시간 지연됐다! 당신의 속마음은?',
    answerData: [
      {
        answer: '하 진짜 짜증난다.. 당장 남은 일정 계획 다시 짜야해!📋',
        type: 'first',
        personality: 'J',
      },
      {
        answer: '오히려 좋아~ 공항에서 놀아야지!☕️',
        type: 'second',
        personality: 'P',
      },
    ],
  },
  {
    id: 12,
    question:
      '추운 날씨, 친구와 둘이 있는데 뭐 가지러 밖에 나가야 하는 상황일 때, 나의 행동은?',
    answerData: [
      {
        answer: '추운데 나 혼자 갔다 올게. 넌 여기에 있어! 😜',
        type: 'first',
        personality: 'F',
      },
      {
        answer: '같이 가면 마음이 따듯하잖아... 같이 가자 😉',
        type: 'second',
        personality: 'T',
      },
    ],
  },
];
