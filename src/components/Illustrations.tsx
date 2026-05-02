import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, Polygon, G } from 'react-native-svg';

export const SvgCat = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FAD0C4'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="115" rx="52" ry="38" fill={c} stroke={s} strokeWidth="4" /><Circle cx="80" cy="72" r="40" fill={c} stroke={s} strokeWidth="4" /><Path d="M 48 52 L 40 22 L 68 40 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 112 52 L 120 22 L 92 40 Z" fill={c} stroke={s} strokeWidth="4" /><Circle cx="66" cy="70" r="5" fill={s} /><Circle cx="94" cy="70" r="5" fill={s} /><Path d="M 76 84 L 84 84 L 80 90 Z" fill={isShadow ? '#111' : (color ? '#fff' : '#FF5252')} /></Svg>; };
export const SvgSun = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FFD54F'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="34" fill={c} stroke={s} strokeWidth="4" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => { const r = a * Math.PI / 180, x1 = 80 + 40 * Math.cos(r), y1 = 80 + 40 * Math.sin(r), x2 = 80 + 58 * Math.cos(r), y2 = 80 + 58 * Math.sin(r); return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={s} strokeWidth="5" strokeLinecap="round" />; })}</Svg>; };
export const SvgApple = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FF5252'); const s = isShadow ? '#111' : '#333'; const g = isShadow ? '#111' : (color ? '#fff' : '#4CAF50'); return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80 30 Q 76 14 66 10" stroke={s} strokeWidth="4" fill="none" /><Ellipse cx="90" cy="20" rx="12" ry="6" fill={g} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgBall = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#42A5F5'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="60" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80,20 Q 110,80 80,140" stroke={s} strokeWidth="3" fill="none" /><Path d="M 20,80 Q 80,110 140,80" stroke={s} strokeWidth="3" fill="none" /></Svg>; };
export const SvgStar = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FFEB3B'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Polygon points="80,10 96,55 145,58 108,88 120,135 80,108 40,135 52,88 15,58 64,55" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgTree = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const b = isShadow ? '#111' : (color ? '#fff' : '#795548'); const g = isShadow ? '#111' : (color || '#4CAF50'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="70" y="100" width="20" height="40" fill={b} stroke={s} strokeWidth="3" /><Circle cx="80" cy="70" r="45" fill={g} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgMoon = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FFD54F'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 120 40 A 60 60 0 1 0 120 120 A 45 45 0 1 1 120 40 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCar = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const r = isShadow ? '#111' : (color || '#F44336'); const w = isShadow ? '#111' : (color ? '#fff' : '#E3F2FD'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 20 100 L 20 70 L 50 40 L 110 40 L 140 70 L 140 100 Z" fill={r} stroke={s} strokeWidth="4" /><Circle cx="40" cy="100" r="15" fill={s} /><Circle cx="120" cy="100" r="15" fill={s} /><Rect x="55" y="45" width="25" height="20" fill={w} stroke={s} strokeWidth="3" /><Rect x="85" y="45" width="25" height="20" fill={w} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgFish = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const o = isShadow ? '#111' : (color || '#FF9800'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="80" rx="40" ry="25" fill={o} stroke={s} strokeWidth="4" /><Path d="M 40 80 L 10 55 L 10 105 Z" fill={o} stroke={s} strokeWidth="4" /><Circle cx="100" cy="70" r="4" fill={s} /><Path d="M 120 80 Q 130 80 130 70" stroke={s} strokeWidth="3" fill="none" /><Path d="M 80 55 Q 70 40 90 40 Z" fill={o} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgHouse = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const y = isShadow ? '#111' : (color || '#FFF59D'); const r = isShadow ? '#111' : (color ? '#fff' : '#F44336'); const b = isShadow ? '#111' : (color ? '#fff' : '#8D6E63'); const w = isShadow ? '#111' : (color ? '#fff' : '#E3F2FD'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="40" y="70" width="80" height="70" fill={y} stroke={s} strokeWidth="4" /><Polygon points="30,70 80,30 130,70" fill={r} stroke={s} strokeWidth="4" /><Rect x="65" y="100" width="30" height="40" fill={b} stroke={s} strokeWidth="4" /><Rect x="50" y="80" width="15" height="15" fill={w} stroke={s} strokeWidth="3" /><Rect x="95" y="80" width="15" height="15" fill={w} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgBook = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const b = isShadow ? '#111' : (color || '#2196F3'); const w = isShadow ? '#111' : (color ? '#fff' : '#FFF'); const s = isShadow ? '#111' : '#333'; const c = isShadow ? '#111' : '#ccc'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="30" y="40" width="100" height="80" rx="5" fill={b} stroke={s} strokeWidth="4" /><Rect x="40" y="45" width="80" height="70" fill={w} stroke={s} strokeWidth="3" /><Path d="M 80 45 L 80 115" stroke={s} strokeWidth="3" /><Path d="M 45 60 L 70 60 M 45 80 L 70 80 M 45 100 L 70 100" stroke={c} strokeWidth="3" strokeLinecap="round" /><Path d="M 90 60 L 115 60 M 90 80 L 115 80 M 90 100 L 115 100" stroke={c} strokeWidth="3" strokeLinecap="round" /></Svg>; };
export const SvgHeart = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#E91E63'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 80 130 C 80 130 20 80 20 45 C 20 20 50 20 80 45 C 110 20 140 20 140 45 C 140 80 80 130 80 130 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCloud = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#E3F2FD'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 50 100 A 20 20 0 0 1 50 60 A 30 30 0 0 1 110 60 A 20 20 0 0 1 110 100 Z" fill={c} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgCup = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#81D4FA'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 40 40 L 100 40 L 90 110 A 10 10 0 0 1 50 110 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 100 50 A 20 20 0 0 1 100 90" stroke={s} strokeWidth="4" fill="none" /></Svg>; };
export const SvgKey = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#FFC107'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="50" cy="80" r="20" fill={c} stroke={s} strokeWidth="4" /><Path d="M 70 80 L 130 80 M 110 80 L 110 100 M 125 80 L 125 100" stroke={s} strokeWidth="4" strokeLinecap="round" /></Svg>; };
export const SvgHat = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#9C27B0'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 40 100 L 120 100 A 40 40 0 0 0 40 100 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 20 100 L 140 100" stroke={s} strokeWidth="6" strokeLinecap="round" /></Svg>; };
export const SvgSock = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c1 = isShadow ? '#111' : (color || '#4CAF50'); const c2 = isShadow ? '#111' : (color ? '#fff' : '#F44336'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 60 30 L 100 30 L 100 90 A 20 20 0 0 1 40 90 Z" fill={c1} stroke={s} strokeWidth="4" /><Path d="M 60 30 L 100 30 L 100 50 L 60 50 Z" fill={c2} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgLeaf = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c = isShadow ? '#111' : (color || '#8BC34A'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 80 120 C 20 120 20 40 80 40 C 140 40 140 120 80 120 Z" fill={c} stroke={s} strokeWidth="4" /><Path d="M 80 40 L 80 140" stroke={s} strokeWidth="3" /></Svg>; };
export const SvgIce = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c1 = isShadow ? '#111' : (color ? '#fff' : '#FFB74D'); const c2 = isShadow ? '#111' : (color || '#E91E63'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 60 70 L 100 70 L 80 130 Z" fill={c1} stroke={s} strokeWidth="4" /><Circle cx="80" cy="60" r="25" fill={c2} stroke={s} strokeWidth="4" /></Svg>; };
export const SvgBed = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c1 = isShadow ? '#111' : (color || '#2196F3'); const c2 = isShadow ? '#111' : (color ? '#fff' : '#FFF'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="20" y="80" width="120" height="30" fill={c1} stroke={s} strokeWidth="4" /><Path d="M 20 50 L 20 120 M 140 80 L 140 120" stroke={s} strokeWidth="4" strokeLinecap="round" /><Rect x="30" y="60" width="30" height="20" rx="5" fill={c2} stroke={s} strokeWidth="3" /></Svg>; };
export const SvgDoor = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c1 = isShadow ? '#111' : (color || '#795548'); const c2 = isShadow ? '#111' : (color ? '#fff' : '#FFC107'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="50" y="40" width="60" height="90" fill={c1} stroke={s} strokeWidth="4" /><Circle cx="95" cy="85" r="4" fill={c2} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgRing = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => { const c1 = isShadow ? '#111' : (color ? '#fff' : '#00BCD4'); const c2 = isShadow ? '#111' : (color || '#FFC107'); const s = isShadow ? '#111' : '#333'; return <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="30" fill="none" stroke={c2} strokeWidth="6" /><Polygon points="80,30 90,45 70,45" fill={c1} stroke={s} strokeWidth="2" /></Svg>; };
export const SvgBird = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="80" rx="30" ry="20" fill={isShadow ? '#111' : (color || "#03A9F4")} stroke={isShadow ? '#111' : "#333"} strokeWidth="4" /><Circle cx="110" cy="65" r="15" fill={isShadow ? '#111' : (color || "#03A9F4")} stroke={isShadow ? '#111' : "#333"} strokeWidth="4" /><Polygon points="125,60 140,65 125,70" fill={isShadow ? '#111' : (color ? '#fff' : "#FFC107")} stroke={isShadow ? '#111' : "#333"} strokeWidth="3" /><Path d="M 50 80 L 20 70 L 30 90 Z" fill={isShadow ? '#111' : (color || "#03A9F4")} stroke={isShadow ? '#111' : "#333"} strokeWidth="3" /><Circle cx="115" cy="62" r="2" fill={isShadow ? '#111' : "#333"} /></Svg>;
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
export const SvgDog = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#D2691E');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse cx="80" cy="105" rx="45" ry="32" fill={c} stroke={s} strokeWidth="4" />
            <Circle cx="80" cy="68" r="32" fill={c} stroke={s} strokeWidth="4" />
            <Path d="M 52 48 L 40 22 L 62 42 Z" fill={c} stroke={s} strokeWidth="3" />
            <Path d="M 108 48 L 120 22 L 98 42 Z" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="68" cy="65" r="5" fill={s} />
            <Circle cx="92" cy="65" r="5" fill={s} />
            <Ellipse cx="80" cy="80" rx="10" ry="7" fill={isShadow ? '#111' : (color ? '#fff' : "#FF8A65")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgEgg = ({ isShadow }: { isShadow?: boolean } = {}) => {
    const c = isShadow ? '#111' : '#FFF9C4';
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 80 20 Q 130 20 130 90 Q 130 148 80 148 Q 30 148 30 90 Q 30 20 80 20 Z" fill={c} stroke={s} strokeWidth="4" />
            <Ellipse cx="80" cy="95" rx="25" ry="18" fill={isShadow ? '#111' : "#FFC107"} stroke={s} strokeWidth="3" />
        </Svg>
    );
};

export const SvgGrape = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#9C27B0');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Circle cx="65" cy="100" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="95" cy="100" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="80" cy="75" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="50" cy="75" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="110" cy="75" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="80" cy="50" r="18" fill={c} stroke={s} strokeWidth="3" />
            <Path d="M 80 32 Q 76 18 90 14" stroke={s} strokeWidth="4" fill="none" />
        </Svg>
    );
};

