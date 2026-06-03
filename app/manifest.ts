import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Focus Forest",
    short_name: "Focus Forest",
    description: "Motivational calendar app — grow your day, one task at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#3B7A57",
    theme_color: "#3B7A57",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
