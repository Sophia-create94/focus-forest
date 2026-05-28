// App.jsx — interactive UI kit demo
const { useState } = React;

const SCREENS = [
  { key: "home", label: "Home Screen" },
  { key: "todo", label: "To-Do List" },
  { key: "lock", label: "Lock Reminder" },
];

const App = () => {
  const [screen, setScreen] = useState("home");
  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>🌿 Focus Forest UI Kit</h1>
        <p>Interactive iOS prototype · click sub-tabs · check todos · tap notification</p>
      </div>
      <div className="screen-tabs">
        {SCREENS.map(s => (
          <button key={s.key} type="button"
            className={`screen-tab ${screen === s.key ? "active" : ""}`}
            onClick={() => setScreen(s.key)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="iphone-frame">
        <div className="dynamic-island"/>
        <div className="iphone-screen">
          {screen === "home" && (
            <HomeScreen nav={<BottomNav active="home" onNav={(k)=> k==="events" && setScreen("todo")}/>}/>
          )}
          {screen === "todo" && (
            <TodoScreen nav={<BottomNav active="events" onNav={(k)=> k==="home" && setScreen("home")}/>}/>
          )}
          {screen === "lock" && <LockScreen/>}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
