import React from 'react';
import {
  SvgApple, SvgBall, SvgCar, SvgDog, SvgEgg, SvgFish, SvgGrape, SvgHouse,
  SvgIce, SvgJar, SvgKite, SvgLeaf, SvgMoon, SvgNest, SvgOwl, SvgPig,
  SvgQuilt, SvgRocket, SvgSun, SvgTrain, SvgUmbrella, SvgVase, SvgWatch,
  SvgXylophone, SvgYak, SvgZebra, SvgMango,
  SvgCat, SvgStar, SvgTree, SvgHeart, SvgCloud, SvgCup, SvgKey, SvgHat,
  SvgSock, SvgBed, SvgDoor, SvgRing, SvgBird, SvgBook,
  SvgCircleShape, SvgSquareShape, SvgTriangleShape, SvgStarShape, SvgHeartShape,
  SvgOvalShape, SvgDiamondShape, SvgHexagonShape, SvgPentagonShape, SvgCrossShape,
  SvgCrescentShape, SvgArrowShape, SvgTrapezoidShape, SvgParallelogramShape, SvgOctagonShape,
  SvgHeptagonShape, SvgKiteShape, SvgSemiCircleShape, SvgDropShape, SvgPieShape,
  SvgButterfly, SvgRainbow, SvgRobot, SvgPizza, SvgCake, SvgBoat, SvgPlane, SvgFlower, SvgMushroom, SvgCrab, SvgWhale, SvgCactus, SvgGift, SvgHelicopter, SvgSubmarine
} from '../components/Illustrations';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Animal {
  id: string;
  name: string;
  image: any;
  color: string;
  bgGradient: [string, string];
  fact: string;
}

export interface AlphabetItem {
  word: string;
  letter: string;
  color: string;
  render: () => React.ReactNode;
}

export interface ShadowItem {
  id: string;
  name: string;
  render: (isShadow?: boolean) => React.ReactNode;
}

export interface WordRound {
  word: string;
  options: string[];
  Illus: () => React.ReactNode;
  bg: string;
}

export interface ShapeDef {
  name: string;
  color: string;
  render: (fill: string) => React.ReactNode;
}

export interface MusicTrack {
  id: string;
  title: string;
  type: 'song' | 'poem';
  emoji: string;
  color: string;
  dark: string;
  lyrics: string[];
  file?: any;
  youtubeId?: string;
}

// ─── Animals ──────────────────────────────────────────────────────────────────

