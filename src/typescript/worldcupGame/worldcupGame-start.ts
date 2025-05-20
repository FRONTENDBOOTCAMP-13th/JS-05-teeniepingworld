/* 이상형 월드컵 게임 알고리즘
  TODO
  - [x] 라운드 수 대로 랜덤 객체 2개씩 배치, 배열 생성
  - [x] 각 라운드 당, selected, unselected 객체 구분하여 배열 반환
  - [x] 우승한 객체 반환
  - [x] 유저 선택했던 우승 결과 저장 및 통계 페이지 

  flow
  1. worldcupGameModal.ts
  startGame()에서 ${selectedRound} 갯수대로 dataBase.ts에서 랜덤 객체 호출
  2. 갯수/2 하여 쌍 생성
  3. 객체 DOM 동적 생성
  4. 객체 click 시, selected, unselected 개체 구분, 배열에서 데이터 처리
  5. 최종 하나 남을 시, 우승 객체 선출, 게임 종료

  관련 변수
  selected: string, 선택 시 다음 라운드 진출, 아닐 시 탈락
  player: [] -> 라운드 수에 맞게 선정한 객체를 담는 배열
  winner: [] -> selected 객체를 담는 배열
  */

import {
  getIsLikelionClicked,
  getSpecialCharacters,
} from './worldcupGame-likelion.ts';

// 티니핑 data type 정의
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

// 게임 관련 type 정의
interface GameState {
  currentRound: number;
  totalRounds: number;
  matchIndex: number;
  players: Teenieping[];
  winners: Teenieping[];
  gameHistory: GameHistory;
}

interface GameHistory {
  matchups: MatchupResult[];
  finalWinner?: Teenieping;
}

interface GameResult {
  winner: string | number;
  date: string;
  roundCount: number;
  matchups: MatchupData[];
}

interface MatchupData {
  round: number;
  winner: string | number;
  loser: string | number;
}

interface MatchupResult {
  round: number;
  winner: Teenieping;
  loser: Teenieping;
}

// dataBase에서 티니핑 data 호출
let teeniepingData: { properties: string[]; result: Teenieping[] };

try {
  // 실무에서는 import, 혹은 fetch 사용 가능
  import('../dataBase.ts')
    .then(({ teeniepingData: importedData }) => {
      teeniepingData = importedData;
    })
    .catch((error) => {
      console.error('database Load Error:', error);
      // 호출 에러 발생 시 빈 배열 호출
      teeniepingData = { properties: [], result: [] };
    });
} catch (error) {
  console.error('database Load Error:', error);
  teeniepingData = { properties: [], result: [] };
}

// game 상태 초기화
let gameState: GameState = {
  currentRound: 0,
  totalRounds: 0,
  matchIndex: 0,
  players: [],
  winners: [],
  gameHistory: {
    matchups: [],
  },
};

/** 배열 셔플 함수 (Fisher-Yates 알고리즘)
 * @param array 셔플할 배열
 * @returns 셔플된 배열
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled: T[] = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * 객체 랜덤 선택 함수
 * @param count 선택할 객체 수
 * @returns 선택될 케릭터 배열
 */
