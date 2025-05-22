// BGM 싱글톤 모듈 - worldcupGame-bgm.ts
class BgmPlayer {
  private static instance: BgmPlayer;
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;
  private bgmBtn: HTMLButtonElement | null = null;
  private bgmToggle: HTMLSpanElement | null = null;

  private constructor() {
    // 오디오 객체 생성 및 초기 설정
    this.audio = new Audio('/worldcupGame_bgm/teenieping-100.mp3');
    this.audio.volume = 0.2;
    this.audio.loop = true;

    // 오디오 로드 오류 처리
    this.audio.addEventListener('error', (e) => {
      console.error('오디오 로드 오류:', e);
      this.updateBgmIcon(false);
    });

    // 페이지가 언로드될 때 오디오 정지
    window.addEventListener('beforeunload', () => {
      this.audio.pause();
    });

    // 문서 변경 감지 (MutationObserver 사용)
    this.observeDomChanges();
  }

  // 싱글톤 인스턴스 반환
  public static getInstance(): BgmPlayer {
    if (!BgmPlayer.instance) {
      BgmPlayer.instance = new BgmPlayer();
    }
    return BgmPlayer.instance;
  }

  // DOM 변경 감지 및 대응
  private observeDomChanges(): void {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 문서에 새 요소가 추가되었는지 확인
          this.searchAndSetupBgmControls();
        }
      }
    });

    // 문서 전체의 하위 요소 변경 감지
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // BGM 컨트롤을 찾아 설정
  private searchAndSetupBgmControls(): void {
    // 현재 문서에서 BGM 버튼과 토글 요소 찾기
    const newBgmBtn = document.querySelector<HTMLButtonElement>('.bgm-btn');
    const newBgmToggle = document.querySelector<HTMLSpanElement>('.bgm-toggle');

    // 새로운 BGM 버튼이 발견되면 이벤트 리스너 설정
    if (newBgmBtn && (!this.bgmBtn || this.bgmBtn !== newBgmBtn)) {
      this.bgmBtn = newBgmBtn;
      this.bgmToggle = newBgmToggle;

      // 이전 상태에 따라 아이콘 업데이트
      this.updateBgmIcon(this.isPlaying);

      // 클릭 이벤트 설정
      this.bgmBtn.addEventListener('click', () => this.toggleBgm());
    }
  }

  // BGM 아이콘 업데이트
  private updateBgmIcon(isPlaying: boolean): void {
    if (this.bgmToggle) {
      this.bgmToggle.textContent = isPlaying ? '🔉' : '🔇';
    }
  }

  // BGM 토글 (재생/일시정지)
  public toggleBgm(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // BGM 재생
  public play(): void {
    try {
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updateBgmIcon(true);
            console.log('BGM 재생 시작');
          })
          .catch((error) => {
            console.error('BGM 재생 오류:', error);
            this.isPlaying = false;
            this.updateBgmIcon(false);

            // 자동 재생 정책 관련 오류 발생 시 사용자에게 알림
            if (error.name === 'NotAllowedError') {
              console.warn('자동 재생이 차단되었습니다. 사용자 상호작용 필요');

              // 상호작용 이벤트에 한 번 리스너 추가
              const enableAudio = () => {
                this.play();
                document.body.removeEventListener('click', enableAudio);
              };
              document.body.addEventListener('click', enableAudio);
            }
          });
      }
    } catch (e) {
      console.error('재생 시도 중 오류:', e);
      this.isPlaying = false;
      this.updateBgmIcon(false);
    }
  }

  // BGM 일시정지
  public pause(): void {
    this.audio.pause();
    this.isPlaying = false;
    this.updateBgmIcon(false);
  }

  // BGM 상태 확인
  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // 게임 페이지에 BGM 버튼 추가 함수
  public addBgmButtonToGamePage(gamePageContainer: HTMLElement): void {
    // 이미 버튼이 있는지 확인
    if (gamePageContainer.querySelector('.bgm-btn')) return;

    // BGM 버튼 생성
    const bgmBtn = document.createElement('button');
    bgmBtn.className = 'bgm-btn';
    bgmBtn.type = 'button';
    bgmBtn.style.position = 'absolute';
    bgmBtn.style.right = '20px';
    bgmBtn.style.top = '20px';
    bgmBtn.style.zIndex = '100';

    const bgmToggle = document.createElement('span');
    bgmToggle.className = 'bgm-toggle';
    bgmToggle.textContent = this.isPlaying ? '🔉' : '🔇';

    bgmBtn.appendChild(bgmToggle);

    // 게임 페이지 컨테이너에 직접 추가
    gamePageContainer.style.position = 'relative'; // 부모 요소에 relative 포지션 설정
    gamePageContainer.appendChild(bgmBtn);

    // 생성한 버튼에 이벤트 연결
    bgmBtn.addEventListener('click', () => this.toggleBgm());

    // 버튼 참조 업데이트
    this.bgmBtn = bgmBtn;
    this.bgmToggle = bgmToggle;
  }

  // 새 BGM 버튼 추가 함수 (승자 페이지용)
  public addBgmButtonToWinnerPage(titleContainer: HTMLElement): void {
    // 이미 버튼이 있는지 확인
    if (titleContainer.querySelector('.bgm-btn')) return;

    // 기존 title-container 스타일 변경
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'center';
    titleContainer.style.position = 'relative';
    titleContainer.style.width = '100%';

    // BGM 버튼 생성
    const bgmBtn = document.createElement('button');
    bgmBtn.className = 'bgm-btn';
    bgmBtn.type = 'button';
    bgmBtn.style.position = 'absolute';
    bgmBtn.style.right = '0';
    bgmBtn.style.top = '50%';
    bgmBtn.style.transform = 'translateY(-50%)';

    const bgmToggle = document.createElement('span');
    bgmToggle.className = 'bgm-toggle';
    bgmToggle.textContent = this.isPlaying ? '🔉' : '🔇';

    bgmBtn.appendChild(bgmToggle);
    titleContainer.appendChild(bgmBtn);

    // 생성한 버튼에 이벤트 연결
    bgmBtn.addEventListener('click', () => this.toggleBgm());

    // 버튼 참조 업데이트
    this.bgmBtn = bgmBtn;
    this.bgmToggle = bgmToggle;
  }
}
// 초기 BGM 설정 및 인스턴스 생성
export function bgmSetting() {
  return BgmPlayer.getInstance();
}

// 이 함수를 통해 다른 모듈에서 BGM 플레이어에 접근
export function getBgmPlayer() {
  return BgmPlayer.getInstance();
}

// 문서 로드 시 BGM 초기화
document.addEventListener('DOMContentLoaded', () => {
  bgmSetting();
});
