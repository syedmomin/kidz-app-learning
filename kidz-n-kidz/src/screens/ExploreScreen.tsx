import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Star } from '../components/Icons';
import { C } from '../theme';
import type { ScreenProps, RootStackParamList } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

// ── SVG strings ───────────────────────────────────────────────────────────────

const svgLetters = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8F5FF"/><stop offset="100%" stop-color="#C5E8FF"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#bg)"/>
  <ellipse cx="150" cy="198" rx="160" ry="24" fill="#7BE0AD"/>
  <g transform="rotate(-5 60 100)">
    <path d="M28 148 L60 52 L92 148 Z" fill="#FF3333" stroke="#BB0000" stroke-width="4" stroke-linejoin="round"/>
    <rect x="41" y="110" width="38" height="15" rx="5" fill="#FF3333" stroke="#BB0000" stroke-width="3"/>
    <rect x="41" y="110" width="38" height="15" rx="5" fill="white" opacity="0.25"/>
    <ellipse cx="60" cy="78" rx="18" ry="6" fill="white" opacity="0.2" transform="rotate(-10 60 78)"/>
    <circle cx="50" cy="92" r="4" fill="#880000"/>
    <circle cx="70" cy="92" r="4" fill="#880000"/>
    <path d="M52 102 Q60 109 68 102" stroke="#880000" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="rotate(3 150 100)">
    <rect x="114" y="52" width="18" height="95" rx="7" fill="#1E88E5" stroke="#0D47A1" stroke-width="3"/>
    <path d="M132 52 Q178 52 178 76 Q178 100 132 100 Z" fill="#1E88E5" stroke="#0D47A1" stroke-width="3"/>
    <path d="M132 100 Q182 100 182 124 Q182 148 132 148 Z" fill="#1E88E5" stroke="#0D47A1" stroke-width="3"/>
    <ellipse cx="156" cy="70" rx="10" ry="6" fill="white" opacity="0.3" transform="rotate(-20 156 70)"/>
    <ellipse cx="160" cy="118" rx="10" ry="6" fill="white" opacity="0.3" transform="rotate(-20 160 118)"/>
    <circle cx="156" cy="120" r="3.5" fill="#0D47A1"/>
    <circle cx="170" cy="120" r="3.5" fill="#0D47A1"/>
    <path d="M156 128 Q163 134 170 128" stroke="#0D47A1" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="rotate(-4 235 100)">
    <path d="M268 65 Q212 46 202 98 Q192 150 248 150" stroke="#388E3C" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M268 65 Q212 46 202 98 Q192 150 248 150" stroke="#66BB6A" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M258 58 Q228 50 215 70" stroke="white" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.35"/>
  </g>
  <g transform="translate(8 148) rotate(-10 26 24)">
    <rect x="6" y="4" width="14" height="40" rx="6" fill="#8E24AA" stroke="#4A148C" stroke-width="2.5"/>
    <path d="M20 4 Q48 4 48 24 Q48 44 20 44 Z" fill="#8E24AA" stroke="#4A148C" stroke-width="2.5"/>
    <ellipse cx="34" cy="18" rx="6" ry="4" fill="white" opacity="0.25" transform="rotate(-20 34 18)"/>
  </g>
  <g transform="translate(248 148) rotate(7 26 24)">
    <rect x="4" y="4" width="14" height="40" rx="6" fill="#F57C00" stroke="#BF360C" stroke-width="2.5"/>
    <rect x="18" y="4" width="26" height="12" rx="6" fill="#F57C00" stroke="#BF360C" stroke-width="2.5"/>
    <rect x="18" y="18" width="20" height="10" rx="4" fill="#F57C00" stroke="#BF360C" stroke-width="2.5"/>
    <rect x="18" y="32" width="26" height="12" rx="6" fill="#F57C00" stroke="#BF360C" stroke-width="2.5"/>
  </g>
  <path d="M14 28 L17 37 L26 37 L19 43 L22 52 L14 46 L6 52 L9 43 L2 37 L11 37 Z" fill="#FFE566"/>
  <path d="M280 18 L282 25 L289 25 L283 30 L286 37 L280 32 L274 37 L277 30 L271 25 L278 25 Z" fill="#FF9FD4"/>
  <path d="M148 20 L151 13 L154 20 L161 20 L155 24 L158 32 L151 27 L144 32 L147 24 L141 20 Z" fill="#FFE566"/>
