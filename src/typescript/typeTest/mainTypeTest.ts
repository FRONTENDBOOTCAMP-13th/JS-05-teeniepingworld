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

// mp3 재생
const mp3Btn = document.querySelector('.mp3-button');
const mp3Img = document.querySelector('.mp3-img') as HTMLImageElement;
const mp3 = document.querySelector('audio') as HTMLAudioElement;
let isMuted: boolean = localStorage.getItem('isMuted') === 'true' || false;
let isPlaying: boolean = false;

// 음소거/음소거 해제 버튼 이벤트
mp3Btn?.addEventListener('click', function () {
  isMuted = !isMuted;
  mp3.muted = isMuted;

  if (isMuted!) {
    mp3Img?.setAttribute('src', '/typeTest_img/volume_off.png');
    localStorage.setItem('isMuted', 'true');
  } else {
    localStorage.setItem('isMuted', 'false');
    mp3Img?.setAttribute('src', '/typeTest_img/volume_up.png');

    // 음소거 해제 시 재생 중이 아니라면 재생 시작
    if (!isPlaying && mp3) {
      mp3.play();
      isPlaying = true;
    }
  }
});

export async function playAudio(resume: boolean) {
  if (mp3) {
    mp3.volume = 0.2;
    mp3.loop = true;
    mp3.muted = isMuted;

    const audioTime = resume ? localStorage.getItem('audioTime') || '0' : '0';
    mp3.currentTime = parseFloat(audioTime);
    try {
      if (!isMuted) {
        await mp3.play();
      } else {
        mp3Img?.setAttribute('src', '/typeTest_img/volume_off.png');
      }
      return true;
    } catch (err) {
      mp3Img?.setAttribute('src', '/typeTest_img/volume_off.png');
      console.log('자동 재생이 차단되었습니다:', err);
      return false;
    }
  }
}

// 페이지 바꾸면 이어서 노래가 나오는 기능
window.addEventListener('beforeunload', () => {
  if (mp3) {
    // mp3.pause();
    localStorage.setItem('audioTime', mp3.currentTime + '');
    // 이전 페이지에서 off 상태이면 다음페이지 상태에서도 off 상태로 유지
    localStorage.setItem('isMuted', isMuted + '');
    if (localStorage.getItem('isMuted') === 'true') {
      mp3Img?.setAttribute('src', '/typeTest_img/volume_off.png');
    }
  }
});