export const ANIMALS: Animal[] = [
  { id: '1', name: 'Lion', image: require('../../assets/animals/lion.jpg'), color: '#FFB347', bgGradient: ['#FFD580', '#FF9500'], fact: 'King of the jungle!' },
  { id: '2', name: 'Tiger', image: require('../../assets/animals/tiger.jpg'), color: '#FF7043', bgGradient: ['#FFAB91', '#FF5722'], fact: 'Has 100 stripes!' },
  { id: '3', name: 'Elephant', image: require('../../assets/animals/elephant.jpg'), color: '#90A4AE', bgGradient: ['#CFD8DC', '#78909C'], fact: 'Never forgets!' },
  { id: '4', name: 'Dog', image: require('../../assets/animals/dog.jpg'), color: '#A1887F', bgGradient: ['#D7CCC8', '#795548'], fact: "Human's best friend!" },
  { id: '5', name: 'Cat', image: require('../../assets/animals/cat.jpg'), color: '#CE93D8', bgGradient: ['#E1BEE7', '#AB47BC'], fact: 'Purr-fect pets!' },
  { id: '6', name: 'Cow', image: require('../../assets/animals/cow.jpg'), color: '#80CBC4', bgGradient: ['#B2EBF2', '#26C6DA'], fact: 'Gives us milk!' },
  { id: '7', name: 'Bear', image: require('../../assets/animals/bear.jpg'), color: '#8D6E63', bgGradient: ['#BCAAA4', '#6D4C41'], fact: 'Loves honey!' },
  { id: '8', name: 'Chicken', image: require('../../assets/animals/chicken.jpg'), color: '#F9A825', bgGradient: ['#FFF59D', '#F9A825'], fact: 'Lays yummy eggs!' },
  { id: '9', name: 'Pig', image: require('../../assets/animals/pig.jpg'), color: '#F48FB1', bgGradient: ['#FCE4EC', '#EC407A'], fact: 'Very smart animal!' },
  { id: '10', name: 'Monkey', image: require('../../assets/animals/monkey.jpg'), color: '#FFCC80', bgGradient: ['#FFE0B2', '#FB8C00'], fact: 'Loves bananas!' },
  { id: '11', name: 'Gorilla', image: require('../../assets/animals/gorilla.jpg'), color: '#78909C', bgGradient: ['#B0BEC5', '#455A64'], fact: 'Strongest primate!' },
  { id: '12', name: 'Deer', image: require('../../assets/animals/deer.jpg'), color: '#A5D6A7', bgGradient: ['#C8E6C9', '#43A047'], fact: 'Has big antlers!' },
  { id: '13', name: 'Rabbit', image: require('../../assets/animals/rabbit.jpg'), color: '#EF9A9A', bgGradient: ['#FFCDD2', '#EF5350'], fact: 'Hops super fast!' },
  { id: '14', name: 'Goat', image: require('../../assets/animals/goat.jpg'), color: '#C5E1A5', bgGradient: ['#DCEDC8', '#7CB342'], fact: 'Climbs mountains!' },
  { id: '15', name: 'Horse', image: require('../../assets/animals/horse.jpg'), color: '#BCAAA4', bgGradient: ['#D7CCC8', '#8D6E63'], fact: 'Runs super fast!' },
  { id: '16', name: 'Sheep', image: require('../../assets/animals/sheep.jpg'), color: '#E0E0E0', bgGradient: ['#F5F5F5', '#BDBDBD'], fact: 'Gives us wool!' },
  { id: '17', name: 'Wolf', image: require('../../assets/animals/wolf.jpg'), color: '#B0BEC5', bgGradient: ['#ECEFF1', '#607D8B'], fact: 'Howls at the moon!' },
  { id: '18', name: 'Fox', image: require('../../assets/animals/fox.jpg'), color: '#FF8A65', bgGradient: ['#FFCCBC', '#FF5722'], fact: 'Very clever animal!' },
  { id: '19', name: 'Duck', image: require('../../assets/animals/duck.jpg'), color: '#80DEEA', bgGradient: ['#E0F7FA', '#00BCD4'], fact: 'Loves to swim!' },
  { id: '20', name: 'Squirrel', image: require('../../assets/animals/squirrel.jpg'), color: '#FFAB91', bgGradient: ['#FBE9E7', '#FF7043'], fact: 'Collects acorns!' },
  { id: '21', name: 'Zebra', image: require('../../assets/animals/zebra.jpg'), color: '#757575', bgGradient: ['#F5F5F5', '#424242'], fact: 'Has cool stripes!' },
  { id: '22', name: 'Giraffe', image: require('../../assets/animals/giraffe.jpg'), color: '#FFD54F', bgGradient: ['#FFF8E1', '#FFB300'], fact: 'Tallest animal ever!' },
  { id: '23', name: 'Penguin', image: require('../../assets/animals/penguin.jpg'), color: '#90CAF9', bgGradient: ['#E3F2FD', '#1E88E5'], fact: 'Swims but not fly!' },
  { id: '24', name: 'Frog', image: require('../../assets/animals/frog.jpg'), color: '#69F0AE', bgGradient: ['#E8F5E9', '#00C853'], fact: 'Ribbit ribbit!' },
  { id: '25', name: 'Panda', image: require('../../assets/animals/panda.jpg'), color: '#EEEEEE', bgGradient: ['#FAFAFA', '#9E9E9E'], fact: 'Eats bamboo all day!' },
  { id: '26', name: 'Crocodile', image: require('../../assets/animals/crocodile.jpg'), color: '#66BB6A', bgGradient: ['#C8E6C9', '#388E3C'], fact: 'Very old reptile!' },
  { id: '27', name: 'Owl', image: require('../../assets/animals/owl.jpg'), color: '#8D6E63', bgGradient: ['#EFEBE9', '#5D4037'], fact: 'Sees in the dark!' },
  { id: '28', name: 'Parrot', image: require('../../assets/animals/parrot.jpg'), color: '#AED581', bgGradient: ['#F1F8E9', '#7CB342'], fact: 'Can copy your words!' },
  { id: '29', name: 'Flamingo', image: require('../../assets/animals/flamingo.jpg'), color: '#F48FB1', bgGradient: ['#FCE4EC', '#E91E63'], fact: 'Stands on one leg!' },
  { id: '30', name: 'Camel', image: require('../../assets/animals/camel.jpg'), color: '#FFD54F', bgGradient: ['#FFF8E1', '#F9A825'], fact: 'Survives without water!' },
  { id: '31', name: 'Dolphin', image: require('../../assets/animals/dolphin.jpg'), color: '#4FC3F7', bgGradient: ['#E1F5FE', '#0288D1'], fact: 'Super smart swimmer!' },
  { id: '32', name: 'Turtle', image: require('../../assets/animals/turtle.jpg'), color: '#81C784', bgGradient: ['#E8F5E9', '#388E3C'], fact: 'Lives 100+ years!' },
];

