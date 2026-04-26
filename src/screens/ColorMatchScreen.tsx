import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions, Alert, PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse, Rect, Polygon } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const CANVAS = SW - 28;
const BLANK  = '#FFFFFF';   // white paper — kids color themselves
const ERASER = '#FFFFFF';

// ─── Palette ─────────────────────────────────────────────────────────────────

const PALETTE = [
  '#FF3B3B', '#FF6B35', '#FF9800', '#FFCC00', '#FFD93D',
  '#C8E600', '#4CAF50', '#00C853', '#00BCD4', '#00B0FF',
  '#2196F3', '#3F51B5', '#673AB7', '#9C27B0', '#E91E63',
  '#FF69B4', '#FF80AB', '#FF1744', '#F06292', '#A0522D',
  '#795548', '#FF8A65', '#9E9E9E', '#607D8B', '#37474F',
  '#FFFFFF', '#FFCCBC', '#B2EBF2', '#F3E5F5', '#CCFF90',
  '#FFE082', '#80D8FF', '#B9F6CA', '#EA80FC', '#000000',
];

// ─── SVG Region Types ─────────────────────────────────────────────────────────

type RegBase = { id: string; label: string; defaultFill?: string };
type CircR  = RegBase & { k: 'circle';  cx:number; cy:number; r:number };
type EllR   = RegBase & { k: 'ellipse'; cx:number; cy:number; rx:number; ry:number; t?:string };
type PathR  = RegBase & { k: 'path';    d:string };
type RectR  = RegBase & { k: 'rect';    x:number; y:number; w:number; h:number; rx?:number };
type PolyR  = RegBase & { k: 'poly';    pts:string };
type Region = CircR | EllR | PathR | RectR | PolyR;

type Page = { id:string; title:string; emoji:string; bg:string; regions:Region[] };

// ─── Coloring Pages  (simple shapes — 4-5 yr kids) ───────────────────────────

