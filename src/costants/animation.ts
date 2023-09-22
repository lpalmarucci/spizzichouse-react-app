export const fadeIn = {
  opacity: 1,
  transition: {
    staggerChildren: 0.2,
  },
};

export const fadeOut = {
  opacity: 0,
};

export const fadeVariant = {
  hidden: fadeOut,
  show: fadeIn,
};
