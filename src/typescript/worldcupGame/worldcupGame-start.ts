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
  resetLikelionState,
} from './worldcupGame-likelion.ts';

import {
  showRankingPage,
  shareResult,
  setGameState,
} from './worldcupGame-rank';

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

//proload 이미지 저장소
const imageCache: Map<string, HTMLImageElement> = new Map();

//dataBase.ts load
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

/**
 * 이미지 preload function
 */
async function preloadImages(
  imageUrls: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const total = imageUrls.length;
  let loaded = 0;

  const loadPromises = imageUrls.map((url) => {
    return new Promise<void>((resolve) => {
      //이미 preloaded 한 이미지인지 확인
      if (imageCache.has(url)) {
        loaded++;
        onProgress?.(loaded, total);
        resolve();
        return;
      }

      const img = new Image();

      img.onload = () => {
        //성공 로드한 이미지 캐시에 저장
        imageCache.set(url, img);
        loaded++;
        onProgress?.(loaded, total);
        resolve();
      };

      img.onerror = () => {
        console.warn(`이미지 로드 실패: ${url}`);
        loaded++;
        onProgress?.(loaded, total);
        resolve();
      };

      img.src = url;
    });
  });

  await Promise.all(loadPromises);
}

/**
 * 배열 셔플 함수 (Fisher-Yates 알고리즘)
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

  let selected: Teenieping[] = [];

  //debug: check likelion status
  const likelionStatus = getIsLikelionClicked();
  console.log('[debug] Check likelion status', likelionStatus);

  const allHiddenCharacterNumbers = ['134', '135'];

  //.likelion click 시, hidden character joined
  if (likelionStatus) {
    const specialCharacters = getSpecialCharacters();
    console.log(
      '[debug] hidden 캐릭터 list',
      specialCharacters.map((char) => char.name),
    );

    //hidden character를 selected array에 우선 추가
    selected = [
      ...specialCharacters.map((char) => standardizeTeenieping(char)),
    ];

    console.log('hidden teeniepings are coming!');
    console.log(
      '선택된 특별 캐릭터:',
      specialCharacters.map((char) => char.name),
    );
  } else {
    console.log('일반 캐릭터 반환');
  }

  // 남은 slot 계산
  const remainingCount = count - selected.length;
  console.log(
    '[debug] hidden ping 갯수:',
    selected.length,
    '남은 슬롯:',
    remainingCount,
  );

  // 요청 수가 히든 캐릭터 수보다 적거나 같으면 히든 캐릭터만으로 충분
  if (remainingCount <= 0) {
    const result = shuffleArray(selected.slice(0, count));
    console.log(
      '히든 캐릭터만으로 구성:',
      result.map((char) => char.name),
    );
    return result;
  }

  //일반 캐릭터들만 선택
  const regularCharacters = teeniepingData.result.filter(
    (char) => !allHiddenCharacterNumbers.includes(char.no.toString()),
  );
  const shuffledCharacters = shuffleArray(regularCharacters);

  //남은 수만큼 일반 케릭터 추가
  for (let i = 0; i < remainingCount && i < shuffledCharacters.length; i++) {
    selected.push(standardizeTeenieping(shuffledCharacters[i]));
  }

  // 최종 배열 셔플
  const finalResult = shuffleArray(selected);
  console.log(
    '최종 선택된 players:',
    finalResult.map((char) => char.name),
  );

  //debug 중복 검사
  const uniqueNumbers = new Set(finalResult.map((char) => char.no.toString()));
  const hasDuplicates = uniqueNumbers.size !== finalResult.length;
  console.log('[debug] 중복 캐릭터 존재 여부:', hasDuplicates);

  //hidden 캐릭터 포함 여부 체크
  const hasHiddenCharacters = finalResult.some((char) =>
    allHiddenCharacterNumbers.includes(char.no.toString()),
  );
  console.log('[debug] hidden ping 포함 여부:', hasHiddenCharacters);

  // likelion을 클릭하지 않았는데 히든 캐릭터가 포함된 경우 경고
  if (!likelionStatus && hasHiddenCharacters) {
    console.error(
      '[ERROR] 라이키온을 클릭하지 않았는데 히든 캐릭터가 포함되었습니다!',
    );
    // 히든 캐릭터를 제거하고 다시 선택
    const filteredResult = finalResult.filter(
      (char) => !allHiddenCharacterNumbers.includes(char.no.toString()),
    );

    // 부족한 만큼 추가 선택
    const needMore = count - filteredResult.length;
    if (needMore > 0) {
      const availableCharacters = shuffledCharacters.filter(
        (char) => !filteredResult.some((selected) => selected.no === char.no),
      );

      for (let i = 0; i < needMore && i < availableCharacters.length; i++) {
        filteredResult.push(standardizeTeenieping(availableCharacters[i]));
      }
    }

    console.log(
      '히든 캐릭터 제거 후 최종 결과:',
      filteredResult.map((char) => char.name),
    );
    return shuffleArray(filteredResult);
  }

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
async function startGame(roundCount: number): Promise<void> {
  // players 선택
  const selectedTeeniepings = getRandomTeeniepings(roundCount);

  if (selectedTeeniepings.length < roundCount) {
    console.error(`${roundCount}강을 위한 티니핑이 없습니다.`);
    return;
  }

  //게임 상태 초기화
  gameState = {
    currentRound: 1,
    totalRounds: roundCount,
    matchIndex: 0,
    players: selectedTeeniepings,
    winners: [],
    gameHistory: {
      matchups: [],
    },
  };

  //image preload
  const imageUrls = selectedTeeniepings.map((teenieping) => teenieping.imgLink);

  try {
    await preloadImages(imageUrls);
    console.log('images loading finished');
  } catch (error) {
    console.warn('이미지 preload 중 일부 실패:', error);
  }

  //게임화면 초기화 및 표시
  initializeGameUI();

  //loading 완전 끝난 후 첫 매치 표시
  displayCurrentMatch();
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
    // return 제거 - 다음 라운드 첫 매치를 바로 표시해야 함
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

  //배열 범위 체크 및 안전 가드 추가
  if (idx + 1 >= gameState.players.length) {
    console.error('매치 인덱스 오류: 배열 범위 초과');
    console.error('현재 players:', gameState.players);
    console.error('matchIndex:', gameState.matchIndex);
    console.error('idx:', idx);
    return;
  }

  const character1 = gameState.players[idx];
  const character2 = gameState.players[idx + 1];

  // 캐릭터 유효성 검사 추가
  if (!character1 || !character2) {
    console.error('캐릭터가 undefined입니다:', { character1, character2 });
    return;
  }

  console.log(`다음 매치 준비: ${character1.name} vs ${character2.name}`);

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

  //match UI 생성, - 강제로 숨김 상태로 시작
  characterMatch.innerHTML = `
    <li data-no="${character1.no}" class="character-option character-hidden">
        <figure>
          <img class="cover-img" src="${character1.imgLink}" alt="${character1.name}" />
          <figcaption class="content-text">${character1.name}</figcaption>
        </figure>
      </li>
      <li data-no="${character2.no}" class="character-option character-hidden">
        <figure>
          <img class="cover-img" src="${character2.imgLink}" alt="${character2.name}" />
          <figcaption class="content-text">${character2.name}</figcaption>
        </figure>
      </li>
      `;

  //image preload 확인 후 표시
  const images = characterMatch.querySelectorAll(
    '.cover-img',
  ) as NodeListOf<HTMLImageElement>;
  const options = document.querySelectorAll('.character-option');

  //image loading Promise 배열 생성
  const imageLoadPromises = Array.from(images).map((img) => {
    return new Promise<void>((resolve) => {
      //image가 loaded, 혹은 캐시에 있는 경우
      if (img.complete && img.naturalHeight !== 0) {
        resolve();
        return;
      }
      //캐시에서 확인
      if (imageCache.has(img.src)) {
        resolve();
        return;
      }

      //image load event 대기
      const handleLoad = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        resolve();
      };
      const handleError = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        console.warn(`이미지 로드 실패: ${img.src}`);
        resolve();
      };

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      //image src가 설정 시, loading 이미 시작
      //설정되어 있지 않을 시 재설정
      if (!img.src) {
        img.src = img.getAttribute('src') || '';
      }
    });
  });

  //모든 image 로딩 완료 후 캐릭터 표시
  Promise.all(imageLoadPromises).then(() => {
    setTimeout(() => {
      showCharactersSequentially(options);

      //게임 로딩 완료, 이벤트 발생
      const gameReadyEvent = new CustomEvent('gameLoadingComplete');
      document.dispatchEvent(gameReadyEvent);
    }, 100);
  });

  //click event 추가
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

/**캐릭터 순차 표기 함수 */
function showCharactersSequentially(options: NodeListOf<Element>): void {
  options.forEach((option, index) => {
    setTimeout(
      () => {
        const element = option as HTMLElement;
        // opacity와 transform을 부드럽게 변경
        element.style.transition =
          'opacity 0.5s ease-out, transform 0.5s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        element.classList.remove('character-hidden');
        element.classList.add('character-visible');
      },
      index * 150 + 300,
    );
  });
}