const PAGES: Page[] = [
  { id:'cat',      title:'Cute Cat',       emoji:'🐱', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:220, rx:90, ry:65, label:'Body' },
    { id:'head',  k:'circle',  cx:150, cy:118, r:78,  label:'Head' },
    { id:'lear',  k:'poly', pts:'88,75 65,12 128,60',   label:'Ear L' },
    { id:'rear',  k:'poly', pts:'212,75 235,12 172,60',  label:'Ear R' },
    { id:'leye',  k:'circle',  cx:118, cy:108, r:18,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:182, cy:108, r:18,  label:'Eye R' },
    { id:'nose',  k:'circle',  cx:150, cy:140, r:10,  label:'Nose' },
    { id:'tail',  k:'path', d:'M 238,255 Q 298,215 282,155', label:'Tail', defaultFill:'none' },
  ]},
  { id:'butterfly',title:'Butterfly',      emoji:'🦋', bg:'#FFFFFF', regions:[
    { id:'tlw', k:'path', d:'M 150,150 Q 82,55 25,95 Q 15,168 82,190 L 150,170 Z',  label:'Wing TL' },
    { id:'trw', k:'path', d:'M 150,150 Q 218,55 275,95 Q 285,168 218,190 L 150,170 Z', label:'Wing TR' },
    { id:'blw', k:'path', d:'M 150,170 Q 62,185 45,250 Q 72,295 150,265 Z',          label:'Wing BL' },
    { id:'brw', k:'path', d:'M 150,170 Q 238,185 255,250 Q 228,295 150,265 Z',       label:'Wing BR' },
    { id:'body',k:'ellipse', cx:150, cy:208, rx:12, ry:65, label:'Body' },
    { id:'sp1', k:'circle', cx:80,  cy:120, r:18, label:'Spot L' },
    { id:'sp2', k:'circle', cx:220, cy:120, r:18, label:'Spot R' },
  ]},
  { id:'house',    title:'My House',        emoji:'🏠', bg:'#FFFFFF', regions:[
    { id:'sky',  k:'rect',   x:0,   y:0,   w:300, h:180, label:'Sky' },
    { id:'sun',  k:'circle', cx:250, cy:52, r:40,  label:'Sun' },
    { id:'grass',k:'rect',   x:0,   y:240, w:300, h:60,  label:'Grass' },
    { id:'wall', k:'rect',   x:45,  y:140, w:210, h:130, rx:4, label:'Wall' },
    { id:'roof', k:'path',   d:'M 20,144 L 150,35 L 280,144 Z', label:'Roof' },
    { id:'door', k:'rect',   x:112, y:200, w:56,  h:70,  rx:4, label:'Door' },
    { id:'winL', k:'rect',   x:58,  y:158, w:55,  h:45,  rx:5, label:'Window L' },
    { id:'winR', k:'rect',   x:187, y:158, w:55,  h:45,  rx:5, label:'Window R' },
  ]},
  { id:'fish',     title:'Happy Fish',      emoji:'🐟', bg:'#FFFFFF', regions:[
    { id:'water',  k:'rect',    x:0, y:185, w:300, h:115, label:'Water' },
    { id:'body',   k:'ellipse', cx:145, cy:148, rx:110, ry:72, label:'Body' },
    { id:'tail',   k:'path',    d:'M 252,148 L 300,95 L 300,148 L 300,201 Z', label:'Tail' },
    { id:'topfin', k:'path',    d:'M 125,78 Q 152,32 182,76', label:'Fin' },
    { id:'eye',    k:'circle',  cx:72, cy:132, r:24, label:'Eye' },
    { id:'pupil',  k:'circle',  cx:70, cy:130, r:11, label:'Pupil' },
  ]},
  { id:'rocket',   title:'Space Rocket',    emoji:'🚀', bg:'#FFFFFF', regions:[
    { id:'space',  k:'rect',   x:0,   y:0,   w:300, h:300, label:'Space' },
    { id:'body',   k:'rect',   x:108, y:90,  w:84,  h:135, rx:10, label:'Body' },
    { id:'nose',   k:'path',   d:'M 108,90 Q 150,5 192,90 Z', label:'Nose' },
    { id:'lfin',   k:'path',   d:'M 108,190 L 62,255 L 108,230 Z', label:'Fin L' },
    { id:'rfin',   k:'path',   d:'M 192,190 L 238,255 L 192,230 Z', label:'Fin R' },
    { id:'win',    k:'circle', cx:150, cy:148, r:28, label:'Window' },
    { id:'flame',  k:'path',   d:'M 120,225 Q 135,278 150,255 Q 165,278 180,225 Z', label:'Flame' },
    { id:'star1',  k:'circle', cx:35,  cy:40,  r:5, label:'Star 1' },
    { id:'star2',  k:'circle', cx:258, cy:28,  r:5, label:'Star 2' },
    { id:'star3',  k:'circle', cx:270, cy:145, r:4, label:'Star 3' },
  ]},
  { id:'flower',   title:'Pretty Flower',   emoji:'🌸', bg:'#FFFFFF', regions:[
    { id:'stem',   k:'rect',    x:144, y:172, w:12, h:95, rx:6, label:'Stem' },
    { id:'lleaf',  k:'ellipse', cx:110, cy:230, rx:42, ry:16, t:'rotate(-35 110 230)', label:'Leaf L' },
    { id:'rleaf',  k:'ellipse', cx:190, cy:230, rx:42, ry:16, t:'rotate(35 190 230)',  label:'Leaf R' },
    { id:'p1', k:'ellipse', cx:150, cy:88,  rx:26, ry:50, label:'Petal 1' },
    { id:'p2', k:'ellipse', cx:196, cy:105, rx:26, ry:50, t:'rotate(60 196 105)',  label:'Petal 2' },
    { id:'p3', k:'ellipse', cx:196, cy:158, rx:26, ry:50, t:'rotate(120 196 158)', label:'Petal 3' },
    { id:'p4', k:'ellipse', cx:150, cy:174, rx:26, ry:50, label:'Petal 4' },
    { id:'p5', k:'ellipse', cx:104, cy:158, rx:26, ry:50, t:'rotate(60 104 158)',  label:'Petal 5' },
    { id:'p6', k:'ellipse', cx:104, cy:105, rx:26, ry:50, t:'rotate(120 104 105)', label:'Petal 6' },
    { id:'cent',k:'circle', cx:150, cy:130, r:38, label:'Center' },
  ]},
  { id:'rainbow',  title:'Rainbow',          emoji:'🌈', bg:'#FFFFFF', regions:[
    { id:'sky',  k:'rect',  x:0, y:0,   w:300, h:300, label:'Sky' },
    { id:'arc1', k:'path',  d:'M -80,290 A 230,230 0 0 1 380,290 L 352,290 A 202,202 0 0 0 -52,290 Z', label:'Red' },
    { id:'arc2', k:'path',  d:'M -52,290 A 202,202 0 0 1 352,290 L 324,290 A 174,174 0 0 0 -24,290 Z', label:'Orange' },
    { id:'arc3', k:'path',  d:'M -24,290 A 174,174 0 0 1 324,290 L 296,290 A 146,146 0 0 0 4,290 Z',   label:'Yellow' },
    { id:'arc4', k:'path',  d:'M 4,290 A 146,146 0 0 1 296,290 L 268,290 A 118,118 0 0 0 32,290 Z',    label:'Green' },
    { id:'arc5', k:'path',  d:'M 32,290 A 118,118 0 0 1 268,290 L 240,290 A 90,90 0 0 0 60,290 Z',     label:'Blue' },
    { id:'arc6', k:'path',  d:'M 60,290 A 90,90 0 0 1 240,290 L 215,290 A 65,65 0 0 0 85,290 Z',       label:'Indigo' },
    { id:'arc7', k:'path',  d:'M 85,290 A 65,65 0 0 1 215,290 L 150,290 Z',                            label:'Violet' },
    { id:'grass',k:'path',  d:'M 0,260 Q 75,246 150,258 Q 225,270 300,258 L 300,300 L 0,300 Z',        label:'Grass' },
    { id:'sun',  k:'circle',cx:255, cy:48, r:38, label:'Sun' },
  ]},
  { id:'elephant', title:'Elephant',         emoji:'🐘', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:158, cy:192, rx:105, ry:82, label:'Body' },
    { id:'head',  k:'circle',  cx:90,  cy:118, r:72,   label:'Head' },
    { id:'ear',   k:'ellipse', cx:35,  cy:135, rx:32,  ry:52, label:'Ear' },
    { id:'trunk', k:'path',    d:'M 60,162 Q 22,182 16,222 Q 12,250 40,255 Q 65,258 70,236 Q 75,212 55,202 Q 40,192 46,175', label:'Trunk' },
    { id:'lleg',  k:'ellipse', cx:82,  cy:272, rx:24, ry:20, label:'Leg 1' },
    { id:'rleg',  k:'ellipse', cx:135, cy:272, rx:24, ry:20, label:'Leg 2' },
    { id:'lleg2', k:'ellipse', cx:192, cy:272, rx:24, ry:20, label:'Leg 3' },
    { id:'rleg2', k:'ellipse', cx:245, cy:272, rx:24, ry:20, label:'Leg 4' },
    { id:'eye',   k:'circle',  cx:68,  cy:100, r:16,   label:'Eye' },
  ]},
  { id:'dog',      title:'Cute Dog',          emoji:'🐶', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:220, rx:90, ry:68, label:'Body' },
    { id:'head',  k:'circle',  cx:150, cy:118, r:78,  label:'Head' },
    { id:'lear',  k:'ellipse', cx:82,  cy:92,  rx:28, ry:48, t:'rotate(-15 82 92)',  label:'Ear L' },
    { id:'rear',  k:'ellipse', cx:218, cy:92,  rx:28, ry:48, t:'rotate(15 218 92)',  label:'Ear R' },
    { id:'snout', k:'ellipse', cx:150, cy:148, rx:42, ry:30, label:'Snout' },
    { id:'nose',  k:'ellipse', cx:150, cy:134, rx:16, ry:10, label:'Nose' },
    { id:'leye',  k:'circle',  cx:115, cy:105, r:15,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:185, cy:105, r:15,  label:'Eye R' },
    { id:'tail',  k:'path',    d:'M 238,200 Q 292,165 280,118', label:'Tail', defaultFill:'none' },
  ]},
  { id:'lion',     title:'Lion',               emoji:'🦁', bg:'#FFFFFF', regions:[
    { id:'mane',  k:'circle',  cx:150, cy:140, r:105, label:'Mane' },
    { id:'face',  k:'circle',  cx:150, cy:132, r:72,  label:'Face' },
    { id:'leye',  k:'circle',  cx:118, cy:112, r:15,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:182, cy:112, r:15,  label:'Eye R' },
    { id:'snout', k:'ellipse', cx:150, cy:155, rx:42, ry:30, label:'Snout' },
    { id:'nose',  k:'poly',    pts:'150,137 138,154 162,154',  label:'Nose' },
    { id:'body',  k:'ellipse', cx:150, cy:250, rx:88, ry:55,  label:'Body' },
  ]},
  { id:'bird',     title:'Cute Bird',          emoji:'🐦', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:185, rx:82, ry:68, label:'Body' },
    { id:'lwing', k:'path',    d:'M 70,165 Q 25,138 38,190 Q 50,230 92,210 Z',   label:'Wing L' },
    { id:'rwing', k:'path',    d:'M 230,165 Q 275,138 262,190 Q 250,230 208,210 Z', label:'Wing R' },
    { id:'head',  k:'circle',  cx:150, cy:108, r:55, label:'Head' },
    { id:'beak',  k:'path',    d:'M 192,108 L 228,115 L 192,122 Z', label:'Beak' },
    { id:'eye',   k:'circle',  cx:168, cy:96,  r:14, label:'Eye' },
    { id:'tail',  k:'path',    d:'M 100,242 Q 68,270 60,248 Q 52,228 80,218 Z', label:'Tail' },
    { id:'chest', k:'ellipse', cx:162, cy:195, rx:40, ry:32, label:'Chest' },
  ]},
  { id:'bear',     title:'Teddy Bear',         emoji:'🧸', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:212, rx:92, ry:80, label:'Body' },
    { id:'head',  k:'circle',  cx:150, cy:115, r:80,  label:'Head' },
    { id:'lear',  k:'circle',  cx:82,  cy:52,  r:30,  label:'Ear L' },
    { id:'rear',  k:'circle',  cx:218, cy:52,  r:30,  label:'Ear R' },
    { id:'belly', k:'ellipse', cx:150, cy:218, rx:55, ry:48, label:'Belly' },
    { id:'leye',  k:'circle',  cx:118, cy:100, r:15,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:182, cy:100, r:15,  label:'Eye R' },
    { id:'snout', k:'ellipse', cx:150, cy:145, rx:38, ry:28, label:'Snout' },
    { id:'lleg',  k:'ellipse', cx:95,  cy:280, rx:35, ry:22, label:'Leg L' },
    { id:'rleg',  k:'ellipse', cx:205, cy:280, rx:35, ry:22, label:'Leg R' },
  ]},
  { id:'frog',     title:'Cute Frog',          emoji:'🐸', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:195, rx:95, ry:82, label:'Body' },
    { id:'head',  k:'ellipse', cx:150, cy:115, rx:88, ry:68, label:'Head' },
    { id:'leyeB', k:'circle',  cx:100, cy:75,  r:30,  label:'Eye Bump L' },
    { id:'reyeB', k:'circle',  cx:200, cy:75,  r:30,  label:'Eye Bump R' },
    { id:'leye',  k:'circle',  cx:100, cy:72,  r:18,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:200, cy:72,  r:18,  label:'Eye R' },
    { id:'belly', k:'ellipse', cx:150, cy:205, rx:60, ry:55, label:'Belly' },
    { id:'lleg',  k:'path',    d:'M 55,262 Q 18,244 15,278 Q 12,308 58,298 Q 90,288 88,270 Z',    label:'Leg L' },
    { id:'rleg',  k:'path',    d:'M 245,262 Q 282,244 285,278 Q 288,308 242,298 Q 210,288 212,270 Z', label:'Leg R' },
  ]},
  { id:'owl',      title:'Cute Owl',            emoji:'🦉', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:200, rx:88, ry:95, label:'Body' },
    { id:'head',  k:'circle',  cx:150, cy:108, r:80,  label:'Head' },
    { id:'lear',  k:'poly',    pts:'88,52 72,8 122,55',   label:'Tuft L' },
    { id:'rear',  k:'poly',    pts:'212,52 228,8 178,55',  label:'Tuft R' },
    { id:'leyeO', k:'circle',  cx:118, cy:102, r:32,  label:'Eye Ring L' },
    { id:'reyeO', k:'circle',  cx:182, cy:102, r:32,  label:'Eye Ring R' },
    { id:'leye',  k:'circle',  cx:118, cy:102, r:18,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:182, cy:102, r:18,  label:'Eye R' },
    { id:'beak',  k:'poly',    pts:'150,128 136,150 164,150', label:'Beak' },
    { id:'belly', k:'ellipse', cx:150, cy:215, rx:55, ry:65, label:'Belly' },
  ]},
  { id:'penguin',  title:'Penguin',             emoji:'🐧', bg:'#FFFFFF', regions:[
    { id:'body',  k:'ellipse', cx:150, cy:205, rx:82, ry:88, label:'Body' },
    { id:'belly', k:'ellipse', cx:150, cy:212, rx:50, ry:68, label:'Belly' },
    { id:'head',  k:'circle',  cx:150, cy:105, r:65,  label:'Head' },
    { id:'lwing', k:'path',    d:'M 68,160 Q 28,196 42,252 Q 55,278 78,265 L 82,180 Z',   label:'Wing L' },
    { id:'rwing', k:'path',    d:'M 232,160 Q 272,196 258,252 Q 245,278 222,265 L 218,180 Z', label:'Wing R' },
    { id:'leye',  k:'circle',  cx:125, cy:92,  r:15,  label:'Eye L' },
    { id:'reye',  k:'circle',  cx:175, cy:92,  r:15,  label:'Eye R' },
    { id:'beak',  k:'path',    d:'M 140,120 L 150,140 L 160,120 Z', label:'Beak' },
    { id:'lfoot', k:'ellipse', cx:110, cy:285, rx:28, ry:12, label:'Foot L' },
    { id:'rfoot', k:'ellipse', cx:190, cy:285, rx:28, ry:12, label:'Foot R' },
  ]},
  { id:'balloon',  title:'Hot Air Balloon',     emoji:'🎈', bg:'#FFFFFF', regions:[
    { id:'sky',   k:'rect',    x:0, y:0,   w:300, h:300, label:'Sky' },
    { id:'ball',  k:'ellipse', cx:150, cy:130, rx:102, ry:118, label:'Balloon' },
    { id:'seg1',  k:'path',    d:'M 150,12 Q 75,55 48,130 Q 75,168 150,168 Z',                                         label:'Stripe 1' },
    { id:'seg2',  k:'path',    d:'M 150,12 Q 225,55 252,130 Q 225,168 150,168 Z',                                      label:'Stripe 2' },
    { id:'seg3',  k:'path',    d:'M 48,130 Q 75,205 150,248 Q 225,205 252,130 Q 225,168 150,168 Q 75,168 48,130 Z',   label:'Stripe 3' },
    { id:'basket',k:'rect',    x:108,y:245, w:84, h:50, rx:8, label:'Basket' },
    { id:'cloud', k:'path',    d:'M 8,70 a 18,15 0 0 1 36,0 a 14,12 0 0 1 28,0 a 18,15 0 0 1 26,0 L 98,88 L 8,88 Z', label:'Cloud' },
  ]},
  { id:'icecream', title:'Ice Cream',            emoji:'🍦', bg:'#FFFFFF', regions:[
    { id:'cone',   k:'path',    d:'M 88,195 L 150,298 L 212,195 Z', label:'Cone' },
    { id:'sc1',    k:'ellipse', cx:150, cy:158, rx:68, ry:55, label:'Scoop 1' },
    { id:'sc2',    k:'ellipse', cx:150, cy:100, rx:60, ry:52, label:'Scoop 2' },
    { id:'sc3',    k:'ellipse', cx:150, cy:50,  rx:48, ry:42, label:'Scoop 3' },
    { id:'cherry', k:'circle',  cx:150, cy:18,  r:18,  label:'Cherry' },
    { id:'spr1',   k:'circle',  cx:132, cy:48,  r:6,   label:'Sprinkle 1' },
    { id:'spr2',   k:'circle',  cx:162, cy:56,  r:6,   label:'Sprinkle 2' },
    { id:'spr3',   k:'circle',  cx:148, cy:68,  r:6,   label:'Sprinkle 3' },
  ]},
  { id:'turtle',   title:'Cute Turtle',          emoji:'🐢', bg:'#FFFFFF', regions:[
    { id:'shell',  k:'ellipse', cx:150, cy:162, rx:108, ry:90, label:'Shell' },
    { id:'sp1',    k:'path',    d:'M 150,82 Q 188,115 195,158 Q 158,172 105,158 Q 110,112 150,82 Z',                 label:'Patch 1' },
    { id:'sp2',    k:'path',    d:'M 195,158 Q 245,148 252,188 Q 235,222 192,225 Q 172,192 195,158 Z',               label:'Patch 2' },
    { id:'sp3',    k:'path',    d:'M 105,158 Q 58,148 48,188 Q 65,222 108,225 Q 128,192 105,158 Z',                  label:'Patch 3' },
    { id:'sp4',    k:'path',    d:'M 192,225 Q 175,252 150,255 Q 125,252 108,225 Q 130,210 170,210 Z',               label:'Patch 4' },
    { id:'head',   k:'ellipse', cx:150, cy:62,  rx:42, ry:36, label:'Head' },
    { id:'leye',   k:'circle',  cx:132, cy:52,  r:11,  label:'Eye L' },
    { id:'reye',   k:'circle',  cx:168, cy:52,  r:11,  label:'Eye R' },
    { id:'lleg',   k:'ellipse', cx:52,  cy:148, rx:22, ry:36, t:'rotate(-30 52 148)',  label:'Leg L' },
    { id:'rleg',   k:'ellipse', cx:248, cy:148, rx:22, ry:36, t:'rotate(30 248 148)',  label:'Leg R' },
  ]},
  { id:'train',    title:'Choo Choo Train',      emoji:'🚂', bg:'#FFFFFF', regions:[
    { id:'sky',    k:'rect',   x:0,   y:0,   w:300, h:300, label:'Sky' },
    { id:'ground', k:'path',   d:'M 0,255 Q 75,245 150,252 Q 225,260 300,252 L 300,300 L 0,300 Z', label:'Ground' },
    { id:'body',   k:'rect',   x:18,  y:158, w:195, h:95,  rx:8, label:'Body' },
    { id:'cabin',  k:'rect',   x:28,  y:120, w:90,  h:52,  rx:6, label:'Cabin' },
    { id:'chimn',  k:'rect',   x:155, y:132, w:28,  h:38,  rx:5, label:'Chimney' },
    { id:'smk',    k:'circle', cx:169, cy:118, r:16, label:'Smoke' },
    { id:'win',    k:'rect',   x:38,  y:130, w:62,  h:35,  rx:5, label:'Window' },
    { id:'wh1',    k:'circle', cx:58,  cy:252, r:28, label:'Wheel 1' },
    { id:'wh2',    k:'circle', cx:148, cy:252, r:28, label:'Wheel 2' },
    { id:'wh3',    k:'circle', cx:228, cy:252, r:22, label:'Wheel 3' },
  ]},
  { id:'castle',   title:'Castle',               emoji:'🏰', bg:'#FFFFFF', regions:[
    { id:'sky',    k:'rect',  x:0,   y:0,   w:300, h:300, label:'Sky' },
    { id:'grass',  k:'path',  d:'M 0,252 Q 75,238 150,248 Q 225,258 300,248 L 300,300 L 0,300 Z', label:'Grass' },
    { id:'main',   k:'rect',  x:65,  y:115, w:170, h:150, label:'Main Wall' },
    { id:'ltow',   k:'rect',  x:18,  y:88,  w:65,  h:178, label:'Tower L' },
    { id:'rtow',   k:'rect',  x:217, y:88,  w:65,  h:178, label:'Tower R' },
    { id:'gate',   k:'path',  d:'M 105,265 L 105,195 Q 150,162 195,195 L 195,265 Z', label:'Gate' },
    { id:'lwin',   k:'circle',cx:50,  cy:138, r:20, label:'Window L' },
    { id:'rwin',   k:'circle',cx:250, cy:138, r:20, label:'Window R' },
    { id:'flag1',  k:'path',  d:'M 50,88 L 50,50 L 80,64 L 50,76',   label:'Flag L' },
    { id:'flag2',  k:'path',  d:'M 250,88 L 250,50 L 220,64 L 250,76', label:'Flag R' },
  ]},
  { id:'bunny',    title:'Cute Bunny',            emoji:'🐰', bg:'#FFFFFF', regions:[
    { id:'body',   k:'ellipse', cx:150, cy:222, rx:88, ry:75, label:'Body' },
    { id:'head',   k:'circle',  cx:150, cy:128, r:75,  label:'Head' },
    { id:'lear',   k:'ellipse', cx:108, cy:44,  rx:24, ry:60, label:'Ear L' },
    { id:'rear',   k:'ellipse', cx:192, cy:44,  rx:24, ry:60, label:'Ear R' },
    { id:'leye',   k:'circle',  cx:122, cy:112, r:15,  label:'Eye L' },
    { id:'reye',   k:'circle',  cx:178, cy:112, r:15,  label:'Eye R' },
    { id:'nose',   k:'circle',  cx:150, cy:145, r:10,  label:'Nose' },
    { id:'tail',   k:'circle',  cx:228, cy:240, r:20,  label:'Tail' },
    { id:'lleg',   k:'ellipse', cx:108, cy:282, rx:32, ry:18, label:'Leg L' },
    { id:'rleg',   k:'ellipse', cx:192, cy:282, rx:32, ry:18, label:'Leg R' },
  ]},
  { id:'cupcake',  title:'Cupcake',               emoji:'🧁', bg:'#FFFFFF', regions:[
    { id:'wrap',   k:'path',    d:'M 72,192 L 88,282 L 212,282 L 228,192 Z', label:'Cup' },
    { id:'frost',  k:'path',    d:'M 68,195 Q 88,142 108,162 Q 128,142 150,118 Q 172,142 192,162 Q 212,142 232,195 Z', label:'Frosting' },
    { id:'top',    k:'circle',  cx:150, cy:105, r:22,  label:'Swirl Top' },
    { id:'cherry', k:'circle',  cx:150, cy:78,  r:18,  label:'Cherry' },
    { id:'spr1',   k:'circle',  cx:98,  cy:175, r:7,   label:'Sprinkle 1' },
    { id:'spr2',   k:'circle',  cx:125, cy:162, r:7,   label:'Sprinkle 2' },
    { id:'spr3',   k:'circle',  cx:175, cy:162, r:7,   label:'Sprinkle 3' },
    { id:'spr4',   k:'circle',  cx:202, cy:175, r:7,   label:'Sprinkle 4' },
    { id:'spr5',   k:'circle',  cx:150, cy:155, r:7,   label:'Sprinkle 5' },
  ]},
  { id:'sunmoon',  title:'Sun & Stars',           emoji:'🌙', bg:'#FFFFFF', regions:[
    { id:'bg',     k:'rect',    x:0, y:0, w:300, h:300, label:'Sky' },
    { id:'sun',    k:'circle',  cx:85,  cy:110, r:62, label:'Sun' },
    { id:'ray1',   k:'ellipse', cx:85,  cy:28,  rx:10, ry:22, label:'Ray T' },
    { id:'ray2',   k:'ellipse', cx:85,  cy:192, rx:10, ry:22, label:'Ray B' },
    { id:'ray3',   k:'ellipse', cx:3,   cy:110, rx:22, ry:10, label:'Ray L' },
    { id:'ray4',   k:'ellipse', cx:167, cy:110, rx:22, ry:10, label:'Ray R' },
    { id:'ray5',   k:'ellipse', cx:29,  cy:54,  rx:10, ry:22, t:'rotate(-45 29 54)',   label:'Ray TL' },
    { id:'ray6',   k:'ellipse', cx:141, cy:54,  rx:10, ry:22, t:'rotate(45 141 54)',   label:'Ray TR' },
    { id:'moon',   k:'path',    d:'M 210,55 Q 258,78 270,130 Q 258,182 210,202 Q 250,182 262,130 Q 250,78 210,55 Z', label:'Moon' },
    { id:'star1',  k:'circle',  cx:195, cy:252, r:14, label:'Star 1' },
    { id:'star2',  k:'circle',  cx:242, cy:228, r:10, label:'Star 2' },
    { id:'star3',  k:'circle',  cx:270, cy:265, r:12, label:'Star 3' },
  ]},
  { id:'dino',     title:'Dinosaur',              emoji:'🦕', bg:'#FFFFFF', regions:[
    { id:'body',   k:'ellipse', cx:148, cy:210, rx:108, ry:80, label:'Body' },
    { id:'neck',   k:'path',    d:'M 68,155 Q 55,95 72,52 Q 90,30 115,48 Q 132,65 118,108 Q 105,145 92,158 Z', label:'Neck' },
    { id:'head',   k:'ellipse', cx:82,  cy:35,  rx:45, ry:32, label:'Head' },
    { id:'eye',    k:'circle',  cx:65,  cy:25,  r:13,  label:'Eye' },
    { id:'sp1',    k:'poly',    pts:'148,132 138,108 160,108', label:'Spine 1' },
    { id:'sp2',    k:'poly',    pts:'175,120 165,96 185,96',   label:'Spine 2' },
    { id:'sp3',    k:'poly',    pts:'202,116 192,92 212,92',   label:'Spine 3' },
    { id:'lleg',   k:'rect',    x:82,  y:268, w:44, h:32, rx:10, label:'Leg L' },
    { id:'rleg',   k:'rect',    x:162, y:268, w:44, h:32, rx:10, label:'Leg R' },
    { id:'tail',   k:'path',    d:'M 252,240 Q 298,222 295,185', label:'Tail', defaultFill:'none' },
  ]},
  { id:'mermaid',  title:'Mermaid',               emoji:'🧜', bg:'#FFFFFF', regions:[
    { id:'water',  k:'rect',    x:0, y:200, w:300, h:100, label:'Water' },
    { id:'tail',   k:'path',    d:'M 100,230 Q 150,258 200,230 Q 222,268 200,290 Q 150,305 100,290 Q 78,268 100,230 Z', label:'Tail' },
    { id:'fin1',   k:'path',    d:'M 100,290 Q 70,302 52,288 Q 68,274 88,280 Z', label:'Fin L' },
    { id:'fin2',   k:'path',    d:'M 200,290 Q 230,302 248,288 Q 232,274 212,280 Z', label:'Fin R' },
    { id:'body',   k:'path',    d:'M 95,228 Q 80,178 90,142 Q 105,115 150,112 Q 195,115 210,142 Q 220,178 205,228 Q 175,218 150,220 Q 125,218 95,228 Z', label:'Body' },
    { id:'head',   k:'circle',  cx:150, cy:90, r:52, label:'Head' },
    { id:'leye',   k:'circle',  cx:132, cy:84, r:11, label:'Eye L' },
    { id:'reye',   k:'circle',  cx:168, cy:84, r:11, label:'Eye R' },
    { id:'bub1',   k:'circle',  cx:45,  cy:220, r:12, label:'Bubble 1' },
    { id:'bub2',   k:'circle',  cx:255, cy:215, r:10, label:'Bubble 2' },
  ]},
  { id:'submarine',title:'Submarine',             emoji:'🚢', bg:'#FFFFFF', regions:[
    { id:'sea',    k:'rect',    x:0, y:0, w:300, h:300, label:'Ocean' },
    { id:'body',   k:'ellipse', cx:150, cy:175, rx:130, ry:72, label:'Body' },
    { id:'tower',  k:'path',    d:'M 108,103 Q 125,70 168,70 Q 188,70 195,103 Z', label:'Tower' },
    { id:'peri',   k:'rect',    x:145, y:45, w:12, h:30, rx:4, label:'Periscope' },
    { id:'win1',   k:'circle',  cx:85,  cy:170, r:28, label:'Window 1' },
    { id:'win2',   k:'circle',  cx:168, cy:170, r:22, label:'Window 2' },
    { id:'win3',   k:'circle',  cx:232, cy:170, r:16, label:'Window 3' },
    { id:'fin',    k:'path',    d:'M 105,245 Q 72,265 65,244 Q 68,228 105,232 Z', label:'Fin' },
    { id:'fish1',  k:'ellipse', cx:245, cy:52,  rx:20, ry:11, label:'Fish 1' },
    { id:'fish2',  k:'ellipse', cx:48,  cy:262, rx:16, ry:9,  label:'Fish 2' },
  ]},
  { id:'xmastree', title:'Xmas Tree',             emoji:'🎄', bg:'#FFFFFF', regions:[
    { id:'bg',     k:'rect',   x:0,   y:0,   w:300, h:300, label:'Background' },
    { id:'trunk',  k:'rect',   x:128, y:255, w:44,  h:45,  label:'Trunk' },
    { id:'lay3',   k:'path',   d:'M 62,255 L 150,138 L 238,255 Z', label:'Layer 3' },
    { id:'lay2',   k:'path',   d:'M 80,190 L 150,88 L 220,190 Z',  label:'Layer 2' },
    { id:'lay1',   k:'path',   d:'M 98,132 L 150,42 L 202,132 Z',  label:'Layer 1' },
    { id:'star',   k:'poly',   pts:'150,8 158,32 182,32 162,48 170,72 150,56 130,72 138,48 118,32 142,32', label:'Star' },
    { id:'b1',     k:'circle', cx:118, cy:160, r:13, label:'Ball 1' },
    { id:'b2',     k:'circle', cx:182, cy:160, r:13, label:'Ball 2' },
    { id:'b3',     k:'circle', cx:105, cy:218, r:13, label:'Ball 3' },
    { id:'b4',     k:'circle', cx:150, cy:198, r:13, label:'Ball 4' },
    { id:'b5',     k:'circle', cx:195, cy:218, r:13, label:'Ball 5' },
  ]},
  { id:'unicorn',  title:'Unicorn',               emoji:'🦄', bg:'#FFFFFF', regions:[
    { id:'body',   k:'ellipse', cx:168, cy:218, rx:108, ry:72, label:'Body' },
    { id:'neck',   k:'path',    d:'M 72,168 Q 62,118 75,85 Q 90,60 118,68 Q 142,75 138,112 Q 132,150 110,172 Z', label:'Neck' },
    { id:'head',   k:'ellipse', cx:88,  cy:65,  rx:52, ry:42, label:'Head' },
    { id:'horn',   k:'path',    d:'M 75,28 L 98,5 L 120,28 Z', label:'Horn' },
    { id:'ear',    k:'poly',    pts:'112,30 100,5 128,20', label:'Ear' },
    { id:'eye',    k:'circle',  cx:70,  cy:58,  r:13, label:'Eye' },
    { id:'lleg',   k:'rect',    x:100, y:272, w:36, h:28, rx:10, label:'Leg FL' },
    { id:'rleg',   k:'rect',    x:148, y:272, w:36, h:28, rx:10, label:'Leg FR' },
    { id:'lleg2',  k:'rect',    x:202, y:272, w:36, h:28, rx:10, label:'Leg BL' },
    { id:'rleg2',  k:'rect',    x:250, y:272, w:36, h:28, rx:10, label:'Leg BR' },
  ]},
  { id:'fishbowl', title:'Fish Bowl',             emoji:'🐠', bg:'#FFFFFF', regions:[
    { id:'bowl',   k:'circle',  cx:150, cy:168, r:120, label:'Bowl' },
    { id:'water',  k:'path',    d:'M 32,180 Q 38,262 80,288 Q 150,310 220,288 Q 262,262 268,180 Q 228,198 150,200 Q 72,198 32,180 Z', label:'Water' },
    { id:'neck',   k:'rect',    x:108, y:46,  w:84, h:28, rx:8, label:'Neck' },
    { id:'rim',    k:'rect',    x:88,  y:38,  w:124,h:18, rx:9, label:'Rim' },
    { id:'fish1',  k:'ellipse', cx:108, cy:220, rx:32, ry:18, label:'Fish 1' },
    { id:'ftail1', k:'path',    d:'M 140,220 L 158,208 L 158,232 Z', label:'Tail 1' },
    { id:'fish2',  k:'ellipse', cx:195, cy:245, rx:25, ry:15, label:'Fish 2' },
    { id:'ftail2', k:'path',    d:'M 220,245 L 236,234 L 236,256 Z', label:'Tail 2' },
    { id:'sand',   k:'path',    d:'M 32,280 Q 75,268 150,272 Q 225,268 268,280 L 268,295 L 32,295 Z', label:'Sand' },
    { id:'bub1',   k:'circle',  cx:125, cy:178, r:9, label:'Bubble 1' },
    { id:'bub2',   k:'circle',  cx:145, cy:158, r:7, label:'Bubble 2' },
  ]},
  { id:'space',    title:'Space Scene',           emoji:'🌌', bg:'#FFFFFF', regions:[
    { id:'bg',     k:'rect',    x:0, y:0, w:300, h:300, label:'Space' },
    { id:'star1',  k:'circle',  cx:22,  cy:18,  r:5, label:'Star 1' },
    { id:'star2',  k:'circle',  cx:60,  cy:8,   r:4, label:'Star 2' },
    { id:'star3',  k:'circle',  cx:245, cy:28,  r:5, label:'Star 3' },
    { id:'star4',  k:'circle',  cx:280, cy:90,  r:4, label:'Star 4' },
    { id:'star5',  k:'circle',  cx:15,  cy:88,  r:4, label:'Star 5' },
    { id:'moon',   k:'path',    d:'M 48,82 Q 82,98 90,132 Q 82,166 48,182 Q 80,166 88,132 Q 80,98 48,82 Z', label:'Moon' },
    { id:'plan1',  k:'circle',  cx:218, cy:88,  r:50, label:'Planet' },
    { id:'pring',  k:'ellipse', cx:218, cy:88,  rx:75, ry:18, label:'Ring' },
    { id:'ufo',    k:'ellipse', cx:82,  cy:225, rx:55, ry:22, label:'UFO' },
    { id:'ufodm',  k:'ellipse', cx:82,  cy:212, rx:32, ry:20, label:'Dome' },
    { id:'astro',  k:'circle',  cx:150, cy:242, r:30, label:'Astronaut' },
    { id:'asuit',  k:'ellipse', cx:150, cy:278, rx:22, ry:22, label:'Suit' },
  ]},
];

