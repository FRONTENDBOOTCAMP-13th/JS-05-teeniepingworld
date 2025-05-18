/* 시작페이지 typeTest.html */
/* 테스트 시작하기 버튼 누르면 다음 페이지로 이동 */
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.start-button');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      console.log('다음페이지로 이동합니다.');
      window.location.href = './typeTestStart.html';
    });
  }
});
