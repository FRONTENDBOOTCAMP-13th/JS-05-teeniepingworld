import { type findTeenieping } from '../../types/findGameType.ts';

/**
 * 큐브 이미지를 열린 상태 이미지로 변경합니다.
 *
 * @param {findTeenieping} set - 이미지가 포함된 div 요소를 가진 객체
 */
export function openCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('Cube.WEBP')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('Cube', 'CubeOpen'));
  }
}

/**
 * 열린 큐브 이미지를 닫힌 상태 이미지로 변경합니다.
 *
 * @param {findTeenieping} set - 이미지가 포함된 div 요소를 가진 객체
 */
export function closeCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('CubeOpen.WEBP')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('CubeOpen', 'Cube'));
  }
}

/**
 * 게임 화면에 열린 티니핑 큐브 이미지를 추가합니다.
 *
 * @param {number} i - 큐브의 고유 인덱스 (div의 id에 사용됨)
 * @param {string} name - 티니핑 이름 (이미지 파일 이름에 사용됨)
 */
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

/**
 * 정답 큐브에 티니핑 이미지를 삽입하고 라운드에 따라 크기와 위치를 조정합니다.
 *
 * @param {findTeenieping} answerSet - 티니핑을 삽입할 대상 div를 가진 객체
 * @param {string} name - 티니핑 이름 (이미지 파일 이름에 사용됨)
 * @param {number} round - 현재 라운드 (이미지 크기 및 위치 조정에 사용됨)
 */
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

    if (round <= 2) {
      newImg.style.height = '50%';
      newImg.style.transform = 'translateY(0)';
    } else if (round <= 4) {
      newImg.style.height = '40%';
      newImg.style.transform = 'translateY(-20%)';
    } else if (round <= 6) {
      newImg.style.height = '30%';
      newImg.style.transform = 'translateY(-20%)';
    } else {
      newImg.style.height = '25%';
      newImg.style.transform = 'translateY(-20%)';
    }
  }
}

/**
 * 유저의 선택을 처리하고, 클릭된 요소를 기준으로 큐브를 열거나 복원하며 정답 여부를 출력합니다.
 *
 * @param {findTeenieping[]} arr - 선택 가능한 티니핑 객체 배열
 * @returns {Promise<number>} 선택된 인덱스를 반환하는 Promise
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
 * 정답인 티니핑의 큐브를 열고 설명 문구를 출력합니다.
 *
 * @param {findTeenieping[]} arr - 티니핑 객체 배열
 * @param {string} teeniepingName - 정답 티니핑 이름 (설명 문구에 사용됨)
 * @returns {Promise<void>} 2초 후 정답 큐브를 연 후 완료되는 Promise
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

/**
 * 지정한 시간(ms)만큼 대기합니다.
 *
 * @param {number} delay - 대기할 시간 (밀리초)
 * @returns {Promise<void>} 지정한 시간 후에 완료되는 Promise
 */
export function waitDelay(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * 게임 설명 텍스트를 갱신합니다.
 *
 * @param {string} msg - 화면에 표시할 설명 메시지
 */
export function setGameDescription(msg: string) {
  const gameDescription = document.querySelector('.game-description');

  if (gameDescription?.textContent) {
    gameDescription.textContent = msg;
  }
}

/**
 * 현재 라운드 번호를 화면에 표시합니다.
 *
 * @param {number} round - 표시할 라운드 번호
 */
export function setRound(round: number) {
  const roundSpan = document.querySelector('#current-game-round');
  if (roundSpan?.textContent) roundSpan.textContent = `${round}`;
}

/**
 * 게임 결과 다이얼로그를 표시하고, 닫기 버튼 클릭 시 결과를 resolve 합니다.
 *
 * @param {(result: boolean) => void} resolve - 결과를 전달하는 Promise의 resolve 함수
 * @param {boolean} result - 현재 라운드 성공 여부
 * @param {number} round - 현재 라운드 번호
 */
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

  if (round === 10) {
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
 * 게임 내 큐브 두 개를 랜덤으로 선택하여 지정된 시간 동안 위치를 교환하는 애니메이션을 실행합니다.
 *
 * @param {number} duration - 애니메이션 지속 시간 (밀리초)
 * @returns {Promise<void>} 애니메이션 종료 시점에 완료되는 Promise
 */
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

/**
 * 두 큐브의 DOM 위치를 서로 교환합니다.
 *
 * @param {HTMLElement} cube1 - 위치를 교환할 첫 번째 큐브 요소
 * @param {HTMLElement} cube2 - 위치를 교환할 두 번째 큐브 요소
 */
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
