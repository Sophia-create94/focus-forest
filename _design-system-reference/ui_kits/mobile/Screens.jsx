// Screens.jsx — three core screens: HomeScreen, TodoScreen, LockScreen

const HomeScreen = ({ nav }) => (
  <div className="screen screen-home">
    <StatusBar/>
    <AppHeader/>
    <div className="home-scroll">
      <div className="home-welcome">Welcome!</div>
      <div className="home-progress-label">Your progress</div>
      <div className="progress-card">
        <div className="progress-level">Good job!<br/>You reached level 5</div>
        <div className="jungle-wrap">
          <JungleIllustration/>
          <button type="button" className="jungle-cta">See your jungle here</button>
        </div>
      </div>
    </div>
    {nav}
  </div>
);

const TrashIcon = () => (<svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="2 4 12 4"/><path d="M4 4V2h6v2"/><rect x="2.5" y="4" width="9" height="10" rx="1.5"/><line x1="5" y1="7" x2="5" y2="12"/><line x1="9" y1="7" x2="9" y2="12"/></svg>);

const INITIAL_TODOS = [
  { id: "bread", text: "Bread", done: false },
  { id: "oj", text: "Orange Juice", done: false },
  { id: "pancakes", text: "Needed for Pancakes", done: false, isGroup: true,
    children: [
      { id: "strawberries", text: "Strawberries", done: false },
      { id: "bananas", text: "Bananas", done: false },
      { id: "flour", text: "Flour", done: false },
    ]
  },
  { id: "rice", text: "Rice", done: false },
  { id: "mushrooms", text: "Mushrooms", done: false },
  { id: "onions", text: "Onions", done: false },
  { id: "croissants", text: "Croissants", done: false },
];