// ─── Alphabet Items ───────────────────────────────────────────────────────────

export const ALPHABET_ITEMS: AlphabetItem[] = [
  { word: 'Apple', letter: 'A', color: '#FF5252', render: () => <SvgApple /> },
  { word: 'Ball', letter: 'B', color: '#42A5F5', render: () => <SvgBall /> },
  { word: 'Car', letter: 'C', color: '#EF5350', render: () => <SvgCar /> },
  { word: 'Dog', letter: 'D', color: '#D2691E', render: () => <SvgDog /> },
  { word: 'Egg', letter: 'E', color: '#FFF9C4', render: () => <SvgEgg /> },
  { word: 'Fish', letter: 'F', color: '#FF9800', render: () => <SvgFish /> },
  { word: 'Grapes', letter: 'G', color: '#9C27B0', render: () => <SvgGrape /> },
  { word: 'House', letter: 'H', color: '#F44336', render: () => <SvgHouse /> },
  { word: 'Ice Cream', letter: 'I', color: '#E91E63', render: () => <SvgIce /> },
  { word: 'Jar', letter: 'J', color: '#00BCD4', render: () => <SvgJar /> },
  { word: 'Kite', letter: 'K', color: '#E91E63', render: () => <SvgKite /> },
  { word: 'Leaf', letter: 'L', color: '#8BC34A', render: () => <SvgLeaf /> },
  { word: 'Moon', letter: 'M', color: '#FFD54F', render: () => <SvgMoon /> },
  { word: 'Nest', letter: 'N', color: '#795548', render: () => <SvgNest /> },
  { word: 'Owl', letter: 'O', color: '#8D6E63', render: () => <SvgOwl /> },
  { word: 'Pig', letter: 'P', color: '#FFB3C1', render: () => <SvgPig /> },
  { word: 'Quilt', letter: 'Q', color: '#FF8A65', render: () => <SvgQuilt /> },
  { word: 'Rocket', letter: 'R', color: '#EF5350', render: () => <SvgRocket /> },
  { word: 'Sun', letter: 'S', color: '#FFD54F', render: () => <SvgSun /> },
  { word: 'Train', letter: 'T', color: '#1E88E5', render: () => <SvgTrain /> },
  { word: 'Umbrella', letter: 'U', color: '#7C4DFF', render: () => <SvgUmbrella /> },
  { word: 'Vase', letter: 'V', color: '#42A5F5', render: () => <SvgVase /> },
  { word: 'Watch', letter: 'W', color: '#E8EAF6', render: () => <SvgWatch /> },
  { word: 'Xylophone', letter: 'X', color: '#F44336', render: () => <SvgXylophone /> },
  { word: 'Yak', letter: 'Y', color: '#5D4037', render: () => <SvgYak /> },
  { word: 'Zebra', letter: 'Z', color: '#fff', render: () => <SvgZebra /> },
];

// ─── Shadow Match Items ───────────────────────────────────────────────────────

