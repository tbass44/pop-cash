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
