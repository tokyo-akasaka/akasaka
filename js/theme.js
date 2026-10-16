// Se ejecuta antes de pintar la página para evitar destellos del tema contrario.
(() => {
 const root = document.documentElement;
 const preference = matchMedia('(prefers-color-scheme: dark)');
 let saved;
 try { saved = localStorage.getItem('akasaka-theme'); } catch {}
 let explicit = saved === 'dark' || saved === 'light';
 function apply(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  updateButton();
 }
 function updateButton() {
  const button = document.querySelector('#theme-toggle');
  if (!button) return;
  const dark = root.dataset.theme === 'dark', english = root.lang === 'en';
  button.textContent = dark ? (english ? '☀ Light' : '☀ Claro') : (english ? '☾ Dark' : '☾ Oscuro');
  button.setAttribute('aria-label', english ? `Switch to ${dark ? 'light' : 'dark'} mode` : `Cambiar a modo ${dark ? 'claro' : 'oscuro'}`);
 }
 apply(explicit ? saved : (preference.matches ? 'dark' : 'light'));
 preference.addEventListener('change', event => { if (!explicit) apply(event.matches ? 'dark' : 'light'); });
 document.addEventListener('DOMContentLoaded', () => {
  updateButton();
  document.querySelector('#theme-toggle').addEventListener('click', () => {
   const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
   explicit = true;
   apply(theme);
   try { localStorage.setItem('akasaka-theme', theme); } catch {}
  });
  new MutationObserver(updateButton).observe(root, {attributes:true, attributeFilter:['lang']});
 });
})();
