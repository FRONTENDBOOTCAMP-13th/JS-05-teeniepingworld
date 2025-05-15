/* interface AnswerData {
  id: number;
  question: string;
  answerData: AnswerOption[];
}
interface AnswerOption {
  answer: string;
  type: string;
  personality: string;
} */

/** 질문 답변 데이터 */
/* const answerBtnData: AnswerData[] = [
  {
    id: 1,
    question:
      '프로젝트에서 갑자기 리더를 맡아달라는 말을 들었다. 당신의 속마음은?',
    answerData: [
      {
        answer: '왜 하필 나야..? 리더는 부담스러운데...😓',
        type: 'front',
        personality: 'I',
      },
      {
        answer: '오..할 기회가 생겼네? 잘 해보자!😎',
        type: 'back',
        personality: 'E',
      },
    ],
  },
  {
    id: 2,
    question:
      '프로젝트 조원이 갑자기 번개로 회식하자고 연락했다. 당신의 속마음은?',
    answerData: [
      {
        answer: '헉..나갈 준비도 안 했는데 나가야 하나?😅',
        type: 'front',
        personality: 'J',
      },
      {
        answer: '끝났으니까 나가서 팀원들이랑 수다나 떨어야지😆',
        type: 'back',
        personality: 'P',
      },
    ],
  },
  {
    id: 3,
    question: '새로운 취미로 그림을 그려보기로 했다. 당신의 속마음은?',
    answerData: [
      {
        answer: '잘 못 그리는데 괜히 시작한 거 아닐까?🎨',
        type: 'front',
        personality: 'S',
      },
      {
        answer: '그림 그리는 건 재밌지! 잘 그려보자!🖌️',
        type: 'back',
        personality: 'N',
      },
    ],
  },
  {
    id: 4,
    question: '좋아하는 사람이 카톡을 씹었다. 당신의 속마음은?',
    answerData: [
      {
        answer: '내가 뭔가 실수했나? 아 이 문자 괜히 보냈나..😔',
        type: 'front',
        personality: 'F',
      },
      {
        answer: '바쁜가? 그냥 기다려보자!😌',
        type: 'back',
        personality: 'T',
      },
    ],
  },
  {
    id: 5,
    question: '기념일을 깜빡한 연인. 당신의 속마음은?',
    answerData: [
      {
        answer: '그럴 수도 있지. 중요한 건 지금 이후의 행동이지.📆',
        type: 'front',
        personality: 'T',
      },
      {
        answer: '우리의 생일인데 안 소중해?(서운 MAX)😡',
        type: 'back',
        personality: 'F',
      },
    ],
  },
  {
    id: 6,
    question: '연인이 대화 중 자꾸 딴 얘기로 새버린다. 당신의 속마음은?',
    answerData: [
      {
        answer: '지금 얘기부터 마무리하자. 흐름 끊기니까 집중하자!🧭',
        type: 'front',
        personality: 'S',
      },
      {
        answer: '오히려 흘러가는 대로 얘기하는 게 더 재밌는걸?🌌',
        type: 'back',
        personality: 'N',
      },
    ],
  },
  {
    id: 7,
    question: '갑자기 내 냉장고가 나한테 잔소리를 시작한다면? 당신의 속마음은?',
    answerData: [
      {
        answer: '또 시작이네… 조용히 냉장고 말 듣지 말아야겠다🥲',
        type: 'front',
        personality: 'I',
      },
      {
        answer: '야 냉장고야, 네 잔소리 완전 웃기다! 계속 해봐😂',
        type: 'back',
        personality: 'E',
      },
    ],
  },
  {
    id: 8,
    question: '하루 동안 내 몸이 갑자기 자동으로 움직인다면? 당신의 속마음은?',
    answerData: [
      {
        answer:
          '몸이 맘대로 움직이면 위험해! 내가 통제하지 못하면 위험하니까 상황을 빨리 파악해야 해!🕹️',
        type: 'front',
        personality: 'J',
      },
      {
        answer: '재밌겠다! 무작정 몸이 가는 대로 놔둬봐야지!😆',
        type: 'back',
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
        type: 'front',
        personality: 'S',
      },
      {
        answer: '이건 운명적인 메시지야! 내 인생의 큰 전환점일 수도 있어!🔮',
        type: 'back',
        personality: 'N',
      },
    ],
  },
  {
    id: 10,
    question:
      '한회당 500만원 주는 환승연애라는 프로에 출연하게 되었다! 당신의 속마음은?',
    answerData: [
      {
        answer: '그래도 전 남자친구랑은 아니지...😨',
        type: 'front',
        personality: 'I',
      },
      {
        answer: '어차피 헤어진 사이..! 지금부터 예능감 발휘한다! 돈 벌자🔥📸',
        type: 'back',
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
        type: 'front',
        personality: 'J',
      },
      {
        answer: '오히려 좋아~ 공항에서 놀아야지!☕️',
        type: 'back',
        personality: 'P',
      },
    ],
  },
  {
    id: 12,
    question: '당신이 AI로 바뀌는 꿈을 꿨다! 눈 떴을 때 드는 생각은?',
    answerData: [
      {
        answer: '감정을 잃는다면… 나는 더 이상 내가 아닌 것 같아 😢',
        type: 'front',
        personality: 'F',
      },
      {
        answer: '좋은데? 감정 기복 없고 연산력 빠르면 인생 최적화 완료 🤖📈',
        type: 'back',
        personality: 'T',
      },
    ],
  },
];
 */