</svg>`;

const svgAnimals = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="an" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8F5E9"/><stop offset="100%" stop-color="#C8E6C9"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#an)"/>
  <ellipse cx="150" cy="196" rx="160" ry="22" fill="#A5D6A7"/>
  <rect x="130" y="130" width="12" height="50" rx="6" fill="#795548"/>
  <circle cx="136" cy="115" r="40" fill="#66BB6A"/>
  <circle cx="110" cy="128" r="26" fill="#4CAF50"/>
  <circle cx="162" cy="126" r="28" fill="#4CAF50"/>
  <circle cx="58" cy="138" r="30" fill="#E65100" opacity="0.85"/>
  <circle cx="58" cy="128" r="26" fill="#FFB74D" stroke="#E65100" stroke-width="2.5"/>
  <circle cx="58" cy="115" r="17" fill="#FFD54F"/>
  <circle cx="50" cy="112" r="4.5" fill="#37474F"/><circle cx="51" cy="111" r="1.8" fill="white"/>
  <circle cx="66" cy="112" r="4.5" fill="#37474F"/><circle cx="67" cy="111" r="1.8" fill="white"/>
  <ellipse cx="58" cy="120" rx="6" ry="4" fill="#FF8A65"/>
  <path d="M52 125 Q58 131 64 125" stroke="#37474F" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="168" cy="148" rx="38" ry="32" fill="#90A4AE"/>
  <circle cx="168" cy="120" r="24" fill="#90A4AE"/>
  <ellipse cx="155" cy="112" rx="11" ry="15" fill="#90A4AE"/>
  <ellipse cx="181" cy="112" rx="11" ry="15" fill="#B0BEC5"/>
  <path d="M168 134 Q163 150 161 162 Q160 167 165 167" stroke="#78909C" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="160" cy="116" r="4.5" fill="#37474F"/><circle cx="161" cy="115" r="1.8" fill="white"/>
  <circle cx="176" cy="116" r="4.5" fill="#37474F"/><circle cx="177" cy="115" r="1.8" fill="white"/>
  <rect x="248" y="72" width="18" height="72" rx="9" fill="#FFD54F"/>
  <ellipse cx="252" cy="80" rx="4" ry="5" fill="#E65100" opacity="0.7"/>
  <ellipse cx="258" cy="95" rx="4" ry="5" fill="#E65100" opacity="0.7"/>
  <ellipse cx="250" cy="110" rx="4" ry="5" fill="#E65100" opacity="0.7"/>
  <ellipse cx="260" cy="124" rx="4" ry="5" fill="#E65100" opacity="0.7"/>
  <ellipse cx="257" cy="65" rx="16" ry="18" fill="#FFD54F"/>
  <ellipse cx="249" cy="56" rx="3" ry="5" fill="#795548"/>
  <ellipse cx="265" cy="56" rx="3" ry="5" fill="#795548"/>
  <circle cx="251" cy="62" r="3.5" fill="#37474F"/><circle cx="252" cy="61" r="1.5" fill="white"/>
  <circle cx="263" cy="62" r="3.5" fill="#37474F"/><circle cx="264" cy="61" r="1.5" fill="white"/>
  <path d="M253 70 Q257 75 261 70" stroke="#37474F" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

const svgMusic = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="mu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF9C4"/><stop offset="100%" stop-color="#FFE082"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#mu)"/>
  <text x="25" y="58" font-size="38" fill="#FF6B6B" opacity="0.9">&#9834;</text>
  <text x="228" y="48" font-size="46" fill="#3FB5FF" opacity="0.9">&#9835;</text>
  <text x="138" y="38" font-size="30" fill="#B68CFF" opacity="0.85">&#9833;</text>
  <text x="258" y="118" font-size="34" fill="#7BE0AD" opacity="0.9">&#9836;</text>
  <circle cx="90" cy="90" r="22" fill="#FFCCBC"/>
  <path d="M68 75 Q75 60 90 68 Q105 60 112 75 Q105 72 90 72 Q75 72 68 75 Z" fill="#5D4037"/>
  <circle cx="83" cy="87" r="4" fill="#37474F"/><circle cx="84" cy="86" r="1.8" fill="white"/>
  <circle cx="97" cy="87" r="4" fill="#37474F"/><circle cx="98" cy="86" r="1.8" fill="white"/>
  <circle cx="76" cy="92" r="6" fill="#FF6B6B" opacity="0.4"/>
  <circle cx="104" cy="92" r="6" fill="#FF6B6B" opacity="0.4"/>
  <path d="M84 97 Q90 103 96 97" stroke="#37474F" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="78" y="112" width="24" height="34" rx="8" fill="#FF6B6B"/>
  <path d="M78 120 Q58 130 53 148" stroke="#FFCCBC" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M102 120 Q124 126 129 146" stroke="#FFCCBC" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M80 146 Q78 166 72 176" stroke="#3FB5FF" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M100 146 Q102 162 110 172" stroke="#3FB5FF" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="200" cy="95" r="22" fill="#FFE0B2"/>
  <ellipse cx="200" cy="79" rx="14" ry="8" fill="#795548"/>
  <circle cx="193" cy="92" r="4" fill="#37474F"/><circle cx="194" cy="91" r="1.8" fill="white"/>
  <circle cx="207" cy="92" r="4" fill="#37474F"/><circle cx="208" cy="91" r="1.8" fill="white"/>
  <circle cx="186" cy="98" r="6" fill="#FF6B6B" opacity="0.4"/>
  <circle cx="214" cy="98" r="6" fill="#FF6B6B" opacity="0.4"/>
  <path d="M193 101 Q200 107 207 101" stroke="#37474F" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="188" y="117" width="24" height="34" rx="8" fill="#7BE0AD"/>
  <path d="M188 125 Q168 132 162 150" stroke="#FFE0B2" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M212 125 Q230 128 236 146" stroke="#FFE0B2" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M190 151 Q188 170 183 178" stroke="#FFD54F" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M210 151 Q213 166 220 175" stroke="#FFD54F" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M150 158 L153 168 L163 168 L155 174 L158 184 L150 178 L142 184 L145 174 L137 168 L147 168 Z" fill="#FFE566"/>
</svg>`;

