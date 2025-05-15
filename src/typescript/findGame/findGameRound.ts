import { type findTeenieping } from '../../types/findGameType.ts';
import {
  animateSwap,
  checkAnswer,
  closeCube,
  handleSelection,
  insertTeenieping,
  setGameDescription,
  setRound,
  showResult,
  waitDelay,
} from './findGameUtils.ts';

export function playOneRound(round: number) {
  return new Promise<void>((resolve) => {
    play(round, resolve);
  });
}

async function play(round: number, resolve: () => void) {
  const gameContainer = document.querySelector<HTMLElement>('.game-container');
  // 라운드 변경
  setRound(round);

  // TODO 라운드에 따라 변경
  let teeniepingName: string = '';
  if (round === 1 || round === 2) teeniepingName = '루루핑';
  else teeniepingName = '빤짝핑';

  setGameDescription(`${teeniepingName}이 큐브 속에 숨었어요!`);

  // set 모두 가져오기 (배열로)
  const setArr: NodeListOf<HTMLElement> | undefined =
    gameContainer?.querySelectorAll('.set');

  // 추후 변경 시(티니핑 추가) let으로 변경
  const findTeeniepingArr: findTeenieping[] = [];

  // findTeeniepingArr 생성
  if (setArr != undefined) {
    for (let i = 0; i < setArr.length; i++) {
      findTeeniepingArr[i] = {
        getDiv: setArr[i],
        status: false,
      };
    }
  }

  // 정답 지정(랜덤)
  const answerIdx: number = Math.floor(
    Math.random() * findTeeniepingArr.length,
  );
  findTeeniepingArr[answerIdx].status = true;
  console.log(answerIdx);

  // TODO 특정 행동(티니핑 넣기) 구현

  // 정답 인덱스에 티니핑 넣기
  insertTeenieping(findTeeniepingArr[answerIdx]);

  // 큐브 닫기
  await waitDelay(2000);
  findTeeniepingArr.forEach(closeCube);

  setGameDescription(`빠르게 움직이는 큐브에 집중해주세요!`);

  await waitDelay(1000);

  // 위치 바꾸기 (5번)
  for (let i = 0; i < 5; i++) {
    if (gameContainer) await animateSwap(1000);
  }

  setGameDescription(`어느 큐브에 ${teeniepingName}이 숨어있을까요?`);

  // 클릭 이벤트 추기 (정답 맞추기)
  const selectIdx = await handleSelection(findTeeniepingArr);
  let result = false;

  if (selectIdx === answerIdx) {
    setGameDescription(`숨어있는 ${teeniepingName}을 찾았어요!`);
    result = true;

    await waitDelay(2000);
    showResult(resolve, result, round);
  } else {
    // 정답 확인하기 틀린 경우만
    setGameDescription(`앗, 여긴 아니었네요!`);

    await checkAnswer(findTeeniepingArr, teeniepingName);

    await waitDelay(2000);
    showResult(resolve, result, round);
  }
}
