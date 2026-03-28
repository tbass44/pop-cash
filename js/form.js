// =========================
// form select 挙動
// =========================
document.querySelectorAll('.js-select').forEach(select => {
  const current = select.querySelector('.select__current');
  const list = select.querySelector('.select__list');
  const items = select.querySelectorAll('li');
  const input = select.querySelector('input');

  // 開閉
  current.addEventListener('click', () => {
    const isOpen = list.style.display === 'block';
    const isSelected = select.classList.contains('is-selected');

    if (isOpen) {
      list.style.display = 'none';
      select.classList.remove('is-open');
    } else {
      list.style.display = 'block';

      // ★ここが核心
      if (isSelected) {
        select.classList.add('is-open-reverse'); // ↓向き用
      } else {
        select.classList.remove('is-open-reverse'); // ↑向き
      }

      select.classList.add('is-open');
    }
  });

  // 選択
  items.forEach(item => {
    item.addEventListener('click', () => {
      current.textContent = item.textContent;
      input.value = item.dataset.value;

      items.forEach(i => i.classList.remove('is-selected'));
      item.classList.add('is-selected');

      list.style.display = 'none';
      select.classList.remove('is-open');
      select.classList.remove('is-open-reverse');

      if (item.dataset.value) {
        select.classList.add('is-selected');
      } else {
        select.classList.remove('is-selected');
      }
    });
  });

  // 外クリック
  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) {
      list.style.display = 'none';
      select.classList.remove('is-open');
      select.classList.remove('is-open-reverse');
    }
  });
});


// amount 挙動（統一版）
document.querySelectorAll('.amount__inputWrap').forEach((wrap) => {
  const input = wrap.querySelector('input');
  const upBtn = wrap.querySelector('.amount__btn--up');
  const downBtn = wrap.querySelector('.amount__btn--down');

  const toggleActive = () => {
    if (input.value && Number(input.value) > 0) {
      input.classList.add('is-active');
    } else {
      input.classList.remove('is-active');
    }
  };

  // 初期 → プレースホルダ状態
  input.classList.remove('is-active');

  // 手入力でも反応させる
  input.addEventListener('input', toggleActive);

  // ボタン（1回だけ動く）
  upBtn.addEventListener('click', () => {
    input.stepUp();
    toggleActive();
  });

  downBtn.addEventListener('click', () => {
    input.stepDown();
    toggleActive();
  });
});

// =========================
// text input（名前など）
// =========================
document.querySelectorAll('.formItem__input').forEach((input) => {
  // amountはここでは除外（すでに別管理）
  if (input.closest('.amount__inputWrap')) return;

  const toggleActive = () => {
    if (input.value && input.value.trim() !== '') {
      input.classList.add('is-active');
    } else {
      input.classList.remove('is-active');
    }
  };

  // 初期（placeholder状態）
  input.classList.remove('is-active');

  // 入力時
  input.addEventListener('input', toggleActive);
});


// =========================
// 郵便番号 → 住所自動入力
// =========================
const zipInput = document.getElementById('zip');
const prefInput = document.getElementById('prefecture');
const cityInput = document.getElementById('city');
const addrInput = document.getElementById('address');

zipInput.addEventListener('input', async () => {
  const zip = zipInput.value.replace(/-/g, '');

  if (zip.length !== 7) return;

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
    const data = await res.json();

    if (data.results) {
      const result = data.results[0];

      prefInput.value = result.address1; // 都道府県
      cityInput.value = result.address2 + result.address3; // 市区町村＋町名

      // 入力状態を反映（既存のis-active用）
      prefInput.classList.add('is-active');
      cityInput.classList.add('is-active');

      // 詳細は触らない（ユーザー入力）
    }
  } catch (e) {
    console.error('住所取得エラー', e);
  }
});