export const SvgJar = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#B2EBF2");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="55" y="40" width="50" height="10" rx="4" fill={isShadow ? '#111' : (color ? '#fff' : "#78909C")} stroke={s} strokeWidth="3" />
            <Path d="M 45 50 L 45 130 Q 45 140 80 140 Q 115 140 115 130 L 115 50 Z" fill={c} stroke={s} strokeWidth="4" />
            <Ellipse cx="80" cy="95" rx="28" ry="20" fill={isShadow ? '#111' : (color ? '#fff' : "#FFC107")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgKite = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#E91E63");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Polygon points="80,15 130,80 80,130 30,80" fill={c} stroke={s} strokeWidth="4" />
            <Path d="M 80 130 Q 95 145 80 155 Q 65 145 80 130" stroke={s} strokeWidth="3" fill={isShadow ? '#111' : (color ? '#fff' : "#FFC107")} />
            <Path d="M 80,15 L 80,130" stroke={s} strokeWidth="2" />
            <Path d="M 30,80 L 130,80" stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgNest = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#795548");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 30 100 Q 80 60 130 100 Q 130 140 80 140 Q 30 140 30 100 Z" fill={c} stroke={s} strokeWidth="4" />
            <Circle cx="65" cy="95" r="16" fill={isShadow ? '#111' : (color ? '#fff' : "#FFF9C4")} stroke={s} strokeWidth="3" />
            <Circle cx="95" cy="95" r="16" fill={isShadow ? '#111' : (color ? '#fff' : "#FFF9C4")} stroke={s} strokeWidth="3" />
            <Circle cx="80" cy="80" r="16" fill={isShadow ? '#111' : (color ? '#fff' : "#FFF9C4")} stroke={s} strokeWidth="3" />
        </Svg>
    );
};