// ─── Hit Testing ─────────────────────────────────────────────────────────────

function pointInPolygon(x: number, y: number, pts: string): boolean {
  const coords = pts.trim().split(/[\s,]+/).map(Number);
  const vx: number[] = [], vy: number[] = [];
  for (let i = 0; i < coords.length; i += 2) { vx.push(coords[i]); vy.push(coords[i + 1]); }
  let inside = false;
  for (let i = 0, j = vx.length - 1; i < vx.length; j = i++) {
    if (((vy[i] > y) !== (vy[j] > y)) && (x < (vx[j] - vx[i]) * (y - vy[i]) / (vy[j] - vy[i]) + vx[i]))
      inside = !inside;
  }
  return inside;
}

function hitTest(region: Region, x: number, y: number): boolean {
  switch (region.k) {
    case 'circle':
      return Math.hypot(x - region.cx, y - region.cy) <= region.r;
    case 'ellipse': {
      const dx = x - region.cx, dy = y - region.cy;
      return (dx * dx) / (region.rx * region.rx) + (dy * dy) / (region.ry * region.ry) <= 1;
    }
    case 'rect':
      return x >= region.x && x <= region.x + region.w && y >= region.y && y <= region.y + region.h;
    case 'poly':
      return pointInPolygon(x, y, region.pts);
    case 'path':
      return false; // paths use SVG onPress fallback
    default:
      return false;
  }
}

