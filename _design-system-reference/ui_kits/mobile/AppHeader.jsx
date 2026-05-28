// AppHeader.jsx — green app header with ff logo
const AppHeader = ({ showDots = false }) => (
  <div className="app-header">
    <div className="header-logo">ff</div>
    <span className="header-title">focusforest</span>
    {showDots && (<>
      <div className="header-spacer"/>
      <div className="header-dots">⋮</div>
    </>)}
  </div>
);

// TabBar.jsx — segmented tabs (Calendar / To-do-list / Countdown)
const TabBar = ({ active, onChange, tabs = ["Calendar", "To-do-list", "Countdown"] }) => (
  <div className="tab-bar">
    {tabs.map((t) => (
      <button key={t} type="button"
        className={`tab-item ${active === t ? "active" : ""}`}
        onClick={() => onChange && onChange(t)}>
        {t}
      </button>
    ))}
  </div>
);

window.AppHeader = AppHeader;
window.TabBar = TabBar;