export const SvgOwl = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#8D6E63');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse cx="80" cy="95" rx="42" ry="48" fill={c} stroke={s} strokeWidth="4" />
            <Circle cx="63" cy="72" r="20" fill={isShadow ? '#111' : (color ? '#fff' : "#fff")} stroke={s} strokeWidth="3" />
            <Circle cx="97" cy="72" r="20" fill={isShadow ? '#111' : (color ? '#fff' : "#fff")} stroke={s} strokeWidth="3" />
            <Circle cx="63" cy="72" r="10" fill={s} />
            <Circle cx="97" cy="72" r="10" fill={s} />
            <Polygon points="80,88 74,100 86,100" fill={isShadow ? '#111' : (color ? '#fff' : "#FFC107")} stroke={s} strokeWidth="2" />
            <Path d="M 45 48 L 35 30 L 55 40 Z" fill={c} stroke={s} strokeWidth="3" />
            <Path d="M 115 48 L 125 30 L 105 40 Z" fill={c} stroke={s} strokeWidth="3" />
        </Svg>
    );
};

export const SvgPig = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#FFB3C1');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse cx="80" cy="100" rx="50" ry="38" fill={c} stroke={s} strokeWidth="4" />
            <Circle cx="80" cy="68" r="35" fill={c} stroke={s} strokeWidth="4" />
            <Ellipse cx="80" cy="80" rx="15" ry="10" fill={isShadow ? '#111' : (color ? '#fff' : "#FF8A9A")} stroke={s} strokeWidth="2" />
            <Circle cx="75" cy="78" r="4" fill={s} />
            <Circle cx="85" cy="78" r="4" fill={s} />
            <Circle cx="65" cy="60" r="5" fill={s} />
            <Circle cx="95" cy="60" r="5" fill={s} />
            <Path d="M 108 55 Q 118 42 115 35" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none" />
        </Svg>
    );
};

