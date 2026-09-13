(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const history = [];
  let busy = false;
  const welcome = 'Здравствуйте! Я AI-помощник. Опишите вопрос, укажите страну и при необходимости регион. Не отправляйте документы, паспортные данные, пароли или сведения, составляющие тайну.';
  function add(text, role = 'bot') {
    const element = document.createElement('div');
    element.className = `message ${role}`;
    element.textContent = text;
    $('messages').append(element);
    while ($('messages').children.length > 80) $('messages').firstElementChild.remove();
    $('messages').scrollTop = $('messages').scrollHeight;
  }
  function setBusy(value) {
    busy = value;
    $('send').disabled = value;
    $('clear').disabled = value;
    $('input').disabled = value;
    $('consent').disabled = value;
    document.querySelectorAll('[data-question]').forEach(b => { b.disabled = value; });
    $('status').textContent = value ? 'Помощник готовит ответ…' : '';
  }
  add(welcome);
  fetch('/api/config').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(config => {
    if (typeof config.companyName === 'string') $('company').textContent = config.companyName;
    for (const [id, key] of [['contact', 'contactUrl'], ['privacy', 'privacyUrl']]) {
      try {
        const url = new URL(config[key]);
        if (url.protocol === 'https:') { $(id).href = url.href; $(id).hidden = false; }
      } catch { /* Unconfigured links remain hidden. */ }
    }
  }).catch(() => { $('status').textContent = 'Настройки компании временно недоступны.'; });
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
    $('input').value = button.dataset.question; $('input').focus();
  }));
  $('clear').addEventListener('click', () => {
    if (busy) return;
    history.length = 0; $('messages').replaceChildren(); $('input').value = ''; add(welcome);
  });
  $('form').addEventListener('submit', async event => {
    event.preventDefault();
    const text = $('input').value.trim();
    if (busy || !text || !$('consent').checked) return;
    const previous = history.slice(-10);
    // Remove complete pairs so the request always begins and ends with a user turn.
    while (previous.reduce((n, m) => n + m.content.length, text.length) > 24000 && previous.length) previous.splice(0, 2);
    const messages = [...previous, { role: 'user', content: text }];
    add(text, 'user'); $('input').value = ''; setBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, consent: true }), signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Ошибка сервера. Попробуйте позже.');
      if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Пустой ответ сервера.');
      add(data.answer);
      history.push({ role: 'user', content: text }, { role: 'assistant', content: data.answer });
      if (history.length > 10) history.splice(0, history.length - 10);
    } catch (error) {
      add(error.name === 'AbortError' ? 'Время ожидания истекло. Попробуйте ещё раз.' : error.message, 'error');
      $('input').value = text;
    } finally {
      clearTimeout(timer); setBusy(false); $('input').focus();
    }
  });
})();