function getRandomTeeniepings(count: number): Teenieping[] {
  //data 없을 시 빈배열 반환
  if (!teeniepingData.result || teeniepingData.result.length === 0) {
    console.error('사용 가능한 티니핑 데이터가 없습니다.');
    return [];
  }

  const selected: Teenieping[] = [];

  //.likelion click 시, hidden character joined
  if (getIsLikelionClicked()) {
    const specialCharacters = getSpecialCharacters();

    //hidden character를 selected array에 우선 추가
    specialCharacters.forEach((character) => {
      selected.push(standardizeTeenieping(character));
    });

    console.log('🦁 clicked, hidden teeniepings are coming!');
    console.log(
      '선택된 특별 캐릭터:',
      specialCharacters.map((char) => char.name),
    );
  }

  // 남은 slot에 기타 객체 선택
  const remainingCount = count - selected.length;

  // 요청 수가 히든케보다 적거나 같으면 히든케만 반환
  if (remainingCount <= 0) {
    const result = shuffleArray(selected.slice(0, count));
    console.log('요청 수가 적어서 히든 케릭으로만 구성');
    return result;
  }

  // 일반 케릭터들에서 남은 만큼 랜덤 선택
  const allCharacters = [...teeniepingData.result];
  const shuffledCharacters = shuffleArray(allCharacters);

  // 남은 수만큼 일반 케릭터 추가
  for (let i = 0; i < remainingCount && i < shuffledCharacters.length; i++) {
    selected.push(standardizeTeenieping(shuffledCharacters[i]));
  }

  // 최종 배열 셔플
  const finalResult = shuffleArray(selected);
  console.log(
    '최종 players',
    finalResult.map((char) => char.name),
  );
  return finalResult;
}

/**
 * 티니핑 데이터 표준화 (likes, dislikes 배열 처리)
 */
function standardizeTeenieping(teenieping: Teenieping): Teenieping {
  //likes와 dislikes가 문자열인 경우 배열로 반환
  const likes =
    typeof teenieping.likes === 'string'
      ? teenieping.likes.split(',').map((item) => item.trim())
      : teenieping.likes;

  const dislikes =
    typeof teenieping.dislikes === 'string'
      ? teenieping.dislikes.split(',').map((item) => item.trim())
      : teenieping.dislikes;

  return {
    ...teenieping,
    likes,
    dislikes,
  };
}

/**
 * 게임 시작 함수
 * @param roundCount 라운드 수 (8, 16, 32, 64)
 */
function startGame(roundCount: number): void {
  //게임 상태 초기화
  gameState = {
    currentRound: 1,
    totalRounds: roundCount,
    matchIndex: 0,
    players: getRandomTeeniepings(roundCount),
    winners: [],
    gameHistory: {
      matchups: [],
    },
  };

  //플레이어 수 확인
  if (gameState.players.length < roundCount) {
    console.error(`${roundCount}강을 위한 충분한 케릭터가 없습니다.`);
    return;
  }

  //게임화면 초기화 및 표시
  initializeGameUI();
}

/**
 * 게임 UI 초기화 함수
 */
function initializeGameUI(): void {
  //메인 페이지 hidden
  const mainPage = document.querySelector('.main-page') as HTMLElement;
  if (mainPage) mainPage.style.display = 'none';

  //게임 페이지 생성 및 표시
  createGamePage();

  //첫 매치 표시
  displayCurrentMatch();
}

/**
 * 게임 페이지 생성 함수
 */
function createGamePage(): void {
  //게임 페이지 요소 생성
  const gamePage = document.createElement('section');
  gamePage.className = 'main-content game-page';

  //기본 구조 생성
  gamePage.innerHTML = `
  <div class="game-page-title">
        <h1 class="title-text">티니핑 이상형 월드컵</h1>
        <ul class="text-wrapper">
          <li class="sub-title">${gameState.totalRounds}강</li>
          <li class="sub-info">(1/${gameState.totalRounds / 2})</li>
        </ul>
        <div class="progress-bar">
          <div class="bg-bar"></div>
          <div class="pg-bar" style="width: 10%"></div>
        </div>
      </div>

      <div class="game-page-content">
      <ul class="character-match"></ul>
      </div>
  `;

  //페이지에 추가
  document.body.appendChild(gamePage);
}

/**
 * 현 매치 표시 함수
 */
