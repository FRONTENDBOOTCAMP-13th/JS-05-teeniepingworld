import { type findTeenieping } from '../../types/findGameType.ts';

/**
 * 큐브 이미지를 열린 상태 이미지로 변경합니다.
 *
 * @param {findTeenieping} set - 이미지가 포함된 div 요소를 가진 객체
 */
export function openCube(set: findTeenieping, name: string) {
  const imgPath = getImage(`${name}PingCubeOpen`);

  const targetImg = set.getDiv?.querySelector('img');

  if (!targetImg?.src.includes('CubeOpen')) {
    targetImg?.setAttribute('src', imgPath);
  }
}

/**
 * 열린 큐브 이미지를 닫힌 상태 이미지로 변경합니다.
 *
 * @param {findTeenieping} set - 이미지가 포함된 div 요소를 가진 객체
 */
export function closeCube(set: findTeenieping, name: string) {
  const imgPath = getImage(`${name}PingCube`);

  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.includes('CubeOpen')) {
    targetImg?.setAttribute('src', imgPath);
  }
}

/**
 * 게임 화면에 열린 티니핑 큐브 이미지를 추가합니다.
 *
 * @param {number} i - 큐브의 고유 인덱스 (div의 id에 사용됨)
 * @param {string} name - 티니핑 이름 (이미지 파일 이름에 사용됨)
 */
