import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path, G, Text as T, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

// ── Alphabets Card — colorful ABC with cartoon animals ─────────────────────────
export function AlphabetsIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="abcbg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E8F5FF" />
          <Stop offset="100%" stopColor="#C5E8FF" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#abcbg)" />

      {/* grass */}
      <Ellipse cx="150" cy="198" rx="160" ry="24" fill="#7BE0AD" />
      <Ellipse cx="150" cy="195" rx="155" ry="18" fill="#A5D6A7" />

      {/* BIG A - red */}
      <G transform="rotate(-5 60 100)">
        <Path d="M30 145 L60 55 L90 145 Z" fill="#FF4444" stroke="#CC0000" strokeWidth="4" strokeLinejoin="round"/>
        <Rect x="42" y="112" width="36" height="14" rx="4" fill="#FF4444" stroke="#CC0000" strokeWidth="3"/>
        <Rect x="42" y="112" width="36" height="14" rx="4" fill="#fff" opacity="0.3"/>
        {/* face on A */}
        <Circle cx="52" cy="90" r="4" fill="#CC0000"/>
        <Circle cx="68" cy="90" r="4" fill="#CC0000"/>
        <Path d="M54 100 Q60 106 66 100" stroke="#CC0000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </G>

      {/* BIG B - blue */}
      <G transform="rotate(4 150 95)">
        <Rect x="115" y="55" width="16" height="90" rx="6" fill="#2196F3" stroke="#1565C0" strokeWidth="3"/>
        <Path d="M131 55 Q175 55 175 78 Q175 100 131 100 Z" fill="#2196F3" stroke="#1565C0" strokeWidth="3"/>
        <Path d="M131 100 Q180 100 180 123 Q180 145 131 145 Z" fill="#2196F3" stroke="#1565C0" strokeWidth="3"/>
        {/* shine */}
        <Ellipse cx="155" cy="72" rx="8" ry="5" fill="#fff" opacity="0.35" transform="rotate(-20 155 72)"/>
        <Ellipse cx="158" cy="118" rx="8" ry="5" fill="#fff" opacity="0.35" transform="rotate(-20 158 118)"/>
        {/* face */}
        <Circle cx="155" cy="118" r="3.5" fill="#1565C0"/>
        <Circle cx="168" cy="118" r="3.5" fill="#1565C0"/>
        <Path d="M155 126 Q162 131 169 126" stroke="#1565C0" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </G>

      {/* BIG C - green */}
      <G transform="rotate(-3 235 98)">
        <Path d="M265 68 Q215 50 205 98 Q195 145 245 148" stroke="#4CAF50" strokeWidth="28" fill="none" strokeLinecap="round"/>
        <Path d="M265 68 Q215 50 205 98 Q195 145 245 148" stroke="#66BB6A" strokeWidth="20" fill="none" strokeLinecap="round"/>
        {/* shine */}
        <Path d="M255 62 Q230 54 218 72" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* face */}
        <Circle cx="222" cy="88" r="4" fill="#2E7D32"/>
        <Circle cx="222" cy="108" r="4" fill="#2E7D32"/>
        <Path d="M218 98 Q215 100 218 102" stroke="#2E7D32" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </G>

      {/* small D - purple bottom left */}
      <G transform="translate(10,148) rotate(-8 25 22)">
        <Rect x="8" y="5" width="12" height="38" rx="5" fill="#9C27B0" stroke="#6A1B9A" strokeWidth="2.5"/>
        <Path d="M20 5 Q45 5 45 24 Q45 43 20 43 Z" fill="#9C27B0" stroke="#6A1B9A" strokeWidth="2.5"/>
        <Ellipse cx="33" cy="20" rx="5" ry="3" fill="#fff" opacity="0.3" transform="rotate(-20 33 20)"/>
      </G>

      {/* small E - orange bottom right */}
      <G transform="translate(250,148) rotate(6 25 22)">
        <Rect x="5" y="5" width="12" height="38" rx="5" fill="#FF9800" stroke="#E65100" strokeWidth="2.5"/>
        <Rect x="17" y="5" width="24" height="11" rx="5" fill="#FF9800" stroke="#E65100" strokeWidth="2.5"/>
        <Rect x="17" y="18" width="18" height="10" rx="4" fill="#FF9800" stroke="#E65100" strokeWidth="2.5"/>
        <Rect x="17" y="32" width="24" height="11" rx="5" fill="#FF9800" stroke="#E65100" strokeWidth="2.5"/>
      </G>

      {/* Stars */}
      <Path d="M15 30 L17.5 38 L26 38 L19 43 L22 51 L15 46 L8 51 L11 43 L4 38 L12.5 38 Z" fill="#FFE566" stroke="#F0A500" strokeWidth="1"/>
      <Path d="M278 20 L280 26 L286 26 L281 30 L283 36 L278 32 L273 36 L275 30 L270 26 L276 26 Z" fill="#FF9FD4" stroke="#E060A0" strokeWidth="1"/>
      <Circle cx="150" cy="22" r="6" fill="#FFE566" opacity="0.8"/>
      <Path d="M147 22 L150 15 L153 22 L160 22 L154 26 L156 33 L150 29 L144 33 L146 26 L140 22 Z" fill="#FFE566"/>
    </Svg>
  );
}