export const SHADOW_ITEMS: ShadowItem[] = [
  { id: 'cat', name: 'Cat', render: (s) => <SvgCat isShadow={s} /> },
  { id: 'sun', name: 'Sun', render: (s) => <SvgSun isShadow={s} /> },
  { id: 'apple', name: 'Apple', render: (s) => <SvgApple isShadow={s} /> },
  { id: 'ball', name: 'Ball', render: (s) => <SvgBall isShadow={s} /> },
  { id: 'star', name: 'Star', render: (s) => <SvgStar isShadow={s} /> },
  { id: 'tree', name: 'Tree', render: (s) => <SvgTree isShadow={s} /> },
  { id: 'moon', name: 'Moon', render: (s) => <SvgMoon isShadow={s} /> },
  { id: 'car', name: 'Car', render: (s) => <SvgCar isShadow={s} /> },
  { id: 'fish', name: 'Fish', render: (s) => <SvgFish isShadow={s} /> },
  { id: 'house', name: 'House', render: (s) => <SvgHouse isShadow={s} /> },
  { id: 'heart', name: 'Heart', render: (s) => <SvgHeart isShadow={s} /> },
  { id: 'cloud', name: 'Cloud', render: (s) => <SvgCloud isShadow={s} /> },
  { id: 'cup', name: 'Cup', render: (s) => <SvgCup isShadow={s} /> },
  { id: 'key', name: 'Key', render: (s) => <SvgKey isShadow={s} /> },
  { id: 'hat', name: 'Hat', render: (s) => <SvgHat isShadow={s} /> },
  { id: 'sock', name: 'Sock', render: (s) => <SvgSock isShadow={s} /> },
  { id: 'leaf', name: 'Leaf', render: (s) => <SvgLeaf isShadow={s} /> },
  { id: 'ice', name: 'Ice Cream', render: (s) => <SvgIce isShadow={s} /> },
  { id: 'bed', name: 'Bed', render: (s) => <SvgBed isShadow={s} /> },
  { id: 'door', name: 'Door', render: (s) => <SvgDoor isShadow={s} /> },
  { id: 'ring', name: 'Ring', render: (s) => <SvgRing isShadow={s} /> },
  { id: 'bird', name: 'Bird', render: (s) => <SvgBird isShadow={s} /> },
  { id: 'rocket', name: 'Rocket', render: (s) => <SvgRocket isShadow={s} /> },
  { id: 'train', name: 'Train', render: (s) => <SvgTrain isShadow={s} /> },
  { id: 'owl', name: 'Owl', render: (s) => <SvgOwl isShadow={s} /> },
  { id: 'pig', name: 'Pig', render: (s) => <SvgPig isShadow={s} /> },
  { id: 'egg', name: 'Egg', render: (s) => <SvgEgg isShadow={s} /> },
  { id: 'kite', name: 'Kite', render: (s) => <SvgKite isShadow={s} /> },
  { id: 'nest', name: 'Nest', render: (s) => <SvgNest isShadow={s} /> },
  { id: 'umbrella', name: 'Umbrella', render: (s) => <SvgUmbrella isShadow={s} /> },
  { id: 'vase', name: 'Vase', render: (s) => <SvgVase isShadow={s} /> },
  { id: 'watch', name: 'Watch', render: (s) => <SvgWatch isShadow={s} /> },
  { id: 'zebra', name: 'Zebra', render: (s) => <SvgZebra isShadow={s} /> },
  { id: 'mango', name: 'Mango', render: (s) => <SvgMango isShadow={s} /> },
  { id: 'dog', name: 'Dog', render: (s) => <SvgDog isShadow={s} /> },
  { id: 'grape', name: 'Grape', render: (s) => <SvgGrape isShadow={s} /> },
  { id: 'butterfly', name: 'Butterfly', render: (s) => <SvgButterfly isShadow={s} /> },
  { id: 'rainbow', name: 'Rainbow', render: (s) => <SvgRainbow isShadow={s} /> },
  { id: 'robot', name: 'Robot', render: (s) => <SvgRobot isShadow={s} /> },
  { id: 'pizza', name: 'Pizza', render: (s) => <SvgPizza isShadow={s} /> },
  { id: 'cake', name: 'Cake', render: (s) => <SvgCake isShadow={s} /> },
  { id: 'boat', name: 'Boat', render: (s) => <SvgBoat isShadow={s} /> },
  { id: 'plane', name: 'Plane', render: (s) => <SvgPlane isShadow={s} /> },
  { id: 'flower', name: 'Flower', render: (s) => <SvgFlower isShadow={s} /> },
  { id: 'mushroom', name: 'Mushroom', render: (s) => <SvgMushroom isShadow={s} /> },
  { id: 'crab', name: 'Crab', render: (s) => <SvgCrab isShadow={s} /> },
  { id: 'whale', name: 'Whale', render: (s) => <SvgWhale isShadow={s} /> },
  { id: 'cactus', name: 'Cactus', render: (s) => <SvgCactus isShadow={s} /> },
  { id: 'gift', name: 'Gift', render: (s) => <SvgGift isShadow={s} /> },
  { id: 'helicopter', name: 'Helicopter', render: (s) => <SvgHelicopter isShadow={s} /> },
  { id: 'submarine', name: 'Submarine', render: (s) => <SvgSubmarine isShadow={s} /> },
];

// ─── Word Match Bank ──────────────────────────────────────────────────────────

