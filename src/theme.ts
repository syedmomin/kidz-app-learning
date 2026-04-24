// src/theme.ts
export const C = {
  yellow: '#FFCD2E',
  yellowDeep: '#F2A516',
  blue: '#3FB5FF',
  blueDeep: '#1E8FD9',
  coral: '#FF6B6B',
  coralDeep: '#E04848',
  mint: '#7BE0AD',
  mintDeep: '#3CB57F',
  purple: '#B68CFF',
  purpleDeep: '#8857E0',
  cream: '#FFF8EC',
  paper: '#FFFDF5',
  ink: '#2D2A4A',
  inkSoft: '#5A567A',
} as const;

export type ColorKey = keyof typeof C;

export const F = {
  display: 'System',
  body: 'System',
} as const;
