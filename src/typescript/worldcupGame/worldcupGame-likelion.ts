/* likelion easterEgg */
// 티니핑 date type 정의
interface Teenieping {
  no: number | string;
  name: string;
  nameEng: string;
  imgName: string;
  gender: string;
  likes: string[] | string;
  dislikes: string[] | string;
  URL: string;
  imgLink: string;
}

let isLikelionClicked = false;

/**
 * hidden character
 */
const specialCharacters: Teenieping[] = [
  {
    no: '134',
    name: '슬비핑',
    nameEng: 'seulbiping',
    imgName: '134-seulbiping',
    gender: '여성',
    likes: '떡볶이, 대체텍스트',
    dislikes: '접근성 낮은 ui, div 난사',
    URL: 'null',
    imgLink: '/teenieping-local-img/134-seulbiping.webp',
  },
  {
    no: '135',
    name: '길용핑',
    nameEng: 'gdping',
    imgName: '135-gdping',
    gender: '남성',
    likes: '나무, 참이슬, 첫사랑, 다인님',
    dislikes: 'ui만 집중개발',
    URL: 'null',
    imgLink: '/teenieping-local-img/135-gdping.webp',
  },
];

/**
 * .likelion click event
 */

function setupLikelionClickListener(): void {
  const likelionElement = document.querySelector('.likelion') as HTMLElement;

  if (likelionElement) {
    likelionElement.addEventListener('click', () => {
      isLikelionClicked = true;
      console.log('🦁 clicked, we are lions!');
    });
  }
}

/**
 * .likelion click 상태 확인 함수
 * @returns 라이언이 클릭된 지 여부
 */
function getIsLikelionClicked(): boolean {
  return isLikelionClicked;
}

/**
 * hidden cha 배열 반환 함수
 * @returns hidden array
 */
function getSpecialCharacters(): Teenieping[] {
  return [...specialCharacters];
}

/**
 * .likelion click status 초기화 함수
 */
function resetLikelionState(): void {
  isLikelionClicked = false;
}

export {
  setupLikelionClickListener,
  getIsLikelionClicked,
  getSpecialCharacters,
  resetLikelionState,
};

export type { Teenieping };