function displayCurrentMatch(): void {
  //round 끝났는지 확인
  if (gameState.matchIndex >= gameState.players.length / 2) {
    //next round 준비
    prepareNextRound();

  }

  //game 끝났는지 확인
  if (gameState.winners.length === 1 && gameState.players.length === 0) {
    displayWinner(gameState.winners[0]);
    return;
  }

  //마지막 라운드 마지막 매치 체크
  if (
    gameState.totalRounds === Math.pow(2, gameState.currentRound - 1) &&
    gameState.winners.length === 1
  ) {
    displayWinner(gameState.winners[0]);
    return;
  }

  //현재 match index 계산
  const idx = gameState.matchIndex * 2;

  //배열 범위 체크 추가
  if (idx + 1 >= gameState.players.length) {
    console.error('매치 인덱스 오류: 배열 범위 초과');
    console.error('현재 players:', gameState.players);
    console.error('matchIndex:', gameState.matchIndex);
    console.error('idx:', idx);
    return;
  }

  const character1 = gameState.players[idx];
  const character2 = gameState.players[idx + 1];

  //케릭터 유효성 검사
  if (!character1 || !character2) {
    console.error('character is undefined.', { character1, character2 });
    return;
  }

  //매치 ui 업데이트
  updateMatchUI(character1, character2);

  //매치 ui 업데이트
  updateProgressBar();
}

/**
 * 매치 UI 업데이트 함수
 */
function updateMatchUI(character1: Teenieping, character2: Teenieping): void {
  const characterMatch = document.querySelector(
    '.character-match',
  ) as HTMLElement;
  if (!characterMatch) return;

  // 케릭터 매치 UI 생성
  characterMatch.innerHTML = `
  <li data-no="${character1.no}" class="character-option">
      <figure>
        <img class="cover-img" src="${character1.imgLink}" alt="${character1.name}" />
        <figcaption class="content-text">${character1.name}</figcaption>
      </figure>
    </li>
    <li data-no="${character2.no}" class="character-option">
      <figure>
        <img class="cover-img" src="${character2.imgLink}" alt="${character2.name}" />
        <figcaption class="content-text">${character2.name}</figcaption>
      </figure>
    </li>
    `;

  //click event 추가
  const options = document.querySelectorAll('.character-option');
  options.forEach((option) => {
    option.addEventListener('click', handleCharacterSelection);
  });

  //round 정보 업데이트
  const subInfo = document.querySelector('.sub-info') as HTMLElement;
  if (subInfo) {
    const totalMatches =
      gameState.totalRounds / Math.pow(2, gameState.currentRound - 1) / 2;
    subInfo.textContent = `(${gameState.matchIndex + 1} / ${totalMatches})`;
  }
}

/**
 * 캐릭터 선택 처리 함수
 */

function handleCharacterSelection(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const selectedNo = target.dataset.no;

  //현재 매치 가져오기
  const idx = gameState.matchIndex * 2;

  //배열 범위 체크
  if (idx + 1 >= gameState.players.length) {
    console.error('배열 범위 초과:', {
      idx,
      playersLength: gameState.players.length,
    });
    return;
  }

  const character1 = gameState.players[idx];
  const character2 = gameState.players[idx + 1];

  console.log(`매치: ${character1.name} vs ${character2.name}`);

  //선택된 캐릭터, 탈락 캐릭터 결정
  let winner: Teenieping, loser: Teenieping;

  if (selectedNo === character1.no.toString()) {
    winner = character1;
    loser = character2;
  } else {
    winner = character2;
    loser = character1;
  }

  console.log(`승자: ${winner.name}, 패자: ${loser.name}`);

  //위너 배열에 추가
  gameState.winners.push(winner);
  console.log(
    `현재 winners 배열:`,
    gameState.winners.map((w) => w.name),
  );

  //게임 기록 업데이트
  gameState.gameHistory.matchups.push({
    round: gameState.currentRound,
    winner,
    loser,
  });

  //다음 매치로 이동
  gameState.matchIndex++;

  //현 round status 확인
  const isLastRound =
    gameState.totalRounds / Math.pow(2, gameState.currentRound - 1) === 2;
  const isLastMatch = gameState.matchIndex >= gameState.players.length / 2;

  if (isLastRound && isLastMatch && gameState.winners.length === 1) {
    //최종 우승자 표시
    displayWinner(gameState.winners[0]);
    return;
  }

  //다음 매치 표시
  displayCurrentMatch();
}