const svgStories = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="st" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E3F2FD"/><stop offset="100%" stop-color="#90CAF9"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#st)"/>
  <rect x="130" y="100" width="14" height="80" rx="7" fill="#795548"/>
  <circle cx="137" cy="82" r="52" fill="#66BB6A"/>
  <circle cx="112" cy="98" r="33" fill="#4CAF50"/>
  <circle cx="162" cy="96" r="36" fill="#4CAF50"/>
  <ellipse cx="150" cy="193" rx="155" ry="18" fill="#A5D6A7"/>
  <circle cx="85" cy="148" r="18" fill="#FFCCBC"/>
  <path d="M67 136 Q74 122 85 129 Q96 122 103 136 Q96 133 85 133 Q74 133 67 136 Z" fill="#5D4037"/>
  <circle cx="79" cy="146" r="3.5" fill="#37474F"/><circle cx="80" cy="145" r="1.5" fill="white"/>
  <circle cx="91" cy="146" r="3.5" fill="#37474F"/><circle cx="92" cy="145" r="1.5" fill="white"/>
  <path d="M80 153 Q85 158 90 153" stroke="#37474F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <rect x="73" y="166" width="24" height="18" rx="6" fill="#FF6B6B"/>
  <rect x="62" y="180" width="42" height="22" rx="5" fill="white" stroke="#ddd" stroke-width="2"/>
  <rect x="82" y="180" width="2" height="22" fill="#ddd"/>
  <path d="M67 188 L78 188 M67 194 L78 194" stroke="#B68CFF" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="210" cy="150" r="18" fill="#FFE0B2"/>
  <ellipse cx="210" cy="134" rx="14" ry="8" fill="#795548"/>
  <circle cx="204" cy="148" r="3.5" fill="#37474F"/><circle cx="205" cy="147" r="1.5" fill="white"/>
  <circle cx="216" cy="148" r="3.5" fill="#37474F"/><circle cx="217" cy="147" r="1.5" fill="white"/>
  <path d="M205 156 Q210 161 215 156" stroke="#37474F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <rect x="198" y="168" width="24" height="18" rx="6" fill="#3FB5FF"/>
  <rect x="188" y="182" width="42" height="22" rx="5" fill="#FFF9C4" stroke="#ddd" stroke-width="2"/>
  <rect x="208" y="182" width="2" height="22" fill="#ddd"/>
  <path d="M40 25 L43 34 L52 34 L45 40 L48 49 L40 43 L32 49 L35 40 L28 34 L37 34 Z" fill="#FFE566" opacity="0.9"/>
  <circle cx="20" cy="20" r="12" fill="#FFE566" opacity="0.8"/>