export const SvgQuilt = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="30" y="30" width="100" height="100" fill={isShadow ? '#111' : (color || "#fff")} stroke={s} strokeWidth="4" />
            <Rect x="30" y="30" width="50" height="50" fill={isShadow ? '#111' : (color ? '#fff' : "#FF8A65")} stroke={s} strokeWidth="2" />
            <Rect x="80" y="30" width="50" height="50" fill={isShadow ? '#111' : (color ? '#fff' : "#42A5F5")} stroke={s} strokeWidth="2" />
            <Rect x="30" y="80" width="50" height="50" fill={isShadow ? '#111' : (color ? '#fff' : "#66BB6A")} stroke={s} strokeWidth="2" />
            <Rect x="80" y="80" width="50" height="50" fill={isShadow ? '#111' : (color ? '#fff' : "#FFA726")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgRocket = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#EF5350");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 80 15 Q 55 50 55 90 L 105 90 Q 105 50 80 15 Z" fill={c} stroke={s} strokeWidth="4" />
            <Rect x="55" y="90" width="50" height="30" fill={isShadow ? '#111' : (color ? '#fff' : "#BDBDBD")} stroke={s} strokeWidth="4" />
            <Path d="M 55 90 L 30 120 L 55 120 Z" fill={isShadow ? '#111' : (color ? '#fff' : "#FF9800")} stroke={s} strokeWidth="3" />
            <Path d="M 105 90 L 130 120 L 105 120 Z" fill={isShadow ? '#111' : (color ? '#fff' : "#FF9800")} stroke={s} strokeWidth="3" />
            <Circle cx="80" cy="65" r="14" fill={isShadow ? '#111' : (color ? '#fff' : "#E3F2FD")} stroke={s} strokeWidth="3" />
            <Path d="M 60 120 L 55 145 L 80 135 L 105 145 L 100 120" fill={isShadow ? '#111' : (color ? '#fff' : "#FF6D00")} stroke={s} strokeWidth="3" />
        </Svg>
    );
};

export const SvgTrain = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#1E88E5");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="25" y="50" width="110" height="65" rx="12" fill={c} stroke={s} strokeWidth="4" />
            <Rect x="35" y="60" width="30" height="25" rx="4" fill={isShadow ? '#111' : (color ? '#fff' : "#E3F2FD")} stroke={s} strokeWidth="3" />
            <Rect x="95" y="60" width="30" height="25" rx="4" fill={isShadow ? '#111' : (color ? '#fff' : "#E3F2FD")} stroke={s} strokeWidth="3" />
            <Circle cx="45" cy="120" r="14" fill={s} />
            <Circle cx="115" cy="120" r="14" fill={s} />
            <Rect x="72" y="35" width="16" height="20" fill={s} />
            <Circle cx="80" cy="30" r="8" fill={isShadow ? '#111' : (color ? '#fff' : "#FF5722")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgUmbrella = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#7C4DFF");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 20 80 A 60 60 0 0 1 140 80 Z" fill={c} stroke={s} strokeWidth="4" />
            <Path d="M 80 80 L 80 135 Q 80 148 65 148" stroke={s} strokeWidth="5" strokeLinecap="round" fill="none" />
            {!isShadow && <Path d="M 40 80 Q 60 60 80 80" stroke={color ? '#fff' : "#fff"} strokeWidth="3" fill="none" />}
            {!isShadow && <Path d="M 80 80 Q 100 60 120 80" stroke={color ? '#fff' : "#fff"} strokeWidth="3" fill="none" />}
        </Svg>
    );
};

export const SvgVase = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    const c = isShadow ? '#111' : (color || "#42A5F5");
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 60 40 Q 30 70 35 110 Q 35 140 80 140 Q 125 140 125 110 Q 130 70 100 40 Z" fill={c} stroke={s} strokeWidth="4" />
            <Ellipse cx="80" cy="40" rx="22" ry="10" fill={c} stroke={s} strokeWidth="3" />
            <Path d="M 70 40 L 65 15" stroke={isShadow ? '#111' : (color ? '#fff' : "#4CAF50")} strokeWidth="4" strokeLinecap="round" />
            <Circle cx="60" cy="12" r="10" fill={isShadow ? '#111' : (color ? '#fff' : "#F44336")} stroke={s} strokeWidth="2" />
            <Path d="M 85 40 L 92 12" stroke={isShadow ? '#111' : (color ? '#fff' : "#4CAF50")} strokeWidth="4" strokeLinecap="round" />
            <Circle cx="96" cy="8" r="10" fill={isShadow ? '#111' : (color ? '#fff' : "#FFEB3B")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgWatch = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="65" y="25" width="30" height="20" rx="4" fill={isShadow ? '#111' : (color ? '#fff' : "#555")} stroke={s} strokeWidth="2" />
            <Rect x="65" y="115" width="30" height="20" rx="4" fill={isShadow ? '#111' : (color ? '#fff' : "#555")} stroke={s} strokeWidth="2" />
            <Circle cx="80" cy="80" r="38" fill={isShadow ? '#111' : (color || "#fff")} stroke={s} strokeWidth="5" />
            {!isShadow && <Circle cx="80" cy="80" r="30" fill={color ? '#fff' : "#E8EAF6"} />}
            <Path d="M 80 56 L 80 80 L 98 80" stroke={s} strokeWidth="4" strokeLinecap="round" />
        </Svg>
    );
};

