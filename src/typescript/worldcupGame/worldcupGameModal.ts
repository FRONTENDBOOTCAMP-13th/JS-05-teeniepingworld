/* 게임 시작 모달 관리 */
import { startGame } from './worldcupGame-start';

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
   * 게임 시작 함수
   * worldcupGame-start.ts의 startGame 함수 호출
   */
  function handleGameStart(): void {
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

    console.log(`${selectedRound}강 게임을 시작합니다.`);

    // 모듈 로드 확인 후 함수 호출
    if (typeof startGame === 'function') {
      startGame(selectedRound);
    } else {
      console.error('게임 시작 함수를 찾을 수 없습니다.');
      alert('게임을 시작할 수 없습니다. 페이지를 새로고침해 주세요.');
    }
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
