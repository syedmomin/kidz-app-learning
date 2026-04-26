import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, Polygon } from 'react-native-svg';

export const SvgCat = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#FAD0C4'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="115" rx="52" ry="38" fill={c} stroke={s} strokeWidth="4" /><Circle cx="80" cy="72" r="40" fill={c} stroke={s} strokeWidth="4" /><Path d="M 48 52 L 40 22 L 68 40 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 112 52 L 120 22 L 92 40 Z" fill={c} stroke={s} strokeWidth="4" /><Circle cx="66" cy="70" r="5" fill={s} /><Circle cx="94" cy="70" r="5" fill={s} /><Path d="M 76 84 L 84 84 L 80 90 Z" fill={isShadow ? '#111' : '#FF5252'} /></Svg>; };
export const SvgSun = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#FFD54F'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="34" fill={c} stroke={s} strokeWidth="4" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => { const r = a * Math.PI / 180, x1 = 80 + 40 * Math.cos(r), y1 = 80 + 40 * Math.sin(r), x2 = 80 + 58 * Math.cos(r), y2 = 80 + 58 * Math.sin(r); return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={s} strokeWidth="5" strokeLinecap="round" />; })}</Svg>; };
export const SvgApple = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#FF5252'; const s = isShadow ? '#111' : '#333'; const g = isShadow ? '#111' : '#4CAF50'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80 30 Q 76 14 66 10" stroke={s} strokeWidth="4" fill="none" /><Ellipse cx="90" cy="20" rx="12" ry="6" fill={g} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgBall = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#42A5F5'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="60" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80,20 Q 110,80 80,140" stroke={s} strokeWidth="3" fill="none" /><Path d="M 20,80 Q 80,110 140,80" stroke={s} strokeWidth="3" fill="none" /></Svg>; };
export const SvgStar = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#FFEB3B'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Polygon points="80,10 96,55 145,58 108,88 120,135 80,108 40,135 52,88 15,58 64,55" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgTree = ({ isShadow }: { isShadow?: boolean } = {}) => { const b = isShadow ? '#111' : '#795548'; const g = isShadow ? '#111' : '#4CAF50'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="70" y="100" width="20" height="40" fill={b} stroke={s} strokeWidth="3" /><Circle cx="80" cy="70" r="45" fill={g} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgMoon = ({ isShadow }: { isShadow?: boolean } = {}) => { const c = isShadow ? '#111' : '#FFD54F'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 120 40 A 60 60 0 1 0 120 120 A 45 45 0 1 1 120 40 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCar = ({ isShadow }: { isShadow?: boolean } = {}) => { const r = isShadow ? '#111' : '#F44336'; const w = isShadow ? '#111' : '#E3F2FD'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 20 100 L 20 70 L 50 40 L 110 40 L 140 70 L 140 100 Z" fill={r} stroke={s} strokeWidth="4" /><Circle cx="40" cy="100" r="15" fill={s} /><Circle cx="120" cy="100" r="15" fill={s} /><Rect x="55" y="45" width="25" height="20" fill={w} stroke={s} strokeWidth="3" /><Rect x="85" y="45" width="25" height="20" fill={w} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgFish = ({ isShadow }: { isShadow?: boolean } = {}) => { const o = isShadow ? '#111' : '#FF9800'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="80" rx="40" ry="25" fill={o} stroke={s} strokeWidth="4" /><Path d="M 40 80 L 10 55 L 10 105 Z" fill={o} stroke={s} strokeWidth="4" /><Circle cx="100" cy="70" r="4" fill={s} /><Path d="M 120 80 Q 130 80 130 70" stroke={s} strokeWidth="3" fill="none" /><Path d="M 80 55 Q 70 40 90 40 Z" fill={o} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgHouse = ({ isShadow }: { isShadow?: boolean } = {}) => { const y = isShadow ? '#111' : '#FFF59D'; const r = isShadow ? '#111' : '#F44336'; const b = isShadow ? '#111' : '#8D6E63'; const w = isShadow ? '#111' : '#E3F2FD'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="40" y="70" width="80" height="70" fill={y} stroke={s} strokeWidth="4" /><Polygon points="30,70 80,30 130,70" fill={r} stroke={s} strokeWidth="4" /><Rect x="65" y="100" width="30" height="40" fill={b} stroke={s} strokeWidth="4" /><Rect x="50" y="80" width="15" height="15" fill={w} stroke={s} strokeWidth="3" /><Rect x="95" y="80" width="15" height="15" fill={w} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgBook = ({ isShadow }: { isShadow?: boolean }) => { const b = isShadow ? '#111' : '#2196F3'; const w = isShadow ? '#111' : '#FFF'; const s = isShadow ? '#111' : '#333'; const c = isShadow ? '#111' : '#ccc'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="30" y="40" width="100" height="80" rx="5" fill={b} stroke={s} strokeWidth="4" /><Rect x="40" y="45" width="80" height="70" fill={w} stroke={s} strokeWidth="3" /><Path d="M 80 45 L 80 115" stroke={s} strokeWidth="3" /><Path d="M 45 60 L 70 60 M 45 80 L 70 80 M 45 100 L 70 100" stroke={c} strokeWidth="3" strokeLinecap="round" /><Path d="M 90 60 L 115 60 M 90 80 L 115 80 M 90 100 L 115 100" stroke={c} strokeWidth="3" strokeLinecap="round" /></Svg>; };
export const SvgHeart = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#E91E63'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 80 130 C 80 130 20 80 20 45 C 20 20 50 20 80 45 C 110 20 140 20 140 45 C 140 80 80 130 80 130 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCloud = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#E3F2FD'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 50 100 A 20 20 0 0 1 50 60 A 30 30 0 0 1 110 60 A 20 20 0 0 1 110 100 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCup = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#81D4FA'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 40 40 L 100 40 L 90 110 A 10 10 0 0 1 50 110 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 100 50 A 20 20 0 0 1 100 90" stroke={s} strokeWidth="4" fill="none" /></Svg>; };
export const SvgKey = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#FFC107'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="50" cy="80" r="20" fill={c} stroke={s} strokeWidth="4" /><Path d="M 70 80 L 130 80 M 110 80 L 110 100 M 125 80 L 125 100" stroke={s} strokeWidth="4" strokeLinecap="round" /></Svg>; };
export const SvgHat = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#9C27B0'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 40 100 L 120 100 A 40 40 0 0 0 40 100 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 20 100 L 140 100" stroke={s} strokeWidth="6" strokeLinecap="round" /></Svg>; };
export const SvgSock = ({ isShadow }: { isShadow?: boolean }) => { const c1 = isShadow ? '#111' : '#4CAF50'; const c2 = isShadow ? '#111' : '#F44336'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 60 30 L 100 30 L 100 90 A 20 20 0 0 1 40 90 Z" fill={c1} stroke={s} strokeWidth="4" /><Path d="M 60 30 L 100 30 L 100 50 L 60 50 Z" fill={c2} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgLeaf = ({ isShadow }: { isShadow?: boolean }) => { const c = isShadow ? '#111' : '#8BC34A'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 80 120 C 20 120 20 40 80 40 C 140 40 140 120 80 120 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80 40 L 80 140" stroke={s} strokeWidth="3" /></Svg>; };
export const SvgIce = ({ isShadow }: { isShadow?: boolean }) => { const c1 = isShadow ? '#111' : '#FFB74D'; const c2 = isShadow ? '#111' : '#E91E63'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 60 70 L 100 70 L 80 130 Z" fill={c1} stroke={s} strokeWidth="4" /><Circle cx="80" cy="60" r="25" fill={c2} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgBed = ({ isShadow }: { isShadow?: boolean }) => { const c1 = isShadow ? '#111' : '#2196F3'; const c2 = isShadow ? '#111' : '#FFF'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="20" y="80" width="120" height="30" fill={c1} stroke={s} strokeWidth="4" /><Path d="M 20 50 L 20 120 M 140 80 L 140 120" stroke={s} strokeWidth="4" strokeLinecap="round" /><Rect x="30" y="60" width="30" height="20" rx="5" fill={c2} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgDoor = ({ isShadow }: { isShadow?: boolean }) => { const c1 = isShadow ? '#111' : '#795548'; const c2 = isShadow ? '#111' : '#FFC107'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="50" y="40" width="60" height="90" fill={c1} stroke={s} strokeWidth="4" /><Circle cx="95" cy="85" r="4" fill={c2} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgRing = ({ isShadow }: { isShadow?: boolean }) => { const c1 = isShadow ? '#111' : '#00BCD4'; const c2 = isShadow ? '#111' : '#FFC107'; const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="30" fill="none" stroke={c2} strokeWidth="6" /><Polygon points="80,30 90,45 70,45" fill={c1} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgBird = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="80" rx="30" ry="20" fill="#03A9F4" stroke="#333" strokeWidth="4" /><Circle cx="110" cy="65" r="15" fill="#03A9F4" stroke="#333" strokeWidth="4" /><Polygon points="125,60 140,65 125,70" fill="#FFC107" stroke="#333" strokeWidth="3" /><Path d="M 50 80 L 20 70 L 30 90 Z" fill="#03A9F4" stroke="#333" strokeWidth="3" /><Circle cx="115" cy="62" r="2" fill="#333" /></Svg>;
export const SvgCircleShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Circle cx="65" cy="65" r="55" fill={fill || '#FF5E5E'} stroke="#00000011" strokeWidth="0" /></Svg>;
export const SvgSquareShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Rect x="12" y="12" width="106" height="106" fill={fill || '#5E8BFF'} rx="10" /></Svg>;
export const SvgTriangleShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,8 122,122 8,122" fill={fill || '#5EE39F'} /></Svg>;
export const SvgStarShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,8 78,45 118,48 88,74 98,112 65,90 32,112 42,74 12,48 52,45" fill={fill || '#FFEB3B'} /></Svg>;
export const SvgHeartShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M65,108 C65,108 10,70 10,38 C10,20 24,9 42,16 C52,20 65,32 65,32 C65,32 78,20 88,16 C106,9 120,20 120,38 C120,70 65,108 65,108Z" fill={fill || '#FF5EC1'} /></Svg>;
export const SvgOvalShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Ellipse cx="65" cy="65" rx="55" ry="35" fill={fill || '#FF9800'} /></Svg>;
export const SvgDiamondShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,10 115,65 65,120 15,65" fill={fill || '#9C27B0'} /></Svg>;
export const SvgHexagonShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,10 115,35 115,95 65,120 15,95 15,35" fill={fill || '#00BCD4'} /></Svg>;
export const SvgPentagonShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,10 120,50 100,115 30,115 10,50" fill={fill || '#4CAF50'} /></Svg>;
export const SvgCrossShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M 45 20 L 85 20 L 85 45 L 110 45 L 110 85 L 85 85 L 85 110 L 45 110 L 45 85 L 20 85 L 20 45 L 45 45 Z" fill={fill || '#FF5722'} /></Svg>;
export const SvgCrescentShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M 80 10 A 55 55 0 1 0 80 120 A 40 40 0 1 1 80 10 Z" fill={fill || '#FFD54F'} /></Svg>;
export const SvgArrowShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="20,40 80,40 80,10 120,65 80,120 80,90 20,90" fill={fill || '#FF5252'} /></Svg>;
export const SvgTrapezoidShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="30,20 100,20 120,110 10,110" fill={fill || '#4CAF50'} /></Svg>;
export const SvgParallelogramShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="40,20 120,20 90,110 10,110" fill={fill || '#2196F3'} /></Svg>;
export const SvgOctagonShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="40,10 90,10 120,40 120,90 90,120 40,120 10,90 10,40" fill={fill || '#9C27B0'} /></Svg>;
export const SvgHeptagonShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,10 115,35 125,85 90,120 40,120 5,85 15,35" fill={fill || '#00BCD4'} /></Svg>;
export const SvgKiteShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Polygon points="65,10 115,50 65,120 15,50" fill={fill || '#E91E63'} /></Svg>;
export const SvgSemiCircleShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M 10 90 A 55 55 0 0 1 120 90 Z" fill={fill || '#8BC34A'} /></Svg>;
export const SvgDropShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M 65 10 C 65 10 110 60 110 90 C 110 115 90 120 65 120 C 40 120 20 115 20 90 C 20 60 65 10 65 10 Z" fill={fill || '#03A9F4'} /></Svg>;
export const SvgPieShape = ({ fill }: { fill?: string }) => <Svg width="130" height="130"><Path d="M 65 65 L 115 35 A 55 55 0 1 0 115 95 Z" fill={fill || '#FFC107'} /></Svg>;
export const SvgDog = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Ellipse cx="80" cy="105" rx="45" ry="32" fill="#D2691E" stroke="#333" strokeWidth="4" />
        <Circle cx="80" cy="68" r="32" fill="#D2691E" stroke="#333" strokeWidth="4" />
        <Path d="M 52 48 L 40 22 L 62 42 Z" fill="#D2691E" stroke="#333" strokeWidth="3" />
        <Path d="M 108 48 L 120 22 L 98 42 Z" fill="#D2691E" stroke="#333" strokeWidth="3" />
        <Circle cx="68" cy="65" r="5" fill="#333" />
        <Circle cx="92" cy="65" r="5" fill="#333" />
        <Ellipse cx="80" cy="80" rx="10" ry="7" fill="#FF8A65" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgEgg = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Path d="M 80 20 Q 130 20 130 90 Q 130 148 80 148 Q 30 148 30 90 Q 30 20 80 20 Z" fill="#FFF9C4" stroke="#333" strokeWidth="4" />
        <Ellipse cx="80" cy="95" rx="25" ry="18" fill="#FFC107" stroke="#333" strokeWidth="3" />
    </Svg>
);

