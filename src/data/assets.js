// Every image the site uses, in one place. All files live in /public/images.
// To swap a photo, replace the file (same name) or point the path somewhere else.
// The four photos are downloaded automatically on first `npm run dev` / `npm run build`
// (see scripts/fetch-images.mjs).

export const BRAND = {
  logo: "/images/brand/wordcompass-logo.webp",
  logoPng: "/images/brand/wordcompass-logo.png",
  mark: "/images/brand/wordcompass-mark-512.png",
  // Pixel size of the logo file; used to reserve space before it loads.
  logoWidth: 800,
  logoHeight: 216,
};

export const IMAGES = {
  hero: "/images/photos/hero-mentor-and-teen.webp",
  thoughtfulTeen: "/images/photos/thoughtful-teen.webp",
  methodCards: "/images/photos/method-cards.webp",
  onlineSession: "/images/photos/online-session.webp",
};
