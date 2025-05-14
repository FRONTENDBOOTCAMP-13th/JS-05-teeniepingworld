// 인터페이스 정의 - 세미콜론이 아닌 콜론을 사용하고 배열 타입은 인터페이스 바깥에 적용합니다
interface Teenieping {
  no: number;
  name: string;
  gender: string;
  likes: string[];
  dislikes: string[];
  url: string;
}

// 배열 타입 선언
// mock-up data
const teenieping: Teenieping[] = [
  {
    no: 1,
    name: '하츄핑',
    gender: '여성',
    likes: ['생크림 딸기 케이크', '딸기'],
    dislikes: ['신맛이 나는 모든 것'],
    url: 'https://i.namu.wiki/i/ZPL22bnKm1CIWJjdMPs183jR48T2hUMPsLuSEu_IUG0WsgNUxi_l70PZOafX9eUtrOxp45gxhdAd9zaJ0EfINxHbIy-mNjnnMUJA2icjB8RWeY6_3G2OTLAG556TA04C-F3tYYeVVg68J83jkemCOA.webp',
  },
  {
    no: 2,
    name: '떠벌핑',
    gender: '남성',
    likes: ['재밌는 이야기', '수다'],
    dislikes: ['침묵', '도서관'],
    url: 'https://i.namu.wiki/i/wJQCwBlkzkeHC1UzTKtFdvBm18XjGA5DyCanqETrDVYE_oW_x-joPvjTgLPhbmMvTRz2JOZ6uU5F092_t37KoRpfqCbfSPUO2oGCvnSD9RnlYmMXViZWRkbfxhYaznc91VV9E5ZfXfMVLGTblarmqQ.webp',
  },
  {
    no: 3,
    name: '멜로핑',
    gender: '여성',
    likes: ['폭신한 것', '상냥한 사람'],
    dislikes: ['딱딱한 것', '높은 곳'],
    url: 'https://i.namu.wiki/i/ypPDTfH7K2_eBusN8P1uPrsyxtEaV2S95i5r1uKAcxGV1mHG0Fdr8Bbpy4roQzF0_noV3GcpnAYnbS_-p5dowbcuqa_0-WZOrs-G6ozySYZuvWhyG7DYCg1WQOskeurLETmQsxMBttWbKVw9n2rTLw.webp',
  },
  {
    no: 4,
    name: '씽씽핑',
    gender: '남성',
    likes: ['제트기 등의 빠른 것'],
    dislikes: ['거북이, 달팽이 등 느린 것'],
    url: 'https://i.namu.wiki/i/BNx2gmeNzHejqhkmIE3z1-j600XfvRSaKpEt_aM6JDY5sUa6z73_2_UwxTQEGG5Ftckx-9j0oQ6IZFRoSJn8AL24Ygz9kp08FnJWRqFGDNHJWeaLqFJWfRSgmNL71HA6B4aw8AiCFwYKvXVjtC6h8A.webp',
  },
];
