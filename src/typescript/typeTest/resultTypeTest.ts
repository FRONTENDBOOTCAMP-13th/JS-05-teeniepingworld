// 다시테스트 하기 버튼 누르면 메인 화면으로 돌아가기
document.addEventListener('DOMContentLoaded', () => {
  const typeTestBtn = document.querySelector('.repeat-btn');
  if (typeTestBtn) {
    typeTestBtn.addEventListener('click', function () {
      console.log('첫화면으로 이동합니다');
      window.location.href = './typeTest.html';
    });
  }
});
