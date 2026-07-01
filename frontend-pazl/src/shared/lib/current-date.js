const getLocalizedDate = (locale = navigator.language) => {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long"
  }).format(new Date()).replace(/(\s?г\.?)/, "");
};

export const currentDate = getLocalizedDate();

