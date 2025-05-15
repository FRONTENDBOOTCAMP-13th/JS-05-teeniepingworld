import { type findTeenieping } from '../../types/findGameType.ts';

export function openCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('Cube.PNG')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('Cube', 'CubeOpen'));
  }
}

export function closeCube(set: findTeenieping) {
  const targetImg = set.getDiv?.querySelector('img');

  if (targetImg?.src.endsWith('CubeOpen.PNG')) {
    targetImg?.setAttribute('src', targetImg?.src.replace('CubeOpen', 'Cube'));
  }
}

export function insertTeenieping(answerSet: findTeenieping) {
  if (answerSet.getDiv) {
    const targetDiv = answerSet.getDiv;

    const newImg = document.createElement('img');
    newImg.setAttribute('src', '/src/assets/findGame/ruruPing.PNG');
    newImg.setAttribute('alt', '티니핑');
    newImg.setAttribute('class', 'teenieping');
    targetDiv.appendChild(newImg);
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

/**
 * 위치바꾸기 함수
 */
export function changeLocation(arr: findTeenieping[], container: Element) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // set 번호 임의 선정
      const randomNumForChangeLocation: number = Math.floor(Math.random() * 3);
      // 위에서 정한 set 타겟 요소
      const targetElem = arr[randomNumForChangeLocation].getDiv;
      if (targetElem) container?.appendChild(targetElem);
      resolve();
    }, 300);
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

  if (result === true) {
    if (dialogH2?.textContent) dialogH2.textContent = `${round}ROUND 성공`;
    if (dialogImg?.src)
      dialogImg.src = '/src/assets/findGame/ayaPingSuccess.PNG';
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
