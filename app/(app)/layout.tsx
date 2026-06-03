"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/phone-frame";
import { AppHeader } from "@/components/app-header";
import { StatusBar } from "@/components/ui/status-bar";
import { BottomNav, BottomNavItem } from "@/components/ui/bottom-nav";
import { FabMenu } from "@/components/ui/fab-menu";
import {
  HomeIcon,
  CalendarIcon,
  TodayIcon,
  ProfileIcon,
} from "@/components/ui/icons";

const PATH_TO_ACTIVE_ITEM: Record<string, string> = {
  "/": "home",
  "/plans": "plans",
  "/plans/todo": "plans",
  "/plans/calendar": "plans",
  "/plans/countdown": "plans",
  "/today": "today",
  "/profile": "profile",
  "/add": "home",
};

const PATH_TO_SHOWS_DOTS: Record<string, boolean> = {
  "/": false,
  "/plans": false,
  "/plans/todo": true,
  "/plans/calendar": false,
  "/plans/countdown": false,
  "/today": false,
  "/profile": false,
  "/add": false,
};

const NAV_ROUTES: Record<string, string> = {
  "home": "/",
  "plans": "/plans/todo",
  "today": "/today",
  "profile": "/profile",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // On any route change inside the app, force both the outer
  // browser window AND the inner <main> scroll container back to
  // top. Without the inner reset, scrolling deep on one screen
  // (e.g. Calendar's agenda) and switching to another (Today,
  // Profile) leaves the new screen mounted with the old scrollTop
  // — hiding the new screen's title content. The Calendar page's
  // own effect runs after this and re-positions to Today's card.
  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
    document.querySelector("main")?.scrollTo({ top: 0 });
  }, [pathname]);

  const activeItem = PATH_TO_ACTIVE_ITEM[pathname] ?? "home";
  const showDots = PATH_TO_SHOWS_DOTS[pathname] ?? false;

  const handleNavClick = (value: string) => {
    const route = NAV_ROUTES[value];
    if (route) {
      router.push(route);
    }
  };

  return (
    <PhoneFrame>
      {/* `relative` + `data-fab-portal` provide a scoped portal target
          for FabMenu's overlay so the dim layer's absolute inset-0
          stays inside the iPhone frame instead of leaking onto the
          desktop cream chrome. Rounded clipping at the bezel corners
          is handled by the PhoneFrame viewport's clip-path. */}
      <div className="flex flex-col h-full bg-primary relative" data-fab-portal>
        <div data-app-chrome className="flex-shrink-0 [background:var(--surface-header-nav-bg)] [backdrop-filter:var(--surface-header-nav-blur)] [-webkit-backdrop-filter:var(--surface-header-nav-blur)] [border-bottom:var(--surface-header-nav-border)]">
          <StatusBar />
          <AppHeader showDots={showDots} />
        </div>
        <main className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
          {children}
        </main>
        <BottomNav activeItem={activeItem}>
          <BottomNavItem
            icon={<HomeIcon />}
            label="Home"
            value="home"
            onClick={() => handleNavClick("home")}
          />
          <BottomNavItem
            icon={<CalendarIcon width={20} height={20} />}
            label="Plans"
            value="plans"
            onClick={() => handleNavClick("plans")}
          />
          <FabMenu />
          <BottomNavItem
            icon={<TodayIcon />}
            label="Today"
            value="today"
            onClick={() => handleNavClick("today")}
          />
          <BottomNavItem
            icon={<ProfileIcon />}
            label="Profile"
            value="profile"
            onClick={() => handleNavClick("profile")}
          />
        </BottomNav>
      </div>
    </PhoneFrame>
  );
}