export const SvgXylophone = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="25" y="55" width="110" height="18" rx="4" fill={isShadow ? '#111' : (color || "#F44336")} stroke={s} strokeWidth="3" />
            <Rect x="30" y="80" width="100" height="16" rx="4" fill={isShadow ? '#111' : (color || "#FF9800")} stroke={s} strokeWidth="3" />
            <Rect x="35" y="103" width="90" height="14" rx="4" fill={isShadow ? '#111' : (color || "#FFEB3B")} stroke={s} strokeWidth="3" />
            <Rect x="40" y="124" width="80" height="12" rx="4" fill={isShadow ? '#111' : (color || "#4CAF50")} stroke={s} strokeWidth="3" />
            <Circle cx="60" cy="46" r="8" fill={isShadow ? '#111' : (color ? '#fff' : "#78909C")} stroke={s} strokeWidth="2" />
            <Circle cx="100" cy="46" r="8" fill={isShadow ? '#111' : (color ? '#fff' : "#78909C")} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgYak = ({ isShadow, color }: { isShadow?: boolean, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#5D4037');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse cx="80" cy="105" rx="52" ry="35" fill={c} stroke={s} strokeWidth="4" />
            <Circle cx="80" cy="65" r="33" fill={c} stroke={s} strokeWidth="4" />
            <Path d="M 55 48 L 40 28 L 60 40 Z" fill={c} stroke={s} strokeWidth="3" />
            <Path d="M 105 48 L 120 28 L 100 40 Z" fill={c} stroke={s} strokeWidth="3" />
            <Circle cx="68" cy="62" r="5" fill={s} />
            <Circle cx="92" cy="62" r="5" fill={s} />
            <Ellipse cx="80" cy="78" rx="12" ry="8" fill={isShadow ? '#111' : (color ? '#fff' : "#795548")} stroke={s} strokeWidth="2" />
            <Path d="M 28 105 Q 15 115 20 125" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none" />
            <Path d="M 132 105 Q 145 115 140 125" stroke={c} strokeWidth="6" strokeLinecap="round" fill="none" />
        </Svg>
    );
};

export const SvgZebra = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse
                cx="80" cy="105" rx="48" ry="33"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#fff")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Circle
                cx="80" cy="65" r="33"
                fill={isShadow ? '#111' : (partColors?.['head'] || color || "#fff")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('head')}
            />
            <Path d="M 52 50 L 42 28 L 62 42 Z" fill={isShadow ? '#111' : (partColors?.['ear_left'] || color || "#fff")} stroke={s} strokeWidth="3" onPress={() => onPartPress?.('ear_left')} />
            <Path d="M 108 50 L 118 28 L 98 42 Z" fill={isShadow ? '#111' : (partColors?.['ear_right'] || color || "#fff")} stroke={s} strokeWidth="3" onPress={() => onPartPress?.('ear_right')} />
            <Path d="M 60 50 Q 65 70 60 90" stroke={s} strokeWidth="5" />
            <Path d="M 80 48 Q 85 68 80 88" stroke={s} strokeWidth="5" />
            <Path d="M 100 50 Q 95 70 100 90" stroke={s} strokeWidth="5" />
            <Circle cx="68" cy="62" r="5" fill={s} />
            <Circle cx="92" cy="62" r="5" fill={s} />
        </Svg>
    );
};

