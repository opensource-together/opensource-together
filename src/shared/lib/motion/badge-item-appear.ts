/** Matches Combobox selected tags — blur-in + slight lift */
export const badgeItemAppearEase = [0.22, 1, 0.32, 1] as const;

export const badgeItemAppearInitial = {
  opacity: 0,
  filter: "blur(8px)",
  y: 12,
};

export const badgeItemAppearAnimate = {
  opacity: 1,
  filter: "blur(0px)",
  y: 0,
};

export const badgeItemAppearTransition = {
  duration: 0.4,
  ease: badgeItemAppearEase,
};

/** Blur-out when a tag / pill is removed (pair with AnimatePresence) */
export const badgeItemExit = {
  opacity: 0,
  filter: "blur(8px)",
  y: -12,
};