/**
 * 다음 라운드 준비 함수
 */
function prepareNextRound(): void {
  //round 업데이트
  gameState.currentRound++;

  //현 round에 맞는 이름 계산
  const roundName =
    gameState.totalRounds / Math.pow(2, gameState.currentRound - 1);
  console.log(`Next round prepared: ${roundName}강`);

  //sub-title update
  const subTitle = document.querySelector('.sub-title') as HTMLElement;
  if (subTitle) {
    //결승전 시 처리
    if (roundName === 2) {
      subTitle.textContent = '결승';
    } else {
      subTitle.textContent = `${roundName}강`;
    }
  }

  //sub-info update
  const subInfo = document.querySelector('.sub-info') as HTMLElement;
  if (subInfo) {
    const totalMatches = gameState.winners.length / 2;
    subInfo.textContent = `(1/${totalMatches})`;
  }

  //player 배열 업데이트
  gameState.players = shuffleArray([...gameState.winners]);
  gameState.winners = [];

  //match index 초기화
  gameState.matchIndex = 0;
}

/**
 * 진행 상황 바 업데이트 함수
 */
function updateProgressBar(): void {
  const totalRounds = Math.log2(gameState.totalRounds);
  const currentProgress = ((gameState.currentRound - 1) * 100) / totalRounds;
  const matchProgress =
    (gameState.matchIndex * 100) / (gameState.players.length / 2) / totalRounds;

  const progressBar = document.querySelector('.pg-bar') as HTMLElement;
  if (progressBar) {
    progressBar.style.width = `${currentProgress + matchProgress}%`;
  }
}

/**
 * 우승자 표시 함수
 */
function displayWinner(winner: Teenieping): void {
  console.log(`우승자: ${winner.name}`);

  //최종 우승자 기록
  gameState.gameHistory.finalWinner = winner;

  //로컬 스토리지에 결과 저장
  saveGameResult(winner);

  //게임 페이지 제거
  const gamePage = document.querySelector('.game-page') as HTMLElement;
  if (gamePage) gamePage.remove();

  //우승자 페이지 생성
  createWinnerPage(winner);
}

/**
 * 우승자 페이지 생성 함수
 */
function createWinnerPage(winner: Teenieping): void {
  //우승자 페이지 요소 생성
  const winnerPage = document.createElement('section');
  winnerPage.className = 'main-content winner-page';

  //likes와 dislikes 처리
  const likes = Array.isArray(winner.likes)
    ? winner.likes.join(', ')
    : winner.likes;
  const dislikes = Array.isArray(winner.dislikes)
    ? winner.dislikes.join(', ')
    : winner.dislikes;

  //기본 구조 새성
  winnerPage.innerHTML = `
 <div class="winner-page-title">
      <h1 class="title-text">티니핑 이상형 월드컵</h1>
    </div>
    <div class="winner-page-content">
      <ul>
        <li class="sub-title">💕💗 나의 최애 티니핑은.. 💗💕</li>
        <li>
          <figure>
            <img class="cover-img" src="${winner.imgLink}" alt="${winner.name}" />
            <figcaption class="content-text">${winner.name}</figcaption>
          </figure>
        </li>
        <li class="character-info">
          <p><span class="label">성별:</span> <span>${winner.gender}</span></p>
          <p><span class="label">좋아하는 것:</span> <span>${likes}</span></p>
          <p><span class="label">싫어하는 것:</span> <span>${dislikes}</span></p>
        </li>
      </ul>

      <div class="button-group">
        <button class="action-btn retry-btn" type="button">
        <img src="/typeTest_img/repeat.png" alt="다시하기" />
        <span>
          다시 선택하기</span>
        </button>
        <button class="action-btn rank-btn" type="button">
          <span><img src=".././assets/worldcupGame_img/rank.svg" alt="이상형 랭킹" /></span>
          랭킹보기
        </button>
        <button class="action-btn share-btn sns-share-btn" type="button">
          <span>🔗</span> 공유하기
        </button>

        <button class="action-btn share-btn fb-share-btn" type="button" onclick="shareFacebook()">
          <span>facebook</span> 공유하기
        </button>
      </div>
    </div>
    <button class="home-btn" type="button">이상형 월드컵으로 돌아가기</button>
  `;

  //페이지에 추가
  document.body.appendChild(winnerPage);

  //버튼 이벤트 리스너 추가
  addWinnerPageEventListeners();
}