export const SvgMango = ({ isShadow, size = 140, color }: { isShadow?: boolean, size?: number, color?: string } = {}) => {
    const c = isShadow ? '#111' : (color || '#FF6B35');
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx="100" cy="135" rx="55" ry="50" fill={c} stroke={s} strokeWidth="4" />
            <Ellipse cx="100" cy="145" rx="32" ry="32" fill={isShadow ? '#111' : (color ? '#fff' : "#FFE9B0")} stroke={s} strokeWidth="3" />
            <Ellipse cx="78" cy="180" rx="14" ry="9" fill={isShadow ? '#111' : (color ? '#fff' : "#E65100")} stroke={s} strokeWidth="3" />
            <Ellipse cx="122" cy="180" rx="14" ry="9" fill={isShadow ? '#111' : (color ? '#fff' : "#E65100")} stroke={s} strokeWidth="3" />
            <Ellipse cx="50" cy="125" rx="14" ry="20" fill={c} stroke={s} strokeWidth="4" transform="rotate(-15 50 125)" />
            <Ellipse cx="150" cy="110" rx="14" ry="20" fill={c} stroke={s} strokeWidth="4" transform="rotate(25 150 110)" />
            <Circle cx="100" cy="78" r="48" fill={c} stroke={s} strokeWidth="4" />
            <Path d="M 62 50 Q 55 25 75 35 L 78 55 Z" fill={c} stroke={s} strokeWidth="4" strokeLinejoin="round" />
            <Path d="M 138 50 Q 145 25 125 35 L 122 55 Z" fill={c} stroke={s} strokeWidth="4" strokeLinejoin="round" />
            {!isShadow && <Ellipse cx="100" cy="88" rx="32" ry="26" fill={color ? '#fff' : "#FFF5E0"} stroke="none" />}
            <Ellipse cx="84" cy="78" rx="7" ry="9" fill={s} />
            <Ellipse cx="116" cy="78" rx="7" ry="9" fill={s} />
            {!isShadow && <Circle cx="86" cy="75" r="2.5" fill="#fff" />}
            {!isShadow && <Circle cx="118" cy="75" r="2.5" fill="#fff" />}
            <Ellipse cx="100" cy="92" rx="5" ry="4" fill={s} />
            <Path d="M 90 100 Q 100 110 110 100" stroke={s} strokeWidth="3" fill="none" strokeLinecap="round" />
        </Svg>
    );
};

export const SvgButterfly = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 80 60 Q 40 20 30 70 Q 30 110 80 90 Q 130 110 130 70 Q 120 20 80 60"
                fill={isShadow ? '#111' : (partColors?.['wing_top'] || color || "#FF4081")}
                stroke={s}
                strokeWidth="4"
                onPress={() => onPartPress?.('wing_top')}
            />
            <Path
                d="M 80 90 Q 50 110 40 140 Q 80 150 80 120 Q 80 150 120 140 Q 110 110 80 90"
                fill={isShadow ? '#111' : (partColors?.['wing_bottom'] || color || "#FF4081")}
                stroke={s}
                strokeWidth="4"
                onPress={() => onPartPress?.('wing_bottom')}
            />
            <Rect x="76" y="40" width="8" height="80" rx="4" fill={s} />
            <Path d="M 76 45 Q 60 30 55 15" fill="none" stroke={s} strokeWidth="2" />
            <Path d="M 84 45 Q 100 30 105 15" fill="none" stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgRainbow = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 20 120 A 60 60 0 0 1 140 120"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['band1'] || color || "#FF5252")}
                strokeWidth="12"
                onPress={() => onPartPress?.('band1')}
            />
            <Path
                d="M 35 120 A 45 45 0 0 1 125 120"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['band2'] || color || "#FFD740")}
                strokeWidth="12"
                onPress={() => onPartPress?.('band2')}
            />
            <Path
                d="M 50 120 A 30 30 0 0 1 110 120"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['band3'] || color || "#4CAF50")}
                strokeWidth="12"
                onPress={() => onPartPress?.('band3')}
            />
            <Circle cx="20" cy="120" r="15" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
            <Circle cx="140" cy="120" r="15" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgRobot = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect
                x="50" y="40" width="60" height="50" rx="8"
                fill={isShadow ? '#111' : (partColors?.['head'] || color || "#90A4AE")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('head')}
            />
            <Rect
                x="40" y="90" width="80" height="50" rx="4"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#90A4AE")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Circle cx="65" cy="60" r="6" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
            <Circle cx="95" cy="60" r="6" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
            <Rect x="70" y="140" width="10" height="15" fill={s} />
            <Rect x="90" y="140" width="10" height="15" fill={s} />
            <Rect x="30" y="95" width="10" height="30" rx="5" fill={s} />
            <Rect x="120" y="95" width="10" height="30" rx="5" fill={s} />
        </Svg>
    );
};

export const SvgPizza = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 80 150 L 30 40 A 100 100 0 0 1 130 40 Z"
                fill={isShadow ? '#111' : (partColors?.['crust'] || color || "#FFD54F")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('crust')}
            />
            <Path
                d="M 30 40 A 100 100 0 0 1 130 40"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['border'] || "#FF8A65")}
                strokeWidth="12"
                onPress={() => onPartPress?.('border')}
            />
            <Circle cx="60" cy="60" r="5" fill={isShadow ? '#111' : "#F44336"} />
            <Circle cx="100" cy="65" r="5" fill={isShadow ? '#111' : "#F44336"} />
            <Circle cx="80" cy="90" r="5" fill={isShadow ? '#111' : "#F44336"} />
        </Svg>
    );
};

