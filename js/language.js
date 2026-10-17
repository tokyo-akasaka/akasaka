export const translations = {
  es: {
    shareDish: "Compartir plato",
    share: "Compartir",
    shareCopied: "Enlace copiado",
    shareHint: "Copia este enlace para compartir el plato.",
    homeTitle: "Akasaka · Elige tu experiencia",
    choose: "¿Cómo te apetece disfrutar hoy?",
    buffetHint: "Rondas ilimitadas · A tu ritmo",
    cartaTitle: "LA CARTA",
    cartaHint: "Elige cada plato",
    lunchTitle: "MENÚ MEDIODÍA",
    lunchHint: "De lunes a viernes · Excepto festivos",
    drinksTitle: "BEBIDAS",
    drinksHint: "Para acompañar cada momento",
    skip: "Ir a los platos",
    home: "← Inicio",
    conditions: "Condiciones",
    conditionsTitle: "All You Can Eat · Condiciones",
    close: "Cerrar ×",
    loading: "Cargando carta…",
    tax: "Precios con IVA incluido.",
    sampleTitle: "Diseño en revisión V0.1.0",
    dishes: "platos",
    reference: "Ref.",
    allergens: "Alérgenos",
    allergensPending: "Alérgenos pendientes de revisar en el original.",
    reviewPending: "Datos del borrador pendientes de confirmar.",
    error:
      "No se ha podido cargar la carta. Recarga la página para intentarlo de nuevo.",
    changed: "Carta en español",
    nav: "Categorías",
    experiences: "Modalidades",
    pageTitle: "Akasaka · Alicante",
    two: "Para 2 personas",
    starOne:
      "Disponible en cenas, fines de semana, festivos y vísperas; solo una vez.",
    starTwo: "Solo una vez.",
    perPerson: "por persona",
    weekdayLunch: "Comidas de lunes a viernes",
    otherTimes: "Cenas, fines de semana, festivos y vísperas",
    children: "Niños de menos de 120 cm",
    minimum: "Adultos: mínimo 2 personas.",
    buffetShort:
      "Rondas ilimitadas · Máximo 4 platos por persona y ronda. Bebida, postre y café no incluidos.",
    buffetDrinks: "Ver bebidas →",
    lunchStandard: "Con segundo normal",
    lunchSushi: "Con segundo de sushi",
    glass: "Copa",
    shot: "Chupito",
    drinkItems: "bebidas",
    notIncluded: "No incluido en el menú infantil.",
    backToDishes: "Volver a los platos",
  },
  en: {
    shareDish: "Share dish",
    share: "Share",
    shareCopied: "Link copied",
    shareHint: "Copy this link to share the dish.",
    homeTitle: "Akasaka · Choose your experience",
    choose: "How would you like to enjoy your visit?",
    buffetHint: "Unlimited rounds · At your own pace",
    cartaTitle: "À LA CARTE",
    cartaHint: "Choose each dish",
    lunchTitle: "LUNCH MENU",
    lunchHint: "Monday to Friday · Excluding public holidays",
    drinksTitle: "DRINKS",
    drinksHint: "Something for every moment",
    skip: "Skip to dishes",
    home: "← Home",
    conditions: "Conditions",
    conditionsTitle: "All You Can Eat · Conditions",
    close: "Close ×",
    loading: "Loading menu…",
    tax: "Prices include VAT.",
    sampleTitle: "Design under review V0.1.0",
    dishes: "dishes",
    reference: "Ref.",
    allergens: "Allergens",
    allergensPending: "Allergens awaiting review against the source.",
    reviewPending: "Draft details awaiting confirmation.",
    error: "The menu could not be loaded. Reload the page to try again.",
    changed: "Menu in English",
    nav: "Categories",
    experiences: "Dining options",
    pageTitle: "Akasaka · Alicante",
    two: "For 2 people",
    starOne:
      "Available at dinner, weekends, public holidays and their eves; once only.",
    starTwo: "Once only.",
    perPerson: "per person",
    weekdayLunch: "Monday to Friday lunchtime",
    otherTimes: "Dinner, weekends, public holidays and their eves",
    children: "Children under 120 cm",
    minimum: "Adults: minimum 2 people.",
    buffetShort:
      "Unlimited rounds · Up to 4 dishes per person per round. Drinks, dessert and coffee not included.",
    buffetDrinks: "View drinks →",
    lunchStandard: "With a standard main",
    lunchSushi: "With a sushi main",
    glass: "Glass",
    shot: "Shot",
    drinkItems: "drinks",
    notIncluded: "Not included in the children’s menu.",
    backToDishes: "Back to dishes",
  },
};
export function initialLanguage() {
  const sharedLanguage = new URLSearchParams(location.search).get('lang');
  if (sharedLanguage === 'es' || sharedLanguage === 'en') return sharedLanguage;
  try {
    return localStorage.getItem("akasaka-language") === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}
export function applyLanguage(language) {
  const text = translations[language];
  document.documentElement.lang = language;
  document.title = text.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (text[el.dataset.i18n]) el.textContent = text[el.dataset.i18n];
  });
  document
    .querySelectorAll("[data-language]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === language),
      ),
    );
  document
    .querySelectorAll("#categories,#category-rail")
    .forEach((nav) => nav.setAttribute("aria-label", text.nav));
  document
    .querySelector(".experience-menu")
    ?.setAttribute("aria-label", text.experiences);
  try {
    localStorage.setItem("akasaka-language", language);
  } catch {}
}
export function trackHeader() {
  const header = document.querySelector(".masthead");
  new ResizeObserver(() =>
    document.documentElement.style.setProperty(
      "--header-height",
      `${header.getBoundingClientRect().height}px`,
    ),
  ).observe(header);
}
