import { type findTeenieping } from '../../types/findGameType.ts';

export function openCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('Cube.WEBP')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('Cube', 'CubeOpen'));
  }
}

export function closeCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('CubeOpen.WEBP')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('CubeOpen', 'Cube'));
  }
}

export function setCube(i: number, name: string) {
  const gameContainer = document.querySelector<HTMLElement>('.game-container');

  const newDiv = document.createElement('div');
  const newImg = document.createElement('img');
  newDiv.setAttribute('class', 'set');
  newDiv.setAttribute('id', `set-${i}`);
  newImg.setAttribute('src', `/src/assets/findGame/${name}PingCubeOpen.WEBP`);
  newImg.setAttribute('alt', '티니핑 큐브');
  newImg.setAttribute('class', 'teenieping-cube');

  newDiv.appendChild(newImg);
  gameContainer?.appendChild(newDiv);
}

export function insertTeenieping(
  answerSet: findTeenieping,
  name: string,
  round: number,
) {
  if (answerSet.getDiv) {
    const targetDiv = answerSet.getDiv;

    const newImg = document.createElement('img');
    newImg.setAttribute('src', `/src/assets/findGame/${name}Ping.WEBP`);
    newImg.setAttribute('alt', '티니핑');
    newImg.setAttribute('class', 'teenieping');
    targetDiv.appendChild(newImg);

    if (round >= 3) {
      newImg.style.height = '40%';
      newImg.style.transform = 'translateY(-20%)';
    }
    if (round >= 5) {
      newImg.style.height = '30%';
    }
  }
}

/**
 * 클릭 이벤트 추가 (클릭 시 정답 확인)
 * @TODO 클릭 시 모달 열기
 */
export function handleSelection(arr: findTeenieping[]) {
  return new Promise((resolve) => {
    arr.forEach((item) => {
      item.cloneDiv = item.getDiv?.cloneNode(true) as HTMLElement;
    });

    arr.forEach((item, idx) => {
      item.getDiv?.addEventListener('click', () => {
        if (item.getDiv) openCube(item);
        if (item.status) console.log('정답입니다');
        else console.log('오답입니다');

        arr.forEach((otherItem) => {
          if (otherItem === item) return;
          if (otherItem.cloneDiv)
            otherItem.getDiv?.parentElement?.replaceChild(
              otherItem.cloneDiv,
              otherItem.getDiv,
            );
          otherItem.getDiv = otherItem.cloneDiv;
          otherItem.cloneDiv = otherItem.cloneDiv?.cloneNode(
            true,
          ) as HTMLElement;
        });

        resolve(idx);
      });
    });
  });
}

/**
 * 정답 공개 함수
 * @param [] : set 배열
 */
export function checkAnswer(arr: findTeenieping[], teeniepingName: string) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      arr.forEach((item) => {
        if (item.status) openCube(item);
      });
      setGameDescription(`${teeniepingName}은 여기 숨어있었어요!`);
      resolve();
    }, 2000);
  });
}