export function setCube(i: number, name: string) {
  const imgPath = getImage(`${name}PingCubeOpen`);

  const gameContainer = document.querySelector<HTMLElement>('.game-container');

  const newDiv = document.createElement('div');
  const newImg = document.createElement('img');
  newDiv.setAttribute('class', 'set');
  newDiv.setAttribute('id', `set-${i}`);

  newImg.setAttribute('src', imgPath);
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

    const imgPath = getImage(`${name}Ping`);

    const newImg = document.createElement('img');
    newImg.setAttribute('src', imgPath);
    // newImg.setAttribute('src', `/src/assets/findgame_img/${name}Ping.WEBP`);
    newImg.setAttribute('alt', '티니핑');
    newImg.setAttribute('class', 'teenieping');
    targetDiv.appendChild(newImg);

    if (round >= 3 && round <= 4) {
      newImg.style.transform = 'translateY(-30%)';
    } else if (4 <= round) {
      newImg.style.transform = 'translateY(-20%)';
    } else if (6 <= round) {
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
export function handleSelection(arr: findTeenieping[], name: string) {
  return new Promise((resolve) => {
    arr.forEach((item) => {
      item.cloneDiv = item.getDiv?.cloneNode(true) as HTMLElement;
    });

    arr.forEach((item, idx) => {
      item.getDiv?.addEventListener('click', () => {
        if (item.getDiv) openCube(item, name);
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
export function checkAnswer(
  arr: findTeenieping[],
  teeniepingName: string,
  teeniepingNameEng: string,
) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      arr.forEach((item) => {
        if (item.status) openCube(item, teeniepingNameEng);
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
 * @param {() => void} resolve - 결과를 전달하는 Promise의 resolve 함수
 * @param {boolean} result - 현재 라운드 성공 여부
 * @param {number} round - 현재 라운드 번호
 */
export function showResult(
  resolve: () => void,
  result: boolean,
  round: number,
) {
  const resultDialog = document.querySelector(
    '.result-dialog',
  ) as HTMLDialogElement;

  const showDialog = () => resultDialog?.showModal();
  const closeDialog = () => resultDialog?.close();

  const dialogH2 = resultDialog.querySelector('h2');
  const dialogImg = resultDialog.querySelector('img');
  const dialogP = resultDialog.querySelector('p');
  const dialogBtn1 = resultDialog.querySelector('.dialog-btn1');
  const dialogBtn2 = resultDialog.querySelector('.dialog-btn2');

  if (round === 10) {
    const imgPath = getImage(`ayaPingSuccess`);

    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 성공`;
    if (dialogImg?.src) dialogImg.src = imgPath;
    if (dialogP?.textContent) dialogP.textContent = '모든 라운드에 성공했어요!';
    if (dialogBtn2?.textContent) dialogBtn2.textContent = `결과보기`;

    dialogBtn1?.setAttribute('hidden', '');
    localStorage.setItem('history', '0');
  } else if (result === true) {
    const imgPath = getImage(`ayaPingSuccess`);

    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 성공`;
    if (dialogImg?.src) dialogImg.src = imgPath;
    if (dialogP?.textContent)
      dialogP.textContent = '다음 라운드도 도전해보세요!';
    dialogBtn1?.removeAttribute('hidden');

    if (dialogBtn2?.textContent) dialogBtn2.textContent = `그만하기`;
  } else {
    const imgPath = getImage(`ayaPingFail`);

    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 실패`;
    if (dialogImg?.src) dialogImg.src = imgPath;
    if (dialogP?.textContent) dialogP.textContent = '다시 한 번 도전해보세요!!';
    dialogBtn1?.setAttribute('hidden', '');
  }

  showDialog();

  dialogBtn1?.addEventListener('click', () => {
    closeDialog();
    resolve();
  });
  dialogBtn2?.addEventListener('click', () => {
    closeDialog();
    // 결과보기
    showGameConclusion(round);
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

      const distance = loc1.left - loc2.left;
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

function showGameConclusion(round: number) {
  const gameDescription =
    document.querySelector<HTMLParagraphElement>('.game-description');
  const gameContainer =
    document.querySelector<HTMLDivElement>('.game-container');
  const gameConclusion =
    document.querySelector<HTMLDivElement>('.game-conclusion');

  const completedRound =
    gameConclusion?.querySelector<HTMLSpanElement>('.completed-round');
  const attemptCount =
    gameConclusion?.querySelector<HTMLSpanElement>('.attempt-count');

  if (gameDescription?.style) gameDescription.style.display = 'none';
  if (gameContainer?.style) gameContainer.style.display = 'none';
  if (gameConclusion?.style) gameConclusion.style.display = 'flex';

  if (completedRound) completedRound.textContent = round.toString();

  const count = localStorage.getItem('attemptCount');
  if (attemptCount) attemptCount.textContent = count;

  // 10라운드까지 성공하면 시도 횟수 초기화
  if (round === 10) localStorage.setItem('attemptCount', '0');

  const restartBtn = document.querySelector('.restart-btn');
  restartBtn?.addEventListener('click', () => {
    resetToStartScreen();
  });
}

export function resetToStartScreen() {
  const gameStartBtnContainer = document.querySelector<HTMLDivElement>(
    '.game-start-btn-container',
  );
  const gameConclusion =
    document.querySelector<HTMLDivElement>('.game-conclusion');
  const gameRound = document.querySelector<HTMLDivElement>('.game-round');
  const gameContainer =
    document.querySelector<HTMLDivElement>('.game-container');
  const gameDescription =
    document.querySelector<HTMLParagraphElement>('.game-description');

  if (gameStartBtnContainer) gameStartBtnContainer.style.display = 'flex';
  if (gameConclusion) gameConclusion.style.display = 'none';
  if (gameContainer) gameContainer.style.display = 'none';

  if (gameDescription) {
    gameDescription.style.removeProperty('display');
    setGameDescription('큐브 속으로 숨은 티니핑을 찾아보세요!');
  }

  gameRound?.setAttribute('hidden', '');
  setContinueButtonDisabled();
}

export function setContinueButtonDisabled() {
  const history = localStorage.getItem('history');
  const continueStartBtn =
    document.querySelector<HTMLButtonElement>('.continue-game-btn');

  if (continueStartBtn) {
    if (Number(history) < 2) {
      continueStartBtn.style.backgroundColor = '#e0e0e0';
      continueStartBtn.style.color = '#999';
      continueStartBtn.disabled = true;
      continueStartBtn.classList.remove('hovered');
    } else {
      continueStartBtn.style.backgroundColor = '#ff9edb';
      continueStartBtn.style.color = 'white';
      continueStartBtn.disabled = false;
      continueStartBtn.classList.add('hovered');
    }
  }
}

export function getImage(imgName: string) {
  const images: Record<string, unknown> = import.meta.glob(
    '/src/assets/findgame_img/*.WEBP',
    {
      eager: true,
      import: 'default',
    },
  );
  const imgPath = images[`/src/assets/findgame_img/${imgName}.WEBP`] as string;
  return imgPath;
}

export function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