export const SvgGrape = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Circle cx="65" cy="100" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Circle cx="95" cy="100" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Circle cx="80" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Circle cx="50" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Circle cx="110" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Circle cx="80" cy="50" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
        <Path d="M 80 32 Q 76 18 90 14" stroke="#333" strokeWidth="4" fill="none" />
    </Svg>
);

export const SvgJar = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Rect x="55" y="40" width="50" height="10" rx="4" fill="#78909C" stroke="#333" strokeWidth="3" />
        <Path d="M 45 50 L 45 130 Q 45 140 80 140 Q 115 140 115 130 L 115 50 Z" fill="#B2EBF2" stroke="#333" strokeWidth="4" />
        <Ellipse cx="80" cy="95" rx="28" ry="20" fill="#FFC107" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgKite = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Polygon points="80,15 130,80 80,130 30,80" fill="#E91E63" stroke="#333" strokeWidth="4" />
        <Path d="M 80 130 Q 95 145 80 155 Q 65 145 80 130" stroke="#333" strokeWidth="3" fill="#FFC107" />
        <Path d="M 80,15 L 80,130" stroke="#333" strokeWidth="2" />
        <Path d="M 30,80 L 130,80" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgNest = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Path d="M 30 100 Q 80 60 130 100 Q 130 140 80 140 Q 30 140 30 100 Z" fill="#795548" stroke="#333" strokeWidth="4" />
        <Circle cx="65" cy="95" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
        <Circle cx="95" cy="95" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
        <Circle cx="80" cy="80" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
    </Svg>
);