export const SvgCake = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect
                x="30" y="100" width="100" height="40" rx="5"
                fill={isShadow ? '#111' : (partColors?.['bottom'] || color || "#F06292")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('bottom')}
            />
            <Rect
                x="45" y="70" width="70" height="30" rx="5"
                fill={isShadow ? '#111' : (partColors?.['top'] || color || "#F06292")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('top')}
            />
            <Rect x="75" y="40" width="10" height="30" fill={isShadow ? '#111' : "#FFF176"} stroke={s} strokeWidth="2" />
            <Circle cx="80" cy="35" r="6" fill={isShadow ? '#111' : "#FF5252"} />
        </Svg>
    );
};

export const SvgBoat = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 30 100 L 130 100 L 110 135 L 50 135 Z"
                fill={isShadow ? '#111' : (partColors?.['hull'] || color || "#795548")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('hull')}
            />
            <Path
                d="M 80 100 L 80 40 L 40 90 Z"
                fill={isShadow ? '#111' : (partColors?.['sail1'] || "#fff")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('sail1')}
            />
            <Path
                d="M 85 95 L 85 50 L 120 95 Z"
                fill={isShadow ? '#111' : (partColors?.['sail2'] || "#fff")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('sail2')}
            />
        </Svg>
    );
};

export const SvgPlane = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse
                cx="80" cy="80" rx="60" ry="15"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#4FC3F7")}
                stroke={s} strokeWidth="4"
                onPartPress={() => onPartPress?.('body')}
            />
            <Path
                d="M 70 80 L 50 50 L 90 80 Z"
                fill={isShadow ? '#111' : (partColors?.['wing_up'] || color || "#4FC3F7")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('wing_up')}
            />
            <Path
                d="M 70 80 L 50 110 L 90 80 Z"
                fill={isShadow ? '#111' : (partColors?.['wing_down'] || color || "#4FC3F7")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('wing_down')}
            />
            <Circle cx="120" cy="80" r="8" fill={isShadow ? '#111' : "#E3F2FD"} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgFlower = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path d="M 80 80 L 80 150" stroke={isShadow ? '#111' : "#4CAF50"} strokeWidth="6" strokeLinecap="round" />
            <Path
                d="M 80 120 Q 60 110 50 130"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['leaf'] || "#4CAF50")}
                strokeWidth="4"
                onPress={() => onPartPress?.('leaf')}
            />
            {[0, 72, 144, 216, 288].map((angle, i) => (
                <Circle
                    key={i}
                    cx={80 + 30 * Math.cos(angle * Math.PI / 180)}
                    cy={80 + 30 * Math.sin(angle * Math.PI / 180)}
                    r="22"
                    fill={isShadow ? '#111' : (partColors?.[`petal${i}`] || color || "#FF80AB")}
                    stroke={s} strokeWidth="3"
                    onPress={() => onPartPress?.(`petal${i}`)}
                />
            ))}
            <Circle
                cx="80" cy="80" r="18"
                fill={isShadow ? '#111' : (partColors?.['center'] || "#FFD54F")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('center')}
            />
        </Svg>
    );
};

export const SvgMushroom = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 60 140 L 100 140 L 95 100 L 65 100 Z"
                fill={isShadow ? '#111' : (partColors?.['stem'] || "#EFEBE9")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('stem')}
            />
            <Path
                d="M 30 100 Q 80 20 130 100 Z"
                fill={isShadow ? '#111' : (partColors?.['cap'] || color || "#EF5350")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('cap')}
            />
            <Circle cx="60" cy="70" r="6" fill={isShadow ? '#111' : "#fff"} />
            <Circle cx="100" cy="75" r="8" fill={isShadow ? '#111' : "#fff"} />
            <Circle cx="80" cy="50" r="5" fill={isShadow ? '#111' : "#fff"} />
        </Svg>
    );
};

export const SvgCrab = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse
                cx="80" cy="100" rx="45" ry="30"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#FF5252")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Path
                d="M 40 85 L 20 60 L 45 65 Z"
                fill={isShadow ? '#111' : (partColors?.['claw_left'] || color || "#FF5252")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('claw_left')}
            />
            <Path
                d="M 120 85 L 140 60 L 115 65 Z"
                fill={isShadow ? '#111' : (partColors?.['claw_right'] || color || "#FF5252")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('claw_right')}
            />
            <Circle cx="65" cy="85" r="5" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
            <Circle cx="95" cy="85" r="5" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
        </Svg>
    );
};

export const SvgWhale = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Path
                d="M 20 100 Q 20 40 80 40 Q 140 40 140 100 Q 140 130 80 130 Q 50 130 20 100"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#2196F3")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Path
                d="M 140 100 Q 155 85 155 115 Q 140 115 140 100"
                fill={isShadow ? '#111' : (partColors?.['tail'] || color || "#2196F3")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('tail')}
            />
            <Circle cx="50" cy="70" r="5" fill={isShadow ? '#111' : "#fff"} stroke={s} strokeWidth="2" />
            <Path d="M 80 40 Q 80 15 95 15 M 80 40 Q 80 20 65 15" fill="none" stroke={isShadow ? '#111' : "#81D4FA"} strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
};

