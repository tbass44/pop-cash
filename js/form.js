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

// 入力ページのみ（confirm.html 等では要素が無い）
if (zipInput && prefInput && cityInput) {
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
}


// =========================
// form validation + confirm遷移
// =========================
const form = document.querySelector('form');
const confirmBtn = document.querySelector('.js-confirm');

// 入力ページ：バリデーション → sessionStorage → confirm.html
if (form && confirmBtn) {
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let isValid = true;
    const data = {};

    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const name = input.name;
      const value = input.type === 'checkbox'
        ? input.checked
        : input.value.trim();

      if (input.hasAttribute('required')) {
        let hasError = false;

        if (input.type === 'radio') {
          const group = form.querySelectorAll(`input[name="${name}"]`);
          const isChecked = Array.from(group).some(i => i.checked);
          if (!isChecked) hasError = true;
        } else if (input.type === 'checkbox') {
          if (!input.checked) hasError = true;
        } else {
          if (!value) hasError = true;
        }

        const parent = input.closest('.formItem');
        if (hasError) {
          isValid = false;
          parent.classList.add('is-error');

          const errorMsg = parent.querySelector('.error-message');
          if (errorMsg) errorMsg.style.display = 'block';
        } else {
          parent.classList.remove('is-error');

          const errorMsg = parent.querySelector('.error-message');
          if (errorMsg) errorMsg.style.display = 'none';
        }
      }

      if (name) {
        if (input.type === 'radio') {
          if (input.checked) {
            data[name] = input.value;
          }
        } else {
          data[name] = value;
        }
      }
    });

    if (!isValid) {
      const firstError = document.querySelector('.is-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    sessionStorage.setItem('formData', JSON.stringify(data));
    location.href = 'confirm.html';
  });
}



// =========================
// 入力ページ：値復元
// =========================
const restoreData = sessionStorage.getItem('formData');

if (restoreData && form) {
  const data = JSON.parse(restoreData);

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const inputs = form.querySelectorAll(`[name="${key}"]`);

    inputs.forEach((input) => {
      if (input.type === 'radio') {
        if (input.value === value) {
          input.checked = true;
        }
      } else if (input.type === 'checkbox') {
        input.checked = value === true;
      } else {
        input.value = value;
      }

      // is-activeも復元（見た目崩れ防止）
      if (input.classList.contains('formItem__input') && input.value) {
        input.classList.add('is-active');
      }
    });

    // select系（カスタムUI）
    const select = form.querySelector(`.js-select input[name="${key}"]`);
    if (select && value) {
      const wrapper = select.closest('.js-select');
      const current = wrapper.querySelector('.select__current');
      const item = wrapper.querySelector(`li[data-value="${value}"]`);

      if (item) {
        current.textContent = item.textContent;
        wrapper.classList.add('is-selected');
      }
    }
  });
}


// 確認ページ：送信テスト
if (!form && confirmBtn) {
  confirmBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const raw = sessionStorage.getItem('formData');
    const data = raw ? JSON.parse(raw) : {};

    try {
      const res = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log('送信成功:', result);

      alert('送信テスト成功！');

      sessionStorage.removeItem('formData');
      location.href = 'index.html';

    } catch (err) {
      console.error('送信失敗:', err);
      alert('送信失敗');
    }
  });
}
