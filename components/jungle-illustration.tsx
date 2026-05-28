export function JungleIllustration() {
  return (
    <svg
      viewBox="0 0 357 268"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="100%" r="85%">
          <stop offset="0%" stopColor="#B0E0FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4DA8D0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="178" cy="268" rx="210" ry="192" fill="#87CEEB" />
      <ellipse cx="178" cy="268" rx="210" ry="192" fill="url(#skyGrad)" />

      <rect x="0" y="200" width="357" height="68" fill="#4FAC45" />
      <ellipse cx="178" cy="200" rx="210" ry="14" fill="#3E9A35" />
      <ellipse cx="135" cy="203" rx="35" ry="4" fill="#3A9030" opacity="0.5" />
      <ellipse cx="240" cy="203" rx="28" ry="4" fill="#3A9030" opacity="0.5" />

      <g opacity="0.75">
        <rect x="50" y="148" width="9" height="56" fill="#6B4226" rx="2" />
        <ellipse cx="55" cy="136" rx="24" ry="22" fill="#2E7D2E" />
        <ellipse cx="43" cy="145" rx="16" ry="15" fill="#388E3C" />
        <ellipse cx="67" cy="141" rx="18" ry="16" fill="#388E3C" />
      </g>
      <g opacity="0.75">
        <rect x="292" y="151" width="9" height="52" fill="#6B4226" rx="2" />
        <ellipse cx="296" cy="140" rx="22" ry="20" fill="#2E7D2E" />
        <ellipse cx="284" cy="149" rx="15" ry="14" fill="#388E3C" />
        <ellipse cx="308" cy="146" rx="16" ry="15" fill="#388E3C" />
      </g>

      <g className="t1">
        <rect x="87" y="120" width="12" height="84" fill="#7A4E2E" rx="3" />
        <ellipse cx="93" cy="108" rx="34" ry="32" fill="#2A7330" />
        <ellipse cx="76" cy="120" rx="24" ry="22" fill="#338A38" />
        <ellipse cx="110" cy="116" rx="26" ry="23" fill="#338A38" />
        <ellipse cx="93" cy="96" rx="22" ry="20" fill="#44A348" />
        <ellipse cx="81" cy="103" rx="14" ry="13" fill="#3E9B3E" opacity="0.7" />
      </g>
      <g className="t2">
        <rect x="163" y="92" width="14" height="112" fill="#7A4E2E" rx="3.5" />
        <ellipse cx="170" cy="78" rx="42" ry="38" fill="#1F6B22" />
        <ellipse cx="148" cy="92" rx="30" ry="27" fill="#2A7D30" />
        <ellipse cx="192" cy="88" rx="32" ry="29" fill="#2A7D30" />
        <ellipse cx="170" cy="63" rx="26" ry="23" fill="#39A33E" />
        <ellipse cx="155" cy="74" rx="17" ry="16" fill="#35963A" opacity="0.75" />
        <ellipse cx="185" cy="72" rx="16" ry="15" fill="#35963A" opacity="0.75" />
      </g>
      <g className="t3">
        <rect x="244" y="124" width="12" height="79" fill="#7A4E2E" rx="3" />
        <ellipse cx="250" cy="112" rx="32" ry="30" fill="#2A7330" />
        <ellipse cx="233" cy="123" rx="22" ry="21" fill="#338A38" />
        <ellipse cx="267" cy="119" rx="24" ry="22" fill="#338A38" />
        <ellipse cx="250" cy="100" rx="21" ry="19" fill="#44A348" />
        <ellipse cx="259" cy="108" rx="13" ry="12" fill="#3E9B3E" opacity="0.7" />
      </g>

      {/* Toucan */}
      <g className="bird-group" transform="translate(188, 78)">
        <rect x="-4" y="30" width="28" height="5" fill="#5C3A1E" rx="2.5" />
        <path d="M-4 22 Q-16 28 -14 36" stroke="#D32F2F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M-5 24 Q-17 30 -15 38" stroke="#1565C0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="8" cy="20" rx="13" ry="10" fill="#1A3A5C" />
        <ellipse cx="9" cy="22" rx="9" ry="6" fill="#1D4B78" transform="rotate(-10 9 22)" />
        <ellipse cx="4" cy="22" rx="7" ry="6" fill="#FFFDE7" />
        <ellipse cx="5" cy="26" rx="6" ry="3" fill="#E53935" opacity="0.7" />
        <circle cx="18" cy="12" r="9.5" fill="#111827" />
        <path d="M26 9 Q44 8 43 15 Q42 20 26 18 Z" fill="#F6AE2D" />
        <path d="M26 9 Q44 8 43 15" stroke="#EB9C0A" strokeWidth="1" fill="none" />
        <path d="M26 9 Q40 8 43 11" stroke="#FFCA28" strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="22" cy="10" r="3" fill="white" />
        <circle cx="22.5" cy="10" r="2" fill="#111" />
        <circle cx="21.8" cy="9.2" r="0.7" fill="white" />
        <line x1="6" y1="35" x2="4" y2="42" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="42" x2="2" y2="44" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6" y1="42" x2="7" y2="45" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="35" x2="16" y2="42" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="42" x2="13" y2="44" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="16" y1="42" x2="18" y2="45" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Monkey */}
      <g transform="translate(112, 163)">
        <ellipse cx="12" cy="26" rx="12" ry="10" fill="#8D6E63" />
        <ellipse cx="4" cy="32" rx="6" ry="5" fill="#795548" transform="rotate(-20 4 32)" />
        <ellipse cx="20" cy="32" rx="6" ry="5" fill="#795548" transform="rotate(20 20 32)" />
        <path d="M0 22 Q-8 26 -10 32" stroke="#795548" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M24 22 Q32 26 34 32" stroke="#795548" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M24 28 Q36 24 38 34 Q40 42 30 40" stroke="#795548" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <ellipse cx="12" cy="15" rx="8" ry="6" fill="#BCAAA4" />
        <circle cx="1" cy="12" r="5" fill="#8D6E63" />
        <circle cx="1" cy="12" r="3" fill="#BCAAA4" />
        <circle cx="23" cy="12" r="5" fill="#8D6E63" />
        <circle cx="23" cy="12" r="3" fill="#BCAAA4" />
        <circle cx="8" cy="10" r="2.5" fill="#3E2723" />
        <circle cx="8.5" cy="9.5" r="0.8" fill="white" />
        <circle cx="16" cy="10" r="2.5" fill="#3E2723" />
        <circle cx="16.5" cy="9.5" r="0.8" fill="white" />
        <ellipse cx="12" cy="14" rx="2.5" ry="1.8" fill="#6D4C41" />
        <circle cx="11" cy="14" r="0.6" fill="#4E342E" />
        <circle cx="13" cy="14" r="0.6" fill="#4E342E" />
        <path d="M8 17 Q12 20 16 17" stroke="#5D4037" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* Frog */}
      <g transform="translate(255, 188)">
        <path d="M-8 16 Q-16 14 -18 22" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M28 16 Q36 14 38 22" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="10" cy="12" rx="16" ry="11" fill="#56C448" />
        <ellipse cx="10" cy="14" rx="10" ry="7" fill="#A5D6A7" />
        <path d="M-4 14 Q-10 18 -10 24" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M24 14 Q30 18 30 24" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="10" cy="4" rx="14" ry="10" fill="#66CC58" />
        <g className="frog-eye">
          <ellipse cx="2" cy="-2" rx="6.5" ry="6" fill="#80D87A" />
          <circle cx="2" cy="-2" r="4" fill="#111" />
          <circle cx="0.5" cy="-3.5" r="1.2" fill="white" />
        </g>
        <g className="frog-eye" style={{ animationDelay: "0.3s" }}>
          <ellipse cx="18" cy="-2" rx="6.5" ry="6" fill="#80D87A" />
          <circle cx="18" cy="-2" r="4" fill="#111" />
          <circle cx="16.5" cy="-3.5" r="1.2" fill="white" />
        </g>
        <circle cx="7" cy="4" r="1" fill="#3E9B3E" />
        <circle cx="13" cy="4" r="1" fill="#3E9B3E" />
        <path d="M3 8 Q10 12 17 8" stroke="#3E9B3E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      <path d="M18 200 Q20 191 22 200" fill="#5EB854" />
      <path d="M30 200 Q33 189 36 200" fill="#4FAC45" />
      <path d="M335 200 Q338 191 341 200" fill="#5EB854" />
      <path d="M345 200 Q347 192 350 200" fill="#4FAC45" />
      <path d="M195 200 Q197 193 199 200" fill="#5EB854" />

      <g transform="translate(35, 198)">
        <circle cx="0" cy="0" r="4.5" fill="#FFB300" opacity="0.9" />
        <circle cx="0" cy="0" r="2" fill="#FFF176" />
      </g>
      <g transform="translate(228, 198)">
        <circle cx="0" cy="0" r="3.8" fill="#FF7043" opacity="0.85" />
        <circle cx="0" cy="0" r="1.8" fill="#FFCC80" />
      </g>
      <g transform="translate(315, 200)">
        <circle cx="0" cy="0" r="3.5" fill="#EC407A" opacity="0.8" />
        <circle cx="0" cy="0" r="1.5" fill="#FCE4EC" />
      </g>
    </svg>
  );
}