export function waitDelay(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function setGameDescription(msg: string) {
  const gameDescription = document.querySelector('.game-description');

  if (gameDescription?.textContent) {
    gameDescription.textContent = msg;
  }
}

export function setRound(round: number) {
  const roundSpan = document.querySelector('#current-game-round');
  if (roundSpan?.textContent) roundSpan.textContent = `${round}`;
}

export function showResult(
  resolve: (result: boolean) => void,
  result: boolean,
  round: number,
) {
  const resultDialog = document.querySelector(
    '.result-dialog',
  ) as HTMLDialogElement;
  const closeDialogButton = document.querySelector('.close-dialog');

  const showDialog = () => resultDialog?.showModal();
  const closeDialog = () => resultDialog?.close();

  const dialogH2 = resultDialog.querySelector('h2');
  const dialogImg = resultDialog.querySelector('img');
  const dialogP = resultDialog.querySelector('p');
  const dialogButton = resultDialog.querySelector('button');

  if (round === 5) {
    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 성공`;
    if (dialogImg?.src)
      dialogImg.src = '/src/assets/findGame/ayaPingSuccess.WEBP';
    if (dialogP?.textContent) dialogP.textContent = '모든 라운드에 성공했어요!';
    if (dialogButton?.textContent) dialogButton.textContent = `결과보기`;
    result = false;
  } else if (result === true) {
    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 성공`;
    if (dialogImg?.src)
      dialogImg.src = '/src/assets/findGame/ayaPingSuccess.WEBP';
    if (dialogP?.textContent)
      dialogP.textContent = '다음 라운드도 도전해보세요!';
    if (dialogButton?.textContent)
      dialogButton.textContent = `${round + 1}ROUND 도전하기`;
  } else {
    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 실패`;
    if (dialogImg?.src) dialogImg.src = '/src/assets/findGame/ayaPingFail.WEBP';
    if (dialogP?.textContent) dialogP.textContent = '다시 한 번 도전해보세요!!';
    if (dialogButton?.textContent) dialogButton.textContent = '다시하기';
  }

  showDialog();

  closeDialogButton?.addEventListener('click', () => {
    closeDialog();
    console.log(result);
    resolve(result);
  });
}

/**
 * 두 큐브의 위치를 애니메이션으로 교체하는 함수
 */
// export function animateSwap(duration: number) {
//   return new Promise<void>((resolve) => {
//     const gameContainer =
//       document.querySelector<HTMLElement>('.game-container');

//     const sets = gameContainer?.querySelectorAll<HTMLElement>(
//       '.set',
//     ) as NodeListOf<HTMLElement>;

//     const num1 = Math.floor(Math.random() * sets.length);
//     const num2 =
//       (num1 + Math.ceil(Math.random() * (sets.length - 1))) % sets.length;

//     const cube1 = sets[num1];
//     const cube2 = sets[num2];

//     const loc1 = cube1.getBoundingClientRect();
//     const loc2 = cube2.getBoundingClientRect();

//     const distance = loc1.left - loc2.left;

//     const startTime = performance.now();

//     const startX = 0;
//     const endX = distance;

//     const startScale = 1;
//     const endScale = 1.5;

//     function step(currentTime: number) {
//       const elapsed = currentTime - startTime;
//       const t = Math.min(elapsed / duration, 1);

//       const easedTranslate = easeOut(t);
//       const easedScale = easeInOut(t);

//       const translateX = startX + (endX - startX) * easedTranslate;
//       const scale = startScale + (endScale - startScale) * easedScale;

//       cube1.style.transform = `translateX(${-translateX}px) scale(${scale})`;
//       cube2.style.transform = `translateX(${translateX}px) scale(${scale})`;

//       if (t < 1) {
//         requestAnimationFrame(step);
//       } else {
//         resolve();
//       }
//     }
//     requestAnimationFrame(step);
//   });
// }

// function easeOut(t: number): number {
//   return 1 - (1 - t) ** 3;
// }

// function easeInOut(t: number): number {
//   return t < 0.5 ? 2 * t ** 2 : 1 - (-2 * t + 2 ** 2) / 2;
// }

export function animateSwap(duration: number) {
  return new Promise<void>((resolve) => {
    const gameContainer =
      document.querySelector<HTMLElement>('.game-container');

    const sets = gameContainer?.querySelectorAll<HTMLElement>('.set');

    if (typeof sets !== 'undefined') {
      const num1 = Math.floor(Math.random() * sets.length);
      const num2 =
        (num1 + Math.ceil(Math.random() * (sets.length - 1))) % sets.length;

      const cube1 = sets[num1];
      const cube2 = sets[num2];

      const loc1 = cube1.getBoundingClientRect();
      const loc2 = cube2.getBoundingClientRect();

      let distance = loc1.left - loc2.left;
      console.log('distance: ', distance);

      cube1.style.zIndex = '1';
      cube2.style.zIndex = '1';

      const animate = cube1.animate(
        [
          { transform: `translateX(0px) translateY(0px)`, offset: 0 },
          {
            transform: `translateX(${-distance / 2}px) translateY(20px)`,
            offset: 0.5,
          },
          {
            transform: `translateX(${-distance}px) translateY(0px)`,
            offset: 1,
          },
        ],
        {
          duration: duration,
        },
      );
      cube2.animate(
        [
          { transform: `translateX(0px) scale(1)`, offset: 0 },
          {
            transform: `translateX(${distance / 2}px) translateY(-20px)`,
            offset: 0.5,
          },
          { transform: `translateX(${distance}px) scale(1)`, offset: 1 },
        ],
        {
          duration: duration,
        },
      );

      cube1.style.zIndex = '0';
      cube2.style.zIndex = '0';

      animate.onfinish = () => {
        cube1.style.transform = '';
        cube2.style.transform = '';

        changeLocation(cube1, cube2);
        resolve();
      };
    }
  });
}

export function changeLocation(cube1: HTMLElement, cube2: HTMLElement) {
  const parent = cube1.parentElement;
  const next1 = cube1.nextElementSibling;
  const next2 = cube2.nextElementSibling;

  if (next1 !== null && next2 !== null) {
    parent?.insertBefore(cube1, next2);
    parent?.insertBefore(cube2, next1);
  } else if (next1 === null) {
    parent?.insertBefore(cube1, next2);
    parent?.appendChild(cube2);
  } else {
    parent?.appendChild(cube1);
    parent?.insertBefore(cube2, next1);
  }
}
