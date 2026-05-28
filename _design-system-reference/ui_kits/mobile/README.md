# Focus Forest — Mobile UI Kit

iOS-fidelity recreation of the Focus Forest mobile app, built as composable JSX components on top of the brand's `colors_and_type.css`.

## Run
Open `index.html` directly in a browser — no build needed.

## Components
- `StatusBar.jsx` — iOS status bar (9:41, signal/wifi/battery)
- `AppHeader.jsx` — green header w/ "ff" mark + `focusforest` wordmark; also exports `TabBar`
- `BottomNav.jsx` — 5-item bottom nav with raised yellow FAB and Add submenu (Calendar / To-do-list / Countdown)
- `JungleIllustration.jsx` — flat-illustrated reward scene with subtle sway/blink/bob animations
- `Screens.jsx` — `HomeScreen` (Welcome + progress card), `TodoScreen` (grocery list with collapsible group, search, delete), `LockScreen` (clock + reminder notification + action stack)
- `App.jsx` — top-level switcher (Home / To-do / Lock)

## Interactions
- Tap any **Add** in bottom nav → submenu opens (Calendar / To-do-list / Countdown)
- Tap **Events** while on Home → switches to To-do
- Check / uncheck items in the to-do list; expand the **Needed for Pancakes** group; trash any row
- Search filters the list live
- On Lock: tap **✕** dismisses the notification; tap any action row picks a response
