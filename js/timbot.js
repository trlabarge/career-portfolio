/**
 * Timbot. A chat widget that lives on every page.
 *
 * Progressive enhancement, same as the rest of the site. Nothing here renders
 * without JS, and /ask exists as a real page for anyone who would rather have
 * a full screen or arrives without the widget.
 *
 * The conversation is kept in sessionStorage so it survives navigation between
 * pages, which matters when the launcher follows you around the site.
 */
(function () {
  'use strict';

  var ENDPOINT = '/api/chat';
  var STORE_KEY = 'timbot:conversation';
  var OPEN_KEY = 'timbot:open';
  var MAX_TURNS = 24;

  var GREETING =
    'Hi. I’m not Tim, but I’m pretty close. I’m Timbot.\n\n' +
    'They fed me his case studies, his resume, and several hours of him ' +
    'talking into a microphone, so I know his numbers, his opinions, and ' +
    'the fact that he cannot make a decent burger. Ask me anything.';

  var PROMPTS = [
    'What’s your biggest revenue win?',
    'Would you fit a Series B company?',
    'What are you like to work with?',
    'Why can’t you make a burger?',
  ];

  var AVATAR = '/assets/timbot/timbot-avatar.webp';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(-MAX_TURNS) : [];
    } catch (e) {
      return [];
    }
  }

  function save(messages) {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-MAX_TURNS)));
    } catch (e) {
      /* private mode, or full. Not worth surfacing. */
    }
  }

  function Timbot() {
    this.messages = load();
    this.streaming = false;
    this.build();
    this.render();

    /* /ask sets this so the panel is already open when the page loads. */
    if (document.body.hasAttribute('data-timbot-open')) {
      this.open(true);
      return;
    }

    try {
      if (sessionStorage.getItem(OPEN_KEY) === '1') this.open(true);
    } catch (e) {
      /* ignore */
    }
  }

  Timbot.prototype.build = function () {
    var self = this;

    var root = el('div', 'timbot');
    root.setAttribute('data-timbot', '');

    /* Launcher */
    var launcher = el('button', 'timbot__launcher');
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'timbot-panel');

    var avatar = el('img', 'timbot__avatar');
    avatar.src = AVATAR;
    avatar.alt = '';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.width = 48;
    avatar.height = 48;
    launcher.appendChild(avatar);
    launcher.appendChild(el('span', 'timbot__launcher-label', 'Ask me anything'));
    launcher.appendChild(
      el('span', 'visually-hidden', 'Open the chat with Tim’s AI stand-in')
    );

    /* Panel */
    var panel = el('div', 'timbot__panel');
    panel.id = 'timbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Tim’s AI stand-in');
    panel.hidden = true;

    var head = el('div', 'timbot__head');
    var headAvatar = el('img', 'timbot__head-avatar');
    headAvatar.src = AVATAR;
    headAvatar.alt = '';
    headAvatar.setAttribute('aria-hidden', 'true');
    headAvatar.width = 40;
    headAvatar.height = 40;

    var headText = el('div', 'timbot__head-text');
    headText.appendChild(el('p', 'timbot__head-name', 'Timbot'));
    headText.appendChild(
      el('p', 'timbot__head-role', 'Not Tim, but pretty close')
    );

    var close = el('button', 'timbot__close');
    close.type = 'button';
    close.innerHTML = '<span aria-hidden="true">&times;</span>';
    close.appendChild(el('span', 'visually-hidden', 'Close chat'));

    head.appendChild(headAvatar);
    head.appendChild(headText);
    head.appendChild(close);

    var log = el('div', 'timbot__log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    log.setAttribute('aria-label', 'Conversation');

    var form = el('form', 'timbot__form');
    var field = el('textarea', 'timbot__input');
    field.rows = 1;
    field.placeholder = 'What do you want to know about Tim?';
    field.setAttribute('aria-label', 'Your message');
    field.maxLength = 2000;

    var send = el('button', 'timbot__send');
    send.type = 'submit';
    send.innerHTML = '<span aria-hidden="true">&uarr;</span>';
    send.appendChild(el('span', 'visually-hidden', 'Send message'));

    form.appendChild(field);
    form.appendChild(send);

    var foot = el('p', 'timbot__foot');
    foot.appendChild(
      document.createTextNode('AI answers can be wrong. For anything that matters, ')
    );
    var contactLink = el('a', null, 'email Tim');
    contactLink.href = '/contact';
    foot.appendChild(contactLink);
    foot.appendChild(document.createTextNode('.'));

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(form);
    panel.appendChild(foot);

    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    this.root = root;
    this.launcher = launcher;
    this.panel = panel;
    this.log = log;
    this.form = form;
    this.field = field;
    this.send = send;

    launcher.addEventListener('click', function () {
      if (panel.hidden) self.open();
      else self.close();
    });
    close.addEventListener('click', function () {
      self.close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) self.close();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      self.submit(field.value);
    });

    field.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        self.submit(field.value);
      }
    });

    field.addEventListener('input', function () {
      field.style.height = 'auto';
      field.style.height = Math.min(field.scrollHeight, 120) + 'px';
    });
  };

  Timbot.prototype.open = function (silent) {
    this.panel.hidden = false;
    this.root.classList.add('is-open');
    this.launcher.setAttribute('aria-expanded', 'true');
    try {
      sessionStorage.setItem(OPEN_KEY, '1');
    } catch (e) {
      /* ignore */
    }
    if (!silent) this.field.focus();
    this.scroll();
  };

  Timbot.prototype.close = function () {
    this.panel.hidden = true;
    this.root.classList.remove('is-open');
    this.launcher.setAttribute('aria-expanded', 'false');
    try {
      sessionStorage.setItem(OPEN_KEY, '0');
    } catch (e) {
      /* ignore */
    }
    this.launcher.focus();
  };

  Timbot.prototype.scroll = function () {
    this.log.scrollTop = this.log.scrollHeight;
  };

  Timbot.prototype.bubble = function (role, text) {
    var wrap = el('div', 'timbot__msg timbot__msg--' + role);
    var body = el('div', 'timbot__bubble');

    String(text)
      .split(/\n{2,}/)
      .forEach(function (para) {
        if (para.trim()) body.appendChild(el('p', null, para.trim()));
      });

    wrap.appendChild(body);
    this.log.appendChild(wrap);
    return body;
  };

  Timbot.prototype.render = function () {
    var self = this;
    this.log.innerHTML = '';

    var intro = el('div', 'timbot__intro');
    GREETING.split('\n\n').forEach(function (para) {
      intro.appendChild(el('p', null, para));
    });
    this.log.appendChild(intro);

    this.messages.forEach(function (message) {
      self.bubble(message.role, message.content);
    });

    if (!this.messages.length) {
      var prompts = el('div', 'timbot__prompts');
      PROMPTS.forEach(function (text) {
        var chip = el('button', 'timbot__prompt', text);
        chip.type = 'button';
        chip.addEventListener('click', function () {
          self.submit(text);
        });
        prompts.appendChild(chip);
      });
      this.log.appendChild(prompts);
    }

    this.scroll();
  };

  Timbot.prototype.setBusy = function (busy) {
    this.streaming = busy;
    this.log.setAttribute('aria-busy', busy ? 'true' : 'false');
    this.send.disabled = busy;
    this.field.disabled = busy;
  };

  Timbot.prototype.submit = function (raw) {
    var self = this;
    var text = String(raw || '').trim();
    if (!text || this.streaming) return;

    var prompts = this.log.querySelector('.timbot__prompts');
    if (prompts) prompts.remove();

    this.field.value = '';
    this.field.style.height = 'auto';

    this.messages.push({ role: 'user', content: text });
    save(this.messages);
    this.bubble('user', text);

    var wrap = el('div', 'timbot__msg timbot__msg--assistant');
    var body = el('div', 'timbot__bubble');
    var typing = el('span', 'timbot__typing');
    typing.innerHTML = '<i></i><i></i><i></i>';
    typing.setAttribute('aria-label', 'Timbot is typing');
    body.appendChild(typing);
    wrap.appendChild(body);
    this.log.appendChild(wrap);
    this.scroll();

    this.setBusy(true);
    this.stream(body, typing);
  };

  Timbot.prototype.stream = function (body, typing) {
    var self = this;
    var answer = '';
    var started = false;

    function paint() {
      body.innerHTML = '';
      answer.split(/\n{2,}/).forEach(function (para) {
        if (para.trim()) body.appendChild(el('p', null, para.trim()));
      });
      self.scroll();
    }

    function fail(message) {
      if (!started) typing.remove();
      body.innerHTML = '';
      var note = el('p', 'timbot__error', message);
      body.appendChild(note);
      self.setBusy(false);
      self.scroll();
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: this.messages }),
    })
      .then(function (response) {
        if (!response.ok) {
          return response
            .json()
            .catch(function () {
              return {};
            })
            .then(function (payload) {
              throw new Error(payload.error || 'Timbot is unavailable right now.');
            });
        }
        if (!response.body) throw new Error('Streaming is not supported here.');

        var reader = response.body.getReader();
        var decoder = new TextDecoder();
        var buffer = '';

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) return;
            buffer += decoder.decode(result.value, { stream: true });

            var chunks = buffer.split('\n\n');
            buffer = chunks.pop();

            chunks.forEach(function (chunk) {
              var line = chunk.trim();
              if (line.indexOf('data:') !== 0) return;

              var payload;
              try {
                payload = JSON.parse(line.slice(5).trim());
              } catch (e) {
                return;
              }

              if (payload.type === 'text') {
                if (!started) {
                  started = true;
                  typing.remove();
                }
                answer += payload.text;
                paint();
              } else if (payload.type === 'error') {
                throw new Error(payload.message);
              }
            });

            return pump();
          });
        }

        return pump();
      })
      .then(function () {
        if (!answer.trim()) {
          fail('I did not get an answer back. Try that again?');
          return;
        }
        self.messages.push({ role: 'assistant', content: answer });
        save(self.messages);
        self.setBusy(false);
        self.field.focus();
      })
      .catch(function (error) {
        // Drop the unanswered turn so a retry does not stack two user
        // messages in a row, which the API rejects.
        if (self.messages[self.messages.length - 1].role === 'user') {
          self.messages.pop();
          save(self.messages);
        }
        fail(error.message || 'Something went wrong. Try again in a moment.');
      });
  };

  function start() {
    if (document.querySelector('[data-timbot]')) return;
    if (!window.fetch || !window.TextDecoder) return;
    new Timbot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