export const SvgOwl = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Ellipse cx="80" cy="95" rx="42" ry="48" fill="#8D6E63" stroke="#333" strokeWidth="4" />
        <Circle cx="63" cy="72" r="20" fill="#fff" stroke="#333" strokeWidth="3" />
        <Circle cx="97" cy="72" r="20" fill="#fff" stroke="#333" strokeWidth="3" />
        <Circle cx="63" cy="72" r="10" fill="#333" />
        <Circle cx="97" cy="72" r="10" fill="#333" />
        <Polygon points="80,88 74,100 86,100" fill="#FFC107" stroke="#333" strokeWidth="2" />
        <Path d="M 45 48 L 35 30 L 55 40 Z" fill="#8D6E63" stroke="#333" strokeWidth="3" />
        <Path d="M 115 48 L 125 30 L 105 40 Z" fill="#8D6E63" stroke="#333" strokeWidth="3" />
    </Svg>
);

export const SvgPig = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Ellipse cx="80" cy="100" rx="50" ry="38" fill="#FFB3C1" stroke="#333" strokeWidth="4" />
        <Circle cx="80" cy="68" r="35" fill="#FFB3C1" stroke="#333" strokeWidth="4" />
        <Ellipse cx="80" cy="80" rx="15" ry="10" fill="#FF8A9A" stroke="#333" strokeWidth="2" />
        <Circle cx="75" cy="78" r="4" fill="#333" />
        <Circle cx="85" cy="78" r="4" fill="#333" />
        <Circle cx="65" cy="60" r="5" fill="#333" />
        <Circle cx="95" cy="60" r="5" fill="#333" />
        <Path d="M 108 55 Q 118 42 115 35" stroke="#FFB3C1" strokeWidth="6" strokeLinecap="round" fill="none" />
    </Svg>
);

