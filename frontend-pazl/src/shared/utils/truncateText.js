export const truncateText = (text, maxLength = 350) => {
  if (text.length <= maxLength) return text;

  const lastSpace = text.lastIndexOf(' ', maxLength);

  const cutIndex = lastSpace > 0 ? lastSpace : maxLength;
  return text.slice(0, cutIndex) + '...';
};
