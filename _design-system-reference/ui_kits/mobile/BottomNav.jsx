// BottomNav.jsx — 5-item nav with raised yellow FAB and add submenu
const HomeIcon = () => (<svg width="22" height="20" viewBox="0 0 22 20" fill="currentColor"><path d="M9 19v-6h4v6h5v-8h3L11 1 1 11h3v8z"/></svg>);
const EventsIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="16" height="16" rx="2"/><line x1="14" y1="1" x2="14" y2="5"/><line x1="6" y1="1" x2="6" y2="5"/><line x1="2" y1="9" x2="18" y2="9"/></svg>);
const ProgressIcon = () => (<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="9"/><polyline points="11 7 11 11 14 13"/></svg>);
const ProfileIcon = () => (<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="7" r="4"/><path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>);
const PlusIcon = () => (<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="13" y1="4" x2="13" y2="22"/><line x1="4" y1="13" x2="22" y2="13"/></svg>);
const CalendarIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B7A57" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const TodoIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B7A57" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>);
const CountdownIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B7A57" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);

const BottomNav = ({ active, onNav, onPickAdd }) => {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const go = (k) => () => onNav && onNav(k);
  const pick = (k) => () => { setOpen(false); onPickAdd && onPickAdd(k); };

  return (
    <div className="bottom-nav">
      <div className="nav-row">
        <button type="button" className={`nav-item ${active === "home" ? "active" : ""}`} onClick={go("home")}>
          <div className="nav-icon"><HomeIcon/></div>
          <span className="nav-label">Home</span>
        </button>
        <button type="button" className={`nav-item ${active === "events" ? "active" : ""}`} onClick={go("events")}>
          <div className="nav-icon"><EventsIcon/></div>
          <span className="nav-label">Events</span>
        </button>

        <div className="nav-add-wrap" ref={wrapRef}>
          <div className={`add-submenu ${open ? "open" : ""}`}>
            <div className="sub-icon-wrap" onClick={pick("calendar")}>
              <div className="sub-circle"><CalendarIcon/></div>
              <span className="sub-icon-label">Calendar</span>
            </div>
            <div className="sub-icon-wrap" onClick={pick("todo")}>
              <div className="sub-circle"><TodoIcon/></div>
              <span className="sub-icon-label">To-do-list</span>
            </div>
            <div className="sub-icon-wrap" onClick={pick("countdown")}>
              <div className="sub-circle"><CountdownIcon/></div>
              <span className="sub-icon-label">Countdown</span>
            </div>
          </div>
          <button type="button" className={`add-fab ${open ? "open" : ""}`}
            onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}>
            <PlusIcon/>
          </button>
          <span className="add-label-text">Add</span>
        </div>

        <button type="button" className={`nav-item ${active === "progress" ? "active" : ""}`} onClick={go("progress")}>
          <div className="nav-icon"><ProgressIcon/></div>
          <span className="nav-label">Progress</span>
        </button>
        <button type="button" className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={go("profile")}>
          <div className="nav-icon"><ProfileIcon/></div>
          <span className="nav-label">Profile</span>
        </button>
      </div>
    </div>
  );
};

window.BottomNav = BottomNav;