export const SvgQuilt = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Rect x="30" y="30" width="100" height="100" fill="#fff" stroke="#333" strokeWidth="4" />
        <Rect x="30" y="30" width="50" height="50" fill="#FF8A65" stroke="#333" strokeWidth="2" />
        <Rect x="80" y="30" width="50" height="50" fill="#42A5F5" stroke="#333" strokeWidth="2" />
        <Rect x="30" y="80" width="50" height="50" fill="#66BB6A" stroke="#333" strokeWidth="2" />
        <Rect x="80" y="80" width="50" height="50" fill="#FFA726" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgRocket = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Path d="M 80 15 Q 55 50 55 90 L 105 90 Q 105 50 80 15 Z" fill="#EF5350" stroke="#333" strokeWidth="4" />
        <Rect x="55" y="90" width="50" height="30" fill="#BDBDBD" stroke="#333" strokeWidth="4" />
        <Path d="M 55 90 L 30 120 L 55 120 Z" fill="#FF9800" stroke="#333" strokeWidth="3" />
        <Path d="M 105 90 L 130 120 L 105 120 Z" fill="#FF9800" stroke="#333" strokeWidth="3" />
        <Circle cx="80" cy="65" r="14" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
        <Path d="M 60 120 L 55 145 L 80 135 L 105 145 L 100 120" fill="#FF6D00" stroke="#333" strokeWidth="3" />
    </Svg>
);