// ── Animals Card ───────────────────────────────────────────────────────────────
export function AnimalsIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="anbg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E8F5E9" />
          <Stop offset="100%" stopColor="#C8E6C9" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#anbg)" />
      <Ellipse cx="150" cy="196" rx="160" ry="22" fill="#A5D6A7"/>
      <Rect x="130" y="130" width="12" height="50" rx="6" fill="#795548"/>
      <Circle cx="136" cy="115" r="40" fill="#66BB6A"/>
      <Circle cx="110" cy="128" r="26" fill="#4CAF50"/>
      <Circle cx="162" cy="126" r="28" fill="#4CAF50"/>
      {/* Lion */}
      {[0,40,80,120,160,200,240,280,320].map((a,i)=>{
        const r=Math.PI*a/180;
        return <Ellipse key={i} cx={58+Math.cos(r)*24} cy={128+Math.sin(r)*24} rx="7" ry="11" fill="#E65100" transform={`rotate(${a} ${58+Math.cos(r)*24} ${128+Math.sin(r)*24})`} opacity="0.9"/>;
      })}
      <Circle cx="58" cy="128" r="26" fill="#FFB74D" stroke="#E65100" strokeWidth="2.5"/>
      <Circle cx="58" cy="115" r="17" fill="#FFD54F"/>
      <Circle cx="50" cy="112" r="4.5" fill="#37474F"/><Circle cx="51" cy="111" r="1.8" fill="#fff"/>
      <Circle cx="66" cy="112" r="4.5" fill="#37474F"/><Circle cx="67" cy="111" r="1.8" fill="#fff"/>
      <Ellipse cx="58" cy="120" rx="6" ry="4" fill="#FF8A65"/>
      <Path d="M52 125 Q58 131 64 125" stroke="#37474F" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {/* Elephant */}
      <Ellipse cx="168" cy="148" rx="38" ry="32" fill="#90A4AE"/>
      <Circle cx="168" cy="120" r="24" fill="#90A4AE"/>
      <Ellipse cx="155" cy="112" rx="11" ry="15" fill="#90A4AE"/>
      <Ellipse cx="181" cy="112" rx="11" ry="15" fill="#B0BEC5"/>
      <Path d="M168 134 Q163 150 161 162 Q160 167 165 167" stroke="#78909C" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <Circle cx="160" cy="116" r="4.5" fill="#37474F"/><Circle cx="161" cy="115" r="1.8" fill="#fff"/>
      <Circle cx="176" cy="116" r="4.5" fill="#37474F"/><Circle cx="177" cy="115" r="1.8" fill="#fff"/>
      {/* Giraffe */}
      <Rect x="248" y="72" width="18" height="72" rx="9" fill="#FFD54F"/>
      {[[252,80],[258,95],[250,110],[260,124]].map(([x,y],i)=>
        <Ellipse key={i} cx={x} cy={y} rx="4" ry="5" fill="#E65100" opacity="0.7"/>
      )}
      <Ellipse cx="257" cy="65" rx="16" ry="18" fill="#FFD54F"/>
      <Ellipse cx="249" cy="56" rx="3" ry="5" fill="#795548"/>
      <Ellipse cx="265" cy="56" rx="3" ry="5" fill="#795548"/>
      <Circle cx="251" cy="62" r="3.5" fill="#37474F"/><Circle cx="252" cy="61" r="1.5" fill="#fff"/>
      <Circle cx="263" cy="62" r="3.5" fill="#37474F"/><Circle cx="264" cy="61" r="1.5" fill="#fff"/>
      <Path d="M253 70 Q257 75 261 70" stroke="#37474F" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </Svg>
  );
}

