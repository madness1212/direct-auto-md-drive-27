export const preserveScrollPosition = () => {
  return window.scrollY;
};

export const resetScrollToTop = () => {
  window.scrollTo(0, 0);
};

export const restoreScrollPosition = (position: number) => {
  window.scrollTo(0, position);
};