export const SvgTrain = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Rect x="25" y="50" width="110" height="65" rx="12" fill="#1E88E5" stroke="#333" strokeWidth="4" />
        <Rect x="35" y="60" width="30" height="25" rx="4" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
        <Rect x="95" y="60" width="30" height="25" rx="4" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
        <Circle cx="45" cy="120" r="14" fill="#333" />
        <Circle cx="115" cy="120" r="14" fill="#333" />
        <Rect x="72" y="35" width="16" height="20" fill="#333" />
        <Circle cx="80" cy="30" r="8" fill="#FF5722" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgUmbrella = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Path d="M 20 80 A 60 60 0 0 1 140 80 Z" fill="#7C4DFF" stroke="#333" strokeWidth="4" />
        <Path d="M 80 80 L 80 135 Q 80 148 65 148" stroke="#333" strokeWidth="5" strokeLinecap="round" fill="none" />
        <Path d="M 40 80 Q 60 60 80 80" stroke="#fff" strokeWidth="3" fill="none" />
        <Path d="M 80 80 Q 100 60 120 80" stroke="#fff" strokeWidth="3" fill="none" />
    </Svg>
);

export const SvgVase = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Path d="M 60 40 Q 30 70 35 110 Q 35 140 80 140 Q 125 140 125 110 Q 130 70 100 40 Z" fill="#42A5F5" stroke="#333" strokeWidth="4" />
        <Ellipse cx="80" cy="40" rx="22" ry="10" fill="#42A5F5" stroke="#333" strokeWidth="3" />
        <Path d="M 70 40 L 65 15" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        <Circle cx="60" cy="12" r="10" fill="#F44336" stroke="#333" strokeWidth="2" />
        <Path d="M 85 40 L 92 12" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        <Circle cx="96" cy="8" r="10" fill="#FFEB3B" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgWatch = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Rect x="65" y="25" width="30" height="20" rx="4" fill="#555" stroke="#333" strokeWidth="2" />
        <Rect x="65" y="115" width="30" height="20" rx="4" fill="#555" stroke="#333" strokeWidth="2" />
        <Circle cx="80" cy="80" r="38" fill="#fff" stroke="#333" strokeWidth="5" />
        <Circle cx="80" cy="80" r="30" fill="#E8EAF6" />
        <Path d="M 80 56 L 80 80 L 98 80" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    </Svg>
);