/**
 * 우승자 페이지 이벤트 리스너 추가 함수 buttons
 */
function addWinnerPageEventListeners(): void {
  //다시 선택하기 버튼
  const retryBtn = document.querySelector('.retry-btn') as HTMLButtonElement;
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      //우승자 페이지 제거
      const winnerPage = document.querySelector('.winner-page') as HTMLElement;
      if (winnerPage) winnerPage.remove();

      //게임 다시 시작
      startGame(gameState.totalRounds);
    });
  }
  //랭킹 보기 버튼
  const rankBtn = document.querySelector('.rank-btn') as HTMLButtonElement;
  if (rankBtn) {
    rankBtn.addEventListener('click', showRankingPage);
  }

  //공유하기 버튼
  const shareBtn = document.querySelector('.share-btn') as HTMLButtonElement;
  if (shareBtn) {
    shareBtn.addEventListener('click', shareResult);
  }

  //홈으로 버튼
  const homeBtn = document.querySelector('.home-btn') as HTMLButtonElement;
  if (homeBtn) {
    homeBtn.addEventListener('click', goToHomePage);
  }
}

/**
 * 게임 결과 저장 함수
 */
function saveGameResult(winner: Teenieping): void {
  try {
    //기존 결과 가져오기
    const gameResult: GameResult[] = JSON.parse(
      localStorage.getItem('teeniepingWorldcupResults') || '[]',
    );

    //새 결과 추가
    gameResult.push({
      winner: winner.no,
      date: new Date().toISOString(),
      roundCount: gameState.totalRounds,
      matchups: gameState.gameHistory.matchups.map((matchup) => ({
        round: matchup.round,
        winner: matchup.winner.no,
        loser: matchup.loser.no,
      })),
    });

    //결과 저장
    localStorage.setItem(
      'teeniepingWorldcupResults',
      JSON.stringify(gameResult),
    );

    console.log('게임 결과가 저장되었습니다.');
  } catch (error) {
    console.error('게임 결과 저장 오류:', error);
  }
}

/**
 * 랭킹 페이지 표시 함수
 */
function showRankingPage(): void {
  //우승자 페이지 숨기기
  const winnerPage = document.querySelector('.winner-page') as HTMLElement;
  if (winnerPage) winnerPage.style.display = 'none';

  //랭킹 데이터 계산
  const rankingData = calculateRankingData();

  //랭킹 페이지 생성
  createRankingPage(rankingData);
}

/**
 * 랭킹 데이터 계산 함수
 * @returns 정렬된 랭킹 데이터
 */
