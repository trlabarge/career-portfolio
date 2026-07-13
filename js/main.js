/* Minimal progressive-enhancement JS: mobile nav toggle only. */
(function () {
  'use strict';

  var toggle = document.querySelector('.primary-nav__toggle');
  var list = document.querySelector('.primary-nav__list');

  if (!toggle || !list) {
    return;
  }

  toggle.addEventListener('click', function () {
    var isOpen = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu when a link is chosen (mobile).
  list.addEventListener('click', function (event) {
    if (event.target.closest('.primary-nav__link')) {
      list.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
