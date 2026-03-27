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
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
    select.classList.toggle('is-open', !isOpen);
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

      if (item.dataset.value) {
        select.classList.add('is-selected');
      } else {
        select.classList.remove('is-selected');
      }
    });
  });

  // 外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) {
      list.style.display = 'none';
      select.classList.remove('is-open');
    }
  });
});