export const WORD_BANK: WordRound[] = [
  { word: 'CAT', options: ['CAT', 'BAT', 'DOG', 'RAT'], Illus: SvgCat, bg: '#FFF3E0' },
  { word: 'SUN', options: ['SUN', 'MOON', 'SKY', 'STAR'], Illus: SvgSun, bg: '#FFFDE7' },
  { word: 'APPLE', options: ['APPLE', 'BANANA', 'GRAPE', 'PEAR'], Illus: SvgApple, bg: '#FFEBEE' },
  { word: 'BALL', options: ['BALL', 'BAT', 'GAME', 'TOY'], Illus: SvgBall, bg: '#E3F2FD' },
  { word: 'STAR', options: ['STAR', 'SUN', 'MOON', 'PLANET'], Illus: SvgStar, bg: '#FFFDE7' },
  { word: 'TREE', options: ['TREE', 'LEAF', 'FLOWER', 'PLANT'], Illus: SvgTree, bg: '#E8F5E9' },
  { word: 'MOON', options: ['MOON', 'SUN', 'STAR', 'NIGHT'], Illus: SvgMoon, bg: '#F3E5F5' },
  { word: 'CAR', options: ['CAR', 'BUS', 'BIKE', 'TRAIN'], Illus: SvgCar, bg: '#FFEBEE' },
  { word: 'FISH', options: ['FISH', 'SHARK', 'CRAB', 'FROG'], Illus: SvgFish, bg: '#E0F7FA' },
  { word: 'HOUSE', options: ['HOUSE', 'HOME', 'TENT', 'DOOR'], Illus: SvgHouse, bg: '#FFF9C4' },
  { word: 'BOOK', options: ['BOOK', 'PAPER', 'PEN', 'READ'], Illus: SvgBook, bg: '#E8EAF6' },
  { word: 'HEART', options: ['HEART', 'LOVE', 'STAR', 'RED'], Illus: SvgHeart, bg: '#FCE4EC' },
  { word: 'CLOUD', options: ['CLOUD', 'SKY', 'RAIN', 'SUN'], Illus: SvgCloud, bg: '#E3F2FD' },
  { word: 'CUP', options: ['CUP', 'MUG', 'GLASS', 'BOWL'], Illus: SvgCup, bg: '#E1F5FE' },
  { word: 'KEY', options: ['KEY', 'DOOR', 'LOCK', 'RING'], Illus: SvgKey, bg: '#FFFDE7' },
  { word: 'HAT', options: ['HAT', 'CAP', 'HEAD', 'HAIR'], Illus: SvgHat, bg: '#F3E5F5' },
  { word: 'SOCK', options: ['SOCK', 'SHOE', 'FOOT', 'BOOT'], Illus: SvgSock, bg: '#E8F5E9' },
  { word: 'LEAF', options: ['LEAF', 'TREE', 'GREEN', 'PLANT'], Illus: SvgLeaf, bg: '#F1F8E9' },
  { word: 'ICE', options: ['ICE', 'COLD', 'SNOW', 'CREAM'], Illus: SvgIce, bg: '#FFF3E0' },
  { word: 'BED', options: ['BED', 'SLEEP', 'ROOM', 'NIGHT'], Illus: SvgBed, bg: '#E3F2FD' },
  { word: 'DOOR', options: ['DOOR', 'HOME', 'WALL', 'WOOD'], Illus: SvgDoor, bg: '#EFEBE9' },
  { word: 'RING', options: ['RING', 'HAND', 'GOLD', 'STAR'], Illus: SvgRing, bg: '#E0F7FA' },
  { word: 'BIRD', options: ['BIRD', 'FLY', 'SKY', 'WING'], Illus: SvgBird, bg: '#E1F5FE' },
  { word: 'ROCKET', options: ['ROCKET', 'FLY', 'SPACE', 'MOON'], Illus: SvgRocket, bg: '#FFEBEE' },
  { word: 'TRAIN', options: ['TRAIN', 'BUS', 'CAR', 'ROAD'], Illus: SvgTrain, bg: '#E3F2FD' },
  { word: 'OWL', options: ['OWL', 'BIRD', 'NIGHT', 'WISE'], Illus: SvgOwl, bg: '#EFEBE9' },
  { word: 'PIG', options: ['PIG', 'PINK', 'FARM', 'ANIMAL'], Illus: SvgPig, bg: '#FCE4EC' },
  { word: 'EGG', options: ['EGG', 'FOOD', 'BIRD', 'WHITE'], Illus: SvgEgg, bg: '#FFF9C4' },
  { word: 'KITE', options: ['KITE', 'FLY', 'SKY', 'WIND'], Illus: SvgKite, bg: '#F3E5F5' },
  { word: 'NEST', options: ['NEST', 'BIRD', 'HOME', 'EGG'], Illus: SvgNest, bg: '#E8F5E9' },
  { word: 'UMBRELLA', options: ['UMBRELLA', 'RAIN', 'SUN', 'WET'], Illus: SvgUmbrella, bg: '#F3E5F5' },
  { word: 'VASE', options: ['VASE', 'FLOWER', 'POT', 'WATER'], Illus: SvgVase, bg: '#E1F5FE' },
  { word: 'WATCH', options: ['WATCH', 'TIME', 'CLOCK', 'HAND'], Illus: SvgWatch, bg: '#E8EAF6' },
  { word: 'ZEBRA', options: ['ZEBRA', 'HORSE', 'STRIPE', 'ANIMAL'], Illus: SvgZebra, bg: '#F5F5F5' },
  { word: 'MANGO', options: ['MANGO', 'FRUIT', 'APPLE', 'PEACH'], Illus: SvgMango, bg: '#FFF3E0' },
  { word: 'DOG', options: ['DOG', 'CAT', 'PET', 'WOLF'], Illus: SvgDog, bg: '#EFEBE9' },
  { word: 'GRAPE', options: ['GRAPE', 'FRUIT', 'APPLE', 'PLUM'], Illus: SvgGrape, bg: '#F3E5F5' },
  { word: 'BUTTERFLY', options: ['BUTTERFLY', 'BIRD', 'FLY', 'BUG'], Illus: SvgButterfly, bg: '#FCE4EC' },
  { word: 'RAINBOW', options: ['RAINBOW', 'SUN', 'SKY', 'CLOUD'], Illus: SvgRainbow, bg: '#E1F5FE' },
  { word: 'ROBOT', options: ['ROBOT', 'TOY', 'IRON', 'GEAR'], Illus: SvgRobot, bg: '#ECEFF1' },
  { word: 'PIZZA', options: ['PIZZA', 'FOOD', 'CAKE', 'BREAD'], Illus: SvgPizza, bg: '#FFF3E0' },
  { word: 'CAKE', options: ['CAKE', 'SWEET', 'PARTY', 'FOOD'], Illus: SvgCake, bg: '#FCE4EC' },
  { word: 'BOAT', options: ['BOAT', 'SHIP', 'WATER', 'SEA'], Illus: SvgBoat, bg: '#E1F5FE' },
  { word: 'PLANE', options: ['PLANE', 'FLY', 'SKY', 'BIRD'], Illus: SvgPlane, bg: '#E3F2FD' },
  { word: 'FLOWER', options: ['FLOWER', 'ROSE', 'GARDEN', 'PLANT'], Illus: SvgFlower, bg: '#F1F8E9' },
  { word: 'MUSHROOM', options: ['MUSHROOM', 'PLANT', 'FOREST', 'FOOD'], Illus: SvgMushroom, bg: '#FDF2F0' },
  { word: 'CRAB', options: ['CRAB', 'FISH', 'SEA', 'WATER'], Illus: SvgCrab, bg: '#FFEBEE' },
  { word: 'WHALE', options: ['WHALE', 'FISH', 'SEA', 'BIG'], Illus: SvgWhale, bg: '#E0F7FA' },
  { word: 'CACTUS', options: ['CACTUS', 'PLANT', 'GREEN', 'DESERT'], Illus: SvgCactus, bg: '#F1F8E9' },
  { word: 'GIFT', options: ['GIFT', 'BOX', 'PARTY', 'TOY'], Illus: SvgGift, bg: '#FFFDE7' },
  { word: 'HELICOPTER', options: ['HELICOPTER', 'PLANE', 'FLY', 'SKY'], Illus: SvgHelicopter, bg: '#E1F5FE' },
  { word: 'SUBMARINE', options: ['SUBMARINE', 'SEA', 'WATER', 'SHIP'], Illus: SvgSubmarine, bg: '#FFF9C4' },
];


