/* 이상형 월드컵 게임 알고리즘
  TODO
- [ ] worldcupGame-start.ts에서 유저가 선택한 우승 결과 저장, 
  누적 데이터 토대로 통계 페이지 생성, 표 형식으로 구성 후 반환
  
  필요 데이터
  - 우승 비율 (우승 횟수 / 전체 게임 수)
  - 승률 (승리 selected 횟수 / 전체 1:1 매칭 횟수)
  */

import { goToHomePage } from './worldcupGame-start.ts';

// 게임 관련 타입 정의 (worldcupGame-start.ts에서 가져와야 할 타입들)
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

interface MatchupResult {
  round: number;
  winner: Teenieping;
  loser: Teenieping;
}

interface GameHistory {
  matchups: MatchupResult[];
  finalWinner?: Teenieping;
}

// dataBase에서 티니핑 data 호출 (worldcupGame-start.ts와 동일한 방식)
let teeniepingData: { properties: string[]; result: Teenieping[] };

try {
  import('../dataBase.ts')
    .then(({ teeniepingData: importedData }) => {
      teeniepingData = importedData;
    })
    .catch((error) => {
      console.error('database Load Error:', error);
      teeniepingData = { properties: [], result: [] };
    });
} catch (error) {
  console.error('database Load Error:', error);
  teeniepingData = { properties: [], result: [] };
}

// gameState 참조를 위한 변수 (worldcupGame-start.ts에서 가져와야 함)
let gameState: GameState;

/**
 * gameState 설정 함수
 * worldcupGame-start.ts에서 호출하여 현재 게임 상태를 전달받음
 */
export function setGameState(state: GameState): void {
  gameState = state;
}

/**
 * 우승자 페이지 이벤트 리스너 추가 함수 buttons
 */
export function addWinnerPageEventListeners(): void {
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
export function calculateRankingData(): {
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
    if (teeniepingData && teeniepingData.result) {
      teeniepingData.result.forEach((character) => {
        characterStats[character.no] = {
          wins: 0,
          matches: 0,
          name: character.name,
          imgLink: character.imgLink,
        };
      });
    }

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
  if (
    !gameState ||
    !gameState.gameHistory ||
    !gameState.gameHistory.finalWinner
  ) {
    console.error('게임 상태 또는 우승자 정보가 없습니다.');
    return;
  }

  const winner = gameState.gameHistory.finalWinner;

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

export { showRankingPage, shareResult };
