(() => {
  'use strict';
  if (document.getElementById('legal-ai-widget-host')) return;
  const script = document.currentScript;
  if (!script?.src) return;
  const base = new URL(script.src).origin;
  function mount() {
    if (document.getElementById('legal-ai-widget-host')) return;
    const host = document.createElement('div');
    host.id = 'legal-ai-widget-host';
    host.style.cssText = 'position:fixed!important;right:16px!important;bottom:16px!important;z-index:2147483000!important;display:block!important;';
    const root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ':host{font-family:Arial,sans-serif}*{box-sizing:border-box}.panel{width:min(410px,calc(100vw - 32px));height:min(710px,calc(100vh - 110px));height:min(710px,calc(100dvh - 110px));margin-bottom:10px;background:white;border:1px solid #dce2ed;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px #17255440}iframe{display:block;width:100%;height:100%;border:0}.toggle{display:block;margin-left:auto;min-width:60px;height:56px;padding:0 18px;border:0;border-radius:28px;background:#172554;color:white;font:16px Arial,sans-serif;cursor:pointer;box-shadow:0 6px 24px #17255440}.toggle:focus-visible{outline:3px solid #c99c26;outline-offset:3px}[hidden]{display:none!important}';
    const panel = document.createElement('div');
    panel.className = 'panel'; panel.id = 'legal-panel'; panel.hidden = true;
    const frame = document.createElement('iframe');
    frame.title = 'Чат с юридическим AI-помощником';
    frame.referrerPolicy = 'no-referrer';
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'toggle';
    button.textContent = '⚖ Задать вопрос';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'legal-panel');
    button.addEventListener('click', () => {
      const open = panel.hidden;
      if (open && !frame.hasAttribute('src')) frame.src = `${base}/`;
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Закрыть чат' : '⚖ Задать вопрос';
    });
    panel.append(frame); root.append(style, panel, button); document.body.append(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