// ── Music Card ─────────────────────────────────────────────────────────────────
export function MusicIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="mubg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFF9C4" />
          <Stop offset="100%" stopColor="#FFE082" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#mubg)" />
      <T x="25" y="58" fontSize="38" fill="#FF6B6B" opacity="0.9">♪</T>
      <T x="228" y="48" fontSize="46" fill="#3FB5FF" opacity="0.9">♫</T>
      <T x="138" y="38" fontSize="30" fill="#B68CFF" opacity="0.85">♩</T>
      <T x="258" y="118" fontSize="34" fill="#7BE0AD" opacity="0.9">♬</T>
      <T x="8" y="138" fontSize="28" fill="#FFB74D" opacity="0.85">♪</T>
      <Circle cx="90" cy="90" r="22" fill="#FFCCBC"/>
      <Path d="M68 75 Q75 60 90 68 Q105 60 112 75 Q105 72 90 72 Q75 72 68 75 Z" fill="#5D4037"/>
      <Circle cx="83" cy="87" r="4" fill="#37474F"/><Circle cx="84" cy="86" r="1.8" fill="#fff"/>
      <Circle cx="97" cy="87" r="4" fill="#37474F"/><Circle cx="98" cy="86" r="1.8" fill="#fff"/>
      <Circle cx="76" cy="92" r="6" fill="#FF6B6B" opacity="0.4"/>
      <Circle cx="104" cy="92" r="6" fill="#FF6B6B" opacity="0.4"/>
      <Path d="M84 97 Q90 103 96 97" stroke="#37474F" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <Rect x="78" y="112" width="24" height="34" rx="8" fill="#FF6B6B"/>
      <Path d="M78 120 Q58 130 53 148" stroke="#FFCCBC" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M102 120 Q124 126 129 146" stroke="#FFCCBC" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M80 146 Q78 166 72 176" stroke="#3FB5FF" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M100 146 Q102 162 110 172" stroke="#3FB5FF" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Circle cx="200" cy="95" r="22" fill="#FFE0B2"/>
      <Ellipse cx="200" cy="79" rx="14" ry="8" fill="#795548"/>
      <Circle cx="193" cy="92" r="4" fill="#37474F"/><Circle cx="194" cy="91" r="1.8" fill="#fff"/>
      <Circle cx="207" cy="92" r="4" fill="#37474F"/><Circle cx="208" cy="91" r="1.8" fill="#fff"/>
      <Circle cx="186" cy="98" r="6" fill="#FF6B6B" opacity="0.4"/>
      <Circle cx="214" cy="98" r="6" fill="#FF6B6B" opacity="0.4"/>
      <Path d="M193 101 Q200 107 207 101" stroke="#37474F" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <Rect x="188" y="117" width="24" height="34" rx="8" fill="#7BE0AD"/>
      <Path d="M188 125 Q168 132 162 150" stroke="#FFE0B2" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M212 125 Q230 128 236 146" stroke="#FFE0B2" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M190 151 Q188 170 183 178" stroke="#FFD54F" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M210 151 Q213 166 220 175" stroke="#FFD54F" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <Path d="M150 158 L153 168 L163 168 L155 174 L158 184 L150 178 L142 184 L145 174 L137 168 L147 168 Z" fill="#FFE566"/>
    </Svg>
  );
}

