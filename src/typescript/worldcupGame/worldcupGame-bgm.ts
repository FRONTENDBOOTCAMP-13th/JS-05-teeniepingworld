// BGM 싱글톤 모듈 - 프로덕션 빌드 호환 버전
class BgmPlayer {
  private static instance: BgmPlayer;
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;
  private bgmBtn: HTMLButtonElement | null = null;
  private bgmToggle: HTMLSpanElement | null = null;
  private boundToggleBgm: () => void; // 바인딩된 함수 저장

  private constructor() {
    // 바인딩된 함수 미리 생성 (빌드 최적화 대응)
    this.boundToggleBgm = this.toggleBgm.bind(this);

    // 오디오 객체 생성 및 초기 설정
    this.audio = new Audio('/worldcupGame_bgm/teenieping-100.mp3');
    this.audio.volume = 0.2;
    this.audio.loop = true;

    // 오디오 로드 오류 처리
    this.audio.addEventListener('error', (e) => {
      console.error('오디오 로드 오류:', e);
      this.updateAllBgmIcons(false);
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
          // 프로덕션 빌드에서 더 긴 지연 시간 적용
          setTimeout(() => {
            this.searchAndSetupBgmControls();
          }, 200);
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

    // 새로운 BGM 버튼이 발견되고, 기존 버튼과 다른 경우에만 설정
    if (newBgmBtn && (!this.bgmBtn || this.bgmBtn !== newBgmBtn)) {
      this.bgmBtn = newBgmBtn;
      this.bgmToggle = newBgmToggle;

      // 현재 상태에 따라 모든 아이콘 업데이트
      this.updateAllBgmIcons(this.isPlaying);

      // 바인딩된 함수 사용 (프로덕션 빌드 안정성)
      this.bgmBtn.addEventListener('click', this.boundToggleBgm);

      console.log('BGM 컨트롤이 MutationObserver로 설정되었습니다.');
    }
  }

  // 모든 페이지의 BGM 아이콘 업데이트 - 강화된 버전
  private updateAllBgmIcons(isPlaying: boolean): void {
    // DOM이 완전히 로드될 때까지 대기
    const updateIcons = () => {
      // 페이지에 존재하는 모든 .bgm-toggle 요소 찾아서 업데이트
      const allBgmToggles =
        document.querySelectorAll<HTMLSpanElement>('.bgm-toggle');
      const iconText = isPlaying ? '🔉' : '🔇';

      allBgmToggles.forEach((toggle) => {
        if (toggle) {
          toggle.textContent = iconText;
          // 프로덕션에서 DOM 조작 강제 적용
          toggle.setAttribute(
            'data-bgm-state',
            isPlaying ? 'playing' : 'stopped',
          );
        }
      });

      console.log(
        `모든 BGM 아이콘 업데이트: ${isPlaying ? '재생중' : '정지'} (${allBgmToggles.length}개 아이콘)`,
      );

      // 현재 참조하고 있는 토글도 강제 업데이트
      if (this.bgmToggle && this.bgmToggle.textContent !== iconText) {
        this.bgmToggle.textContent = iconText;
        this.bgmToggle.setAttribute(
          'data-bgm-state',
          isPlaying ? 'playing' : 'stopped',
        );
      }
    };

    // 즉시 실행 + 지연 실행으로 확실히 적용
    updateIcons();
    setTimeout(updateIcons, 100);
    setTimeout(updateIcons, 300);
  }

  // BGM 토글 (재생/일시정지) - 프로덕션 안정화
  public toggleBgm(): void {
    console.log('BGM 토글 실행됨, 현재 상태:', this.isPlaying);

    // 상태 변경 전 로그
    const previousState = this.isPlaying;

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }

    // 상태 변경 후 강제 아이콘 업데이트
    setTimeout(() => {
      if (this.isPlaying !== previousState) {
        this.updateAllBgmIcons(this.isPlaying);
      }
    }, 50);
  }

  // BGM 재생 - 강화된 버전
  public play(): void {
    try {
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updateAllBgmIcons(true);
            console.log('BGM 재생 시작');

            // 프로덕션에서 추가 확인
            setTimeout(() => {
              if (this.audio.paused === false) {
                this.updateAllBgmIcons(true);
              }
            }, 200);
          })
          .catch((error) => {
            console.error('BGM 재생 오류:', error);
            this.isPlaying = false;
            this.updateAllBgmIcons(false);

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
      this.updateAllBgmIcons(false);
    }
  }

  // BGM 일시정지 - 강화된 버전
  public pause(): void {
    this.audio.pause();
    this.isPlaying = false;
    this.updateAllBgmIcons(false);
    console.log('BGM 일시정지');

    // 프로덕션에서 추가 확인
    setTimeout(() => {
      if (this.audio.paused === true) {
        this.updateAllBgmIcons(false);
      }
    }, 200);
  }

  // BGM 상태 확인
  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // 게임 페이지에 BGM 버튼 추가 함수 - 프로덕션 최적화
  public addBgmButtonToGamePage(gamePageContainer: HTMLElement): void {
    console.log('게임 페이지에 BGM 버튼 추가 시도');

    // 프로덕션에서 DOM 조작 안정성 확보
    if (!gamePageContainer || !gamePageContainer.parentNode) {
      console.warn('게임 페이지 컨테이너가 유효하지 않습니다.');
      return;
    }

    // 이미 버튼이 있는지 확인하고 제거
    const existingBtn = gamePageContainer.querySelector('.bgm-btn');
    if (existingBtn) {
      existingBtn.remove();
      console.log('기존 BGM 버튼 제거됨');
    }

    // BGM 버튼 생성
    const bgmBtn = document.createElement('button');
    bgmBtn.className = 'bgm-btn';
    bgmBtn.type = 'button';
    bgmBtn.style.cssText = `
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 100;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      padding: 8px;
    `;

    const bgmToggle = document.createElement('span');
    bgmToggle.className = 'bgm-toggle';
    // 현재 BGM 상태에 맞는 아이콘으로 초기화
    bgmToggle.textContent = this.isPlaying ? '🔉' : '🔇';
    bgmToggle.setAttribute(
      'data-bgm-state',
      this.isPlaying ? 'playing' : 'stopped',
    );

    bgmBtn.appendChild(bgmToggle);

    // 게임 페이지 컨테이너에 직접 추가
    gamePageContainer.style.position = 'relative';
    gamePageContainer.appendChild(bgmBtn);

    // 바인딩된 함수 사용 (프로덕션 안정성)
    bgmBtn.addEventListener('click', this.boundToggleBgm);

    // 버튼 참조 업데이트
    this.bgmBtn = bgmBtn;
    this.bgmToggle = bgmToggle;

    console.log(
      `게임 페이지에 BGM 버튼이 추가됨 - 초기 상태: ${this.isPlaying ? '재생중' : '정지'}`,
    );

    // 생성 직후 아이콘 상태 강제 동기화 (프로덕션용)
    setTimeout(() => {
      this.updateAllBgmIcons(this.isPlaying);
    }, 100);
    setTimeout(() => {
      this.updateAllBgmIcons(this.isPlaying);
    }, 500);
  }

  // 승자 페이지용 BGM 버튼 추가 함수 - 프로덕션 최적화
  public addBgmButtonToWinnerPage(titleContainer: HTMLElement): void {
    console.log('승자 페이지에 BGM 버튼 추가 시도');

    // 프로덕션에서 DOM 조작 안정성 확보
    if (!titleContainer || !titleContainer.parentNode) {
      console.warn('승자 페이지 컨테이너가 유효하지 않습니다.');
      return;
    }

    // 이미 버튼이 있는지 확인하고 제거
    const existingBtn = titleContainer.querySelector('.bgm-btn');
    if (existingBtn) {
      existingBtn.remove();
      console.log('기존 승자 페이지 BGM 버튼 제거됨');
    }

    // 기존 title-container 스타일 변경
    titleContainer.style.cssText += `
      display: flex;
      justify-content: center;
      position: relative;
      width: 100%;
    `;

    // BGM 버튼 생성
    const bgmBtn = document.createElement('button');
    bgmBtn.className = 'bgm-btn';
    bgmBtn.type = 'button';
    bgmBtn.style.cssText = `
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      padding: 8px;
    `;

    const bgmToggle = document.createElement('span');
    bgmToggle.className = 'bgm-toggle';
    // 현재 BGM 상태에 맞는 아이콘으로 초기화
    bgmToggle.textContent = this.isPlaying ? '🔉' : '🔇';
    bgmToggle.setAttribute(
      'data-bgm-state',
      this.isPlaying ? 'playing' : 'stopped',
    );

    bgmBtn.appendChild(bgmToggle);
    titleContainer.appendChild(bgmBtn);

    // 바인딩된 함수 사용 (프로덕션 안정성)
    bgmBtn.addEventListener('click', this.boundToggleBgm);

    // 버튼 참조 업데이트
    this.bgmBtn = bgmBtn;
    this.bgmToggle = bgmToggle;

    console.log(
      `승자 페이지에 BGM 버튼이 추가됨 - 초기 상태: ${this.isPlaying ? '재생중' : '정지'}`,
    );

    // 생성 직후 아이콘 상태 강제 동기화 (프로덕션용)
    setTimeout(() => {
      this.updateAllBgmIcons(this.isPlaying);
    }, 100);
    setTimeout(() => {
      this.updateAllBgmIcons(this.isPlaying);
    }, 500);
  }

  // 수동으로 BGM 컨트롤 재설정하는 공개 메서드
  public refreshBgmControls(): void {
    console.log('BGM 컨트롤 수동 새로고침 시도');
    this.searchAndSetupBgmControls();
    // 새로고침 시 모든 아이콘 동기화
    this.updateAllBgmIcons(this.isPlaying);
  }

  // 공개 메서드: 외부에서 아이콘 동기화 요청 가능
  public syncAllIcons(): void {
    console.log('외부 요청으로 모든 BGM 아이콘 동기화');
    this.updateAllBgmIcons(this.isPlaying);
  }

  // 메인 페이지 BGM 버튼 재설정을 위한 공개 메서드 - 프로덕션 최적화
  public reconnectMainPageButton(): void {
    console.log('메인 페이지 BGM 버튼 재연결 시도');

    // 메인 페이지의 BGM 버튼 찾기
    const mainPageBgmBtn = document.querySelector(
      '.main-page .bgm-btn',
    ) as HTMLButtonElement;
    const mainPageBgmToggle = document.querySelector(
      '.main-page .bgm-toggle',
    ) as HTMLSpanElement;

    if (mainPageBgmBtn && mainPageBgmToggle) {
      console.log('메인 페이지 BGM 버튼 발견, 재설정 중...');

      // 기존 이벤트 리스너 제거를 위해 버튼 복제
      const newBgmBtn = mainPageBgmBtn.cloneNode(true) as HTMLButtonElement;
      if (mainPageBgmBtn.parentNode) {
        mainPageBgmBtn.parentNode.replaceChild(newBgmBtn, mainPageBgmBtn);
      }

      // 새 버튼의 토글 요소 찾기
      const newBgmToggle = newBgmBtn.querySelector(
        '.bgm-toggle',
      ) as HTMLSpanElement;

      // 버튼 참조 업데이트
      this.bgmBtn = newBgmBtn;
      this.bgmToggle = newBgmToggle;

      // 현재 BGM 상태에 맞게 아이콘 업데이트
      newBgmToggle.textContent = this.isPlaying ? '🔉' : '🔇';
      newBgmToggle.setAttribute(
        'data-bgm-state',
        this.isPlaying ? 'playing' : 'stopped',
      );

      // 바인딩된 함수 사용 (프로덕션 안정성)
      newBgmBtn.addEventListener('click', this.boundToggleBgm);

      console.log('메인 페이지 BGM 버튼 재연결 완료');

      // 모든 아이콘 동기화 (다중 시도)
      setTimeout(() => {
        this.updateAllBgmIcons(this.isPlaying);
      }, 100);
      setTimeout(() => {
        this.updateAllBgmIcons(this.isPlaying);
      }, 300);
    } else {
      console.warn('메인 페이지에서 BGM 버튼을 찾을 수 없습니다.');

      // MutationObserver를 통해 다시 시도
      setTimeout(() => {
        this.searchAndSetupBgmControls();
      }, 200);
    }
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

// 문서 로드 시 BGM 초기화 (프로덕션 안정성)
document.addEventListener('DOMContentLoaded', () => {
  bgmSetting();
});

// 추가 안전장치: 윈도우 로드 이벤트
window.addEventListener('load', () => {
  const bgmPlayer = getBgmPlayer();
  setTimeout(() => {
    bgmPlayer.refreshBgmControls();
    bgmPlayer.syncAllIcons();
  }, 500);
});
