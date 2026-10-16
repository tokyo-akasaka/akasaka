import {initialLanguage,applyLanguage,trackHeader} from './language.js';
applyLanguage(initialLanguage());trackHeader();
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.language)));
