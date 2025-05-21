/**
 * 개발자용 기능으로, 모든 큐브의 뚜껑을 열어 상태를 확인할 수 있습니다.
 *
 * (추후 삭제 예정)
 */

import { getImage } from './findGameUtils';

export function openCubeAll() {
  const openBtn = document.querySelector('.green');
  openBtn?.addEventListener('click', () => {
    const cubes =
      document.querySelectorAll<HTMLImageElement>('.teenieping-cube');
    cubes.forEach((item) => {
      if (item?.src.includes('ruru')) {
        const imgPath = getImage(`ruruPingCubeOpen`);
        item?.setAttribute('src', imgPath);
      }
      if (item?.src.includes('bbanzzak')) {
        const imgPath = getImage(`bbanzzakPingCubeOpen`);
        item?.setAttribute('src', imgPath);
      }
    });
  });
}

export function goToMainPage() {
  const goHomeBtn = document.querySelector('.red');
  goHomeBtn?.addEventListener('click', () => {
    location.assign('./main.html');
  });
}

// 개발자 기능(시작 라운드 설정하기)
export function setStartRound() {
  const yellownBtn = document.querySelector('.yellow');
  const setStartRound =
    document.querySelector<HTMLInputElement>('#set-start-round');
  yellownBtn?.addEventListener('click', () => {
    setStartRound?.classList.toggle('hidden-toggle');
  });
}
