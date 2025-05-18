interface PingData {
  name: string;
  img: string;
  mbti: string;
  char: string;
  tabContainer: TabContainer;
  likeName: string;
  hateName: string;
}
export interface TabContainer {
  tab1: string;
  tab2: string;
  tab3: string;
  tab4: string;
}

export const pingData: PingData[] = [
  {
    name: '파티핑',
    img: '../assets/teenieping_img/partying.webp',
    mbti: 'ENFP',
    char: '열정적인 활동가',
    tabContainer: {
      tab1: '창의적',
      tab2: '열정적',
      tab3: '자유로움',
      tab4: '공감력',
    },
    likeName: '요거핑',
    hateName: '삐뽀핑',
  },
  {
    name: '샤샤핑',
    img: '../assets/teenieping_img/shashaping.webp',
    mbti: 'ENFJ',
    char: '정의로운 리더',
    tabContainer: {
      tab1: '리더십',
      tab2: '이타적',
      tab3: '공감능력',
      tab4: '책임감',
    },
    likeName: '토닥핑',
    hateName: '코자핑',
  },
  {
    name: '똑똑핑',
    img: '../assets/teenieping_img/smartping.webp',
    mbti: 'ENTP',
    char: '창의적인 발명가',
    tabContainer: {
      tab1: '도전적',
      tab2: '유쾌함',
      tab3: '논리적',
      tab4: '혁신적',
    },
    likeName: '요거핑',
    hateName: '코자핑',
  },
  {
    name: '아자핑',
    img: '../assets/teenieping_img/azaping.webp',
    mbti: 'ENTJ',
    char: '단호한 통솔자',
    tabContainer: {
      tab1: '리더십',
      tab2: '전략적',
      tab3: '목표지향',
      tab4: '효율성',
    },
    likeName: '토닥핑',
    hateName: '그림핑',
  },
  {
    name: '홀라핑',
    img: '../assets/teenieping_img/holaping.webp',
    mbti: 'ESFP',
    char: '자유로운 연예인',
    tabContainer: {
      tab1: '사교적',
      tab2: '긍정적',
      tab3: '현실적',
      tab4: '감각적',
    },
    likeName: '포실핑',
    hateName: '싹싹핑',
  },
  {
    name: '나눔핑',
    img: '../assets/teenieping_img/nanumPing.webp',
    mbti: 'ESFJ',
    char: '따뜻한 돌봄 제공자',
    tabContainer: {
      tab1: '사교적',
      tab2: '책임감 강함',
      tab3: '현실적',
      tab4: '공감 능력 뛰어남',
    },
    likeName: '그림핑',
    hateName: '아라핑',
  },
  {
    name: '씽씽핑',
    img: '../assets/teenieping_img/singsingPing.webp',
    mbti: 'ESTP',
    char: '현실의 모험가',
    tabContainer: {
      tab1: '활동적',
      tab2: '현실적',
      tab3: '즉흥적',
      tab4: '도전적',
    },
    likeName: '포실핑',
    hateName: '요거핑',
  },
  {
    name: '찌릿핑',
    img: '../assets/teenieping_img/eleping.webp',
    mbti: 'ESTJ',
    char: '현실적 리더',
    tabContainer: {
      tab1: '책임감',
      tab2: '리더십',
      tab3: '실용적',
      tab4: '규칙 중시',
    },
    likeName: '포실핑',
    hateName: '토닥핑',
  },
  {
    name: '토닥핑',
    img: '../assets/teenieping_img/pattping.webp',
    mbti: 'INFP',
    char: '이상주의 감성주의자',
    tabContainer: {
      tab1: '내향적',
      tab2: '감성적',
      tab3: '상상력 풍부',
      tab4: '가치 중심',
    },
    likeName: '샤샤핑',
    hateName: '찌릿핑',
  },
  {
    name: '요거핑',
    img: '../assets/teenieping_img/yogaping.webp',
    mbti: 'INFJ',
    char: '이상주의 전략가',
    tabContainer: {
      tab1: '직관적',
      tab2: '사고력',
      tab3: '공감력',
      tab4: '비전 중심',
    },
    likeName: '파티핑',
    hateName: '씽씽핑',
  },
  {
    name: '아라핑',
    img: '../assets/teenieping_img/arapping.webp',
    mbti: 'INTP',
    char: '논리적 탐구자',
    tabContainer: {
      tab1: '분석적',
      tab2: '독창적',
      tab3: '이론 중심',
      tab4: '내향적',
    },
    likeName: '요거핑',
    hateName: '나눔핑',
  },
  {
    name: '싹싹핑',
    img: '../assets/teenieping_img/snapping.webp',
    mbti: 'INTJ',
    char: '조용한 계획자',
    tabContainer: {
      tab1: '논리적',
      tab2: '독립적',
      tab3: '미래지향적',
      tab4: '체계적',
    },
    likeName: '파티핑',
    hateName: '홀라핑',
  },
  {
    name: '그림핑',
    img: '../assets/teenieping_img/drawping.webp',
    mbti: 'ISFP',
    char: '감성적인 아티스트',
    tabContainer: {
      tab1: '감각적',
      tab2: '내향적',
      tab3: '따뜻함',
      tab4: '자유로운 성향',
    },
    likeName: '나눔핑',
    hateName: '아자핑',
  },
  {
    name: '포실핑',
    img: '../assets/teenieping_img/fossilPing.webp',
    mbti: 'ISFJ',
    char: '헌신적인 보호자',
    tabContainer: {
      tab1: '현신적',
      tab2: '배려심',
      tab3: '책임감',
      tab4: '신뢰성',
    },
    likeName: '파티핑',
    hateName: '똑똑핑',
  },
  {
    name: '코자핑',
    img: '../assets/teenieping_img/cojaping.webp',
    mbti: 'ISTP',
    char: '논리적 해결사',
    tabContainer: {
      tab1: '현실적',
      tab2: '분석적',
      tab3: '독립적',
      tab4: '즉흥적',
    },
    likeName: '나눔핑',
    hateName: '샤샤핑',
  },
  {
    name: '삐뽀핑',
    img: '../assets/teenieping_img/beepping.webp',
    mbti: 'ISTJ',
    char: '원칙 있는 실천가',
    tabContainer: {
      tab1: '책임감',
      tab2: '현실적',
      tab3: '체계적',
      tab4: '신중함',
    },
    likeName: '홀라핑',
    hateName: '토닥핑',
  },
];
