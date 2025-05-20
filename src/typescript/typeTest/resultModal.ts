declare global {
  interface KakaoLinkButton {
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }

  interface KakaoLinkContent {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }

  interface Kakao {
    isInitialized(): boolean;
    init(key: string): void;
    Link: {
      sendDefault(options: {
        objectType: 'feed';
        content: KakaoLinkContent;
        buttons?: KakaoLinkButton[];
      }): void;
    };
  }

  interface Window {
    Kakao: Kakao;
  }
}
export {};

// 결과 공유하기
const shareBtn = document.querySelector<HTMLButtonElement>('.share-btn');
const shareModal = document.querySelector<HTMLDialogElement>('.share-modal');
const closeBtn = document.querySelector('.modal-close');

shareBtn?.addEventListener('click', () => {
  shareModal?.showModal();
});

closeBtn?.addEventListener('click', () => {
  shareModal?.close();
});

//다시하기를 누르면 첫 화면으로 돌아가기
const repeatBtn = document.querySelector('.repeat-modal-btn');
if (repeatBtn) {
  repeatBtn.addEventListener('click', function () {
    console.log('다시 테스트하기');
    window.location.href = './typeTest.html';
  });
}

// 홈화면을 누르면 홈화면으로 돌아가기
const homeBtn = document.querySelector('.home-modal-btn');
if (homeBtn) {
  homeBtn.addEventListener('click', function () {
    console.log('다시 테스트하기');
    window.location.href = './main.html';
  });
}

//copy 기능
const copyBtn = document.querySelector('.copy');
const shareLink = document.querySelector('.share-link') as HTMLInputElement;
if (shareLink) {
  shareLink.value = window.location.href;
}

// 최신 브라우저 적용
copyBtn?.addEventListener('click', () => {
  if (shareLink) {
    navigator.clipboard.writeText(shareLink.value).then(() => {
      alert('링크가 복사되었습니다!');
    });
  }
}); // 결과 페이지의 전체 URL을 가져옴

// //예전 브라우저 적용
// copyBtn?.addEventListener('click', () => {
//   if (shareLink) {
//     shareLink.select();
//     shareLink.setSelectionRange(0, 99999); // 모바일 대응
//     document.execCommand('copy');
//     alert('링크가 복사되었습니다!');
//     console.log('링크 복사');
//   }
// });

// 페이스북 공유
const facebookBtn = document.querySelector('.facebook') as HTMLAnchorElement;
const resultUrl = window.location.href;
const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultUrl)}`;
if (facebookBtn) {
  facebookBtn.href = facebookShareUrl;
}

// 카카오톡 공유
const kakaoBtn = document.querySelector('.kakao');
if (kakaoBtn) {
  kakaoBtn.addEventListener('click', () => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('98c13eaeebace99567b6a3316d7a065b');
      }

      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '티니핑 성격 유형 테스트 결과',
          description: '나의 티니핑 유형을 확인해보세요!',
          imageUrl:
            'https://selectstar.ai/ko/wp-content/uploads/2024/09/SAMG_%EC%BA%90%EC%B9%98_%ED%8B%B0%EB%8B%88%ED%95%91_%EC%8B%9C%EC%A6%8C_4_POSTER_0516_1.webp',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '나도 하러가기!',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert('카카오 SDK를 불러오지 못했습니다.');
    }
  });
}
