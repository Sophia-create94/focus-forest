import type { Metadata, Viewport } from "next";
import { niramit, sourceSans } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_DESCRIPTION =
  "Calendar, to-do & countdown in one place — level up and unlock new animals as you stay organized.";

export const metadata: Metadata = {
  metadataBase: new URL("https://focus-forest-sophia.vercel.app"),
  title: "Focus Forest",
  description: SITE_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Focus Forest",
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Focus Forest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focus Forest — a jungle-themed motivational calendar app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Forest",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  appleWebApp: {
    title: "Focus Forest",
    statusBarStyle: "black-translucent",
  },
  // Icons are handled by the app/ file conventions (favicon.ico, icon.svg,
  // apple-icon.png) — Next auto-injects the <link> tags. Defining
  // metadata.icons here would suppress that file-based injection.
  other: {
    // Legacy iOS Safari needs this prefixed tag to launch full-screen
    // (standalone) from the home screen; Next only emits the modern
    // non-prefixed `mobile-web-app-capable`, so this one is added by hand.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B7A57",
  // Lets content extend under the iOS status bar and makes the
  // env(safe-area-inset-*) values resolve, which the standalone
  // status-bar rule in globals.css relies on.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${niramit.variable} ${sourceSans.variable} h-full antialiased`}
    >
      {/* Mobile: body is pinned to the dynamic viewport height and
       *  cannot itself scroll, so the user cannot drag the
       *  PhoneFrame's bottom edge upward to expose body bg below it.
       *  `min-h-screen` previously kept body at 100vh, but on iOS
       *  Safari `100vh` does not shrink with the URL bar — so once
       *  the URL bar appeared the body extended past the dvh-sized
       *  PhoneFrame and a green band became scrollable into view at
       *  the bottom.
       *
       *  Desktop: body keeps `min-h-screen` and is normally
       *  scrollable so the PhoneFrame layout reflows if the window is
       *  shorter than the framed mockup. The body centers the phone
       *  on both axes with a 50px top/bottom pad (`md:py-[50px]`); when
       *  the window is taller than phone+pad the phone sits centered,
       *  when shorter the body grows past the viewport and scrolls
       *  while the 50px pad is preserved. */}
      <body className="h-[100dvh] overflow-hidden bg-primary flex flex-col md:relative md:h-auto md:min-h-screen md:overflow-visible md:bg-cream md:items-center md:justify-center md:py-[50px]">
        {/* Desktop title + tagline (visible md:+ only). Responsive
         *  placement so it never hides behind the phone:
         *  - mobile (< md): hidden, the app is full-screen.
         *  - md to < xl: in normal flow, centered as a header ABOVE the
         *    phone (no room to sit beside the centered 414px frame).
         *  - xl+ : absolutely positioned on the left edge beside the
         *    phone, where there is finally enough horizontal room. */}
        <div className="hidden md:block md:text-center md:mb-8 xl:absolute xl:left-12 xl:top-[50px] xl:mb-0 xl:text-left">
          <h1 className="font-display text-[32px] font-medium leading-[1.2] tracking-[-0.3px] text-primary mb-2">
            Focus Forest
          </h1>
          <p className="font-body text-[18px] text-primary/85">
            The easy-to-use motivational calendar app
          </p>
        </div>

        {/* Phone frame + app content (responsive: full width mobile, 414px centered desktop) */}
        <div className="flex-1 md:flex-none md:flex md:items-center md:justify-center md:px-4">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