// ── Stories Card ───────────────────────────────────────────────────────────────
export function StoriesIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="stbg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E3F2FD" />
          <Stop offset="100%" stopColor="#90CAF9" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#stbg)" />
      <Rect x="130" y="100" width="14" height="80" rx="7" fill="#795548"/>
      <Circle cx="137" cy="82" r="52" fill="#66BB6A"/>
      <Circle cx="112" cy="98" r="33" fill="#4CAF50"/>
      <Circle cx="162" cy="96" r="36" fill="#4CAF50"/>
      <Ellipse cx="150" cy="193" rx="155" ry="18" fill="#A5D6A7"/>
      <Circle cx="85" cy="148" r="18" fill="#FFCCBC"/>
      <Path d="M67 136 Q74 122 85 129 Q96 122 103 136 Q96 133 85 133 Q74 133 67 136 Z" fill="#5D4037"/>
      <Circle cx="79" cy="146" r="3.5" fill="#37474F"/><Circle cx="80" cy="145" r="1.5" fill="#fff"/>
      <Circle cx="91" cy="146" r="3.5" fill="#37474F"/><Circle cx="92" cy="145" r="1.5" fill="#fff"/>
      <Path d="M80 153 Q85 158 90 153" stroke="#37474F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <Rect x="73" y="166" width="24" height="18" rx="6" fill="#FF6B6B"/>
      <Rect x="62" y="180" width="42" height="24" rx="5" fill="#fff" stroke="#ddd" strokeWidth="2"/>
      <Rect x="82" y="180" width="2" height="24" fill="#ddd"/>
      <Path d="M67 188 L78 188 M67 194 L78 194" stroke="#B68CFF" strokeWidth="1.5" strokeLinecap="round"/>
      <Circle cx="210" cy="150" r="18" fill="#FFE0B2"/>
      <Ellipse cx="210" cy="134" rx="14" ry="8" fill="#795548"/>
      <Circle cx="204" cy="148" r="3.5" fill="#37474F"/><Circle cx="205" cy="147" r="1.5" fill="#fff"/>
      <Circle cx="216" cy="148" r="3.5" fill="#37474F"/><Circle cx="217" cy="147" r="1.5" fill="#fff"/>
      <Path d="M205 156 Q210 161 215 156" stroke="#37474F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <Rect x="198" y="168" width="24" height="18" rx="6" fill="#3FB5FF"/>
      <Rect x="188" y="182" width="42" height="24" rx="5" fill="#FFF9C4" stroke="#ddd" strokeWidth="2"/>
      <Rect x="208" y="182" width="2" height="24" fill="#ddd"/>
      <Path d="M40 25 L43 34 L52 34 L45 40 L48 49 L40 43 L32 49 L35 40 L28 34 L37 34 Z" fill="#FFE566" opacity="0.9"/>
      <Circle cx="20" cy="20" r="12" fill="#FFE566" opacity="0.8"/>
    </Svg>
  );
}