const TodoScreen = ({ nav }) => {
  const [items, setItems] = React.useState(INITIAL_TODOS);
  const [expanded, setExpanded] = React.useState({ pancakes: true });
  const [tab, setTab] = React.useState("To-do-list");
  const [query, setQuery] = React.useState("");

  const toggle = (id) => setItems(items.map(it => {
    if (it.id === id) return { ...it, done: !it.done };
    if (it.children) return { ...it, children: it.children.map(c => c.id === id ? { ...c, done: !c.done } : c) };
    return it;
  }));
  const remove = (id) => setItems(items.filter(it => it.id !== id).map(it => it.children ? { ...it, children: it.children.filter(c => c.id !== id) } : it));

  const q = query.trim().toLowerCase();
  const match = (t) => !q || t.toLowerCase().includes(q);

  return (
    <div className="screen screen-todo">
      <StatusBar/>
      <AppHeader showDots/>
      <TabBar active={tab} onChange={setTab}/>
      <div className="todo-scroll">
        <div className="todo-list-title">Grocery shopping</div>
        <div className="search-wrap">
          <input className="search-input" placeholder="Search" value={query} onChange={(e)=>setQuery(e.target.value)}/>
          <span className="search-mag"><svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="7.5" cy="7.5" r="6"/><line x1="12" y1="12" x2="16.5" y2="16.5"/></svg></span>
        </div>
        <div className="todo-list">
          {items.map((it) => {
            if (it.isGroup) {
              const open = expanded[it.id];
              if (!match(it.text) && !it.children.some(c => match(c.text))) return null;
              return (
                <div key={it.id}>
                  <div className="todo-row">
                    <span className="drag-dots">⠿</span>
                    <button type="button" className={`check-box ${it.done ? "checked" : ""}`} onClick={() => toggle(it.id)}/>
                    <span className={`row-text ${it.done ? "done" : ""}`}>{it.text}</span>
                    <div className="row-actions">
                      <button type="button" className={`expand-arrow ${!open ? "collapsed" : ""}`} onClick={() => setExpanded({...expanded, [it.id]: !open})}>∨</button>
                      <button type="button" className="trash-btn" onClick={() => remove(it.id)}><TrashIcon/></button>
                    </div>
                  </div>
                  <div className={`group-children ${!open ? "collapsed" : ""}`}>
                    {it.children.filter(c => match(c.text)).map(c => (
                      <div key={c.id} className="todo-row sub-row">
                        <span className="drag-dots">⠿</span>
                        <button type="button" className={`check-box ${c.done ? "checked" : ""}`} onClick={() => toggle(c.id)}/>
                        <span className={`row-text ${c.done ? "done" : ""}`}>{c.text}</span>
                        <div className="row-actions">
                          <button type="button" className="trash-btn" onClick={() => remove(c.id)}><TrashIcon/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (!match(it.text)) return null;
            return (
              <div key={it.id} className="todo-row">
                <span className="drag-dots">⠿</span>
                <button type="button" className={`check-box ${it.done ? "checked" : ""}`} onClick={() => toggle(it.id)}/>
                <span className={`row-text ${it.done ? "done" : ""}`}>{it.text}</span>
                <div className="row-actions">
                  <button type="button" className="trash-btn" onClick={() => remove(it.id)}><TrashIcon/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {nav}
    </div>
  );
};

const LockScreen = () => {
  const [choice, setChoice] = React.useState(null);
  return (
    <div className="screen screen-lock">
      <StatusBar transparent/>
      <div className="lock-body">
        <div className="ios-lock-icon">
          <svg width="14" height="17" viewBox="0 0 14 17" fill="white"><path d="M7 0a4 4 0 014 4v3h1.2c.4 0 .8.4.8.9v8c0 .5-.4.9-.8.9H1.8c-.4 0-.8-.4-.8-.9V8c0-.5.4-.9.8-.9H3V4a4 4 0 014-4zm0 1.5A2.5 2.5 0 004.5 4v3h5V4A2.5 2.5 0 007 1.5z"/></svg>
        </div>
        <div className="ios-date">Monday, June 3</div>
        <div className="ios-clock">9:41</div>
        <div className="ios-notif-stack">
          <div className="ios-notif">
            <div className="ios-notif-head">
              <div className="ios-app-icon">ff</div>
              <span className="ios-app-name">focusforest</span>
              <span className="ios-ts">now</span>
            </div>
            <div className="ios-notif-title">Time for sports</div>
            <div className="ios-notif-body">You wanted to do sports today. Please choose from the below.</div>
          </div>
          <div className="ios-actions">
            <button type="button" className={`ios-action ${choice==="later"?"picked":""}`} onClick={()=>setChoice("later")}>I will do it later</button>
            <button type="button" className={`ios-action ${choice==="tracking"?"picked":""}`} onClick={()=>setChoice("tracking")}>Start tracking</button>
            <button type="button" className={`ios-action ${choice==="done"?"picked":""}`} onClick={()=>setChoice("done")}>I am done</button>
          </div>
        </div>
        <div className="ios-lock-bottom">
          <div className="ios-util-row">
            <button type="button" className="ios-util" aria-label="Flashlight"><svg width="23" height="23" viewBox="0 0 22 22" fill="white"><path d="M7.4 5h7.2l-1.1-2.4a1.2 1.2 0 00-1.1-.7H9.6a1.2 1.2 0 00-1.1.7L7.4 5zM6.8 6.4a.9.9 0 00-.3.7v1.5c0 .4.2.7.5.9l.6.3v9.6c0 1 .8 1.7 1.7 1.7h3.4c1 0 1.7-.8 1.7-1.7V9.8l.6-.3c.3-.2.5-.5.5-.9V7.1a.9.9 0 00-.3-.7H6.8z"/></svg></button>
            <button type="button" className="ios-util" aria-label="Camera"><svg width="22" height="20" viewBox="0 0 22 20" fill="white"><path d="M3 5h2.8l1.5-2.5h7.4L16.2 5H19a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm8 3.5a4 4 0 100 8 4 4 0 000-8z"/></svg></button>
          </div>
          <div className="ios-home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

window.HomeScreen = HomeScreen;
window.TodoScreen = TodoScreen;
window.LockScreen = LockScreen;