</svg>`;

const svgColoring = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="co" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E0F7FA"/><stop offset="100%" stop-color="#80DEEA"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#co)"/>
  <circle cx="20" cy="30" r="10" fill="white" opacity="0.4"/>
  <circle cx="60" cy="20" r="7" fill="white" opacity="0.4"/>
  <circle cx="250" cy="25" r="9" fill="white" opacity="0.4"/>
  <circle cx="280" cy="40" r="6" fill="white" opacity="0.4"/>
  <ellipse cx="90" cy="108" rx="48" ry="36" fill="#FF7043"/>
  <ellipse cx="90" cy="108" rx="36" ry="26" fill="#FF8C00"/>
  <rect x="76" y="78" width="12" height="60" rx="6" fill="white" opacity="0.8"/>
  <rect x="98" y="76" width="10" height="64" rx="5" fill="white" opacity="0.7"/>
  <path d="M138 92 L162 76 L162 132 L138 118 Z" fill="#FF7043"/>
  <circle cx="72" cy="100" r="7" fill="white"/>
  <circle cx="73" cy="99" r="4" fill="#1a1a1a"/><circle cx="74" cy="98" r="1.5" fill="white"/>
  <path d="M200 52 Q215 57 210 77 Q205 97 215 112 Q225 127 215 147 Q205 162 210 177" stroke="#FF9FD4" stroke-width="16" fill="none" stroke-linecap="round"/>
  <circle cx="205" cy="47" r="18" fill="#FF9FD4"/>
  <circle cx="198" cy="42" r="5" fill="#1a1a1a"/><circle cx="199" cy="41" r="2" fill="white"/>
  <path d="M194 32 L198 24 L202 30 L206 20 L210 30 L214 24 L218 32 Z" fill="#FFE566" stroke="#F0A500" stroke-width="1.5"/>
  <path d="M30 200 Q30 172 40 157 Q50 142 45 127 Q55 148 70 140 Q76 122 70 110 Q76 128 88 130 Q82 200 30 200 Z" fill="#FF7043" opacity="0.75"/>
  <path d="M238 200 Q244 177 254 162 Q264 147 257 132 Q265 152 278 144 Q282 200 238 200 Z" fill="#7BE0AD" opacity="0.8"/>
  <circle cx="112" cy="42" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
  <circle cx="160" cy="62" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
</svg>`;

const svgNumbers = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
  <defs><linearGradient id="nb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFDE7"/><stop offset="100%" stop-color="#FFF9C4"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#nb)"/>
  <circle cx="44" cy="46" r="26" fill="#FF3333"/><ellipse cx="36" cy="34" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 36 34)"/><text x="44" y="56" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">1</text><circle cx="36" cy="38" r="3.5" fill="white" opacity="0.7"/><circle cx="52" cy="38" r="3.5" fill="white" opacity="0.7"/><path d="M36 46 Q44 53 52 46" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="104" cy="36" r="26" fill="#FF69B4"/><ellipse cx="96" cy="24" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 96 24)"/><text x="104" y="46" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">2</text><circle cx="96" cy="28" r="3.5" fill="white" opacity="0.7"/><circle cx="112" cy="28" r="3.5" fill="white" opacity="0.7"/><path d="M96 36 Q104 43 112 36" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="164" cy="42" r="26" fill="#FFD700"/><ellipse cx="156" cy="30" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 156 30)"/><text x="164" y="52" text-anchor="middle" font-size="28" font-weight="900" fill="#333" font-family="Arial">3</text><circle cx="156" cy="34" r="3.5" fill="#333" opacity="0.5"/><circle cx="172" cy="34" r="3.5" fill="#333" opacity="0.5"/><path d="M156 42 Q164 49 172 42" stroke="#333" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.5"/>
  <circle cx="224" cy="36" r="26" fill="#4CAF50"/><ellipse cx="216" cy="24" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 216 24)"/><text x="224" y="46" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">4</text><circle cx="216" cy="28" r="3.5" fill="white" opacity="0.7"/><circle cx="232" cy="28" r="3.5" fill="white" opacity="0.7"/><path d="M216 36 Q224 43 232 36" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="276" cy="44" r="22" fill="#2196F3"/><ellipse cx="269" cy="33" rx="7" ry="5" fill="white" opacity="0.25" transform="rotate(-30 269 33)"/><text x="276" y="53" text-anchor="middle" font-size="24" font-weight="900" fill="white" font-family="Arial">5</text>
  <circle cx="44" cy="138" r="26" fill="#9C27B0"/><ellipse cx="36" cy="126" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 36 126)"/><text x="44" y="148" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">6</text><circle cx="36" cy="130" r="3.5" fill="white" opacity="0.7"/><circle cx="52" cy="130" r="3.5" fill="white" opacity="0.7"/><path d="M36 138 Q44 145 52 138" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="104" cy="130" r="26" fill="#FF9800"/><ellipse cx="96" cy="118" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 96 118)"/><text x="104" y="140" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">7</text><circle cx="96" cy="122" r="3.5" fill="white" opacity="0.7"/><circle cx="112" cy="122" r="3.5" fill="white" opacity="0.7"/><path d="M96 130 Q104 137 112 130" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="164" cy="134" r="26" fill="#00BCD4"/><ellipse cx="156" cy="122" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 156 122)"/><text x="164" y="144" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">8</text><circle cx="156" cy="126" r="3.5" fill="white" opacity="0.7"/><circle cx="172" cy="126" r="3.5" fill="white" opacity="0.7"/><path d="M156 134 Q164 141 172 134" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="224" cy="130" r="26" fill="#F44336"/><ellipse cx="216" cy="118" rx="9" ry="6" fill="white" opacity="0.25" transform="rotate(-30 216 118)"/><text x="224" y="140" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial">9</text><circle cx="216" cy="122" r="3.5" fill="white" opacity="0.7"/><circle cx="232" cy="122" r="3.5" fill="white" opacity="0.7"/><path d="M216 130 Q224 137 232 130" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="276" cy="138" r="22" fill="#4CAF50"/><ellipse cx="269" cy="127" rx="7" ry="5" fill="white" opacity="0.25" transform="rotate(-30 269 127)"/><text x="276" y="147" text-anchor="middle" font-size="24" font-weight="900" fill="white" font-family="Arial">0</text>