export const SvgXylophone = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Rect x="25" y="55" width="110" height="18" rx="4" fill="#F44336" stroke="#333" strokeWidth="3" />
        <Rect x="30" y="80" width="100" height="16" rx="4" fill="#FF9800" stroke="#333" strokeWidth="3" />
        <Rect x="35" y="103" width="90" height="14" rx="4" fill="#FFEB3B" stroke="#333" strokeWidth="3" />
        <Rect x="40" y="124" width="80" height="12" rx="4" fill="#4CAF50" stroke="#333" strokeWidth="3" />
        <Circle cx="60" cy="46" r="8" fill="#78909C" stroke="#333" strokeWidth="2" />
        <Circle cx="100" cy="46" r="8" fill="#78909C" stroke="#333" strokeWidth="2" />
    </Svg>
);

export const SvgYak = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Ellipse cx="80" cy="105" rx="52" ry="35" fill="#5D4037" stroke="#333" strokeWidth="4" />
        <Circle cx="80" cy="65" r="33" fill="#5D4037" stroke="#333" strokeWidth="4" />
        <Path d="M 55 48 L 40 28 L 60 40 Z" fill="#5D4037" stroke="#333" strokeWidth="3" />
        <Path d="M 105 48 L 120 28 L 100 40 Z" fill="#5D4037" stroke="#333" strokeWidth="3" />
        <Circle cx="68" cy="62" r="5" fill="#333" />
        <Circle cx="92" cy="62" r="5" fill="#333" />
        <Ellipse cx="80" cy="78" rx="12" ry="8" fill="#795548" stroke="#333" strokeWidth="2" />
        <Path d="M 28 105 Q 15 115 20 125" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" fill="none" />
        <Path d="M 132 105 Q 145 115 140 125" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" fill="none" />
    </Svg>
);

export const SvgZebra = () => (
    <Svg width="140" height="140" viewBox="0 0 160 160">
        <Ellipse cx="80" cy="105" rx="48" ry="33" fill="#fff" stroke="#333" strokeWidth="4" />
        <Circle cx="80" cy="65" r="33" fill="#fff" stroke="#333" strokeWidth="4" />
        <Path d="M 52 50 L 42 28 L 62 42 Z" fill="#fff" stroke="#333" strokeWidth="3" />
        <Path d="M 108 50 L 118 28 L 98 42 Z" fill="#fff" stroke="#333" strokeWidth="3" />
        <Path d="M 60 50 Q 65 70 60 90" stroke="#333" strokeWidth="5" />
        <Path d="M 80 48 Q 85 68 80 88" stroke="#333" strokeWidth="5" />
        <Path d="M 100 50 Q 95 70 100 90" stroke="#333" strokeWidth="5" />
        <Circle cx="68" cy="62" r="5" fill="#333" />
        <Circle cx="92" cy="62" r="5" fill="#333" />
    </Svg>
);