// ─── Music Tracks ─────────────────────────────────────────────────────────────

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: '1', title: 'Twinkle Twinkle', type: 'poem', emoji: '⭐',
    color: '#FFF176', dark: '#F9A825',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
    ],
  },
  {
    id: '2', title: 'ABC Song', type: 'poem', emoji: '🔤',
    color: '#B3E5FC', dark: '#0288D1',
    lyrics: [
      'A B C D E F G,',
      'H I J K L M N O P,',
      'Q R S T U V,',
      'W X Y and Z!',
      'Now I know my ABCs,',
      "Next time won't you sing with me?",
    ],
  },
  {
    id: '3', title: 'Wheels on the Bus', type: 'poem', emoji: '🚌',
    color: '#C8E6C9', dark: '#388E3C',
    lyrics: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round,',
      'The wheels on the bus go round and round,',
      'All through the town!',
    ],
  },
  {
    id: '4', title: 'Baa Baa Black Sheep', type: 'poem', emoji: '🐑',
    color: '#F3E5F5', dark: '#7B1FA2',
    lyrics: [
      'Baa, baa, black sheep,',
      'Have you any wool?',
      'Yes sir, yes sir,',
      'Three bags full!',
      'One for the master,',
      'One for the dame,',
      'One for the little boy',
      'Who lives down the lane.',
    ],
  },
  {
    id: '5', title: 'Humpty Dumpty', type: 'poem', emoji: '🥚',
    color: '#FFE0B2', dark: '#E65100',
    lyrics: [
      'Humpty Dumpty sat on a wall,',
      'Humpty Dumpty had a great fall.',
      "All the king's horses",
      'And all the king\'s men,',
      "Couldn't put Humpty",
      'Together again!',
    ],
  },
  {
    id: '6', title: 'Row Your Boat', type: 'poem', emoji: '🚣',
    color: '#B2EBF2', dark: '#00838F',
    lyrics: [
      'Row, row, row your boat,',
      'Gently down the stream,',
      'Merrily, merrily, merrily, merrily,',
      'Life is but a dream!',
    ],
  },
  {
    id: '7', title: 'Old MacDonald', type: 'poem', emoji: '🚜',
    color: '#DCEDC8', dark: '#558B2F',
    lyrics: [
      'Old MacDonald had a farm,',
      'E-I-E-I-O!',
      'And on his farm he had a cow,',
      'E-I-E-I-O!',
      'With a moo moo here,',
      'And a moo moo there,',
      'Here a moo, there a moo,',
      'Everywhere a moo moo!',
    ],
  },
  {
    id: '8', title: 'Itsy Bitsy Spider', type: 'poem', emoji: '🕷️',
    color: '#FCE4EC', dark: '#C2185B',
    lyrics: [
      'The itsy bitsy spider',
      'Climbed up the water spout,',
      'Down came the rain',
      'And washed the spider out.',
      'Out came the sun',
      'And dried up all the rain,',
      'And the itsy bitsy spider',
      'Climbed up the spout again!',
    ],
  },
  {
    id: '13', title: 'London Bridge', type: 'poem', emoji: '🌉',
    color: '#E0F2F1', dark: '#00695C',
    lyrics: [
      'London Bridge is falling down,',
      'Falling down, falling down.',
      'London Bridge is falling down,',
      'My fair lady!',
    ],
  },
  {
    id: '14', title: 'Rain Rain Go Away', type: 'poem', emoji: '☔',
    color: '#E1F5FE', dark: '#0277BD',
    lyrics: [
      'Rain, rain, go away,',
      'Come again another day.',
      'Little Johnny wants to play,',
      'Rain, rain, go away!',
    ],
  },
  {
    id: '15', title: 'Head & Shoulders', type: 'poem', emoji: '🧘',
    color: '#F3E5F5', dark: '#6A1B9A',
    lyrics: [
      'Head, shoulders, knees, and toes,',
      'Knees and toes!',
      'Head, shoulders, knees, and toes,',
      'Knees and toes!',
      'And eyes and ears and mouth and nose,',
      'Head, shoulders, knees, and toes,',
      'Knees and toes!',
    ],
  },
  {
    id: '16', title: 'Johny Johny', type: 'poem', emoji: '👶',
    color: '#FFCCBC', dark: '#E64A19',
    lyrics: ['Johny, Johny, Yes Papa!', 'Eating sugar? No Papa!', 'Telling lies? No Papa!', 'Open your mouth, Ha! Ha! Ha!'],
    youtubeId: '809t-32kC3k',
  },
  {
    id: '17', title: 'Finger Family', type: 'poem', emoji: '✋',
    color: '#C8E6C9', dark: '#2E7D32',
    lyrics: ['Daddy finger, daddy finger, where are you?', 'Here I am, here I am. How do you do?'],
    youtubeId: 'YJyNoFkud6g',
  },
  {
    id: '18', title: 'Five Little Ducks', type: 'poem', emoji: '🦆',
    color: '#FFF9C4', dark: '#FBC02D',
    lyrics: ['Five little ducks went out one day', 'Over the hill and far away'],
    youtubeId: 'pZw9veQ76fo',
  },
];

