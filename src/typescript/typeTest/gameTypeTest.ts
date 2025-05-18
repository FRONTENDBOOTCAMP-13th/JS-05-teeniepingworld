// 이전버튼 클릭하면 이전페이지로 이동하기
document.addEventListener('DOMContentLoaded', () => {
  const previousBtn = document.querySelector('.previous-btn');
  if (previousBtn) {
    previousBtn.addEventListener('click', function () {
      console.log('이전페이지로 이동합니다');
      window.location.href = './typeTest.html';
    });
  }
});