/**
 * 캐릭터 선택 처리 함수
 */
function handleCharacterSelection(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const selectedNo = target.dataset.no;

  if (!selectedNo) {
    console.error('선택된 캐릭터 번호가 없습니다.');
    return;
  }

  //현재 매치 가져오기
  const idx = gameState.matchIndex * 2;

  // 배열 범위 체크
  if (idx + 1 >= gameState.players.length) {
    console.error('배열 범위 초과:', {
      idx,
      playersLength: gameState.players.length,
    });
    return;
  }

  const character1 = gameState.players[idx];
  const character2 = gameState.players[idx + 1];

  // 캐릭터 유효성 검사
  if (!character1 || !character2) {
    console.error('캐릭터가 undefined입니다:', { character1, character2 });
    return;
  }

  console.log(`매치: ${character1.name} vs ${character2.name}`);

  //선택된 캐릭터, 탈락 캐릭터 결정
  let winner: Teenieping, loser: Teenieping;

  if (selectedNo === character1.no.toString()) {
    winner = character1;
    loser = character2;
  } else if (selectedNo === character2.no.toString()) {
    winner = character2;
    loser = character1;
  } else {
    console.error('선택된 캐릭터를 찾을 수 없습니다:', selectedNo);
    return;
  }

  console.log(`승자: ${winner.name} 패자: ${loser.name}`);

  //딜레이 후 다음 매치 진행
  setTimeout(() => {
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
  }, 600); // 0.6초 딜레이
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

  //player 배열 업데이트 (winners를 셔플해서 다음 라운드에 적용)
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

  //기본 구조 생성
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
            이상형 공유하기
          </button>
        </div>
      </div>
      <button class="home-btn" type="button">이상형 월드컵으로 돌아가기</button>
    `;

  //페이지에 추가
  document.body.appendChild(winnerPage);

  // gameState를 rank 파일로 전달 후 이벤트 리스너 추가
  setGameState(gameState);
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

      // 프리로드 캐시 초기화
      imageCache.clear();

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

    // 프리로드 캐시 초기화
    imageCache.clear();
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
 * 홈 페이지로 이동 함수
 */
export function goToHomePage(): void {
  //현재 열려있는 모든 페이지 제거
  const pages = document.querySelectorAll(
    '.winner-page, .rank-page, .game-page',
  );
  pages.forEach((page) => page.remove());

  //게임 초기화
  resetLikelionState();
  console.log('Game Reseted');

  //메인 페이지 표시
  const mainPage = document.querySelector('.main-page') as HTMLElement;
  if (mainPage) mainPage.style.display = 'block';
}

//worldcupGameModal.ts에서 startGame 함수를 export
export { startGame };
export type { GameState, Teenieping };