// ─── Shapes ───────────────────────────────────────────────────────────────────

export const SHAPES: ShapeDef[] = [
  { name: 'Circle', color: '#FF5E5E', render: f => <SvgCircleShape fill={f} /> },
  { name: 'Square', color: '#5E8BFF', render: f => <SvgSquareShape fill={f} /> },
  { name: 'Triangle', color: '#5EE39F', render: f => <SvgTriangleShape fill={f} /> },
  { name: 'Star', color: '#FFEB3B', render: f => <SvgStarShape fill={f} /> },
  { name: 'Heart', color: '#FF5EC1', render: f => <SvgHeartShape fill={f} /> },
  { name: 'Oval', color: '#FF9800', render: f => <SvgOvalShape fill={f} /> },
  { name: 'Diamond', color: '#9C27B0', render: f => <SvgDiamondShape fill={f} /> },
  { name: 'Hexagon', color: '#00BCD4', render: f => <SvgHexagonShape fill={f} /> },
  { name: 'Pentagon', color: '#4CAF50', render: f => <SvgPentagonShape fill={f} /> },
  { name: 'Cross', color: '#FF5722', render: f => <SvgCrossShape fill={f} /> },
  { name: 'Crescent', color: '#FFD54F', render: f => <SvgCrescentShape fill={f} /> },
  { name: 'Arrow', color: '#FF5252', render: f => <SvgArrowShape fill={f} /> },
  { name: 'Trapezoid', color: '#4CAF50', render: f => <SvgTrapezoidShape fill={f} /> },
  { name: 'Parallelogram', color: '#2196F3', render: f => <SvgParallelogramShape fill={f} /> },
  { name: 'Octagon', color: '#9C27B0', render: f => <SvgOctagonShape fill={f} /> },
  { name: 'Heptagon', color: '#00BCD4', render: f => <SvgHeptagonShape fill={f} /> },
  { name: 'Kite', color: '#E91E63', render: f => <SvgKiteShape fill={f} /> },
  { name: 'Semi-Circle', color: '#8BC34A', render: f => <SvgSemiCircleShape fill={f} /> },
  { name: 'Drop', color: '#03A9F4', render: f => <SvgDropShape fill={f} /> },
  { name: 'Pie', color: '#FFC107', render: f => <SvgPieShape fill={f} /> },
];