</svg>`;

// ── Card spec ─────────────────────────────────────────────────────────────────

type CardSpec = {
  label: string;
  route: keyof RootStackParamList;
  badge?: string;
  accent: string;
  xml: string;
};

const CARDS: CardSpec[] = [
  { label: 'Alphabets', route: 'Category',   accent: '#E3F2FD', xml: svgLetters  },
  { label: 'Animals',   route: 'WordMatch',  accent: '#E8F5E9', xml: svgAnimals, badge: 'NEW' },
  { label: 'Music',     route: 'ColorMatch', accent: '#FFF9C4', xml: svgMusic    },
  { label: 'Stories',   route: 'Story',      accent: '#DDEEFF', xml: svgStories  },
  { label: 'Coloring',  route: 'Games',      accent: '#E0F7FA', xml: svgColoring },
  { label: 'Numbers',   route: 'Numbers',    accent: '#FFFDE7', xml: svgNumbers  },
];

// ── Card component ────────────────────────────────────────────────────────────

function Card({ spec, onPress }: { spec: CardSpec; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <View style={s.illusBox}>
        <SvgXml xml={spec.xml} width="100%" height={130} />
      </View>
      <View style={[s.cardFooter, { backgroundColor: spec.accent }]}>
        <Text style={s.cardLabel}>{spec.label}</Text>
      </View>
      {spec.badge && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{spec.badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  useEffect(() => { touchStreak(); }, []);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.appName}>KidzNKidz ✨</Text>
          <Text style={s.greeting}>What do you want to learn today?</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
            <Star size={16} /><Text style={s.chipText}>{p.stars}</Text>
          </Pressable>
          <Pressable style={[s.chip, { backgroundColor: '#FFD6F0' }]} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 15 }}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.searchBar}>
        <Text style={s.searchIcon}>🔍</Text>
        <Text style={s.searchText}>Search KidzNKidz</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {CARDS.map((c) => (
            <Card key={c.label} spec={c} onPress={() => navigation.navigate(c.route as never)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F8FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10,
  },
  appName: { fontSize: 22, fontWeight: '900', color: C.ink },
  greeting: { fontSize: 12, fontWeight: '600', color: '#888', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFE566', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 2.5, borderColor: C.ink,
  },
  chipText: { fontWeight: '900', fontSize: 14, color: C.ink },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 18, marginBottom: 14,
    backgroundColor: '#fff', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  searchIcon: { fontSize: 16 },
  searchText: { fontSize: 14, color: '#bbb', fontWeight: '500' },
  scroll: { paddingHorizontal: 12, paddingBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  card: {
    width: '47.5%', borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10, shadowRadius: 12, elevation: 6,
  },
  illusBox: { width: '100%', height: 130, overflow: 'hidden', backgroundColor: '#f0f4ff' },
  cardFooter: { paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' },
  cardLabel: { fontWeight: '800', fontSize: 15, color: C.ink },
  badge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#FF6B6B', borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 10 },
});