// ── Coloring Card ──────────────────────────────────────────────────────────────
export function ColoringIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="cobg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E0F7FA" />
          <Stop offset="100%" stopColor="#80DEEA" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#cobg)" />
      {[[20,30,10],[60,20,7],[250,25,9],[280,40,6],[10,100,8],[290,110,7]].map(([x,y,r],i)=>
        <Circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.4"/>
      )}
      <Ellipse cx="90" cy="108" rx="48" ry="36" fill="#FF7043"/>
      <Ellipse cx="90" cy="108" rx="36" ry="26" fill="#FF8C00"/>
      <Rect x="76" y="78" width="12" height="60" rx="6" fill="#fff" opacity="0.8"/>
      <Rect x="98" y="76" width="10" height="64" rx="5" fill="#fff" opacity="0.7"/>
      <Path d="M138 92 L162 76 L162 132 L138 118 Z" fill="#FF7043"/>
      <Circle cx="72" cy="100" r="7" fill="#fff"/>
      <Circle cx="73" cy="99" r="4" fill="#1a1a1a"/><Circle cx="74" cy="98" r="1.5" fill="#fff"/>
      <Path d="M200 52 Q215 57 210 77 Q205 97 215 112 Q225 127 215 147 Q205 162 210 177" stroke="#FF9FD4" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <Circle cx="205" cy="47" r="18" fill="#FF9FD4"/>
      <Circle cx="198" cy="42" r="5" fill="#1a1a1a"/><Circle cx="199" cy="41" r="2" fill="#fff"/>
      <Path d="M194 32 L198 24 L202 30 L206 20 L210 30 L214 24 L218 32 Z" fill="#FFE566" stroke="#F0A500" strokeWidth="1.5"/>
      <Path d="M30 200 Q30 172 40 157 Q50 142 45 127 Q55 148 70 140 Q76 122 70 110 Q76 128 88 130 Q82 200 30 200 Z" fill="#FF7043" opacity="0.75"/>
      <Path d="M238 200 Q244 177 254 162 Q264 147 257 132 Q265 152 278 144 Q282 200 238 200 Z" fill="#7BE0AD" opacity="0.8"/>
      {[[112,42],[160,62],[176,32]].map(([x,y],i)=>
        <Circle key={i} cx={x} cy={y} r={8} fill="none" stroke="#fff" strokeWidth="2" opacity="0.6"/>
      )}
    </Svg>
  );
}

// ── Numbers Card — cute number faces ──────────────────────────────────────────
export function NumbersIllustration({ w = 300, h = 200 }: { w?: number; h?: number }) {
  const row1 = [
    { n:'1', x:18,  y:18,  bg:'#FF4444', tc:'#fff' },
    { n:'2', x:78,  y:10,  bg:'#FF69B4', tc:'#fff' },
    { n:'3', x:138, y:14,  bg:'#FFD700', tc:'#2D2A4A' },
    { n:'4', x:198, y:10,  bg:'#4CAF50', tc:'#fff' },
    { n:'5', x:248, y:18,  bg:'#2196F3', tc:'#fff' },
  ];
  const row2 = [
    { n:'6', x:18,  y:108, bg:'#9C27B0', tc:'#fff' },
    { n:'7', x:78,  y:100, bg:'#FF9800', tc:'#fff' },
    { n:'8', x:138, y:104, bg:'#00BCD4', tc:'#fff' },
    { n:'9', x:198, y:100, bg:'#FF4444', tc:'#fff' },
    { n:'0', x:248, y:108, bg:'#4CAF50', tc:'#fff' },
  ];
  return (
    <Svg width={w} height={h} viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="nubg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFDE7" />
          <Stop offset="100%" stopColor="#FFF9C4" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="200" fill="url(#nubg)" />
      {[...row1, ...row2].map(({ n, x, y, bg, tc }, i) => (
        <G key={i}>
          {/* shadow */}
          <Circle cx={x + 26} cy={y + 34} r={26} fill="#00000018"/>
          {/* circle */}
          <Circle cx={x + 26} cy={y + 28} r={26} fill={bg}/>
          {/* shine */}
          <Ellipse cx={x + 18} cy={y + 16} rx={9} ry={6} fill="#ffffff40" transform={`rotate(-30 ${x+18} ${y+16})`}/>
          {/* number */}
          <T x={x + 26} y={y + 36} textAnchor="middle" fontSize="26" fontWeight="900" fill={tc}>{n}</T>
          {/* eyes */}
          <Circle cx={x + 18} cy={y + 20} r={3.5} fill={tc} opacity="0.7"/>
          <Circle cx={x + 34} cy={y + 20} r={3.5} fill={tc} opacity="0.7"/>
          {/* smile */}
          <Path d={`M ${x+18} ${y+26} Q ${x+26} ${y+33} ${x+34} ${y+26}`} stroke={tc} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
        </G>
      ))}
    </Svg>
  );
}
