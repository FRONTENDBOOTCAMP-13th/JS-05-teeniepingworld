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
  // 모달 열기
  function openModal(event: Event): void {
    // 기본 이벤트(페이지 이동) 방지
    event.preventDefault();
    // 새 모달 열기
    if (worldcupDialog) {
      worldcupDialog.showModal();
    }
  }

  // 모달 닫기
  function closeModal(): void {
    if (worldcupDialog) {
      worldcupDialog.close();
    }
  }

  // 게임 시작
  function startGame(): void {
    // 게임 관련 로직 추가
    const roundSelect = document.getElementById(
      '월드컵 라운드 수 선택',
    ) as HTMLSelectElement;
    const selectedRound = roundSelect.value;
    console.log(`${selectedRound}강 게임을 시작합니다.`);

    // 게임 페이지 이동 코드, 혹은 게임 컴포넌트 로드 코드 추가

    closeModal();
  }

  // 이벤트 리스너 등록
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (confirmModalBtn) {
    confirmModalBtn.addEventListener('click', startGame);
  }
});
