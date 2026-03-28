document.addEventListener('DOMContentLoaded', function () {
  const sliderEl = document.querySelector('.voice__slider');
  const voiceBar = document.querySelector('.voice__bar');

  if (!sliderEl || typeof Swiper === 'undefined') {
    console.log('voice swiper not ready');
    return;
  }

  const voiceSwiper = new Swiper('.voice__slider', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: false,
    grabCursor: true,
    allowTouchMove: true,
    observer: true,
    observeParents: true,
  });

  function updateVoiceBar() {
    if (!voiceBar) return;
  
    const total = voiceSwiper.slides.length;
    const currentIndex = voiceSwiper.activeIndex;
    const isEnd = voiceSwiper.isEnd;
  
    if (isEnd) {
      voiceBar.style.width = '100%';
      return;
    }
  
    const progress = ((currentIndex + 1) / (total - 1)) * 100;
    voiceBar.style.width = progress + '%';
  }

  updateVoiceBar();
  voiceSwiper.on('slideChange', updateVoiceBar);
});


// =========================
// FAQ アコーディオン
// =========================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-q');

  question.addEventListener('click', () => {

    // 全部閉じる（1個だけ開く仕様）
    faqItems.forEach(el => {
      if (el !== item) {
        el.classList.remove('is-open');
      }
    });

    // トグル
    item.classList.toggle('is-open');
  });
});


// =========================
// caution アコーディオン
// =========================
const caution = document.querySelector('.form_caution');

if (caution) {
  const header = caution.querySelector('.form_cautionHeader');

  header.addEventListener('click', () => {
    caution.classList.toggle('is-open');
  });
}


// =========================
// モーダル（プライバシーポリシー）
// =========================
const modal = document.getElementById('privacyModal');
const openBtn = document.querySelector('.footer__link');
const closeBtn = document.querySelector('.modal__close');
const overlay = document.querySelector('.modal__overlay');

// 開く
openBtn.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.add('is-active');
});

// 閉じる
closeBtn.addEventListener('click', () => {
  modal.classList.remove('is-active');
});

// 背景クリックでも閉じる
overlay.addEventListener('click', () => {
  modal.classList.remove('is-active');
});
