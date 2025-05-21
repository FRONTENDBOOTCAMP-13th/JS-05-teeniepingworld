/* 게임 시작 모달 관리 */
import { setupLikelionClickListener } from './worldcupGame-likelion';
import { startGame } from './worldcupGame-start';
import { resetLikelionState } from './worldcupGame-likelion.ts';

/* 기본 세팅 */
document.addEventListener('DOMContentLoaded', () => {
  // DOM 선택
  const openModalBtn = document.querySelector(
    '.start-btn',
  ) as HTMLButtonElement;
  const closeModalBtn = document.querySelector(
    '.modal-close-btn',
  ) as HTMLButtonElement;
  const confirmModalBtn = document.querySelector(
    '.modal-confirm-btn',
  ) as HTMLButtonElement;
  const worldcupDialog = document.querySelector(
    '.main-page-modal',
  ) as HTMLDialogElement;

  //.likelion click event setup
  setupLikelionClickListener();

  //게임 초기화
  resetLikelionState();
  console.log('New Game is Ready');

  // 페이지 로드시 dialog close
  if (worldcupDialog) {
    worldcupDialog.close();
  }

  // 함수
  /**
   * 모달 열기 함수
   */
  function openModal(event: Event): void {
    // 기본 이벤트(페이지 이동) 방지
    event.preventDefault();

    // 새 모달 열기
    if (worldcupDialog) {
      try {
        worldcupDialog.showModal();
      } catch (error) {
        console.error('모달 열기 오류:', error);
      }
    }
  }
  /**
   * 모달 닫기 함수
   */
  function closeModal(): void {
    if (worldcupDialog) {
      worldcupDialog.close();
    }
  }

  /**
   * 로딩 인디케이터 표시
   */
  function showLoadingIndicator(): void {
    //기존 로딩 오버레이 제거
    const existingOverlay = document.querySelector('.game-loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    //로딩 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'game-loading-overlay';
    overlay.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <h3 class="loading-title">티니핑들을 불러오는 중...</h3>
      <p class="loading-text">잠시만 기다려주세요!</p>
    </div>
    `;

    document.body.appendChild(overlay);

    //애니메이션 시작
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  }

  /**
   * 로딩 인디케이터 숨기기
   */
  function hideLoadingIndicator(): Promise<void> {
    return new Promise((resolve) => {
      const overlay = document.querySelector('.game-loading-overlay');
      if (overlay) {
        overlay.classList.add('fade-out');

        //transition 완료 후 제거
        const handleTransitionEnd = () => {
          overlay.removeEventListener('transitionend', handleTransitionEnd);
          overlay.remove();
          resolve();
        };
        overlay.addEventListener('transitionend', handleTransitionEnd);

        //백업 timer (transition event 발생 하지 않을 시)
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.removeEventListener('transitionend', handleTransitionEnd);
            overlay.remove();
          }
          resolve();
        }, 1500);
      } else {
        //overlay 없을 시 즉시 resolve
        resolve();
      }
    });
  }

  /**
   * 게임 시작 함수
   * worldcupGame-start.ts의 startGame 함수 호출
   */
  async function handleGameStart(): Promise<void> {
    // 선택 라운드 값 호출
    const roundSelect = document.getElementById(
      '월드컵 라운드 수 선택',
    ) as HTMLSelectElement;
    const selectedRound = parseInt(roundSelect.value);

    // 유효성 검사
    if (isNaN(selectedRound) || selectedRound <= 0) {
      console.error('유효하지 않는 라운드 값:', selectedRound);
      return;
    }

    // 모달 닫기
    closeModal();

    try {
      //로딩 표시
      showLoadingIndicator();
      console.log(`${selectedRound}강 게임을 시작합니다.`);

      // 모듈 로드 확인 후 함수 호출
      if (typeof startGame === 'function') {
        await startGame(selectedRound);

        //로딩 완료 event 기다림
        await waitForGameLoadingComplete();

        //최소 로딩 시간 보장
        const minLoadingTime = new Promise((resolve) =>
          setTimeout(resolve, 800),
        );
        await minLoadingTime;

        //loadingIndicator가 완전 사라질 때까지 기다림
        await hideLoadingIndicator();
      } else {
        console.error('게임 시작 함수를 찾을 수 없습니다.');
        await hideLoadingIndicator();
        alert('게임을 시작할 수 없습니다. 페이지를 새로고침해 주세요.');
      }
    } catch (error) {
      console.error('게임 시작 중 오류:', error);
      hideLoadingIndicator();
      console.log('게임 시작 중 오류가 발생했습니다.');
    }
  }

  /**
   * 로딩 완료를 기다리는 함수
   */
  function waitForGameLoadingComplete(): Promise<void> {
    return new Promise((resolve) => {
      let timeoutId: number;

      const handleLoadingComplete = () => {
        document.removeEventListener(
          'gameLoadingComplete',
          handleLoadingComplete,
        );
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      };

      document.addEventListener('gameLoadingComplete', handleLoadingComplete);

      //timeoutId 설정
      timeoutId = window.setTimeout(() => {
        console.warn('게임 로딩 타임아웃 - 대기 종료');
        document.removeEventListener(
          'gameLoadingComplete',
          handleLoadingComplete,
        );
        resolve();
      }, 1000 * 10);
    });
  }

  // 이벤트 리스너 등록
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (confirmModalBtn) {
    confirmModalBtn.addEventListener('click', handleGameStart);
  }
});