function calculateRankingData(): {
  no: string | number;
  name: string;
  winCount: number;
  winRate: number;
  imgLink: string;
}[] {
  try {
    //게임 결과 가져오기
    const gameResults: GameResult[] = JSON.parse(
      localStorage.getItem('teeniepingWorldcupResults') || '[]',
    );

    //캐릭터별 승리 횟수 및 총 매치 수 계산
    const characterStats: {
      [key: string]: {
        wins: number;
        matches: number;
        name: string;
        imgLink: string;
      };
    } = {};

    //모든 티니핑 초기화
    teeniepingData.result.forEach((character) => {
      characterStats[character.no] = {
        wins: 0,
        matches: 0,
        name: character.name,
        imgLink: character.imgLink,
      };
    });
    //우승 데이터 처리
    gameResults.forEach((result) => {
      if (characterStats[result.winner]) {
        characterStats[result.winner].wins++;
      }

      //매치업 데이터 처리
      result.matchups.forEach((matchup) => {
        if (characterStats[matchup.winner]) {
          characterStats[matchup.winner].matches++;
        }
        if (characterStats[matchup.loser]) {
          characterStats[matchup.loser].matches++;
        }
      });
    });

    //랭킹 배열 생성 및 정렬
    const rankingArray = Object.keys(characterStats).map((no) => {
      const stats = characterStats[no];
      return {
        no,
        name: stats.name,
        winCount: stats.wins,
        winRate: stats.matches > 0 ? (stats.wins / stats.matches) * 100 : 0,
        imgLink: stats.imgLink,
      };
    });

    //승리 횟수로 정렬
    rankingArray.sort((a, b) => b.winCount - a.winCount);

    return rankingArray;
  } catch (error) {
    console.error('랭킹 데이터 계산 오류:', error);
    return [];
  }
}

/**
 * 랭킹 페이지 생성 함수
 */
function createRankingPage(
  rankingData: {
    no: string | number;
    name: string;
    winCount: number;
    winRate: number;
    imgLink: string;
  }[],
): void {
  //랭킹 페이지 요소 생성
  const rankPage = document.createElement('section');
  rankPage.className = 'main-content rank-page';

  //기본 구조 생성
  rankPage.innerHTML = `
  <div class="rank-page-title">
      <h1 class="title-text">티니핑 이상형 월드컵 인기 랭킹</h1>
    </div>
    <div class="rank-page-content">
      <table class="rank-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>캐릭터</th>
            <th>승리 횟수</th>
            <th>승률</th>
          </tr>
        </thead>
        <tbody>
          ${rankingData
            .slice(0, 10)
            .map(
              (character, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="character-cell">
                  <img src="${character.imgLink}" alt="${character.name}" class="rank-img" />
                  <span>${character.name}</span>
                </div>
              </td>
              <td>${character.winCount}</td>
              <td>${character.winRate.toFixed(1)}%</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <button class="home-btn" type="button">홈으로</button>
  `;

  //페이지에 추가
  document.body.appendChild(rankPage);

  //홈으로 버튼 이벤트 리스너 추가
  const homeBtn = document.querySelector(
    '.rank-page .home-btn',
  ) as HTMLButtonElement;
  if (homeBtn) {
    homeBtn.addEventListener('click', goToHomePage);
  }
}

/**
 * 결과 공유 함수
 */
function shareResult(): void {
  const winner = gameState.gameHistory.finalWinner;
  if (!winner) return;

  //현재 페이지 URL
  const url = window.location.href;

  //공유할 텍스트
  const shareText = `티니핑 이상형 월드컵에서 내가 선택한 최애는 ${winner.name}~~!❤️`;

  //클립보드에 복사
  try {
    navigator.clipboard.writeText(`${shareText} ${url}`).then(() => {
      alert('클립보드에 복사되었습니다!');
    });
  } catch (error) {
    console.error('공유하기 오류:', error);
    alert('공유하기 기능을 사용할 수 없습니다.');
  }
}

/**
 * 홈 페이지로 이동 함수
 */
function goToHomePage(): void {
  //현재 열려있는 모든 페이지 제거
  const pages = document.querySelectorAll(
    '.winner-page, .rank-page, .game-page',
  );
  pages.forEach((page) => page.remove());

  //메인 페이지 표시
  const mainPage = document.querySelector('.main-page') as HTMLElement;
  if (mainPage) mainPage.style.display = 'block';
}

//worldcupGameModal.ts에서 startGame 함수를 export
export { startGame, calculateRankingData };
export type { GameState, Teenieping };
