import { type findTeenieping } from '../../types/findGameType.ts';
import {
  animateSwap,
  checkAnswer,
  closeCube,
  getResult,
  handleSelection,
  insertTeenieping,
  setCube,
  setGameDescription,
  setRound,
  waitDelay,
  waitForNextPaint,
} from './findGameUtils.ts';

/**
 * 주어진 라운드를 실행하고 완료 시 Promise를 해결합니다.
 *
 * @param {number} round - 실행할 라운드 번호
 * @returns {Promise<number>} 라운드 실행 완료 시점에 완료되는 Promise
 */
export async function play(round: number) {
  const gameContainer = document.querySelector<HTMLElement>('.game-container');

  const getAllSets = gameContainer?.querySelectorAll('div');
  getAllSets?.forEach((item) => {
    item.remove();
  });

  // 라운드 표시
  setRound(round);

  // TODO 라운드에 따라 변경
  let teeniepingName: string = '루루핑';
  let teeniepingNameEng: string = 'ruru';
  if (round === 3 || round === 4) {
    teeniepingName = '빤짝핑';
    teeniepingNameEng = 'bbanzzak';
  } else if (round == 5 || round == 6) {
    teeniepingName = '빛나핑';
    teeniepingNameEng = 'bitna';
  } else if (round == 7 || round == 8) {
    teeniepingName = '오로라핑';
    teeniepingNameEng = 'aurora';
  } else if (round == 9 || round == 10) {
    teeniepingName = '댄스핑';
    teeniepingNameEng = 'sway';
  }
  // 큐브 세팅
  let cubeCount = 3;
  if (round >= 3) cubeCount++;
  if (round >= 5) cubeCount++;
  if (round >= 7) cubeCount++;
  if (round >= 9) cubeCount++;

  for (let i = 0; i < cubeCount; i++) {
    setCube(i, teeniepingNameEng);
  }

  await waitForNextPaint();

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
  console.log(findTeeniepingArr);

  // TODO 특정 행동(티니핑 넣기) 구현

  // 정답 인덱스에 티니핑 넣기
  insertTeenieping(findTeeniepingArr[answerIdx], teeniepingNameEng, round);

  // 큐브 닫기
  await waitDelay(2000);
  findTeeniepingArr.forEach((item) => closeCube(item, teeniepingNameEng));

  setGameDescription(`빠르게 움직이는 큐브에 집중해주세요!`);

  await waitDelay(1000);

  // 위치 바꾸기 (5번)
  for (let i = 0; i < round * 4; i++) {
    if (gameContainer) await animateSwap(1000 / round);
  }

  setGameDescription(`어느 큐브에 ${teeniepingName}이 숨어있을까요?`);

  // 클릭 이벤트 추기 (정답 맞추기)
  const selectIdx = await handleSelection(findTeeniepingArr, teeniepingNameEng);
  let result = false;

  if (selectIdx === answerIdx) {
    setGameDescription(`숨어있는 ${teeniepingName}을 찾았어요!`);
    result = true;

    await waitDelay(2000);
    return getResult(result, round);
  } else {
    // 정답 확인하기 틀린 경우만
    setGameDescription(`앗, 여긴 아니었네요!`);

    await checkAnswer(findTeeniepingArr, teeniepingName, teeniepingNameEng);

    await waitDelay(2000);
    return getResult(result, round);
  }
}
