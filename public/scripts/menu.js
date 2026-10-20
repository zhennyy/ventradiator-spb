// Меню: выпадающие списки разделов (мышь и клавиатура) и мобильное меню.
(function setupMenu() {
  const dropdownItems = Array.from(document.querySelectorAll('[data-dropdown]'));
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.getElementById('site-nav');

  function setDropdown(item, isOpen) {
    const toggle = item.querySelector('.nav-toggle');
    toggle.setAttribute('aria-expanded', String(isOpen));
    item.classList.toggle('is-open', isOpen);
  }

  function closeAllDropdowns(except) {
    dropdownItems.forEach((item) => {
      if (item !== except) setDropdown(item, false);
    });
  }

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.nav-toggle');
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns(item);
      setDropdown(item, !isOpen);
      if (!isOpen) {
        const firstLink = item.querySelector('.dropdown a');
        if (firstLink && toggle.matches(':focus-visible')) firstLink.focus();
      }
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && item.classList.contains('is-open')) {
        setDropdown(item, false);
        toggle.focus();
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const links = Array.from(item.querySelectorAll('.dropdown a'));
        const position = links.indexOf(document.activeElement);
        if (position === -1 && document.activeElement !== toggle) return;
        event.preventDefault();
        if (!item.classList.contains('is-open')) setDropdown(item, true);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const next = position === -1 ? 0 : (position + step + links.length) % links.length;
        links[next].focus();
      }
    });
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) setDropdown(item, false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-dropdown]')) closeAllDropdowns();
  });

  if (!menuButton || !nav) return;

  function setMenu(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  }

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (query) => {
    if (query.matches) setMenu(false);
  });
})();
