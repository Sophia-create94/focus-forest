import type { Metadata } from "next";
import { niramit, sourceSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Focus Forest",
  description: "Motivational calendar app — grow your day, one task at a time.",
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
        {/* Desktop title + tagline (visible md:+ only). Absolutely
         *  positioned on the left edge, pinned near the top (aligned
         *  with the phone's 50px top pad), so it sits to the side
         *  without pushing the centered phone frame off-axis. */}
        <div className="hidden md:block md:absolute md:left-12 md:top-[50px]">
          <h1 className="font-display text-h2 text-primary mb-2">
            Focus Forest
          </h1>
          <p className="font-body text-[16px] text-primary/85">
            Your motivational calendar
          </p>
        </div>

        {/* Phone frame + app content (responsive: full width mobile, 414px centered desktop) */}
        <div className="flex-1 md:flex-none md:flex md:items-center md:justify-center md:px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
