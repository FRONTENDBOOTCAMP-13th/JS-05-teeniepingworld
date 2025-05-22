/* likelion easterEgg */
import { teeniepingData } from '../dataBase.ts';

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
function getDefaultSpecialCharacters(): Teenieping[] {
  const hiddenNumbers = ['134', '135'];
  return teeniepingData.result.filter((char) =>
    hiddenNumbers.includes(char.no.toString()),
  );
}

/**
 * 현재 활성화된 특별 캐릭터 배열
 */
let specialCharacters: Teenieping[] = [];

/**
 * .likelion click event
 */
function setupLikelionClickListener(): void {
  const likelionElement = document.querySelector('.likelion') as HTMLElement;

  if (likelionElement) {
    likelionElement.addEventListener('click', () => {
      isLikelionClicked = true;

      //click 시 기본 캐릭터 활성화
      specialCharacters = getDefaultSpecialCharacters();
      console.log('🦁 We are lions! 이스터에그가 활성되었습니다!');
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
  specialCharacters = [];
  // console.log(
  //   '[debug] Likelion 클릭 상태 - isClicked:',
  //   isLikelionClicked,
  //   'hidden캐릭터:',
  //   specialCharacters.length,
  // );
}

/**
 * 디버깅용 상태 확인 함수
 */
function debugLikelionState(): void {
  // console.log('[debug] - isLikelionClicked:', isLikelionClicked);
  // console.log(
  //   '[debug] - specialCharacters:',
  //   specialCharacters.map((char) => char.name),
  // );
}

export {
  setupLikelionClickListener,
  getIsLikelionClicked,
  getSpecialCharacters,
  resetLikelionState,
  debugLikelionState,
};

export type { Teenieping };