// ─── Math Game ────────────────────────────────────────────────────────────────

export const MATH_ICONS = ['🍎', '⭐', '🎈', '🍪', '🦁', '🍦', '🍓', '🥕', '🍭', '🍔'];

export type MathOp = '+' | '−' | '×';
export interface MathQuestion {
  a: number;
  b: number;
  op: MathOp;
  answer: number;
  options: number[];
}

function makeMathOptions(answer: number, op: MathOp): number[] {
  const offsets = op === '×' ? [-answer, answer, 2, -2, 3, -3] : [-2, -1, 1, 2, 3, -3];
  const wrongs = new Set<number>();
  const shuffled = [...offsets].sort(() => Math.random() - 0.5);
  for (const d of shuffled) {
    const w = answer + d;
    if (w !== answer && w >= 0 && w <= 99) wrongs.add(w);
    if (wrongs.size === 3) break;
  }
  let pad = 1;
  while (wrongs.size < 3) { wrongs.add(answer + pad * 5); pad++; }
  return [...[answer, ...[...wrongs].slice(0, 3)]].sort(() => Math.random() - 0.5);
}

function makeMathQ(a: number, b: number, op: MathOp): MathQuestion {
  const answer = op === '+' ? a + b : op === '−' ? a - b : a * b;
  return { a, b, op, answer, options: makeMathOptions(answer, op) };
}

export const MATH_BASE_POOL: MathQuestion[] = [
  makeMathQ(1, 1, '+'), makeMathQ(2, 1, '+'), makeMathQ(3, 2, '+'), makeMathQ(5, 1, '+'), makeMathQ(4, 3, '+'),
  makeMathQ(2, 2, '+'), makeMathQ(6, 2, '+'), makeMathQ(1, 4, '+'), makeMathQ(3, 3, '+'), makeMathQ(8, 1, '+'),
  makeMathQ(2, 1, '−'), makeMathQ(5, 2, '−'), makeMathQ(6, 3, '−'), makeMathQ(4, 1, '−'), makeMathQ(7, 2, '−'),
  makeMathQ(3, 3, '−'), makeMathQ(9, 3, '−'), makeMathQ(8, 4, '−'), makeMathQ(5, 5, '−'), makeMathQ(10, 2, '−'),
  makeMathQ(1, 2, '×'), makeMathQ(2, 2, '×'), makeMathQ(3, 1, '×'), makeMathQ(2, 3, '×'), makeMathQ(4, 2, '×'),
];
