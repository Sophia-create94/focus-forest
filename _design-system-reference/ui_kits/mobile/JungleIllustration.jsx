// JungleIllustration.jsx — flat-illustrated reward scene (toucan, frog, monkey, swaying trees)
const JungleIllustration = () => (
  <svg className="jungle-svg" viewBox="0 0 357 268" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="skyGrad" cx="50%" cy="100%" r="85%">
        <stop offset="0%" stopColor="#B0E0FF" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#4DA8D0" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="178" cy="268" rx="210" ry="192" fill="#87CEEB"/>
    <ellipse cx="178" cy="268" rx="210" ry="192" fill="url(#skyGrad)"/>
    <rect x="0" y="200" width="357" height="68" fill="#4FAC45"/>
    <ellipse cx="178" cy="200" rx="210" ry="14" fill="#3E9A35"/>
    <g opacity="0.75">
      <rect x="50" y="148" width="9" height="56" fill="#6B4226" rx="2"/>
      <ellipse cx="55" cy="136" rx="24" ry="22" fill="#2E7D2E"/>
      <ellipse cx="43" cy="145" rx="16" ry="15" fill="#388E3C"/>
      <ellipse cx="67" cy="141" rx="18" ry="16" fill="#388E3C"/>
    </g>
    <g opacity="0.75">
      <rect x="292" y="151" width="9" height="52" fill="#6B4226" rx="2"/>
      <ellipse cx="296" cy="140" rx="22" ry="20" fill="#2E7D2E"/>
      <ellipse cx="284" cy="149" rx="15" ry="14" fill="#388E3C"/>
      <ellipse cx="308" cy="146" rx="16" ry="15" fill="#388E3C"/>
    </g>
    <g className="t1">
      <rect x="87" y="120" width="12" height="84" fill="#7A4E2E" rx="3"/>
      <ellipse cx="93" cy="108" rx="34" ry="32" fill="#2A7330"/>
      <ellipse cx="76" cy="120" rx="24" ry="22" fill="#338A38"/>
      <ellipse cx="110" cy="116" rx="26" ry="23" fill="#338A38"/>
      <ellipse cx="93" cy="96" rx="22" ry="20" fill="#44A348"/>
    </g>
    <g className="t2">
      <rect x="163" y="92" width="14" height="112" fill="#7A4E2E" rx="3.5"/>
      <ellipse cx="170" cy="78" rx="42" ry="38" fill="#1F6B22"/>
      <ellipse cx="148" cy="92" rx="30" ry="27" fill="#2A7D30"/>
      <ellipse cx="192" cy="88" rx="32" ry="29" fill="#2A7D30"/>
      <ellipse cx="170" cy="63" rx="26" ry="23" fill="#39A33E"/>
    </g>
    <g className="t3">
      <rect x="244" y="124" width="12" height="79" fill="#7A4E2E" rx="3"/>
      <ellipse cx="250" cy="112" rx="32" ry="30" fill="#2A7330"/>
      <ellipse cx="233" cy="123" rx="22" ry="21" fill="#338A38"/>
      <ellipse cx="267" cy="119" rx="24" ry="22" fill="#338A38"/>
      <ellipse cx="250" cy="100" rx="21" ry="19" fill="#44A348"/>
    </g>
    <g className="bird-group" transform="translate(188, 78)">
      <rect x="-4" y="30" width="28" height="5" fill="#5C3A1E" rx="2.5"/>
      <ellipse cx="8" cy="20" rx="13" ry="10" fill="#1A3A5C"/>
      <ellipse cx="4" cy="22" rx="7" ry="6" fill="#FFFDE7"/>
      <circle cx="18" cy="12" r="9.5" fill="#111827"/>
      <path d="M26 9 Q44 8 43 15 Q42 20 26 18 Z" fill="#F6AE2D"/>
      <circle cx="22" cy="10" r="3" fill="white"/>
      <circle cx="22.5" cy="10" r="2" fill="#111"/>
    </g>
    <g transform="translate(112, 163)">
      <ellipse cx="12" cy="26" rx="12" ry="10" fill="#8D6E63"/>
      <circle cx="12" cy="12" r="11" fill="#8D6E63"/>
      <ellipse cx="12" cy="15" rx="8" ry="6" fill="#BCAAA4"/>
      <circle cx="1" cy="12" r="5" fill="#8D6E63"/>
      <circle cx="23" cy="12" r="5" fill="#8D6E63"/>
      <circle cx="8" cy="10" r="2.5" fill="#3E2723"/>
      <circle cx="16" cy="10" r="2.5" fill="#3E2723"/>
      <ellipse cx="12" cy="14" rx="2.5" ry="1.8" fill="#6D4C41"/>
    </g>
    <g transform="translate(255, 188)">
      <ellipse cx="10" cy="12" rx="16" ry="11" fill="#56C448"/>
      <ellipse cx="10" cy="4" rx="14" ry="10" fill="#66CC58"/>
      <g className="frog-eye">
        <ellipse cx="2" cy="-2" rx="6.5" ry="6" fill="#80D87A"/>
        <circle cx="2" cy="-2" r="4" fill="#111"/>
      </g>
      <g className="frog-eye">
        <ellipse cx="18" cy="-2" rx="6.5" ry="6" fill="#80D87A"/>
        <circle cx="18" cy="-2" r="4" fill="#111"/>
      </g>
      <path d="M3 8 Q10 12 17 8" stroke="#3E9B3E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

window.JungleIllustration = JungleIllustration;