export const SvgCactus = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect x="55" y="125" width="50" height="25" rx="5" fill={isShadow ? '#111' : "#795548"} stroke={s} strokeWidth="3" />
            <Rect
                x="65" y="40" width="30" height="90" rx="15"
                fill={isShadow ? '#111' : (partColors?.['main'] || color || "#4CAF50")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('main')}
            />
            <Path
                d="M 65 90 Q 40 90 40 70"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['arm_left'] || color || "#4CAF50")}
                strokeWidth="15" strokeLinecap="round"
                onPress={() => onPartPress?.('arm_left')}
            />
            <Path
                d="M 95 80 Q 120 80 120 60"
                fill="none"
                stroke={isShadow ? '#111' : (partColors?.['arm_right'] || color || "#4CAF50")}
                strokeWidth="15" strokeLinecap="round"
                onPress={() => onPartPress?.('arm_right')}
            />
        </Svg>
    );
};

export const SvgGift = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Rect
                x="35" y="60" width="90" height="80" rx="4"
                fill={isShadow ? '#111' : (partColors?.['box'] || color || "#FF5252")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('box')}
            />
            <Rect
                x="30" y="50" width="100" height="20" rx="2"
                fill={isShadow ? '#111' : (partColors?.['lid'] || "#FFD740")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('lid')}
            />
            <Rect
                x="75" y="50" width="10" height="90"
                fill={isShadow ? '#111' : (partColors?.['ribbon'] || "#FFD740")}
                onPress={() => onPartPress?.('ribbon')}
            />
            <Path
                d="M 80 50 Q 60 20 50 40 Q 80 45 80 50"
                fill={isShadow ? '#111' : (partColors?.['bow'] || "#FFD740")}
                stroke={s} strokeWidth="2"
                onPress={() => onPartPress?.('bow')}
            />
            <Path
                d="M 80 50 Q 100 20 110 40 Q 80 45 80 50"
                fill={isShadow ? '#111' : (partColors?.['bow'] || "#FFD740")}
                stroke={s} strokeWidth="2"
                onPress={() => onPartPress?.('bow')}
            />
        </Svg>
    );
};

export const SvgHelicopter = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse
                cx="85" cy="90" rx="45" ry="30"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#FF9800")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Rect
                x="40" y="80" width="30" height="20" rx="5"
                fill={isShadow ? '#111' : (partColors?.['window'] || "#E3F2FD")}
                stroke={s} strokeWidth="3"
                onPress={() => onPartPress?.('window')}
            />
            <Path d="M 40 90 L 10 90" stroke={s} strokeWidth="6" strokeLinecap="round" />
            <Circle cx="10" cy="90" r="15" fill={isShadow ? '#111' : (partColors?.['tail_rotor'] || "#333")} onPress={() => onPartPress?.('tail_rotor')} />
            <Path d="M 85 60 L 85 45" stroke={s} strokeWidth="4" />
            <Path d="M 45 45 L 125 45" stroke={s} strokeWidth="4" strokeLinecap="round" />
            <Path
                d="M 60 120 L 110 120 M 70 120 L 70 135 L 100 135 L 100 120"
                fill="none" stroke={isShadow ? '#111' : (partColors?.['skids'] || "#333")}
                strokeWidth="4"
                onPress={() => onPartPress?.('skids')}
            />
        </Svg>
    );
};

export const SvgSubmarine = ({ isShadow, color, partColors, onPartPress }: IllustrationProps = {}) => {
    const s = isShadow ? '#111' : '#333';
    return (
        <Svg width="140" height="140" viewBox="0 0 160 160">
            <Ellipse
                cx="80" cy="100" rx="65" ry="35"
                fill={isShadow ? '#111' : (partColors?.['body'] || color || "#FFEB3B")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('body')}
            />
            <Rect
                x="70" y="50" width="20" height="30"
                fill={isShadow ? '#111' : (partColors?.['tower'] || color || "#FFEB3B")}
                stroke={s} strokeWidth="4"
                onPress={() => onPartPress?.('tower')}
            />
            <Path d="M 85 50 L 85 30 L 100 30" fill="none" stroke={s} strokeWidth="4" strokeLinecap="round" />
            <Circle cx="45" cy="100" r="8" fill={isShadow ? '#111' : (partColors?.['window1'] || "#03A9F4")} stroke={s} strokeWidth="2" onPress={() => onPartPress?.('window1')} />
            <Circle cx="80" cy="100" r="8" fill={isShadow ? '#111' : (partColors?.['window2'] || "#03A9F4")} stroke={s} strokeWidth="2" onPress={() => onPartPress?.('window2')} />
            <Circle cx="115" cy="100" r="8" fill={isShadow ? '#111' : (partColors?.['window3'] || "#03A9F4")} stroke={s} strokeWidth="2" onPress={() => onPartPress?.('window3')} />
            <Path d="M 15 100 L 5 85 L 5 115 Z" fill={s} />
        </Svg>
    );
};