// ─── Render SVG Region ────────────────────────────────────────────────────────

const INK = '#2D2A4A';
const SW3 = 2.8;

function RenderRegion({ region, fill, onPress }: { region: Region; fill: string; onPress: () => void }) {
  const isDecor = fill === 'none';
  const common = {
    fill: isDecor ? 'none' : fill,
    stroke: INK,
    strokeWidth: SW3,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
    onPress: region.k === 'path' && !isDecor ? onPress : undefined,
  };
  switch (region.k) {
    case 'circle':
      return <Circle cx={region.cx} cy={region.cy} r={region.r} {...common} />;
    case 'ellipse':
      return <Ellipse cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} transform={region.t} {...common} />;
    case 'path':
      return <Path d={region.d} {...common} fill={isDecor ? 'none' : fill} />;
    case 'rect':
      return <Rect x={region.x} y={region.y} width={region.w} height={region.h} rx={region.rx} {...common} />;
    case 'poly':
      return <Polygon points={region.pts} {...common} />;
    default:
      return null;
  }
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────

function Swatch({ color, selected, onPress }: { color: string; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30 }),
    ]).start();
    onPress();
  };
  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[
        sw.dot,
        { backgroundColor: color, transform: [{ scale }] },
        selected && sw.dotSel,
        color === '#FFFFFF' && { borderColor: '#ccc' },
      ]}>
        {selected && <Text style={sw.check}>✓</Text>}
      </Animated.View>
    </Pressable>
  );
}
const sw = StyleSheet.create({
  dot:    { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#2D2A4A', margin: 3, alignItems: 'center', justifyContent: 'center' },
  dotSel: { borderWidth: 3.5, borderColor: '#fff', elevation: 6, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4 },
  check:  { fontSize: 14, color: '#fff', fontWeight: '900', textShadowColor:'rgba(0,0,0,0.5)', textShadowOffset:{width:1,height:1}, textShadowRadius:2 },
});

// ─── Celebration Overlay ──────────────────────────────────────────────────────

function Celebration({ onClose }: { onClose: () => void }) {
  const scale  = useRef(new Animated.Value(0)).current;
  const emojis = ['🎨','⭐','🌈','✨','🎉','💫','🌟','🎊'];
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 16 }).start();
  }, []);
  return (
    <View style={cel.overlay}>
      {emojis.map((e, i) => {
        const angle = (i / emojis.length) * 2 * Math.PI;
        return (
          <Animated.Text key={i} style={[cel.emoji, {
            top: '30%', left: '45%',
            transform: [
              { translateX: Math.cos(angle) * 110 },
              { translateY: Math.sin(angle) * 90 },
              { scale },
            ],
          }]}>{e}</Animated.Text>
        );
      })}
      <Animated.View style={[cel.card, { transform: [{ scale }] }]}>
        <Text style={cel.wow}>🎨 Amazing!</Text>
        <Text style={cel.sub}>You colored it perfectly!</Text>
        <Pressable onPress={onClose} style={cel.btn}>
          <Text style={cel.btnT}>Try another! ›</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
const cel = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.55)', alignItems:'center', justifyContent:'center', zIndex:99 },
  emoji:   { position:'absolute', fontSize:30 },
  card:    { backgroundColor:'#fff', borderRadius:28, padding:28, alignItems:'center', elevation:10 },
  wow:     { fontSize:30, fontWeight:'900', color:C.ink, marginBottom:8 },
  sub:     { fontSize:16, fontWeight:'700', color:C.inkSoft, marginBottom:20 },
  btn:     { backgroundColor:C.mint, paddingHorizontal:28, paddingVertical:12, borderRadius:20 },
  btnT:    { fontSize:17, fontWeight:'900', color:'#fff' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Fills = Record<string, string>;
type History = Fills[];

export default function ColorMatchScreen({ navigation }: ScreenProps<'ColorMatch'>) {
  const [pageIdx,  setPageIdx]  = useState(() => Math.floor(Math.random() * PAGES.length));
  const [color,    setColor]    = useState(PALETTE[0]);
  const [isEraser, setIsEraser] = useState(false);
  const [fills,    setFills]    = useState<Fills>({});
  const [history,  setHistory]  = useState<History>([]);
  const [celebrate,setCelebrate]= useState(false);
  const canvasRef = useRef<View>(null);

  const page = PAGES[pageIdx];

  useEffect(() => {
    const init: Fills = {};
    page.regions.forEach(r => { init[r.id] = r.defaultFill ?? BLANK; });
    setFills(init);
    setHistory([]);
    setCelebrate(false);
  }, [pageIdx]);

  const paint = useCallback((id: string) => {
    const region = page.regions.find(r => r.id === id);
    if (!region) return;
    const current = fills[id] ?? BLANK;
    const next = isEraser ? (region.defaultFill ?? BLANK) : color;
    if (current === next) return;
    setHistory(h => [...h, { ...fills }]);
    setFills(prev => ({ ...prev, [id]: next }));
  }, [fills, color, isEraser, page]);

  const undo = () => {
    if (history.length === 0) return;
    setFills(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };

  const clear = () => {
    setHistory(h => [...h, { ...fills }]);
    const init: Fills = {};
    page.regions.forEach(r => { init[r.id] = r.defaultFill ?? BLANK; });
    setFills(init);
  };

  const prevPage = () => setPageIdx(i => (i - 1 + PAGES.length) % PAGES.length);
  const nextPage = () => setPageIdx(i => (i + 1) % PAGES.length);

  const saveDrawing = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow access to save your drawing!');
        return;
      }
      const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      setCelebrate(true);
    } catch {
      Alert.alert('Oops!', 'Could not save the drawing.');
    }
  };

  const headerY = useRef(new Animated.Value(-40)).current;
  const headerO = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 8 }),
      Animated.timing(headerO, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const activeColor = isEraser ? ERASER : color;

  // PanResponder converts raw touch pixels → SVG viewBox coords (0-300)
  // and hits the correct region regardless of device scale.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
    })
  ).current;

  const handleTouch = useCallback((px: number, py: number) => {
    const scale = 300 / CANVAS;
    const svgX = px * scale;
    const svgY = py * scale;
    // Test regions in reverse order so top-painted regions get hit first
    for (let i = page.regions.length - 1; i >= 0; i--) {
      const r = page.regions[i];
      if (r.defaultFill === 'none') continue;
      if (hitTest(r, svgX, svgY)) {
        paint(r.id);
        return;
      }
    }
  }, [page, paint]);

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <Animated.View style={[s.header, { opacity: headerO, transform: [{ translateY: headerY }] }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.iconBtn}>
          <Text style={s.iconBtnT}>←</Text>
        </Pressable>
        {/* Page navigation */}
        <Pressable onPress={prevPage} style={s.iconBtn}>
          <Text style={s.iconBtnT}>‹</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.title}>{page.emoji} {page.title}</Text>
          <Text style={s.subtitle}>{pageIdx + 1} / {PAGES.length}</Text>
        </View>
        <Pressable onPress={nextPage} style={s.iconBtn}>
          <Text style={s.iconBtnT}>›</Text>
        </Pressable>
        <Pressable onPress={saveDrawing} style={[s.iconBtn, { backgroundColor: '#FFD6F0' }]}>
          <Text style={s.iconBtnT}>📸</Text>
        </Pressable>
      </Animated.View>

      {/* SVG Canvas */}
      <View style={s.canvasWrap}>
        <View
          ref={canvasRef}
          style={[s.canvas, { backgroundColor: '#FFFFFF' }]}
          collapsable={false}
          {...panResponder.panHandlers}
        >
          <Svg width={CANVAS} height={CANVAS} viewBox="0 0 300 300" pointerEvents="none">
            {page.regions.map(region => (
              <RenderRegion
                key={region.id}
                region={region}
                fill={fills[region.id] ?? BLANK}
                onPress={() => paint(region.id)}
              />
            ))}
          </Svg>
        </View>
      </View>

      {/* Bottom panel */}
      <View style={s.panel}>
        {/* Tool bar */}
        <View style={s.toolbar}>
          <Pressable onPress={undo} style={[s.toolBtn, history.length === 0 && s.toolBtnDim]}>
            <Text style={s.toolBtnT}>↩ Undo</Text>
          </Pressable>
          <Pressable
            onPress={() => setIsEraser(e => !e)}
            style={[s.toolBtn, isEraser && { backgroundColor: C.coral }]}
          >
            <Text style={s.toolBtnT}>{isEraser ? '🧹 Erase' : '✏️ Draw'}</Text>
          </Pressable>
          <Pressable onPress={clear} style={s.toolBtn}>
            <Text style={s.toolBtnT}>🗑 Clear</Text>
          </Pressable>
        </View>

        {/* Active color display */}
        <View style={s.activeRow}>
          <Text style={s.activeLabel}>{isEraser ? '🧹 Eraser' : 'Color'}</Text>
          {!isEraser && (
            <View style={[s.activeDot, { backgroundColor: activeColor, borderColor: activeColor === '#FFFFFF' ? '#ccc' : INK }]} />
          )}
        </View>

        {/* Palette grid — no scroll, all colors visible */}
        <View style={s.palette}>
          {PALETTE.map(c => (
            <Swatch
              key={c}
              color={c}
              selected={!isEraser && color === c}
              onPress={() => { setColor(c); setIsEraser(false); }}
            />
          ))}
        </View>
      </View>

      {celebrate && (
        <Celebration onClose={() => { setCelebrate(false); nextPage(); }} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F4FF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  iconBtnT: { fontSize: 20, fontWeight: '800', color: C.ink },
  title:    { fontSize: 20, fontWeight: '900', color: C.ink },
  subtitle: { fontSize: 12, fontWeight: '700', color: C.inkSoft, marginTop: 1 },
  canvasWrap: { alignItems: 'center', paddingHorizontal: 12 },
  canvas: {
    width: CANVAS, height: CANVAS, borderRadius: 24, overflow: 'hidden',
    elevation: 8, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10,
  },
  panel: {
    backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 22, marginTop: 10,
    paddingTop: 10, paddingBottom: 8,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6,
  },
  toolbar: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, marginBottom: 6 },
  toolBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 14,
    backgroundColor: '#EEF0FF', alignItems: 'center',
  },
  toolBtnDim: { opacity: 0.38 },
  toolBtnT: { fontSize: 12, fontWeight: '800', color: C.ink },
  activeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, marginBottom: 4,
  },
  activeLabel: { fontSize: 12, fontWeight: '700', color: C.inkSoft },
  activeDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingBottom: 4 },
});
